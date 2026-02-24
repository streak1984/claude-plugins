---
description: Turn a rough idea into a comprehensive brief for content production
argument-hint: "<rough idea or short brief>"
---

# /brief — $ARGUMENTS

Turn **$ARGUMENTS** into a structured, actionable brief that can be handed directly to `/article`, `/newsletter`, `/social`, or `/research`.

This is a scoping/strategy skill — no writing, no voice rules, no conversion guidance. The downstream skills handle quality. The brief handles clarity.

## Language

**Bokmål** by default. English only if explicitly requested.

## Klientprofil-integrasjon

Hvis en klientprofil er tilgjengelig (fra `/campaign` eller gitt direkte):

- **Pre-fyll** disse feltene fra profilen: tone, målgruppe, CTA-retning, begrensninger
- **Hopp over** spørsmål i steg 2 som allerede er besvart i profilen
- **Bekreft** at profil-verdiene er riktige for denne spesifikke briefen — "Profilen sier målgruppen er [X]. Stemmer det for denne kampanjen?"
- Brukeren kan overstyre profil-verdier for en spesifikk brief

Bruk profilen til å pre-fylle brief-malen i steg 3:
- `Målgruppe` → fra `audience` i profilen
- `Tone og register` → fra `tone` i profilen
- `CTA-retning` → fra `cta_patterns` i profilen

## Frameworks

Three frameworks inform the design — we take the best elements, not the full framework:

- **Message House**: Core message → supporting pillars → evidence. Used for the output structure.
- **StoryBrand SB7**: Customer is the hero, brand is the guide. Used for the clarification questions — keeps the brief audience-centric.
- **Creative Brief discipline**: One page. If it doesn't fit, the thinking isn't clear enough.

## Workflow

### 1. Parse & Identify Gaps

Read the input. Identify what's already clear and what's missing:

- Topic? Audience? Angle? Core message? CTA? Tone? Channels?

Present: "Here's what I understand from your input — here's what I still need." Be specific about what's clear and what's vague.

Hvis klientprofil er tilgjengelig, marker profil-kjente felt som "fra profil — bekreft eller overstyr":
- Audience? ✓ fra profil
- Tone? ✓ fra profil
- CTA direction? ✓ fra profil

**Don't ask a generic questionnaire.** If the input says "GA4-migrering for e-commerce", the topic is clear — don't ask "what's the topic?"

**Wait for approval before continuing.**

### 2. Clarify

Ask **3-7 targeted questions** based only on the gaps from step 1. Use the StoryBrand lens to shape the questions — focus on the reader's world:

**Med klientprofil:** Hopp over spørsmål som profilen besvarer. Fokuser bare på kampanjespesifikke gap: vinkel, støttepunkter, kilder, og kanalvalg.

- **What does the reader want?** The desire that brings them to this content.
- **What's their problem?** The obstacle, pain, confusion they face.
- **What do they stand to gain?** Concrete success state if they act.
- **What do they stand to lose?** Stakes — why act now, not later?

Also cover these dimensions (only if not already answered):

- **Topic specificity**: Narrow it. "GA4" → "GA4 for Norwegian e-commerce, specifically the migration from UA"
- **Tone/register**: Personal, professional, authoritative, conversational?
- **Channels intended**: Which content types are planned? (article, newsletter, social, all?)
- **CTA direction**: What specific action should the audience take?
- **Constraints**: Length, deadline, brand guidelines, existing assets?
- **Research needed**: What do we need to look up? Flag for `/research`.

This step is conversational — multiple rounds OK until the brief is clear. Don't move on until you have enough to draft a strong brief.

### 3. Draft Brief

Produce a structured brief using the Message House model. One page — if it's longer, the thinking isn't done.

Format:

```markdown
## Brief: [Topic]

### Kjernebudskap
[One sentence. The single thing the reader should take away.]

### Målgruppe
[Who they are, what they know, what they care about. Written from THEIR perspective — what do they want? What's their problem?]

### Støttepunkter
1. **[Pillar 1]** — [one-sentence claim] → Bevis: [evidence, data, example]
2. **[Pillar 2]** — [one-sentence claim] → Bevis: [evidence, data, example]
3. **[Pillar 3]** — [one-sentence claim] → Bevis: [evidence, data, example]

### Vinkel
[The specific take/thesis. Not "GA4 er viktig" but "Norske nettbutikker som ikke migrerer til GA4 innen Q2 mister innsikten de trenger for å konkurrere med internasjonale aktører."]

### Hva leseren vinner / taper
- **Vinner**: [Concrete success state if they act]
- **Taper**: [Concrete risk if they don't]

### Tone og register
[Personal/professional/authoritative — and why]

### CTA-retning
[What specific action should the audience take?]

### Kanaler
[Which content types are planned — article, newsletter, social]

### Kilder og research
- [Available sources/data]
- [What needs to be researched — input for /research]

### Begrensninger
[Length, deadline, brand guidelines, existing assets]
```

**Wait for approval before finalizing.**

### 4. Refine

- Iterate on feedback — adjust only what's flagged
- Tighten: if a section is vague, make it concrete
- Final version is the canonical brief for the project

## Rules

- One core message. If you can't pick one, the thinking isn't done.
- Audience-centric, not brand-centric. "Du trenger..." not "Vi tilbyr..."
- Every pillar needs evidence — no unsupported claims.
- Channel-agnostic output. Subject lines, hashtags, SEO keywords belong in the downstream skills.
- If research is needed, flag it clearly — the user can run `/research` separately.
