---
name: campaign-orchestration
description: Use when managing multi-content campaign workflows with parallel production. Coordinates sub-agents, manages brief-to-content pipeline, and tracks campaign directory structure.
---

# Campaign Orchestration Skill

This skill activates when you are coordinating a multi-content campaign. It ensures correct workflow sequencing and sub-agent coordination.

## Workflow Rules

1. **Brief first**: Never produce content without an approved brief.
2. **Research blocks content**: If research is selected, it must complete before content production starts.
3. **Parallel production**: All content types run simultaneously after brief approval (and research if applicable).
4. **Sub-agent delegation**: Use the `content-writer` agent for each content type. Use `researcher` for research. Use `image-curator` for images.
5. **Directory structure**: All campaign output goes to `clients/<slug>/campaigns/YYYY-MM-DD-<topic-slug>/`.

## Campaign Directory Layout

```
clients/<slug>/campaigns/YYYY-MM-DD-<topic-slug>/
├── brief.md
├── research.md          (if research selected)
├── article.md           (if article selected)
├── newsletter.md        (if newsletter selected)
├── linkedin.md          (if LinkedIn selected)
├── social.md            (if social selected)
├── ads.json             (if ads selected)
├── email-sequence.md    (if email sequence selected)
├── images/
├── images-metadata.json
└── campaign-summary.md
```

## Sub-agent Dispatch Pattern

When dispatching content-writer agents, provide each with:
1. The full approved brief
2. Client profile content
3. Research findings (if available)
4. The relevant template from `references/templates/`
5. Anti-patterns and copy-patterns references
6. The exact output file path
