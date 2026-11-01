"""Integration tests for the repo-local FTS5 index, freshness and fail-closed results."""
from pathlib import Path
import subprocess
import sys
from tempfile import TemporaryDirectory
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from research_search import create_index, verify, search, IndexErrorState


def run(root: Path, *args: str) -> None:
    subprocess.run(["git", "-C", str(root), *args], stdout=subprocess.DEVNULL,
                   stderr=subprocess.PIPE, check=True)


class ResearchSearchTests(unittest.TestCase):
    def setUp(self):
        self.tmp = TemporaryDirectory()
        self.root = Path(self.tmp.name)
        run(self.root, "init", "-q")
        (self.root / "notes").mkdir()
        (self.root / "notes" / "sources.md").write_text(
            "# 研究\n索引資料庫需要驗證新鮮度。\nSecret example tokens are NOT real credentials.\n",
            encoding="utf-8")
        run(self.root,"add","notes/sources.md")
        run(self.root,"-c","user.name=CI","-c","user.email=ci@example.invalid","commit","-qm","initial")
        self.db = self.root / ".cache" / "search.sqlite"

    def tearDown(self):
        self.tmp.cleanup()

    def test_index_and_chinese_search(self):
        a = create_index(self.root,self.db)
        self.assertEqual(a["docs"],1)
        self.assertEqual(verify(self.root,self.db)["status"],"fresh")
        found = search("索引資料庫",root=self.root,db_path=self.db)
        self.assertEqual(len(found["results"]),1)
        self.assertEqual(found["results"][0]["line"],2)
        self.assertEqual(found["complete"],False)

    def test_short_substring_search(self):
        create_index(self.root,self.db)
        result = search("資料",root=self.root,db_path=self.db)
        self.assertEqual(len(result["results"]),1)

    def test_stale_index_rejected(self):
        create_index(self.root,self.db)
        (self.root / "notes" / "sources.md").write_text("# modified\n",encoding="utf-8")
        with self.assertRaisesRegex(IndexErrorState,"stale"):
            verify(self.root,self.db)
        with self.assertRaisesRegex(IndexErrorState,"stale"):
            search("索引",root=self.root,db_path=self.db)

    def test_coverage_rejects_new_file(self):
        create_index(self.root,self.db)
        (self.root / "notes" / "new.md").write_text("new",encoding="utf-8")
        run(self.root,"add","notes/new.md")
        with self.assertRaisesRegex(IndexErrorState,"stale"):
            verify(self.root,self.db)

    def test_index_absence_rejected(self):
        with self.assertRaisesRegex(IndexErrorState,"absent"):
            search("test",root=self.root,db_path=self.db)

    def test_query_validation(self):
        create_index(self.root,self.db)
        with self.assertRaises(ValueError):
            search("",root=self.root,db_path=self.db)
        with self.assertRaises(ValueError):
            search("test",limit=200,root=self.root,db_path=self.db)

    def test_literal_wildcards_do_not_broaden_query(self):
        create_index(self.root,self.db)
        result = search("%",root=self.root,db_path=self.db)
        self.assertEqual(result["results"],[])


if __name__=="__main__":
    unittest.main()
