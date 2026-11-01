"""Deterministic regression tests for the research integrity checker."""
import json
from pathlib import Path
import sys
from tempfile import TemporaryDirectory
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from check_repository import check_link, markdown_without_fences, CONTROL_IDS


class ResearchIntegrityTests(unittest.TestCase):
    def test_control_set(self):
        self.assertEqual(len(CONTROL_IDS), 20)
        self.assertEqual(len(set(CONTROL_IDS)), 20)

    def test_json_example(self):
        root = Path(__file__).resolve().parents[1]
        p = root / "research/2026-11-agent-repository-operations/examples/search-result-contract.json"
        self.assertIn("query", json.loads(p.read_text(encoding="utf-8")))

    def test_valid_relative_link(self):
        with TemporaryDirectory() as tmp:
            root = Path(tmp).resolve()
            file = root / "docs" / "one.md"
            file.parent.mkdir()
            file.write_text("x", encoding="utf-8")
            (root / "README.md").write_text("ok", encoding="utf-8")
            self.assertIsNone(check_link(root, file, "../README.md#intro"))

    def test_missing_link(self):
        with TemporaryDirectory() as tmp:
            root = Path(tmp).resolve()
            self.assertIn("missing", check_link(root, root / "docs.md", "./missing.md"))

    def test_traversal(self):
        with TemporaryDirectory() as tmp:
            root = Path(tmp).resolve()
            self.assertIn("escapes", check_link(root, root / "README.md", "../../outside"))

    def test_external_link_not_fetched(self):
        with TemporaryDirectory() as tmp:
            root = Path(tmp).resolve()
            self.assertIsNone(check_link(root, root / "README.md", "https://example.com"))
            self.assertIsNone(check_link(root, root / "README.md", "mailto:a@example.com"))

    def test_code_fences(self):
        text = "See [real](README.md)\n\n" + "```md\n[example](missing.md)\n```\n"
        actual = markdown_without_fences(text)
        self.assertIn("[real](README.md)", actual)
        self.assertNotIn("[example](missing.md)", actual)


if __name__ == "__main__":
    unittest.main()
