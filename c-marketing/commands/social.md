---
description: Create publish-ready social media posts — platform-native for LinkedIn, Instagram, Facebook, X
argument-hint: "<brief, topic, or campaign-dir>"
---

# /social — $ARGUMENTS

Create publish-ready social media posts on **$ARGUMENTS**. Platform-native, not cross-posted copypaste. Every post earns engagement AND drives one action.

**Tip**: Run `/research $ARGUMENTS` first to gather sources, data, and angles. Strong posts start with strong material.

## Context

!references/anti-patterns.md
!references/templates/social-default.md
!references/psychology.md

## Language

**Bokmål** by default. English only if explicitly requested.

Norwegian-specific rules:
- Natural bokmål phrasing — write like a skilled Norwegian communicator, not a translated English text
- Use Norwegian terms where they exist — unless the English term is standard in the field
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
- **Platforms**: Which ones? (LinkedIn, Instagram, Facebook, X) — each gets a native version
- **Audience**: Who follows this account? What do they care about?
- **Goal**: Awareness, engagement, traffic, or leads?
- **CTA goal**: What specific action should the reader take? (click link, comment, share, sign up, DM) — every word serves this action.
- **Sender persona**: Personal (named author, "jeg") or company ("vi")?
- **Assets**: Images, links, data, video? What's available?

Present the brief. **Wait for approval before continuing.**

### 2. Hook + Outline

For each requested platform, present:

**Med strukturell mal:** Bruk malen for plattformspesifikk struktur og lengdemål. Tilpass til briefen og klientprofilen.

- **Hook line**: The first line visible before "see more" / in the feed. This is 80% of the post's performance. 2-3 options per platform.
- **Key points**: 2-3 bullets — what does the post say after the hook?
- **CTA**: The specific action, phrased for the platform.
- **Hashtag direction**: Quantity and type per platform.

Present the outline. **Wait for approval before drafting.**

### 3. Write Drafts

Follow these rules strictly:

**Voice:**

**Med klientprofil:** Bruk profilens tone og avsenderpersona konsistent på tvers av alle plattformer. Plattformtilpasning i format, ikke i stemme.

- Personal register. Write like you're talking to your audience, not broadcasting at them.
- First person ("jeg") when sender persona is personal. Opinions, experiences, and stakes make posts human.
- Take positions. Posts that say "det kommer an på" get scrolled past.
- Be concrete and specific. Numbers, names, examples — not "mange bedrifter" but "3 av mine kunder siste måned".
- Cut filler ruthlessly. Every word costs attention. Social has zero tolerance for "faktisk", "egentlig", "i bunn og grunn".
- Vary rhythm. One-word sentences. Then a longer one that explains. Then punch again.

**Conversion — every post earns the action:**
- The hook stops the scroll. The body builds desire. The CTA converts. In that order.
- Name the benefit, not the action. "Se hvordan vi doblet leads på 3 uker" > "Klikk på lenken i bio."
- Give value first, ask second. A post that teaches something earns the right to ask for a click.
- One CTA per post. Split attention kills conversion.
- Social proof in the content itself. Results, numbers, client stories — not "vi er eksperter."

**Platform-specific format rules:**

**LinkedIn:**
- Hook: First line is everything — visible before "...se mer". Must create curiosity or state a bold claim. No greeting ("Hei alle!"), no question marks in hook.
- Line breaks between every 1-2 sentences. Wall of text = scroll past.
- 3-7 short paragraphs. One idea per paragraph.
- End with a question OR a CTA — not both. Questions drive comments. Links drive clicks. Choose based on goal.
- 3-5 hashtags at the bottom. Mix niche (#GA4 #markedsføring) and broad (#digital #strategi).
- Link in comments if the goal is engagement (algorithm deprioritizes link posts). Link in post if the goal is traffic.
- No emoji-heavy formatting (rocket emoji + point, repeat). Use sparingly or not at all.

**Instagram:**
- Caption: Hook sentence → value (3-5 short paragraphs) → CTA.
- Carousel slides if relevant: suggest 5-8 slides with headline + key point per slide. First slide = hook. Last slide = CTA.
- 15-20 hashtags: mix broad (500K+ posts), medium (50K-500K), and niche (<50K). Place after line breaks or in first comment.
- Suggest alt text for accessibility — describe the visual content, not the message.
- CTA: "Lagre dette innlegget" for value posts (saves boost reach). "Link i bio" for traffic.

**Facebook:**
- Shorter and more conversational than LinkedIn. 2-4 paragraphs.
- Question-driven — Facebook rewards comments over clicks.
- 1-3 hashtags max. Facebook hashtags are low-impact.
- Tag relevant pages/people where natural.
- Clear CTA or question — not both.

**X (Twitter):**
- Single tweet: Under 280 characters. Every word earns its place. Punch hard.
- Thread: 3-7 tweets. First tweet is the hook + promise. Last tweet is CTA + retweet ask. Number them (1/5, 2/5...).
- 0-2 hashtags. X rewards conversation, not discoverability hacks.
- Hot takes and specific numbers outperform generic advice.
- Quote tweet format for commenting on links/others' content.

**Before delivering drafts**, self-review against the shared anti-patterns. Fix violations silently — don't list them.

### 4. Review and Deliver

Run this checklist before presenting drafts:

- [ ] No phrases from the banned cliche lists
- [ ] Hook line creates genuine curiosity or states a bold claim
- [ ] Hook does NOT start with a greeting, rhetorical question, or "I dagens..."
- [ ] Each post is platform-native — not the same text reformatted
- [ ] One CTA per post, naming a benefit not just an action
- [ ] Content gives value before asking for action
- [ ] Paragraphs/lines are short enough for mobile reading
- [ ] Hashtag count matches platform norms
- [ ] Reads like a person posted it, not a social media manager
- [ ] Concrete details: numbers, names, examples — no vague claims

Deliver as markdown with clear platform headers:

```markdown
## LinkedIn

[post content]

**Hashtags:** #tag1 #tag2 #tag3

---

## Instagram

**Caption:**
[caption content]

**Hashtags:** #tag1 #tag2 ...

**Alt text:** [description]

**Carousel suggestion:** [if relevant]

---
```

### 5. Iterate

- Apply feedback per platform — don't rewrite posts that weren't flagged
- A/B variants on request: different hooks, different CTAs, different angles
- Tighten on each pass — social rewards brevity
- Final versions are copy-paste ready per platform

## Quality Standard

The goal: posts a Norwegian professional would engage with because they're genuinely interesting — AND click the CTA because the content made them want to. Scroll-stopping and action-driving are not opposites.

### Forbilder for sosiale medier som konverterer
- **Jasmin Alic** — LinkedIn-spesialist. Hooks som stopper scrolling, strukturert for lesbarhet, alltid med ett klart neste steg. Studer åpningslinjene.
- **Eddie Shleyner** ("Very Good Copy") — Mikrotekst som konverterer. Bevis for at færre ord ofte betyr mer handling.
- **Dave Gerhardt** (Exit Five) — B2B-innhold på LinkedIn som bygger fellesskap og driver trafikk. Benchmark for meningsdrevet posting.
- **Katelyn Bourgoin** ("Why We Buy") — Kjøpspsykologi i sosiale medier-format. Viser at innsikt + nysgjerrighetsgap driver engasjement uten å virke manipulerende.

For norsk språkkvalitet og overbevisende skriving: se stilreferansene i den delte anti-patterns-filen (Christine Calvert, Astrid Valen-Utvik m.fl.).
