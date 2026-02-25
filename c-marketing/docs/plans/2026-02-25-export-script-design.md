# Design: Node.js Export Script

**Date:** 2026-02-25
**Status:** Approved

## Problem

The `/export` command takes ~5 minutes because the LLM manually reads 12+ template files, parses YAML/JSON, converts markdown to HTML, fills tokens, and writes a 3000+ line HTML file through dozens of tool calls. This is a deterministic assembly job being done by an LLM.

## Solution

Replace the LLM-driven assembly with a single Node.js script (`scripts/export.js`) that does the same work in ~200ms. Zero npm dependencies — uses only Node.js built-ins (`fs`, `path`).

## Architecture

Two-phase flow:

1. **LLM phase** — Find the campaign directory, verify files exist, invoke the script
2. **Script phase** — Read scaffold + components, parse campaign files, fill tokens, write HTML

## Script Pipeline

```
CLI args → Resolve paths → Read all files → Parse → Assemble → Write HTML → JSON summary to stdout
```

1. Resolve campaign and client profile paths
2. Parse client profile (YAML frontmatter)
3. Discover which campaign files exist
4. Read scaffold HTML, fill campaign-level tokens
5. For each campaign file:
   - Read matching component template from `references/export/components/`
   - Parse YAML frontmatter + body (or JSON for ads)
   - Convert markdown to HTML
   - Fill `{{TOKEN}}` placeholders
   - For `ads.json`: loop over ads array, match format+platform to component
   - Replace `<!-- INSERT:xxx -->` marker in scaffold
6. Remove unfilled INSERT markers and empty sections + nav links
7. Write to `exports/<client-slug>-<campaign-slug>.html`
8. Print JSON summary to stdout

## Image Path Handling

Relative paths like `images/foo.jpg` in campaign files are resolved to `../clients/<slug>/campaigns/<campaign>/images/foo.jpg` relative to the export HTML location.

## Markdown-to-HTML Converter

Built-in ~60-line converter covering: headings (h1-h3), paragraphs, bold, italic, links, unordered/ordered lists, blockquotes, code, horizontal rules. No external libraries.

## YAML Frontmatter Parser

Built-in ~20-line parser handling key-value pairs and arrays. Sufficient for the simple frontmatter structures used in campaign files.

## File Changes

| File | Action |
|------|--------|
| `scripts/export.js` | NEW — ~300-400 lines, zero dependencies |
| `commands/export.md` | MODIFIED — simplified, delegates to script |

## Export Command Changes

The command removes the `!references/export/scaffold.html` include and the 7-phase assembly instructions. Replaced with:

1. Find campaign directory (existing logic)
2. Verify campaign files exist
3. Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/export.js <campaign-dir>`
4. Report script output to user

## Cross-Platform

- **Mac:** Node.js required by Claude Code
- **Windows:** Node.js required by Claude Code
- **Cowork VM:** Node.js 22 pre-installed (Ubuntu 22.04 ARM64)
- Path handling via Node's `path` module (handles `/` vs `\`)

## Error Handling

Script exits non-zero on errors. LLM reads stderr and helps user debug. Common errors: missing files, malformed YAML, missing profile.

## Performance

| Metric | Before | After |
|--------|--------|-------|
| Time | ~5 min | ~200ms |
| Tool calls | ~38 | ~3 |
| Token usage | ~100K | ~5K |
