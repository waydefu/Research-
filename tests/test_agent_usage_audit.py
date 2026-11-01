"""Unit tests for post-hoc usage accounting; fixtures contain NO real model records."""
import json
from pathlib import Path
import sys
from tempfile import TemporaryDirectory
import unittest
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"scripts"))
from agent_usage_audit import summarize,UsageDataError


class UsageAuditTests(unittest.TestCase):
    def setUp(self):
        self.temp=TemporaryDirectory()
        self.path=Path(self.temp.name)/"usage.jsonl"

    def tearDown(self):
        self.temp.cleanup()

    def put(self,rows):
        self.path.write_text("".join(json.dumps(x)+"\n" for x in rows),encoding="utf-8")

    def record(self,**changes):
        result={"task_id":"synthetic-task","model":"example-model","input_token_basis":"exclusive","input_tokens":10,
                "output_tokens":5,"cache_read_tokens":3,"cache_write_tokens":2,
                "tool_calls":1,"duration_ms":100,"success":True,"cost_usd":None}
        result.update(changes)
        return result

    def test_unknown_dollars_not_zero(self):
        self.put([self.record()])
        r=summarize(self.path)
        self.assertEqual(r["total_tokens"],20)
        self.assertIsNone(r["total_cost_usd"])
        self.assertFalse(r["provider_hard_budget_enforced"])

    def test_multiple_models_and_known_cost(self):
        self.put([self.record(cost_usd="0.02"),self.record(model="another",success=False,cost_usd="0.01")])
        r=summarize(self.path)
        self.assertEqual(r["successful_tasks"],1)
        self.assertEqual(r["total_cost_usd"],"0.03")

    def test_negative_and_missing_rejected(self):
        self.put([self.record(output_tokens=-2)])
        with self.assertRaises(UsageDataError):
            summarize(self.path)
        self.put([{"task_id":"x"}])
        with self.assertRaises(UsageDataError):
            summarize(self.path)


    def test_openai_inclusive_cached_tokens_not_double_counted(self):
        self.put([self.record(input_token_basis="inclusive", input_tokens=100,
                              cache_read_tokens=30, cache_write_tokens=10,
                              output_tokens=20)])
        r = summarize(self.path)
        self.assertEqual(r["total_input_tokens"], 100)
        self.assertEqual(r["total_output_tokens"], 20)
        self.assertEqual(r["total_tokens"], 120)
        self.assertEqual(r["input_basis_counts"]["inclusive"], 1)

    def test_anthropic_exclusive_cache_tokens_added(self):
        self.put([self.record(input_token_basis="exclusive", input_tokens=60,
                              cache_read_tokens=30, cache_write_tokens=10,
                              output_tokens=20)])
        r = summarize(self.path)
        self.assertEqual(r["total_input_tokens"], 100)
        self.assertEqual(r["total_tokens"], 120)
        self.assertEqual(r["input_basis_counts"]["exclusive"], 1)

    def test_mixed_provider_usage_not_double_counted(self):
        self.put([
            self.record(task_id="one", input_token_basis="inclusive", input_tokens=100,
                        cache_read_tokens=30, cache_write_tokens=10, output_tokens=20),
            self.record(task_id="two", input_token_basis="exclusive", input_tokens=60,
                        cache_read_tokens=30, cache_write_tokens=10, output_tokens=20)
        ])
        r = summarize(self.path)
        self.assertEqual(r["total_tokens"], 240)
        self.assertEqual(r["total_input_tokens"], 200)

    def test_ambiguous_legacy_record_rejected(self):
        row = self.record()
        del row["input_token_basis"]
        self.put([row])
        with self.assertRaisesRegex(UsageDataError, "missing fields"):
            summarize(self.path)

    def test_unknown_semantics_and_bad_cache_subset_rejected(self):
        self.put([self.record(input_token_basis="guess")])
        with self.assertRaisesRegex(UsageDataError, "input_token_basis"):
            summarize(self.path)
        self.put([self.record(input_token_basis="inclusive", input_tokens=5,
                              cache_read_tokens=30)])
        with self.assertRaisesRegex(UsageDataError, "cache subset"):
            summarize(self.path)

    def test_threshold_report_is_not_hard_budget(self):
        self.put([self.record()])
        r=summarize(self.path,10)
        self.assertTrue(r["threshold_exceeded"])
        self.assertFalse(r["provider_hard_budget_enforced"])


if __name__=="__main__":
    unittest.main()
