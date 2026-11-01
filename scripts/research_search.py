#!/usr/bin/env python3
"""Local, offline index for tracked Markdown research. Never sends data to a service.

Commands:
    python3 scripts/research_search.py build
    python3 scripts/research_search.py verify
    python3 scripts/research_search.py search "索引資料庫" --limit 5

Explicit rebuild after content changes. Search refuses stale or incomplete indices.
The repository's working tree, NOT an embedding/vector database, is the truth.
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import sqlite3
import subprocess
import sys
import uuid

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = ROOT / ".cache" / "research-index.sqlite"
MAX_DOCUMENT_BYTES = 8 * 1024 * 1024


class IndexErrorState(Exception):
    pass


def git(root: Path, *args: str) -> bytes:
    return subprocess.check_output(["git", "-C", str(root), *args], stderr=subprocess.DEVNULL)


def snapshot(root: Path) -> tuple[str, list[tuple[str, str, str]]]:
    """Return (HEAD, sorted [(path, sha256, content)]); strict on bad sources."""
    try:
        commit = git(root, "rev-parse", "HEAD").decode().strip()
        names = git(root, "ls-files", "-z", "--", "*.md").split(b"\0")
    except (subprocess.CalledProcessError, FileNotFoundError) as exc:
        raise IndexErrorState("Git repository with HEAD required") from exc

    docs: list[tuple[str, str, str]] = []
    for raw in names:
        if not raw:
            continue
        name = raw.decode("utf-8")
        file = root / name
        if file.is_symlink() or not file.is_file():
            raise IndexErrorState(f"Missing or symlinked tracked Markdown: {name}")
        raw_content = file.read_bytes()
        if len(raw_content) > MAX_DOCUMENT_BYTES:
            raise IndexErrorState(f"Markdown exceeds per-file safety limit: {name}")
        try:
            body = raw_content.decode("utf-8")
        except UnicodeDecodeError as exc:
            raise IndexErrorState(f"Non UTF-8 markdown: {name}") from exc
        docs.append((name, hashlib.sha256(raw_content).hexdigest(), body))
    return commit, sorted(docs)


def create_index(root: Path = ROOT, db_path: Path = DEFAULT_DB) -> dict:
    commit, docs = snapshot(root)
    db_path.parent.mkdir(parents=True, exist_ok=True)
    tmp = db_path.parent / (db_path.name + "." + uuid.uuid4().hex + ".tmp")
    try:
        with sqlite3.connect(str(tmp)) as con:
            try:
                con.execute("CREATE VIRTUAL TABLE research USING fts5(path UNINDEXED, body, tokenize='trigram')")
            except sqlite3.OperationalError as exc:
                raise IndexErrorState("SQLite FTS5 trigram unavailable; require SQLite 3.34+ with FTS5") from exc
            con.execute("CREATE TABLE manifest (path TEXT PRIMARY KEY, sha256 TEXT NOT NULL)")
            con.execute("CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL)")
            con.executemany("INSERT INTO research(path,body) VALUES(?,?)", [(p,t) for p,h,t in docs])
            con.executemany("INSERT INTO manifest(path,sha256) VALUES(?,?)", [(p,h) for p,h,t in docs])
            con.executemany("INSERT INTO metadata(key,value) VALUES (?,?)", [
                ("commit",commit), ("doc_count",str(len(docs))), ("status","complete"),
                ("built_at",dt.datetime.now(dt.timezone.utc).isoformat())])
        os.replace(tmp, db_path)
    finally:
        tmp.unlink(missing_ok=True)
    return {"status":"built","commit":commit,"docs":len(docs),"index_path":str(db_path.relative_to(root)) if db_path.is_relative_to(root) else str(db_path)}


def verify(root: Path = ROOT, db_path: Path = DEFAULT_DB) -> dict:
    if not db_path.is_file():
        raise IndexErrorState("Index absent. Run: python3 scripts/research_search.py build")
    commit, docs = snapshot(root)
    try:
        with sqlite3.connect(str(db_path)) as con:
            m = dict(con.execute("SELECT key,value FROM metadata").fetchall())
            stored = dict(con.execute("SELECT path,sha256 FROM manifest").fetchall())
            indexed = con.execute("SELECT count(*) FROM research").fetchone()[0]
    except sqlite3.DatabaseError as exc:
        raise IndexErrorState("Index database corrupt or schema invalid; rebuild") from exc
    current = {p:h for p,h,_ in docs}
    if m.get("commit") != commit or m.get("status") != "complete" or m.get("doc_count") != str(len(docs)) or stored != current or indexed != len(docs):
        raise IndexErrorState("Index stale/incomplete (HEAD, file hashes or coverage differ). Run explicit build.")
    return {"status":"fresh","source_commit":commit,"coverage":"tracked Markdown files only","documents":len(docs)}


def search(query: str, limit: int = 5, root: Path = ROOT, db_path: Path = DEFAULT_DB) -> dict:
    if not query.strip() or len(query) > 256:
        raise ValueError("Search query must be 1..256 characters")
    if not 1 <= limit <= 20:
        raise ValueError("limit must be 1..20")
    info = verify(root, db_path)
    escaped = query.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
    results = []
    with sqlite3.connect(str(db_path)) as con:
        # The trigram FTS5 index can accelerate LIKE for 3+ Unicode characters.
        # Substrings of 1-2 characters may use a full scan; no model tokens consumed.
        cur = con.execute("SELECT path,body FROM research WHERE body LIKE ? ESCAPE '\\' ORDER BY path LIMIT ?", ("%"+escaped+"%",limit))
        digest = dict(con.execute("SELECT path,sha256 FROM manifest"))
        for path, body in cur:
            at = body.casefold().find(query.casefold())
            if at < 0:
                continue
            line = body.count("\n",0,at)+1
            snippet = body[max(0,at-65):at+min(95,len(query)+65)].replace("\n"," ").strip()
            results.append({"path":path,"line":line,"sha256":digest[path],"snippet":snippet[:180]})
    return {"status":"ok","query":query,"source_commit":info["source_commit"],
            "coverage":"tracked Markdown only; top files, not exhaustive callers",
            "results":results,"result_limit":limit,"complete":False,
            "zero_results_means_absent":False}


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    commands = p.add_subparsers(dest="command",required=True)
    commands.add_parser("build")
    commands.add_parser("verify")
    finder = commands.add_parser("search")
    finder.add_argument("query")
    finder.add_argument("--limit",type=int,default=5)
    args = p.parse_args()
    try:
        if args.command == "build":
            result = create_index()
        elif args.command == "verify":
            result = verify()
        else:
            result = search(args.query,args.limit)
        print(json.dumps(result,ensure_ascii=False,indent=2))
        return 0
    except (IndexErrorState,ValueError) as exc:
        print(json.dumps({"status":"fail_closed","error":str(exc)},ensure_ascii=False),file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
