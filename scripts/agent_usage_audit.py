#!/usr/bin/env python3
"""Offline post-hoc Agent usage accounting. NOT provider-side quota enforcement.

Input JSONL: one record per model call. No transcripts, prompts or API keys needed.
Required: task_id, model, input_token_basis, input_tokens, output_tokens,
cache_read_tokens, cache_write_tokens, tool_calls, duration_ms, success,
cost_usd (null if unknown).
input_token_basis: 'inclusive' means input_tokens already includes cache tokens
(e.g. OpenAI Responses); 'exclusive' means add cache reads/writes
(e.g. Anthropic Messages). Explicit basis is mandatory; fail closed on unknown.
Unknown monetary cost stays unknown; never treated as zero.
"""
from __future__ import annotations

import argparse
from decimal import Decimal, InvalidOperation
import json
from pathlib import Path
import sys


FIELDS = ("task_id","model","input_token_basis","input_tokens","output_tokens","cache_read_tokens",
          "cache_write_tokens","tool_calls","duration_ms","success","cost_usd")
NUMBERS = ("input_tokens","output_tokens","cache_read_tokens",
           "cache_write_tokens","tool_calls","duration_ms")


class UsageDataError(ValueError):
    pass


def summarize(path: Path, limit_tokens: int | None = None) -> dict:
    if not path.is_file():
        raise UsageDataError("Usage file not found")
    calls = 0
    tasks: dict[str,dict] = {}
    total_tokens = 0
    total_input_tokens = 0
    total_output_tokens = 0
    basis_counts = {"inclusive": 0, "exclusive": 0}
    all_costs_known = True
    dollars = Decimal("0")
    with path.open(encoding="utf-8") as fh:
        for n, line in enumerate(fh, 1):
            if not line.strip():
                continue
            try:
                row = json.loads(line)
            except json.JSONDecodeError as exc:
                raise UsageDataError(f"Invalid JSON line {n}: {exc}") from exc
            if not isinstance(row,dict) or any(f not in row for f in FIELDS):
                raise UsageDataError(f"Line {n}: missing fields")
            if not isinstance(row["task_id"],str) or not row["task_id"].strip() or not isinstance(row["model"],str) or not row["model"].strip():
                raise UsageDataError(f"Line {n}: invalid task_id or model")
            if any(type(row[f]) is not int or row[f]<0 for f in NUMBERS):
                raise UsageDataError(f"Line {n}: usage metrics must be nonnegative integers")
            basis = row["input_token_basis"]
            if basis not in ("inclusive", "exclusive") or type(basis) is not str:
                raise UsageDataError(f"Line {n}: input_token_basis must be 'inclusive' or 'exclusive'")
            if basis == "inclusive" and (row["cache_read_tokens"] > row["input_tokens"] or row["cache_write_tokens"] > row["input_tokens"]):
                raise UsageDataError(f"Line {n}: cache subset exceeds inclusive input_tokens")
            if type(row["success"]) is not bool:
                raise UsageDataError(f"Line {n}: success must be a boolean")
            v = row["cost_usd"]
            if v is None:
                all_costs_known = False
            elif isinstance(v,bool) or not isinstance(v,(str,int,float)):
                raise UsageDataError(f"Line {n}: invalid cost")
            else:
                try:
                    value=Decimal(str(v))
                except InvalidOperation as exc:
                    raise UsageDataError(f"Line {n}: invalid cost") from exc
                if not value.is_finite() or value<0:
                    raise UsageDataError(f"Line {n}: invalid cost")
                dollars+=value
            input_used = row["input_tokens"] if basis == "inclusive" else (
                row["input_tokens"] + row["cache_read_tokens"] + row["cache_write_tokens"])
            used = input_used + row["output_tokens"]
            total_input_tokens += input_used
            total_output_tokens += row["output_tokens"]
            basis_counts[basis] += 1
            total_tokens += used
            calls+=1
            task=tasks.setdefault(row["task_id"],{"calls":0,"tokens":0,"tools":0,"duration_ms":0,"success":False})
            task["calls"]+=1
            task["tokens"]+=used
            task["tools"]+=row["tool_calls"]
            task["duration_ms"]+=row["duration_ms"]
            task["success"] = task["success"] or row["success"]
    if calls == 0:
        raise UsageDataError("No usage records")
    out={"status":"report_only","model_calls":calls,"task_count":len(tasks),
         "successful_tasks":sum(t["success"] for t in tasks.values()),
         "total_tokens":total_tokens,"total_input_tokens":total_input_tokens,
         "total_output_tokens":total_output_tokens,"input_basis_counts":basis_counts,
         "total_tool_calls":sum(t["tools"] for t in tasks.values()),
         "sum_call_duration_ms":sum(t["duration_ms"] for t in tasks.values()),
         "total_cost_usd":str(dollars) if all_costs_known else None,
         "monetary_cost_complete":all_costs_known,
         "cost_per_success_usd":str(dollars / sum(t["success"] for t in tasks.values())) if all_costs_known and any(t["success"] for t in tasks.values()) else None,
         "provider_hard_budget_enforced":False,
         "note":"Post-hoc accounting only; input_token_basis must match API endpoint semantics. Cache tokens are subsets for inclusive inputs, additive for exclusive inputs. Call durations are not end-to-end elapsed time; cost_usd must be provided by a trustworthy billing source."}
    if limit_tokens is not None:
        if limit_tokens<0:
            raise UsageDataError("Token threshold must be nonnegative")
        out["token_warning_threshold"]=limit_tokens
        out["threshold_exceeded"]=total_tokens>limit_tokens
    return out


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("jsonl",type=Path)
    p.add_argument("--warn-above-tokens",type=int,default=None)
    args=p.parse_args()
    try:
        report=summarize(args.jsonl,args.warn_above_tokens)
    except (UsageDataError,UnicodeDecodeError) as exc:
        print(json.dumps({"status":"invalid","error":str(exc)}),file=sys.stderr)
        return 2
    print(json.dumps(report,ensure_ascii=False,indent=2))
    return 1 if report.get("threshold_exceeded") else 0


if __name__=="__main__":
    sys.exit(main())
