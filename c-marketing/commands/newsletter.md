---
description: Write a publish-ready newsletter issue — subject line, preheader, hook, body, CTA
argument-hint: "<brief, topic, or campaign-dir>"
---

# /newsletter — $ARGUMENTS

Write a publish-ready newsletter issue on **$ARGUMENTS**. Personal, direct, and useful — not a reformatted blog post.

**Tip**: Run `/research $ARGUMENTS` first to gather sources, data, and arguments. The research brief makes steps 1-2 stronger.

## Context

!references/anti-patterns.md
!references/seven-sweeps.md
!references/copy-patterns.md
!references/templates/newsletter-default.md
!references/psychology.md

## Language

**Bokmål** by default. English only if explicitly requested.

Norwegian-specific rules:
- Natural bokmål phrasing — write like a skilled Norwegian communicator, not a translated English text
- Use Norwegian terms where they exist ("programvare" not "software", "markedsføring" not "marketing") — unless the English term is standard in the field
- Avoid direct calques from English sentence structure
- "Du/dere" for addressing readers, not "man"

## Klientens skrivestil

Sjekk om `clients/<slug>/style-guide.md` finnes. Hvis ja:
- Les stilguiden og internalisér stemmesammendraget
- Match klientens tone, ordforråd og stilmønstre gjennom hele teksten
- Bruk referansetekstene som kvalitetsstandard
- Følg "Skriv slik / Ikke slik"-eksemplene

Hvis stilguiden ikke finnes, fortsett uten — bruk klientprofilen for tone-veiledning.

## Workflow

### 1. Brief

Before writing anything, establish:

- **Topic**: What specifically about $ARGUMENTS?
- **Audience**: Who reads this newsletter? What do they already know?
- **Key takeaway**: The one thing the reader should remember or do after reading
- **Format**: Substack, Mailchimp, direct email, other?
- **Sender persona**: Personal (named author, "jeg") or company ("vi")?
- **CTA goal**: What specific action should the reader take? (click a link, reply, sign up, buy, book a demo) — every editorial choice serves this action.

Present the brief. **Wait for approval before continuing.**

### 2. Subject Line + Outline

Build the skeleton:

**Med strukturell mal:** Bruk malen fra `references/templates/newsletter-default.md` som utgangspunkt for strukturen. Tilpass seksjonene til briefen.

- **Subject lines**: 3 options. Under 50 characters. Specific, not vague. No clickbait verbs ("Sjokkerende!", "Du vil ikke tro..."). No emoji unless the sender brand uses them consistently.
- **Preheader**: One per subject line option. Under 90 characters. Extends the subject — don't repeat it.
- **Hook paragraph**: First sentence earns the second. No definitions, no rhetorical questions, no "I dagens...". Start with a concrete fact, a personal observation, or the reader's problem.
- **Sections** (2-4): One-sentence summary per section — what point does it make?
- **CTA**: What should the reader do? One primary action.

Present the outline. **Wait for approval before drafting.**

### 3. Write Draft

Follow these rules strictly:

**Voice:**

**Med klientprofil:** Bruk avsenderpersona og tone fra profilen. Pre-fyll CTA-mønster fra profilens `cta_patterns`.

- Personal register. Write like you're emailing a smart colleague, not publishing a whitepaper.
- First person ("jeg") when sender persona is personal. Conversational asides and parentheticals are OK — they build trust.
- Take positions. Don't hedge everything with "kan", "kanskje", "det er mulig at".
- Vary sentence length — mix short punchy sentences with longer explanatory ones.
- Active voice by default. Passive only when the actor genuinely doesn't matter.
- Lead paragraphs with the point, then support it.
- Cut filler: "faktisk", "egentlig", "på en måte", "i bunn og grunn" — unless they add real meaning.
- Be concrete and specific. Numbers, examples, names — not "mange bedrifter" but "8 av 10 norske SMB-er".

**Email format rules:**
- Short paragraphs: 2-3 sentences max. Email is harder to read than web — shorter is better.
- H2 for section breaks. No H3 or deeper — email clients render them inconsistently.
- One CTA. If you have secondary mentions, put them in a PS.
- One bold/callout per section max. Overuse kills emphasis.
- PS is a valid, powerful element. Use it for secondary links, personal notes, or a softer ask.

**Conversion — every section earns the click:**
- The newsletter exists to inform AND drive one action. Content is the vehicle, CTA is the destination.
- Build desire before asking. Each section should increase the reader's motivation to act — through insight, proof, or tension.
- Name the benefit, not the action. "Se hvordan Oda kuttet churn med 40%" beats "Klikk her for å lese mer." The reader clicks because they want the outcome, not because you told them to.
- Use curiosity gaps. Give enough to prove value, hold back enough to motivate the click. Not clickbait — genuine "I need to know more."
- CTA copy is specific and active. "Les caset (4 min)" > "Les mer" > "Klikk her". Include format/time when relevant.
- Place the CTA after proof, not after fluff. The strongest position is right after your most compelling point or example.
- PS converts. Readers who skimmed the body often read the PS. Use it for a personal angle on the same CTA or a soft secondary ask.

**Before delivering the draft**, self-review against the shared anti-patterns. Fix violations silently — don't list them.

### 4. Review and Deliver

Run this checklist before presenting the draft:

- [ ] No phrases from the banned cliche lists
- [ ] No formulaic structure (5-paragraph essay, definition opening, rhetorical question opening)
- [ ] Subject line is under 50 chars, specific, not clickbait
- [ ] Preheader extends subject without repeating it, under 90 chars
- [ ] First sentence is concrete and earns the second
- [ ] Only H2 headings — no H3 or deeper
- [ ] One CTA — secondary actions in PS only
- [ ] Paragraphs are 2-3 sentences max
- [ ] Varied sentence and paragraph length
- [ ] Every paragraph makes a point (cut those that just "set the scene")
- [ ] Reads like a person wrote it, not a brand voice document
- [ ] CTA names a benefit, not just an action
- [ ] Content builds desire/proof before asking for the click
- [ ] Reader has a clear reason to click — not just "les mer"

Then run the seven sweeps on the draft. Fix issues silently — don't list them.

Deliver as markdown with this frontmatter:

```markdown
---
subject: "Subject line"
preheader: "Preheader text"
date: YYYY-MM-DD
issue: <number or omit>
---
```

### 5. Iterate

- Apply feedback precisely — don't rewrite sections that weren't flagged
- Tighten on each pass: cut 10% of words if possible
- Re-run the checklist after changes
- Final version is markdown, ready to paste into email tool

## Quality Standard

The goal: a newsletter a Norwegian reader would forward to a colleague because it's genuinely useful — AND click the CTA because the content made them want to. Inform and convert are not opposites. The best newsletters do both.

### Forbilder for nyhetsbrev som konverterer
- **Joanna Wiebe** (Copyhackers) — Oppfant "conversion copywriting." Nyhetsbrevene hennes er pensum i CTA-håndverk: hvert avsnitt bygger mot handlingen. Studer strukturen, ikke bare teksten.
- **Ann Handley** (MarketingProfs, "Everybody Writes") — Annenhver uke, alltid personlig, alltid med ett tydelig neste steg. Benchmark for balansen mellom verdi og konvertering.
- **Katelyn Bourgoin** ("Why We Buy") — Bruker kjøpspsykologi i nyhetsbrevformat. Viser hvordan innsikt + nysgjerrighetsgap driver klikk uten å føles manipulerende.
- **Laura Belgray** (Talking Shrimp) — Personlighetsdrevet e-post som konverterer. Bevis for at uformell tone og salg ikke er motsetninger.

For norsk språkkvalitet og overbevisende skriving: se stilreferansene i den delte anti-patterns-filen (Christine Calvert, Erlend Forsund, Lars Aaronæs m.fl.).
