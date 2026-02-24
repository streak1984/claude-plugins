---
description: Generate a client profile from web sources — automated scraping, synthesis, and review
argument-hint: "<domain> [URLs...] or --enrich <slug>"
---

# /profile — $ARGUMENTS

Generer en klientprofil automatisk fra nettkilder. Skraper hjemmeside, sosiale medier og eksterne kilder i parallell, syntetiserer funnene, og produserer en ferdig `profile.md` som passer kampanjepipelinen.

## Language

**Bokmål** by default. English only if explicitly requested.

## Modi

- **Ny profil:** `/profile <domain> [optional URLs...]`
- **Berik eksisterende:** `/profile --enrich <slug>`

## Workflow

### Fase 1 — Discovery (sekvensiell)

Parse argumentene:
- Hvis `--enrich <slug>`: gå til **Enrich-modus** (se egen seksjon nedenfor)
- Ellers: `<domain>` er første argument, resten er valgfrie URLer

**Steg:**

1. **Avled slug** fra domenet: `acme.no` → `acme`, `example.com` → `example`
2. **Sjekk om klientmappe finnes:** Hvis `clients/<slug>/` ikke finnes, opprett den:
   ```bash
   mkdir -p clients/<slug>/campaigns/
   mkdir -p clients/<slug>/research/
   mkdir -p clients/<slug>/templates/
   ```
   Informer brukeren: "Opprettet mappestruktur for `<slug>`. Kjør `/claude-everywhere:onboarding <slug>` for full oppsettsveiledning."
3. **Sjekk om profil finnes:** Les `clients/<slug>/profile.md`. Hvis den finnes, spør brukeren:
   - "Profil for `<slug>` finnes allerede. Vil du overskrive, eller bruke `--enrich` for å oppdatere?"
   - Vent på svar. Stopp hvis brukeren ikke vil overskrive.
4. **WebFetch hjemmeside** (`https://<domain>/`):
   - Trekk ut: firmanavn, navigasjonslenker, blogg-URL, sosiale lenker (LinkedIn, Facebook, X/Twitter, Instagram)
   - Identifiser "Om oss"-side, tjeneste-/produktsider
   - Noter språk (norsk/engelsk)
5. **WebSearch** `"<firmanavn>"`:
   - Finn LinkedIn bedriftsside
   - Finn presseomtaler, anmeldelser, bransjeartikel
6. **Bygg kildeliste** — kombiner:
   - Bruker-oppgitte URLer
   - Oppdagede lenker fra hjemmeside
   - Søkeresultater
   - Organiser i tre kategorier: website, social, external

Presenter kildelisten for brukeren:

```
Fant følgende kilder for <firmanavn>:

Website:
- Hjemmeside: <url>
- Om oss: <url>
- Blogg: <url> (X innlegg funnet)
- Tjenester: <url>

Sosiale medier:
- LinkedIn: <url>
- [andre]

Eksternt:
- <presseartikkel>
- <anmeldelse>

Starter scraping av disse kildene. Noe du vil legge til eller fjerne?
```

**Vent på godkjenning før du fortsetter.**

### Fase 2 — Deep Scraping (3 parallelle Task-agenter)

Start tre Task sub-agenter **samtidig**. Hver agent får sin kildeliste og returnerer strukturert data.

#### Agent 1: Website

```
Prompt til sub-agent:

Du analyserer et firmas nettsted for å bygge en klientprofil.

**Kilder å hente (bruk WebFetch):**
- Om oss / About-side
- 3-4 nyeste bloggposter (hvis blogg finnes)
- Tjeneste-/produktsider (maks 3)
- Hovedside (allerede hentet — innhold vedlagt)

**Trekk ut og returner som YAML:**

```yaml
website_analysis:
  company_name: ""
  tagline: ""
  language: nb  # nb eller en basert på innholdet
  value_proposition: ""  # Én setning: hva de gjør og for hvem
  services:
    - ""
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
  blog_topics:
    - ""
  cta_examples:
    - text: ""
      location: ""
  sender_name: ""  # Hvis én person signerer innhold
  visual_notes:
    primary_colors: []  # Hex-koder hvis synlige
    image_style: ""  # Foto, illustrasjon, etc.
```

**Regler:**
- Bruk direkte sitater der mulig
- Marker konfidens: "observert" vs "antatt"
- Ikke gjet — rapporter bare det du finner
```

#### Agent 2: Social

```
Prompt til sub-agent:

Du analyserer et firmas sosiale medier-tilstedeværelse for å bygge en klientprofil.

**Kilder å hente (bruk WebFetch):**
- LinkedIn bedriftsside
- LinkedIn grunnlegger/CEO-profil (hvis funnet)
- Andre sosiale profiler (Facebook, X/Twitter)

**Trekk ut og returner som YAML:**

```yaml
social_analysis:
  linkedin:
    company_description: ""
    follower_count: ""
    industry: ""
    employee_count: ""
    specialties: []
  founder:
    name: ""
    title: ""
    linkedin_url: ""
  other_social:
    - platform: ""
      url: ""
      follower_count: ""
  sender_persona_signal: ""  # "Grunnlegger poster personlig" vs "Bedriftsside er hovedkanal"
```

**Regler:**
- LinkedIn-data er ofte mest pålitelig for bedriftsbeskrivelse
- Follower count gir en indikasjon på merkevaresynlighet
- Ikke gjet — rapporter bare det du finner
```

#### Agent 3: External

```
Prompt til sub-agent:

Du analyserer eksterne kilder om et firma for å bygge en klientprofil.

**Kilder å hente (bruk WebFetch + WebSearch):**
- Presseartikler og omtaler
- Anmeldelser (Google, Trustpilot, bransjespesifikke)
- Konkurrentsider (WebSearch: "<bransje> + Norge" eller lignende)

**Trekk ut og returner som YAML:**

```yaml
external_analysis:
  press_mentions:
    - title: ""
      source: ""
      url: ""
      summary: ""
  reviews:
    - platform: ""
      rating: ""
      summary: ""
  competitors:
    - name: ""
      domain: ""
      differentiator: ""  # Hva skiller dem fra profil-firmaet?
  market_positioning: ""  # Én setning om hvor firmaet plasserer seg
```

**Regler:**
- Søk bredt: firma + bransje + Norge
- Noter konkurrenter nevnt i samme kontekst
- Ikke gjet — rapporter bare det du finner
- Meld fra hvis du finner lite eksternt — det er også nyttig informasjon
```

### Fase 3 — Syntese

Når alle tre agenter er ferdige, slå sammen resultatene til en profil.

**Konfliktløsningsprioritet:**
1. Eget innhold (website-agent) — høyest
2. Sosiale medier (social-agent)
3. Eksterne kilder (external-agent) — lavest

**Mapping til profil-felt:**

Les `clients/_template/profile.md` for eksakt format. Map funnene slik:

| Profil-felt | Kilde |
|------------|-------|
| `name` | `website_analysis.company_name` → `social_analysis.linkedin.company_description` |
| `domain` | Fra bruker-input |
| `language` | `website_analysis.language` |
| `tone` | `website_analysis.tone_observations.adjectives` (velg 3, kommaseparert) |
| `sender_persona` | `website_analysis.tone_observations.persona` — `personal` hvis "jeg", `company` hvis "vi" |
| `sender_name` | `website_analysis.sender_name` → `social_analysis.founder.name` |
| `audience.primary` | `website_analysis.audience_signals.who` |
| `audience.pain` | Mest nevnte fra `website_analysis.audience_signals.pain_points` |
| `audience.desire` | Mest nevnte fra `website_analysis.audience_signals.desires` |
| `cta_patterns` | `website_analysis.cta_examples[].text` (velg 2-3 representative) |
| `defaults.page.name` | `website_analysis.company_name` |
| `defaults.page.followerCount` | `social_analysis.linkedin.follower_count` |
| `defaults.page.profileImageUrl` | Default: `assets/images/logo.png` |
| **Merkevarestemme** | Skriv basert på `tone_observations` med `sample_quotes` som bevis |
| **Visuelle retningslinjer** | `website_analysis.visual_notes` |
| **Nøkkeltemaer** | `website_analysis.blog_topics` + `website_analysis.services` |
| **Konkurrenter** | `external_analysis.competitors` |
| **Begrensninger** | `<!-- FYLL INN: Legg til merkevareregler, compliance-krav, o.l. -->` |

**For felt som ikke kan fylles:** Bruk `<!-- FYLL INN: [beskrivelse av hva som trengs] -->` som placeholder.

### Fase 4 — Review

Presenter profil-utkastet til brukeren med proveniens-annotasjoner:

```markdown
## Profilforslag: <firmanavn>

### YAML Frontmatter
[Vis alle felt med kilde-annotasjoner i kommentarer]

### Merkevarestemme
[Tekst basert på funnene]
> Kilde: "[sitat]" — <url>

### Visuelle retningslinjer
[Farger, stil]
> Kilde: Observert fra hjemmeside

### Nøkkeltemaer
[Liste]
> Kilde: Blogganalyse, tjenestesider

### Konkurrenter
[Liste med differensiatorer]
> Kilde: [presseartikkel/søk]

### Begrensninger
<!-- FYLL INN: Legg til merkevareregler, compliance-krav, publiseringsfrekvens, o.l. -->

---
**Konfidens:** [oppsummering av hva som er sterkt vs svakt]
**Mangler:** [felt som trenger manuell utfylling]
```

**Vent på godkjenning.** Brukeren kan:
- Godkjenne som den er
- Korrigere enkeltfelt
- Be om re-scraping av spesifikke kilder

Iterer til brukeren er fornøyd.

### Fase 5 — Lagring

1. **Sjekk mappestruktur** — opprett hvis den ikke finnes:
   ```
   clients/<slug>/
     profile.md
     research/
     campaigns/
     assets/
       images/
     templates/
   ```
   Bruk `mkdir -p` for alle mapper. Kopier fra `clients/_template/` hvis den finnes, ellers opprett manuelt.
2. **Skriv `profile.md`** — bruk det godkjente innholdet, men:
   - Fjern alle proveniens-annotasjoner (kilde-kommentarer, konfidens-noter)
   - Behold `<!-- FYLL INN: ... -->` for tomme felt
   - Sørg for at YAML frontmatter er gyldig og parsebar
3. **Bekreft:**
   ```
   Klientprofil lagret: clients/<slug>/profile.md

   Neste steg:
   - Fyll inn manglende felt markert med "FYLL INN"
   - Legg til logo i clients/<slug>/assets/images/
   - Kjør /claude-everywhere:campaign <tema> for å starte en kampanje
   ```

## Enrich-modus

Aktiveres med `/profile --enrich <slug>`.

### Steg:

1. **Les eksisterende profil:** `clients/<slug>/profile.md`
2. **Identifiser hull:**
   - YAML-felt med tomme verdier eller placeholder-tekst
   - Markdown-seksjoner med `<!-- FYLL INN: ... -->` eller generisk template-tekst
   - Felt som kan oppdateres (f.eks. follower count, nye bloggposter)
3. **Presenter gap-analyse:**
   ```
   Eksisterende profil for <slug>:

   Utfylt: name, domain, language, tone, audience
   Mangler: sender_name, cta_patterns, Konkurrenter, Begrensninger
   Kan oppdateres: followerCount (sist: X), Nøkkeltemaer

   Vil du at jeg scraper for de manglende/utdaterte feltene?
   ```
4. **Vent på godkjenning.**
5. **Målrettet scraping:** Kjør kun agentene som trengs for de manglende feltene:
   - Mangler `sender_name`? → Social-agent
   - Mangler `Konkurrenter`? → External-agent
   - Mangler `cta_patterns`? → Website-agent
   - Kan kjøre parallelt hvis flere agenter trengs
6. **Presenter delta:**
   ```
   Foreslåtte oppdateringer:

   sender_name: "" → "Ola Nordmann"
   cta_patterns:
     - "Book en demo"  (NY)
     - "Last ned guide" (NY)

   ### Konkurrenter (NY)
   - Firma A — fokuserer på X
   - Firma B — fokuserer på Y

   Godkjenn oppdateringene?
   ```
7. **Vent på godkjenning.**
8. **Oppdater fil:** Endre kun de godkjente feltene. Bevar alt manuelt innhold urørt.

## Regler

- **Aldri gjett.** Rapporter bare det som faktisk finnes i kildene. Tomme felt er bedre enn feil felt.
- **Proveniens først.** I review-fasen, vis alltid hvor data kommer fra.
- **Bevar manuelt innhold.** I enrich-modus, aldri overskriv felt som brukeren har fylt inn manuelt.
- **Template-format er lov.** Output må matche `clients/_template/profile.md` eksakt i struktur — samme YAML-felt, samme markdown-overskrifter.
- **Én kilde per påstand.** Ikke syntetiser vage konklusjoner fra mange kilder — bruk den beste kilden per felt.
- **Vent på godkjenning** før scraping (Fase 1) og før lagring (Fase 4). Ikke skriv til disk uten brukerens OK.
- **Opprett manglende mapper.** Hvis `clients/<slug>/` ikke finnes, opprett mappestrukturen automatisk i stedet for å feile.
