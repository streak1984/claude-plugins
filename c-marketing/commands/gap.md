---
description: Analyze competitor gaps — two-pass research, structural comparison, actionable recommendations
argument-hint: "<client-slug> <competitor-domain> [extra-urls...]"
---

# /gap — $ARGUMENTS

Analyserer gapet mellom en klient og en konkurrent. Kjører en to-trinns analyseprosess: strukturell kartlegging via sitemap, deretter målrettet dybdeskraping og gapanalyse med konkrete anbefalinger.

## Language

**Bokmål** by default. English only if explicitly requested.

## Argumenter

- `<client-slug>` — Må matche en eksisterende mappe i `clients/` med `profile.md`
- `<competitor-domain>` — Konkurrentens nettsteddomene (f.eks. `duett.no`)
- `[extra-urls...]` — Valgfrie ekstra-sider å inkludere i skrapingen

**Eksempler:**

- `/gap conta duett.no`
- `/gap conta tripletex.no https://tripletex.no/priser`

## Output

```
clients/<slug>/competitors/<competitor-slug>/
├── profile.md    # Konkurrentens mini-profil
└── gap.md        # Gapanalyse med anbefalinger
```

## Workflow

### Fase 1 — Setup og discovery (sekvensiell)

Parse argumentene:

1. **Parse argumenter:** Første = client-slug, andre = competitor-domain, resten = extra-urls
2. **Avled competitor-slug** fra domenet: `duett.no` → `duett`, `tripletex.no` → `tripletex`
3. **Sjekk at klientprofil finnes:** Les `clients/<client-slug>/profile.md`. Avbryt hvis den ikke finnes.
4. **Trekk ut klientkontekst** og behold gjennom hele workflowen:
   - Fra YAML frontmatter: `audience`, `tone`, `cta_patterns`
   - Fra `## Nøkkeltemaer`: liste over temaer og tjenester
   - Fra `## Konkurrenter`: eksisterende konkurrentomtaler
   - Fra `## Merkevarestemme`: posisjonering og budskap
   - Hvis felt er tomme eller har `<!-- FYLL INN -->` placeholder, noter det — gapanalysen kan bare sammenligne det klienten faktisk kommuniserer
5. **Sjekk om konkurrentmappe finnes:** Hvis `clients/<client-slug>/competitors/<competitor-slug>/` allerede finnes, spør brukeren:
   - **Oppdater** — kjør ny analyse og overskriv
   - **Kun analyse** — bruk eksisterende profil, kjør ny gapanalyse
   - **Avbryt**
6. **WebFetch robots.txt** (`https://<competitor-domain>/robots.txt`):
   - Trekk ut `Sitemap:`-direktiver
   - Hvis robots.txt returnerer 404 eller ikke inneholder `Sitemap:`-direktiver, gå direkte til fallback (steg 9)
7. **Hent sitemap(s):**
   - Håndtér sitemap-indekser (sitemaps som peker til andre sitemaps)
   - Prioriter norsk sitemap (`/nb/`, `/no/`, `hreflang="nb"`)
   - Hvis konkurrenten kun har engelskspråklig innhold, bruk det og noter språket
8. **Trekk ut** URL, lastmod, priority fra sitemap-oppføringer
   - **Maks 500 URLer.** Hvis sitemap har flere, prioriter basert på lastmod (nyeste først) og URL-struktur (tjenestesider og blogg over hjelpesider og arkiv)
9. **Fallback hvis ingen sitemap:** Hent hjemmeside-navigasjon + WebSearch `site:<competitor-domain>`
10. **Hent alltid hjemmesiden** for firmanavn og sosiale lenker
11. **WebSearch firmanavn** for LinkedIn, presseomtaler, anmeldelser
12. **Bygg sideoversikt** kategorisert etter sti-struktur:

```
Tjenester: 12 sider
Blogg: 34 innlegg
Priser: 2 sider
Om oss: 3 sider
Hjelp: 18 sider
Annet: 7 sider
```

13. **Presenter oversikten** til brukeren med antall per kategori.

**Vent på godkjenning før du fortsetter.**

### Fase 2 — To-trinns research

#### Pass 1: Strukturell kartlegging (sekvensiell)

Bruk klientkonteksten fra Fase 1 steg 4 (ikke les profilen på nytt):

1. **Kategoriser konkurrentsider** mot klientens temaer fra `## Nøkkeltemaer` og YAML-felt
2. **Produser gap-kart:**
   - **Kun konkurrent:** Temaer/sider konkurrenten har som klienten mangler
   - **Felles:** Temaer begge dekker
   - **Kun klient:** Temaer klienten har som konkurrenten mangler
3. **Velg sider for dybdeskraping** basert på gap-kartet:
   - **Alltid inkluder:** Om oss, priser, 2-3 nyeste blogginnlegg
   - **Gap-områder:** Sider der konkurrenten har dekning klienten mangler
   - **Overlapp:** 2-3 sider med felles tema (for direkte sammenligning)
   - **Dropp:** Områder klienten allerede dekker godt
   - **Maks 20 sider** totalt for dybdeskraping
4. **Bygg konkret URL-liste** med faktiske URLer for hver agent (ikke generiske beskrivelser)

#### Pass 2: Dybdeskraping (3 parallelle Task-agenter)

**Forberedelse:**

1. Opprett research-mappe: `clients/<client-slug>/competitors/<competitor-slug>/.research/`
2. Erstatt alle plassholdere i agent-promptene før dispatch:
   - `[Sammendrag av klientens tjenester...]` → faktisk klientkontekst fra Fase 1 steg 4
   - `[URLer]` → faktiske URLer fra Pass 1 steg 4
   - `[Sti]` → faktisk filsti for output
   - Inkluder gap-kartet så agentene vet hvilke områder som er gap vs. overlapp

**Viktig — disk-basert overlevering:** Agentene skriver fullstendig YAML til disk og returnerer **kun et kort sammendrag** (maks 3-4 setninger) til hovedagenten. Dette hindrer kontekstvinduet fra å fylles opp.

Start tre Task sub-agenter **samtidig**:

##### Agent 1: Website

````
Prompt til sub-agent:

Du analyserer en konkurrents nettsted for å bygge en konkurrentprofil og identifisere gap.

**Klientkontekst:**
[Sett inn: sammendrag av klientens tjenester, nøkkeltemaer og posisjonering fra profilen]

**Sider å hente (bruk WebFetch):**
[Sett inn: faktiske URLer valgt i Pass 1 — f.eks. https://competitor.no/om-oss, https://competitor.no/priser, etc.]

**Trekk ut som YAML med denne strukturen:**

```yaml
website_analysis:
  company_name: ""
  tagline: ""
  language: nb  # nb eller en basert på innholdet
  value_proposition: ""  # Én setning: hva de gjør og for hvem
  services:
    - name: ""
      description: ""
      url: ""
  pricing:
    model: ""  # freemium, abonnement, kontakt-oss, etc.
    tiers: []
    free_tier: false
    price_range: ""
  tone_observations:
    formality: ""  # formell, uformell, blanding
    persona: ""  # personal (bruker "jeg") eller company (bruker "vi")
    adjectives: []  # 3-5 ord som beskriver stilen
    sample_quotes:  # 2-3 representative sitater fra innholdet
      - text: ""
        source: ""
  audience_signals:
    who: ""  # Hvem snakker de til?
    pain_points: []  # Problemer de adresserer
    desires: []  # Ønsker/mål de lover
  blog_analysis:
    frequency: ""  # ukentlig, månedlig, uregelmessig
    topics: []
    recent_posts:
      - title: ""
        url: ""
        date: ""
        topic: ""
  cta_examples:
    - text: ""
      location: ""
  key_messaging:
    - claim: ""
      evidence: ""
      page: ""
```

**Regler:**
- Bruk direkte sitater der mulig
- Marker konfidens: "observert" vs "antatt"
- Ikke gjett — rapporter bare det du finner
- Hvis WebFetch feiler for en URL, noter den som utilgjengelig og gå videre til neste kilde
- Legg spesielt merke til innhold som dekker temaer klienten ikke adresserer (se klientkontekst)

**Output:**
- Skriv YAML-resultatet til: [Sett inn: clients/<client-slug>/competitors/<competitor-slug>/.research/website.yaml]
- Returner kun et kort sammendrag (maks 3-4 setninger) av de viktigste funnene til hovedagenten
````

##### Agent 2: Social

````
Prompt til sub-agent:

Du analyserer en konkurrents sosiale medier-tilstedeværelse for å bygge en konkurrentprofil.

**Klientkontekst:**
[Sett inn: sammendrag av klientens tjenester, nøkkeltemaer og posisjonering fra profilen]

**Kilder å hente (bruk WebFetch):**
[Sett inn: faktiske URLer — f.eks. https://linkedin.com/company/competitor, etc.]

**Trekk ut som YAML med denne strukturen:**

```yaml
social_analysis:
  linkedin:
    company_description: ""
    follower_count: ""
    industry: ""
    employee_count: ""
    specialties: []
    recent_activity: ""  # Aktiv/inaktiv, type innhold
  founder:
    name: ""
    title: ""
    linkedin_url: ""
  other_social:
    - platform: ""
      url: ""
      follower_count: ""
  content_themes: []  # Gjennomgående temaer i sosiale medier
  engagement_level: ""  # Høy, middels, lav
```

**Regler:**
- LinkedIn-data er ofte mest pålitelig for bedriftsbeskrivelse
- Follower count gir en indikasjon på merkevaresynlighet
- Ikke gjett — rapporter bare det du finner
- Hvis WebFetch feiler for en URL, noter den som utilgjengelig og gå videre til neste kilde

**Output:**
- Skriv YAML-resultatet til: [Sett inn: clients/<client-slug>/competitors/<competitor-slug>/.research/social.yaml]
- Returner kun et kort sammendrag (maks 3-4 setninger) av de viktigste funnene til hovedagenten
````

##### Agent 3: External

````
Prompt til sub-agent:

Du analyserer eksterne kilder om en konkurrent for å bygge en konkurrentprofil.

**Klientkontekst:**
[Sett inn: sammendrag av klientens tjenester, nøkkeltemaer og posisjonering fra profilen]

**Kilder å hente (bruk WebFetch + WebSearch):**
[Sett inn: faktiske URLer fra discovery — presseartikler, anmeldelser, etc.]

Gjør også egne søk:
- WebSearch: "<firmanavn> anmeldelse"
- WebSearch: "<firmanavn> vs <klientnavn>"
- WebSearch: "<bransje> sammenligning Norge"

**Trekk ut som YAML med denne strukturen:**

```yaml
external_analysis:
  press_mentions:
    - title: ""
      source: ""
      url: ""
      date: ""
      summary: ""
  reviews:
    - platform: ""
      rating: ""
      review_count: ""
      summary: ""
  comparison_mentions:
    - source: ""
      url: ""
      compared_with: []
      verdict: ""
  market_positioning: ""  # Én setning om hvor konkurrenten plasserer seg
  strengths_mentioned: []  # Styrker nevnt i eksterne kilder
  weaknesses_mentioned: []  # Svakheter nevnt i eksterne kilder
```

**Regler:**
- Søk bredt: firmanavn + bransje + Norge
- Søk spesifikt etter sammenligninger mellom klienten og konkurrenten
- Noter konkurrenter nevnt i samme kontekst
- Ikke gjett — rapporter bare det du finner
- Hvis WebFetch feiler for en URL, noter den som utilgjengelig og gå videre til neste kilde
- Meld fra hvis du finner lite eksternt — det er også nyttig informasjon

**Output:**
- Skriv YAML-resultatet til: [Sett inn: clients/<client-slug>/competitors/<competitor-slug>/.research/external.yaml]
- Returner kun et kort sammendrag (maks 3-4 setninger) av de viktigste funnene til hovedagenten
````

### Fase 3 — Syntese og gapanalyse (sub-agent)

Når alle tre research-agenter er ferdige, dispatch **én syntese-agent** som leser fra disk og skriver ferdig output.

**Viktig:** Hovedagenten sender IKKE agent-resultatene videre. Syntese-agenten leser alt fra disk.

Bygg syntese-prompten med følgende innhold. Erstatt alle plassholdere med faktiske stier og data:

````
Prompt til sub-agent:

Du syntetiserer research-data til en konkurrentprofil og gapanalyse.

**Les disse filene:**
- Klientprofil: [Sett inn: sti til clients/<client-slug>/profile.md]
- Website-analyse: [Sett inn: sti til .research/website.yaml]
- Sosial-analyse: [Sett inn: sti til .research/social.yaml]
- Ekstern-analyse: [Sett inn: sti til .research/external.yaml]

**Metadata fra orkestratoren:**
- Konkurrentens domene: [Sett inn: domene]
- Dagens dato: [Sett inn: dato]
- Antall indekserte sider: [Sett inn: antall fra Fase 1]
- Antall skrapede sider: [Sett inn: antall]
- Sideoversikt per kategori: [Sett inn: kategorisert oversikt fra Fase 1]

---

## Del 1: Bygg profile.md

**Konfliktløsningsprioritet:**
1. Eget innhold (website_analysis) — høyest
2. Sosiale medier (social_analysis)
3. Eksterne kilder (external_analysis) — lavest

**Mapping: Agent-output → Profil-felt**

| Profil-felt | Kilde |
|------------|-------|
| `name` | `website_analysis.company_name` → `social_analysis.linkedin.company_description` (første ord) |
| `domain` | Fra metadata |
| `language` | `website_analysis.language` |
| `tone` | `website_analysis.tone_observations.adjectives` (velg 3, kommaseparert) |
| `audience.primary` | `website_analysis.audience_signals.who` |
| `audience.pain` | Mest nevnte fra `website_analysis.audience_signals.pain_points` |
| `audience.desire` | Mest nevnte fra `website_analysis.audience_signals.desires` |
| `cta_patterns` | `website_analysis.cta_examples[].text` (velg 2-3 representative) |
| `services` | `website_analysis.services[].name` (kun navn, ikke objekter) |
| `pricing.model` | `website_analysis.pricing.model` |
| `pricing.free_tier` | `website_analysis.pricing.free_tier` |
| `pricing.price_range` | `website_analysis.pricing.price_range` |
| `scraped` | Fra metadata |
| `pages_indexed` | Fra metadata |
| `pages_scraped` | Fra metadata |
| **Posisjonering** | `website_analysis.value_proposition` + `key_messaging` + `sample_quotes` som bevis |
| **Tjenester og priser** | `website_analysis.services` (med beskrivelser) + `pricing` |
| **Innholdsstrategi** | `website_analysis.blog_analysis` + `social_analysis.content_themes` + `social_analysis.engagement_level` |
| **Tillitssignaler** | `external_analysis.press_mentions` + `reviews` + `social_analysis.linkedin.follower_count` |

**YAML Frontmatter:**

```yaml
---
name: ""
domain: ""
language: nb
tone: ""
audience:
  primary: ""
  pain: ""
  desire: ""
cta_patterns: []
services: []
pricing:
  model: ""
  free_tier: false
  price_range: ""
scraped: YYYY-MM-DD
pages_indexed: 0
pages_scraped: 0
---
```

**Markdown-seksjoner:**
- **Posisjonering** — value proposition, tagline, markedsposisjon (med sitater som bevis)
- **Tjenester og priser** — tjenesteliste, prismodell, prisnivåer
- **Innholdsstrategi** — bloggfrekvens, temaer, sosiale kanaler, engasjement
- **Tillitssignaler** — presseomtaler, anmeldelser, sammenligninger, styrker/svakheter

---

## Del 2: Bygg gap.md

**To datakilder:** Klientprofilen (lest fra disk) og konkurrentprofilen (nettopp bygget).

For hvert punkt i klient-kolonnen: bruk det som faktisk står i klientprofilen. Hvis klientprofilen mangler informasjon om en dimensjon, skriv "Ikke kommunisert i profil/nettsted" — ikke gjett.

**YAML Frontmatter:**

```yaml
---
client: "<client-slug>"
competitor: "<competitor-slug>"
date: YYYY-MM-DD
gaps_found: 0  # Totalt antall identifiserte gap
---
```

**Strukturell oversikt** — tabell som sammenligner sideantall per kategori (bruk metadata fra orkestratoren):

| Kategori | Konkurrent | Klient | Differanse |
|----------|-----------|--------|------------|

Klientens tall baseres på kjent innhold fra profilen. Hvis ukjent, skriv "ukjent".

**Gapanalyse — 6 dimensjoner.** Hver dimensjon følger samme struktur:

```markdown
#### 1. [Dimensjon]

**Konkurrent:**
[Hva konkurrenten gjør — med data og sitater fra research-filene]

**Klient:**
[Hva klienten gjør — fra klientprofilen]

**Gap:**
[Forskjellen og hvorfor det betyr noe for klientens målgruppe]
```

De seks dimensjonene:
1. **Posisjonering** — Value proposition, tagline, merkevareløfter
2. **Tjenester/Produkt** — Prismodell, tjenestebredde, unike funksjoner
3. **Innhold & Synlighet** — Bloggfrekvens, temaer, SEO-fotavtrykk, sosiale medier
4. **Målgruppe & Budskap** — Hvem snakker de til? Smerter og ønsker
5. **Tillitssignaler** — Presseomtaler, anmeldelser, kundehistorier
6. **CTA & Konvertering** — CTA-mønster, prissider, free trial

**Regler for gapanalysen:**
- Bruk konkrete data og sitater som bevis
- Forklar *hvorfor* hvert gap betyr noe for klientens målgruppe
- Noter også områder der klienten er sterkere
- Hvert gap må ha en kilde (URL eller profilreferanse)

---

## Del 3: Anbefalinger (legg til i gap.md)

Basert på de spesifikke gapene. **Hver anbefaling må referere til et konkret gap.**

**Raske gevinster** (minimum 3, < 2 uker):
```
1. **[Tiltak]** — Lukker gap i [dimensjon]: [spesifikt gap]. Estimert effekt: [høy/middels/lav].
```

**Langsiktige tiltak** (strategiske initiativer):
```
1. **[Initiativ]** — Lukker gap i [dimensjon]: [spesifikt gap]. Forventet utfall: [konkret].
```

**Innholdsideer** (minimum 5 rader):

| Tema | Type | Vinkel | Gap det lukker | Prioritet |
|------|------|--------|----------------|-----------|

**Kilder** — samlet kildeliste med alle URLer brukt i analysen.

---

## Output

Skriv ferdig output til:
- [Sett inn: sti til profile.md]
- [Sett inn: sti til gap.md]

**Returner** kun et sammendrag (maks 5-6 setninger) av de viktigste gapene til hovedagenten.
````

### Fase 4 — Review og lagring

1. **Les ferdig analyse** fra disk:
   - Les `clients/<client-slug>/competitors/<competitor-slug>/gap.md`
   - Presenter sammendrag av de viktigste funnene, anbefalinger og proveniens

**Vent på godkjenning.** Brukeren kan:
- Godkjenne som den er
- Korrigere funn eller anbefalinger
- Be om mer research på spesifikke områder

Iterer til brukeren er fornøyd.

2. **Rydd opp:** Slett `.research/`-mappen etter godkjenning.

3. **Tilby oppdatering av klientprofil:**
   ```
   Vil du oppdatere clients/<client-slug>/profile.md?
   - Legge til <competitor-name> i ## Konkurrenter-seksjonen
   ```

4. **Bekreft med neste steg:**
   ```
   Gapanalyse lagret:
   - clients/<client-slug>/competitors/<competitor-slug>/profile.md
   - clients/<client-slug>/competitors/<competitor-slug>/gap.md

   Neste steg:
   - /brief <tema> — lag et brief basert på et identifisert gap
   - /campaign <tema> — start en kampanje rettet mot et gap-område
   - /gap <client-slug> <annen-konkurrent> — analyser en annen konkurrent
   ```

## Regler

- **Aldri gjett.** Rapporter bare det som faktisk finnes i kildene. Tomme felt er bedre enn feil felt.
- **Proveniens.** I review-fasen, vis alltid hvor data kommer fra.
- **Disk-basert overlevering.** Agenter skriver til disk, returnerer kun sammendrag. Hovedagenten holder aldri full agent-output i kontekst.
- **Maks 20 sider** dybdeskraping totalt. Bruk strukturell kartlegging for å prioritere.
- **Maks 500 URLer** fra sitemap. Prioriter nyeste og mest relevante ved overskridelse.
- **robots.txt først.** Hvis robots.txt mangler eller ikke har Sitemap-direktiver, gå til fallback.
- **Norsk sitemap prioritert.** Velg norsk versjon når flere språkversjoner finnes. Hvis kun engelsk, bruk det og noter språkforskjellen.
- **Konkrete gap.** Bruk data og sitater som bevis — ikke vage påstander.
- **Handlingsrettede anbefalinger.** Hver anbefaling refererer til et spesifikt gap og er konkret nok til å brukes som input til `/brief`.
- **Vent på godkjenning** før skraping (Fase 1) og før lagring (Fase 4). Ikke skriv til disk uten brukerens OK — unntatt `.research/`-filer som er mellomlagring.
