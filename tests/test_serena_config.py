"""Static compatibility checks against pinned Serena v1.5.3 project schema.

These tests validate repository configuration only; they do not start Serena,
install uvx, invoke MCP, or prove runtime sandbox isolation.
Upstream: https://github.com/oraios/serena/blob/v1.5.3/src/serena/resources/project.template.yml
"""
import json
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]


class SerenaConfigTests(unittest.TestCase):
    def test_project_uses_pinned_v153_language_key(self):
        config = (ROOT / ".serena/project.yml").read_text(encoding="utf-8")
        self.assertRegex(config, r"(?m)^languages:\s*\n\s+- python$")
        self.assertNotRegex(config, r"(?m)^language_servers:")
        self.assertRegex(config, r"(?m)^read_only:\s*true$")
        self.assertNotRegex(config, r"(?m)^read_only:\s*false$")

    def test_mcp_example_is_opt_in_and_pinned(self):
        example = ROOT / ".mcp.json.example"
        parsed = json.loads(example.read_text(encoding="utf-8"))
        server = parsed["mcpServers"]["serena-readonly-optional"]
        self.assertEqual(server["command"], "uvx")
        self.assertIn("serena-agent==1.5.3", server["args"])
        self.assertIn("--project-from-cwd", server["args"])
        self.assertIn("--open-web-dashboard", server["args"])
        self.assertEqual(server["args"][-1], "false")


if __name__ == "__main__":
    unittest.main()
