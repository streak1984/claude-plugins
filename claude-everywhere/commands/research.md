---
description: Deep topic research — web search in Norwegian and English, structured findings with confidence levels
argument-hint: "<topic> [--fresh]"
---

# /research — $ARGUMENTS

Deep research on **$ARGUMENTS**. Gather sources, arguments, data, and counterarguments into a structured brief.

## Kunnskapsbase-integrasjon

Hvis en klientmappe er tilgjengelig (`clients/<slug>/research/`):

### Før søk
1. Les alle filer i `clients/<slug>/research/`
2. For hvert delspørsmål, sjekk om eksisterende funn dekker det:
   - **Dekket** (dato < 90 dager) → bruk eksisterende, noter datoen
   - **Delvis dekket** → gjør målrettet søk for å fylle hull
   - **Utdatert** (dato > 90 dager) → gjør målrettet søk for å verifisere/oppdatere
   - **Ikke dekket** → fullt nettsøk
3. Rapporter til brukeren: "Fant eksisterende research om [X] og [Y]. Trenger nye søk for [Z]."

### Etter research
Lagre nye funn tilbake til klientmappen:

```markdown
# clients/<slug>/research/<topic-slug>.md

---
topic: "Emnetittel"
date: YYYY-MM-DD
sources: <antall>
confidence: high # high, moderate, or low
campaign: "YYYY-MM-DD-<campaign-slug>"
---

## Funn
- Funn 1 (kilde: ...)

## Datapunkter
- Datapunkt med kilde og dato

## Argumenter for/mot
- ...
```

Kun nye funn lagres — ikke dupliser det som allerede finnes. Hvis filen allerede eksisterer, oppdater datoen og legg til nye funn under eksisterende. Ikke slett eksisterende funn med mindre de er faktisk feil eller utdatert.

### Tvunget oppdatering
Hvis brukeren ber om `--fresh`, ignorer eksisterende research og gjør fullt søk for alt. Lagre resultatene som erstatning.

## Workflow

### 1. Scope

Before searching, define:

- **Core question**: What specifically are we trying to understand about $ARGUMENTS?
- **Sub-questions** (3-5): Break the topic into searchable pieces
- **What would be useful**: Data points, expert opinions, case studies, counterarguments, definitions, timelines — what does the user actually need?

Hvis klientmappe er tilgjengelig:
- Sjekk `clients/<slug>/research/` for eksisterende dekning
- Juster scope: marker delspørsmål som allerede er dekket
- Presenter: "Eksisterende research dekker [X]. Nye søk trengs for [Y]."

Present scope. **Wait for approval before researching.**

### 2. Search and Gather

For each sub-question:

**Med eksisterende kunnskapsbase:** Start med det som finnes. Kun søk etter:
- Delspørsmål uten dekning
- Oppdateringer for utdaterte funn (> 90 dager)
- Hull i eksisterende dekning

- Run multiple web searches with varied phrasing
- Prioritize primary sources (research papers, official reports, original data) over secondary coverage
- For Norwegian topics: search in both Norwegian and English — different results surface
- Evaluate source credibility: who published it, when, what's their angle?
- Capture specific data points with attribution — not vague summaries

Track everything found. Note gaps where good sources don't exist.

### 3. Synthesize

Organize findings into a structured brief:

```markdown
## Research Brief: [Topic]

### Nøkkelfunn
- [Finding 1 — with source]
- [Finding 2 — with source]
- ...

### Datapunkter
| Claim | Data | Source | Date |
|-------|------|--------|------|
| ... | ... | ... | ... |

### Argumenter for
- [Argument + evidence]

### Argumenter mot / Nyanser
- [Counterargument + evidence]

### Kunnskapshull
- [What we couldn't find or verify]

### Kilder
1. [Source title](URL) — brief note on what it contributes
2. ...
```

### 4. Deliver

Present the brief. Flag:
- **Confidence level** for each key finding (strong evidence, moderate, weak/single-source)
- **Recency** — note when data is older than 2 years
- **Bias** — note when sources have obvious commercial or ideological angles
- **Gaps** — what's missing that the user should know about

## Rules

- Never present a claim without attribution. "Studies show" is not a source.
- Prefer specific numbers over qualitative descriptions. "Revenue grew 23% YoY" not "revenue grew significantly."
- Include counterarguments and nuances — don't build a one-sided case unless asked to.
- If the topic is contested, present the landscape honestly rather than picking a side.
- Norwegian sources are valuable for Norwegian market context but don't limit yourself — English sources often have deeper coverage.
- Date everything. A stat from 2019 may be irrelevant in 2026.

## Output

Markdown brief as shown above. Designed to be self-contained — usable as input for `/article`, a presentation, a strategy document, or just understanding a topic.

Output path: `clients/<slug>/research/<topic-slug>.md`
