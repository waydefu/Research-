#!/usr/bin/env python3
"""Offline integrity checks for a research-only repository; no dependencies."""
from __future__ import annotations

import json
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
LINK = re.compile(r'(?<!!)\[[^\]\n]+\]\((<?[^)\s>]+>?)(?:\s+"[^"]*")?\)')
FENCE = re.compile(r"^\s*(`{3,}|~{3,})")
CONTROL_IDS = ("A1", "A2", "A3", "A4", "G1", "G2", "G3", "S1",
               "S2", "T1", "T2", "I1", "I2", "D1", "D2", "C1", "C2",
               "O1", "O2", "R1")


def tracked_paths(root: Path = ROOT) -> list[Path]:
    raw = subprocess.check_output(["git", "ls-files", "-z"], cwd=root)
    return [root / p.decode("utf-8") for p in raw.split(b"\0") if p]


def markdown_without_fences(source: str) -> str:
    result = []
    fence_marker = None
    for line in source.splitlines():
        match = FENCE.match(line)
        if match:
            marker = match.group(1)
            if fence_marker is None:
                fence_marker = marker
            elif marker[0] == fence_marker[0] and len(marker) >= len(fence_marker):
                fence_marker = None
            result.append("")
        else:
            result.append(line if fence_marker is None else "")
    return "\n".join(result)


def check_link(root: Path, source: Path, raw_link: str) -> str | None:
    """Return an error or None. External URLs are not checked."""
    link = raw_link.strip("<>")
    if link.startswith(("#", "//")):
        return None
    url = urlsplit(link)
    if url.scheme or url.netloc:
        return None
    relative = unquote(url.path)
    if not relative:
        return None
    target = (root / relative.lstrip("/") if relative.startswith("/") else source.parent / relative).resolve()
    try:
        target.relative_to(root.resolve())
    except ValueError:
        return f"{source.relative_to(root)}: link escapes repository: {raw_link}"
    if not target.exists():
        return f"{source.relative_to(root)}: missing local target: {raw_link}"
    return None


def verify_repository(root: Path = ROOT) -> list[str]:
    errors = []
    for path in tracked_paths(root):
        if not path.is_file():
            errors.append(f"{path.relative_to(root)}: missing tracked file")
            continue
        if path.suffix.lower() == ".md":
            try:
                content = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                errors.append(f"{path.relative_to(root)}: non-UTF-8 markdown")
                continue
            for found in LINK.finditer(markdown_without_fences(content)):
                problem = check_link(root, path, found.group(1))
                if problem:
                    errors.append(problem)
        elif path.suffix.lower() == ".json":
            try:
                json.loads(path.read_text(encoding="utf-8"))
            except (ValueError, UnicodeDecodeError) as exc:
                errors.append(f"{path.relative_to(root)}: invalid JSON: {exc}")

    standard = root / "research/2026-11-agent-repository-operations/EAG-100.md"
    if not standard.is_file():
        errors.append("EAG-100 governance standard is missing")
    else:
        content = standard.read_text(encoding="utf-8")
        for cid in CONTROL_IDS:
            if f"**{cid}**" not in content:
                errors.append(f"EAG-100 is missing control {cid}")
        for pid in range(1, 6):
            if f"P0-{pid}" not in content:
                errors.append(f"EAG-100 is missing P0-{pid}")
    return errors


def main() -> int:
    errors = verify_repository()
    if errors:
        print(f"Research integrity FAIL ({len(errors)} findings)")
        for err in errors:
            print(f"::error::{err}")
        return 1
    print("Research integrity PASS: Markdown local links, JSON, EAG control IDs.")
    print("Note: external URLs, live security, model behavior and permissions NOT validated.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
