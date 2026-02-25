---
description: Write a publish-ready article or blog post with integrated SEO — Norwegian market
argument-hint: "<brief, topic, or campaign-dir>"
---

# /article — $ARGUMENTS

Write a publish-ready article on **$ARGUMENTS** for the Norwegian market. SEO is baked into every step — not bolted on at the end.

**Tip**: Run `/research $ARGUMENTS` first to gather sources, data, and arguments. The research brief makes steps 1-3 stronger.

## Context

!references/anti-patterns.md
!references/seo-rules.md
!references/seven-sweeps.md
!references/copy-patterns.md
!references/templates/article-default.md
!references/psychology.md

## Language

**Bokmål** by default. English only if explicitly requested.

Norwegian-specific rules:
- Natural bokmål phrasing — write like a skilled Norwegian communicator, not a translated English text
- Use Norwegian terms where they exist ("programvare" not "software", "markedsføring" not "marketing") — unless the English term is standard in the field
- Avoid direct calques from English sentence structure
- Professional register, but not stiff — conversational where appropriate
- "Du/dere" for addressing readers, not "man"

## Klientens skrivestil

Sjekk om `clients/<slug>/style-guide.md` finnes. Hvis ja:
- Les stilguiden og internalisér stemmesammendraget
- Match klientens tone, ordforråd og stilmønstre gjennom hele teksten
- Bruk referansetekstene som kvalitetsstandard
- Følg "Skriv slik / Ikke slik"-eksemplene

Hvis stilguiden ikke finnes, fortsett uten — bruk klientprofilen for tone-veiledning.

## Workflow

### 1. Brief and Keywords

Before writing anything, establish:

- **Topic**: What specifically about $ARGUMENTS?
- **Audience**: Who reads this? What do they already know?
- **Search intent**: What would someone Google to find this? Informational, transactional, or navigational?
- **Primary keyword**: The one phrase this article should rank for
- **Secondary keywords** (3-5): Related terms to weave in naturally
- **Angle**: Take a position. What's the thesis? What will the reader believe or do differently after reading?
- **Publication context**: Blog, LinkedIn article, external publication?

Present the brief. **Wait for approval before continuing.**

### 2. Outline with SEO Structure

Build the skeleton:

**Med strukturell mal:** Bruk malen fra `references/templates/article-default.md` (eller klientspesifikk override) som utgangspunkt for disposisjonen. Tilpass seksjoner til briefen — malen er et startpunkt, ikke en tvangstrøye.

- **Title**: Contains primary keyword, under 60 characters, specific and compelling. 2-3 options.
- **URL slug**: Short, keyword-rich, lowercase with hyphens
- **Meta description**: 150-160 characters. Treat it as ad copy — it sells the click.
- **H1**: The title (one per article)
- **H2/H3 hierarchy**: Each heading advances the argument. Front-load important words. Include keywords where natural — never forced.
- **Intro hook**: First sentence earns the second. No definitions, no rhetorical questions, no "I dagens...". Start with a concrete fact, bold claim, or the reader's problem.
- **Section summaries**: One sentence per section — what point does it make?
- **Conclusion direction**: What's the takeaway? What should the reader do next?
- **Estimated word count**

Present the outline. **Wait for approval before drafting.**

### 3. Write Draft

Follow these rules strictly:

**Voice:**

**Med klientprofil:** Bruk tone og register fra profilen. Tilpass stemmen til klientens merkevarestemme. Behold alle kvalitetsregler — profilen styrer stemmen, ikke standarden.

- Take positions. Don't hedge everything with "kan", "kanskje", "det er mulig at".
- Write like you're explaining to a smart colleague, not lecturing a student.
- Vary sentence length — mix short punchy sentences with longer explanatory ones.
- Active voice by default. Passive only when the actor genuinely doesn't matter.
- Lead paragraphs with the point, then support it. Don't build up to it.
- Cut filler: "faktisk", "egentlig", "på en måte", "i bunn og grunn" — unless they add real meaning.
- Be concrete and specific. Numbers, examples, names — not "mange bedrifter" but "8 av 10 norske SMB-er".

**Structure:**
- Short paragraphs (2-4 sentences). One idea per paragraph.
- Subheadings that tell a story — a reader skimming only headings should get the argument.
- Use lists only for genuinely parallel items (steps, features, options). Don't list-ify prose.
- Vary paragraph length. Not every paragraph should be the same size.
- Transitions should be invisible — if you need "dessuten" or "videre" to connect paragraphs, the structure is wrong.

**SEO (invisible integration):**
- Primary keyword in title, H1, first 100 words, and 1-2 H2s — naturally.
- Secondary keywords distributed across body — never clustered.
- Internal/external linking opportunities noted in comments.
- Keyword density should be undetectable by a human reader. If it reads like SEO content, rewrite it.

**Before delivering the draft**, self-review against the anti-patterns reference. Fix violations silently — don't list them.

### 4. Review and Deliver

Run this checklist before presenting the draft:

- [ ] No phrases from the banned cliché lists
- [ ] No formulaic structure (5-paragraph essay, definition opening, rhetorical question opening)
- [ ] Every heading advances the argument (not generic labels like "Fordeler" or "Konklusjon")
- [ ] First sentence is concrete and earns the second
- [ ] SEO keywords are invisible — reads like natural Norwegian
- [ ] Varied sentence and paragraph length
- [ ] Every paragraph makes a point (cut those that just "set the scene")
- [ ] Conclusion gives the reader something to do, not a summary of what they just read
- [ ] Meta description works as ad copy

Then run the seven sweeps on the draft. Fix issues silently — don't list them.

Deliver as markdown with this frontmatter:

```markdown
---
title: "Article title"
description: "Meta description (150-160 chars)"
slug: "url-slug"
date: YYYY-MM-DD
keywords:
  - primary keyword
  - secondary keyword 1
  - secondary keyword 2
author: ""
---
```

### 5. Iterate

- Apply feedback precisely — don't rewrite sections that weren't flagged
- Tighten on each pass: cut 10% of words if possible
- Re-run the checklist after changes
- Final version is markdown, ready to publish

## Quality Standard

The goal: an article a Norwegian reader would share with colleagues because it's genuinely useful — not because it's "good for AI-generated content." The bar is Christine Calvert, Erlend Forsund, Lars Aaronæs — writers who are clear, direct, and have something to say.
