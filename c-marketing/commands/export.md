---
description: Export a campaign as a self-contained HTML file for review and sharing
argument-hint: "<campaign-dir>"
---

# /export — $ARGUMENTS

Eksporterer en kampanje til en selvforsynt HTML-fil med plattformtro forhåndsvisninger av alt innhold.

## Context

!references/export/scaffold.html

## Language

**Bokmål** by default. English only if explicitly requested.

## Workflow

### Fase 1 — Finn kampanje

- Hvis `$ARGUMENTS` er oppgitt: bruk den som kampanjesti
- Hvis ikke: finn den nyeste kampanjemappen i `clients/*/campaigns/` (sorter etter dato i mappenavnet)
- Bekreft at mappen finnes og inneholder kampanjefiler

Les `clients/<slug>/profile.md` hvis den finnes — brukes for klientnavn, avsendernavn og profilbilder i mockups.

### Fase 2 — Kartlegg innhold

Les kampanjemappen og bygg en innholdsoversikt. Kategoriser hver fil:

**Organisk innhold:**

| Kampanjefil | Komponent |
|---|---|
| `article.md` | `references/export/components/article-preview.html` |
| `linkedin.md` | `references/export/components/linkedin-post.html` |
| `social.md` | `references/export/components/social-cards.html` |

**Betalt annonsering** (fra `ads.json` — parser JSON, grupper etter format og plattform):

| Format + plattform | Komponent |
|---|---|
| `feed` + `facebook` | `references/export/components/facebook-feed-ad.html` |
| `carousel` + `facebook` ELLER `linkedin` | `references/export/components/facebook-carousel-ad.html` |
| `stories` | `references/export/components/facebook-stories-ad.html` |
| `feed` + `linkedin` | `references/export/components/linkedin-sponsored-ad.html` |
| `search` + `google` | `references/export/components/google-search-ad.html` |
| `display` + `google` | `references/export/components/google-display-ad.html` |

**E-post:**

| Kampanjefil | Komponent |
|---|---|
| `newsletter.md` | `references/export/components/newsletter-preview.html` |
| `email-sequence.md` | `references/export/components/email-sequence.html` |

Hopp over filer som ikke finnes — kampanjer kan ha ulike innholdstyper.

### Fase 3 — Les scaffold

Les `references/export/scaffold.html`. Dette er den ytre HTML-rammen med navigasjon, tre kategoriseksjoner (organisk/betalt/e-post), og innsettingsmarkører (`<!-- INSERT:xxx -->`).

Fyll inn scaffold-plassholdere:
- `{{CAMPAIGN_TITLE}}` — kampanjetema fra brief eller mappenavn
- `{{CLIENT_NAME}}` — klientnavn fra profil
- `{{CAMPAIGN_DATE}}` — dato fra kampanjemappen (YYYY-MM-DD)
- `{{CONTENT_COUNT_BADGE}}` — f.eks. "6 innholdstyper"

### Fase 4 — Bygg innhold per type

For **hver innholdstype** som finnes i kampanjen:

1. **Les komponentmalen** — bruk Read-verktøyet til å lese riktig `.html`-fil fra `references/export/components/`
2. **Parse kampanjefilen** — trekk ut YAML frontmatter og brødtekst
3. **Konverter markdown til HTML** — overskrifter, avsnitt, lister, fet, kursiv, lenker
4. **Fyll inn plassholdere** — erstatt alle `{{TOKEN}}`-er med faktisk kampanjedata
5. **Sett inn i scaffold** — erstatt tilhørende `<!-- INSERT:xxx -->`-markør

#### Spesialhåndtering per type

**article.md:**
- Parse YAML: title, description, slug, date, keywords
- `{{TITLE}}` ← title, `{{DESCRIPTION}}` ← description, `{{SLUG}}` ← slug
- `{{KEYWORDS}}` ← keywords (render som kommaseparert liste)
- `{{DATE}}` ← date
- `{{HERO_IMAGE}}` ← heroImage fra frontmatter (hvis den finnes), ellers utelat
- `{{ARTICLE_HTML}}` ← brødtekst konvertert til HTML
- `{{READING_TIME}}` ← estimer fra ordtelling (ordtelling / 200, rund opp)

**linkedin.md:**
- `{{AUTHOR_NAME}}` ← fra klientprofil (kontaktperson) eller klientnavn
- `{{AUTHOR_HEADLINE}}` ← fra profil eller tom
- `{{PROFILE_IMAGE}}` ← fra profil eller utelat
- `{{TIMESTAMP}}` ← "Nylig"
- `{{POST_TEXT}}` ← hele innlegget (ren tekst, behold linjeskift)
- `{{HASHTAGS}}` ← hashtags fra bunnen av innlegget
- `{{REACTION_COUNT}}` ← "47", `{{COMMENT_COUNT}}` ← "12", `{{SHARE_COUNT}}` ← "5" (placeholder-tall)

**social.md:**
- Parse per-plattform seksjoner (## LinkedIn, ## Instagram, ## Facebook, ## X)
- Fyll inn plattformspesifikke tokens: `{{IG_USERNAME}}`, `{{IG_CAPTION}}`, `{{FB_TEXT}}`, `{{X_TEXT}}` etc.
- Bruk klientnavn/profil for brukernavn og avsender
- Placeholder engasjementstall

**ads.json:**
- Parse JSON. Les `defaults.page` for sidenavn, profilbilde, følgertall
- For HVER annonse i `ads`-arrayet:
  - Identifiser format og plattform
  - Les riktig komponentmal (kun første gang per format — gjenbruk for påfølgende)
  - Fyll inn fra annonseobjektet: primaryText, headline, description, cta, media.imageUrl, engagement
  - `{{PAGE_NAME}}` ← defaults.page.name, `{{PAGE_IMAGE}}` ← defaults.page.profileImageUrl
  - `{{FOLLOWER_COUNT}}` ← defaults.page.followerCount (for LinkedIn)
  - Render hver annonse som en egen komponent, alle satt inn i `<!-- INSERT:xxx -->`-markøren for riktig type
  - Wrap multiple annonser av samme type i en container med overskrift ("Facebook feed-annonse 1", "Facebook feed-annonse 2")

**newsletter.md:**
- Parse YAML: subject, preheader, date
- `{{SENDER_NAME}}` ← klientnavn fra profil
- `{{SUBJECT}}` ← subject, `{{PREHEADER}}` ← preheader, `{{DATE}}` ← date
- `{{EMAIL_HTML}}` ← brødtekst konvertert til HTML
- `{{HEADER_IMAGE}}` ← headerImage fra frontmatter (hvis den finnes)

**email-sequence.md:**
- Parse YAML: sequence, type, emails, trigger, date
- `{{SEQUENCE_NAME}}` ← sequence, `{{SEQUENCE_TYPE}}` ← type
- `{{TRIGGER}}` ← trigger, `{{TOTAL_EMAILS}}` ← emails (antall)
- `{{SEQUENCE_TABLE_HTML}}` ← render sekvenstabell fra innholdet som HTML-tabell
- For HVER e-post (## E-post #N):
  - Parse delay, emnelinje, preheader fra e-postens metadata
  - `{{EMAIL_NUMBER}}`, `{{DELAY}}`, `{{SUBJECT}}`, `{{PREHEADER}}`
  - `{{EMAIL_BODY_HTML}}` ← e-postens brødtekst konvertert til HTML
  - Repeter e-postnoden i timeline-komponenten for hver e-post

### Fase 5 — Fjern tomme seksjoner

- Fjern alle gjenværende `<!-- INSERT:xxx -->`-markører som ikke ble fylt
- Fjern hele kategoriseksjoner (`<section id="organic">`, `<section id="paid">`, `<section id="email">`) hvis de ikke inneholder noe innhold (kun markørene ble fjernet)
- Oppdater navigasjonen: fjern nav-lenker til seksjoner som ikke finnes

### Fase 6 — Skriv HTML

- Opprett `exports/`-mappen hvis den ikke finnes
- Skriv HTML-filen til `exports/<klient-slug>-<kampanje-slug>.html`
- Filnavnet utledes fra klientmappen og kampanjemappen

### Fase 7 — Bekreft

```
Eksport ferdig!

HTML: exports/<klient>-<kampanje-slug>.html

Åpne i nettleser for å se forhåndsvisning, eller del filen med teamet.

Innhold:
- [liste over produserte innholdstyper og antall annonser]

Kategorier:
- Organisk: [liste]
- Betalt: [liste]
- E-post: [liste]
```

## Regler

- Filen skal være 100% selvforsynt — ingen eksterne CSS, JS, eller fonter
- **Les komponentfiler on demand** — kun de som trengs for denne kampanjen
- Konverter markdown til HTML selv — ikke bruk eksterne verktøy
- Bevar bildereferanser fra kampanjefiler som relative stier
- Hvis `images/` finnes i kampanjemappen, bruk bildestier; ellers bruk plassholder-gradienter i komponentene
- Ikke endre kildefilene — kun les og eksporter
- Bruk semantisk HTML (article, section, nav, header)
- Responsive design — fungerer på mobil og desktop
- Plattform-mockups skal se troverdige ut — det er derfor vi bruker komponentmalene
