# Claude Plugins Repository

This repo creates, maintains, and distributes Claude Code / Cowork plugins. Each subdirectory is a self-contained plugin.

## Repo Structure

```
claude-plugins/
├── CLAUDE.md              # This file — project conventions
├── README.md              # User-facing install docs
├── marketplace.json       # Plugin registry for distribution
└── <plugin-name>/         # One directory per plugin
    ├── .claude-plugin/
    │   └── plugin.json    # Manifest (name, version, description)
    ├── commands/           # User-invoked slash commands (Markdown)
    ├── skills/             # Auto-invoked skills (SKILL.md in subdirs)
    ├── agents/             # Sub-agent definitions (Markdown)
    ├── references/         # Shared knowledge files included via !
    ├── hooks/              # Event handlers (hooks.json)
    ├── .mcp.json           # MCP server configs
    ├── .lsp.json           # LSP server configs
    ├── settings.json       # Default plugin settings
    ├── README.md           # Plugin-specific docs
    └── LICENSE
```

## Plugin Anatomy

### Manifest — `.claude-plugin/plugin.json`

Required field: `name` (kebab-case, becomes the namespace prefix).

```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "description": "What this plugin does",
  "author": { "name": "Author Name" },
  "repository": "https://github.com/user/repo",
  "license": "MIT",
  "keywords": ["tag1", "tag2"]
}
```

The `name` field determines the command prefix: `/plugin-name:command`.

### Commands — `commands/*.md`

User-invoked via `/plugin-name:command-name`. File name becomes the command name.

Frontmatter:

```yaml
---
description: Short description shown in /help
argument-hint: "<what the user should provide>"
---
```

Body is a Markdown prompt. Use `$ARGUMENTS` for user input. Use `!references/file.md` to include shared knowledge.

### Skills — `skills/<name>/SKILL.md`

Auto-invoked by Claude based on task context. Each skill is a directory containing `SKILL.md`.

Frontmatter:

```yaml
---
name: skill-name
description: When Claude should use this skill. Be specific — this is the trigger.
---
```

Skills can also be user-invoked via `/plugin-name:skill-name`.

### Agents — `agents/*.md`

Sub-agents dispatched by skills/commands for parallel or specialized work. File name becomes the agent name.

Frontmatter:

```yaml
---
name: agent-name
description: What this agent does and when to invoke it
---
```

Body is the system prompt. Agents appear in `/agents` and can be invoked automatically by Claude.

### References — `references/`

Shared knowledge files included in commands/skills via the `!` syntax:

```markdown
## Context

!references/anti-patterns.md
!references/templates/article-default.md
```

The `!` include is relative to the plugin root. Referenced files are injected into the prompt at invocation time. Always verify references resolve — broken `!` paths silently fail.

### MCP Servers — `.mcp.json`

Standard MCP config at plugin root:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "package-name"],
      "env": { "API_KEY": "${ENV_VAR}" }
    }
  }
}
```

Use `${CLAUDE_PLUGIN_ROOT}` for paths relative to the plugin directory.

### Hooks — `hooks/hooks.json`

Event handlers that run on specific Claude Code events:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [{ "type": "command", "command": "${CLAUDE_PLUGIN_ROOT}/scripts/lint.sh" }]
      }
    ]
  }
}
```

Available events: `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `UserPromptSubmit`, `Notification`, `Stop`, `SubagentStart`, `SubagentStop`, `SessionStart`, `SessionEnd`, `TaskCompleted`, `PreCompact`.

Hook types: `command` (shell), `prompt` (LLM eval), `agent` (agentic verifier).

### Marketplace — `marketplace.json`

Top-level registry listing all plugins in this repo:

```json
{
  "plugins": [
    {
      "name": "plugin-name",
      "path": "plugin-name",
      "description": "What it does",
      "keywords": ["tag1", "tag2"]
    }
  ]
}
```

Update this file whenever a plugin is added, removed, or renamed.

## Conventions

### Naming
- Plugin directories: kebab-case, matching the `name` in plugin.json
- Commands: kebab-case `.md` files (e.g., `email-sequence.md` → `/plugin:email-sequence`)
- Skills: kebab-case directories (e.g., `content-quality/SKILL.md`)
- Agents: kebab-case `.md` files (e.g., `content-writer.md`)

### Language
- Default language for content plugins: Norwegian Bokmål
- English for code/technical plugins or when explicitly requested
- CLAUDE.md and technical docs: English

### File Placement
- NEVER put commands, agents, skills, or hooks inside `.claude-plugin/` — only `plugin.json` goes there
- All component directories live at the plugin root
- References go in `references/`, not scattered across the plugin

### Reference Integrity
- Every `!references/path.md` line in a command or skill MUST point to an existing file
- After adding/removing/renaming reference files, grep for `^!` across all commands and skills to verify
- Verify with: `grep -rh '^!' commands/ skills/ | sort -u | while read ref; do path="${ref#!}"; [ ! -f "$path" ] && echo "BROKEN: $ref"; done`

### Versioning
- Semantic versioning in plugin.json: MAJOR.MINOR.PATCH
- Bump version when distributing changes — cached plugins won't update without a version bump
- Start at 1.0.0 for first stable release

## Development Workflow

### Testing locally

```bash
claude --plugin-dir ./plugin-name
```

Load multiple plugins:

```bash
claude --plugin-dir ./plugin-one --plugin-dir ./plugin-two
```

### Validating a plugin

1. Check manifest: valid JSON, `name` field present
2. Check frontmatter: every command has `description` and `argument-hint`, every skill has `name` and `description`, every agent has `name` and `description`
3. Check references: run the reference integrity check above
4. Test commands: invoke each `/plugin-name:command` and verify it loads
5. Check agents: `/agents` should list all plugin agents
6. Debug: `claude --debug` shows plugin loading details

### Adding a new plugin

1. Create directory: `mkdir -p new-plugin/.claude-plugin`
2. Create manifest: `new-plugin/.claude-plugin/plugin.json` with at minimum `name`
3. Add components: `commands/`, `skills/`, `agents/`, `references/` as needed
4. Add to `marketplace.json`
5. Add to top-level `README.md` plugin table
6. Test with `claude --plugin-dir ./new-plugin`

### Distribution

Team installs from this repo:

```bash
claude plugin install --from streak1984/claude-plugins/plugin-name
```

## Current Plugins

| Plugin | Description |
|--------|-------------|
| `c-marketing` | Content marketing suite — campaigns, articles, ads, social, newsletters. Norwegian Bokmål default. 16 commands, 2 skills, 3 agents, Pexels MCP. |
