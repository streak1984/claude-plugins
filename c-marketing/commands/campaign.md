---
description: Full content campaign — brief, research, parallel content production, images, and export
argument-hint: "<topic or rough idea>"
---

# /campaign — $ARGUMENTS

Produser en komplett innholdskampanje for **$ARGUMENTS**. Fra brief til ferdig innhold — artikkel, nyhetsbrev, LinkedIn, sosiale medier, og annonser — alt i parallell.

**Forutsetning**: Kjør dette som en orkestrering. Briefen lages interaktivt, resten delegeres til sub-agenter.

## Context

!references/anti-patterns.md

## Language

**Bokmål** by default. English only if explicitly requested.

## Workflow

### Fase 0 — Klientvalg

Før du starter, identifiser klienten:

1. Les `clients/`-mappen. List opp tilgjengelige klientprofiler (mapper med `profile.md`).
2. Hvis bare én klient finnes (utenom `_template`): velg den automatisk og bekreft.
3. Hvis flere finnes: spør brukeren hvilken klient kampanjen er for.
4. Hvis ingen finnes: spør brukeren om de vil opprette en ny klientprofil:
   - **Anbefalt:** Kjør `/c-marketing:onboarding` for å sette opp arbeidsområdet

Les `clients/<slug>/profile.md` og hold den tilgjengelig for alle nedstrøms-faser.

### Fase 1 — Brief (interaktiv)

Lag briefen direkte i denne samtalen. Briefen er strategifasen — ingen skriving, ingen stemme-regler, ingen konverteringsråd. Nedstrøms-agenter håndterer kvalitet. Briefen håndterer klarhet.

#### 1a. Parse og identifiser gap

Les inputen. Identifiser hva som allerede er klart og hva som mangler:

- Tema? Målgruppe? Vinkel? Kjernebudskap? CTA? Tone? Kanaler?

Presenter: "Her er det jeg forstår fra inputen din — her er det jeg fortsatt trenger." Vær spesifikk om hva som er klart og hva som er vagt.

Hvis klientprofil er tilgjengelig, marker profil-kjente felt som "fra profil — bekreft eller overstyr":
- Målgruppe? fra profil
- Tone? fra profil
- CTA-retning? fra profil

**Ikke still et generisk spørreskjema.** Hvis inputen sier "GA4-migrering for e-commerce", er temaet klart — ikke spør "hva er temaet?"

**Vent på godkjenning før du fortsetter.**

#### 1b. Avklar

Still **3-7 målrettede spørsmål** basert bare på gapene fra steg 1a. Bruk StoryBrand-linsen for å forme spørsmålene — fokuser på leserens verden:

**Med klientprofil:** Hopp over spørsmål som profilen besvarer. Fokuser bare på kampanjespesifikke gap: vinkel, støttepunkter, kilder, og kanalvalg.

- **Hva vil leseren?** Ønsket som bringer dem til dette innholdet.
- **Hva er problemet deres?** Hindringen, smerten, forvirringen de møter.
- **Hva kan de vinne?** Konkret suksess-tilstand hvis de handler.
- **Hva kan de tape?** Innsatsen — hvorfor handle nå, ikke senere?

Dekk også disse dimensjonene (kun hvis ikke allerede besvart):

- **Temaspesifisitet**: Smalere. "GA4" -> "GA4 for norsk e-commerce, spesifikt migrering fra UA"
- **Tone/register**: Personlig, profesjonell, autoritativ, samtalebasert?
- **Kanaler planlagt**: Hvilke innholdstyper er planlagt?
- **CTA-retning**: Hvilken spesifikk handling skal målgruppen ta?
- **Begrensninger**: Lengde, frist, merkevareguider, eksisterende ressurser?
- **Research-behov**: Hva må vi undersøke? Flagg for research-fasen.

Denne fasen er samtalebasert — flere runder er OK til briefen er klar.

#### 1c. Skriv brief

Produser en strukturert brief med Message House-modellen. Én side — er den lengre, er tenkningen ikke ferdig.

```markdown
## Brief: [Tema]

### Kjernebudskap
[Én setning. Den ene tingen leseren skal ta med seg.]

### Målgruppe
[Hvem de er, hva de vet, hva de bryr seg om. Skrevet fra DERES perspektiv — hva vil de? Hva er problemet deres?]

### Støttepunkter
1. **[Pilar 1]** — [én-setnings påstand] -> Bevis: [evidens, data, eksempel]
2. **[Pilar 2]** — [én-setnings påstand] -> Bevis: [evidens, data, eksempel]
3. **[Pilar 3]** — [én-setnings påstand] -> Bevis: [evidens, data, eksempel]

### Vinkel
[Den spesifikke vinkelen/tesen. Ikke "GA4 er viktig" men "Norske nettbutikker som ikke migrerer til GA4 innen Q2 mister innsikten de trenger for å konkurrere med internasjonale aktorer."]

### Hva leseren vinner / taper
- **Vinner**: [Konkret suksess-tilstand hvis de handler]
- **Taper**: [Konkret risiko hvis de ikke gjor det]

### Tone og register
[Personlig/profesjonell/autoritativ — og hvorfor]

### CTA-retning
[Hvilken spesifikk handling skal målgruppen ta?]

### Kanaler
[Hvilke innholdstyper er planlagt — artikkel, nyhetsbrev, sosiale medier]

### Kilder og research
- [Tilgjengelige kilder/data]
- [Hva som må undersokes — input for research-fasen]

### Begrensninger
[Lengde, frist, merkevareguider, eksisterende ressurser]
```

**Vent på godkjenning av briefen for du fortsetter.**

#### 1d. Kampanjeplan

Etter at briefen er godkjent, legg til en **Kampanjeplan**-seksjon:

```markdown
### Kampanjeplan

Velg innholdstyper for denne kampanjen:

- [ ] Artikkel
- [ ] Nyhetsbrev
- [ ] LinkedIn
- [ ] Sosiale medier
- [ ] Annonser
- [ ] E-postsekvens
- [ ] Research (dypere datagrunnlag for produksjon)
```

Presenter kampanjeplanen. **Vent på godkjenning av kampanjeplan for du fortsetter.**

Opprett kampanjemappe: `clients/<client-slug>/campaigns/YYYY-MM-DD-<topic-slug>/`
Lagre briefen som `brief.md` i kampanjemappen.

### Fase 2 — Research (betinget)

**Kun hvis Research er valgt i kampanjeplanen.** Denne fasen blokkerer Fase 3 — innholdet trenger datagrunnlaget.

Dispatch the `researcher` agent with:
- Research questions from the brief (fra "Kilder og research"-seksjonen + identifiserte kunnskapshull)
- Client profile content (innhold fra `clients/<slug>/profile.md`)
- Existing research from `clients/<slug>/research/` (les alle filer, send som kontekst)
- Output path: `<campaign-dir>/research.md`

Agenten lagrer også nye funn til `clients/<slug>/research/<topic>.md` for fremtidig gjenbruk.

**Blokker** til research-agenten er ferdig. Les resultatet og gå videre til Fase 3.

### Fase 3 — Parallell innholdsproduksjon

Start **alle valgte innholdstyper samtidig** ved å dispatche `content-writer` agenten per type — ALLE I PARALLELL. Hver agent mottar:

1. **Den godkjente briefen** (komplett)
2. **Klientprofilen** (innhold fra `clients/<slug>/profile.md`)
3. **Research-briefen** (hvis den finnes fra Fase 2)
4. **Strukturell mal** (innhold fra `references/templates/<type>-default.md` — eller `clients/<slug>/templates/<type>.md` hvis den finnes)
5. **Anti-patterns** (innhold fra `references/anti-patterns.md`)
6. **Output-sti** i kampanjemappen

| Innholdstype | Mal | Output |
|-------------|-----|--------|
| Artikkel | `references/templates/article-default.md` | `article.md` |
| Nyhetsbrev | `references/templates/newsletter-default.md` | `newsletter.md` |
| LinkedIn | `references/templates/linkedin-default.md` | `linkedin.md` |
| Sosiale medier | `references/templates/social-default.md` | `social.md` |
| Annonser | `references/templates/ad-default.md` | `ads.json` |
| E-postsekvens | `references/templates/email-sequence-default.md` | `email-sequence.md` |

**Viktig for sub-agenter:**
- Hver agent skriver til sin output-fil i kampanjemappen
- Agentene skal IKKE sporre brukeren om godkjenning underveis — de produserer forsteutkast basert på briefen
- Artikkel-agenten inkluderer YAML frontmatter (title, description, slug, date, keywords)
- Nyhetsbrev-agenten inkluderer YAML frontmatter (subject, preheader, date)
- LinkedIn-agenten inkluderer hashtags
- Sosiale medier-agenten produserer platform-native versjoner for alle relevante plattformer
- Annonse-agenten skriver strukturert JSON (samme format som `/ad`)
- E-postsekvens-agenten inkluderer YAML frontmatter (sequence, type, emails, trigger, date) og sekvenstabell

### Fase 3b — Bilder

**Alle kampanjer MA ha minst 1 bilde. Hopp aldri over denne fasen.**

Dispatch the `image-curator` agent IN PARALLEL with the content writers in Fase 3. Agenten mottar:

- **Brief**: Den godkjente kampanjebrifen
- **Campaign directory**: `<campaign-dir>` — bilder lagres i `<campaign-dir>/images/`
- **Client profile**: For merkevarekontekst
- **Content types**: Hvilke innholdstyper som er valgt (artikkel, nyhetsbrev, annonser, osv.)

Agenten bruker Pexels MCP-serveren direkte (`mcp__stock-images__search_images` + `mcp__stock-images__download_image`) for å finne og laste ned relevante bilder.

Etter at image-curator er ferdig, oppdater innholdsfiler:
- `article.md`: Sett `heroImage` i frontmatter
- `newsletter.md`: Sett `headerImage` i frontmatter
- `ads.json`: Erstatt placeholder-URLer med lokale stier (`images/<filnavn>`)

**Ingen bruker-godkjenning** — bilder kan byttes i Fase 5.

### Fase 4 — Samling

Når alle sub-agenter er ferdige (innhold + bilder):

1. **Les alle output-filer** fra kampanjemappen — verifiser at alle valgte innholdstyper er produsert
2. **Generer `campaign-summary.md`** i kampanjemappen med oversikt over alt som ble produsert:

```markdown
# Kampanjeoversikt: [Tema]

**Klient:** [klientnavn]
**Dato:** YYYY-MM-DD
**Kampanjemappe:** clients/<slug>/campaigns/YYYY-MM-DD-<topic-slug>/

## Produsert innhold

| Type | Fil | Status |
|------|-----|--------|
| Artikkel | article.md | Ferdig |
| Nyhetsbrev | newsletter.md | Ferdig |
| ... | ... | ... |

## Bilder
- [liste over bilder i images/]

## Neste steg
- Gjennomga innholdet og gi tilbakemelding
- Kjor `/c-marketing:export` for HTML-forhandsvisning
```

3. **Fortell brukeren**:

```
Kampanjen er ferdig! Alle filer ligger i clients/<client-slug>/campaigns/YYYY-MM-DD-<topic-slug>/

Produsert:
- [liste over produserte innholdstyper]
- [antall] bilder

Kjor `/c-marketing:export` for HTML-forhandsvisning.
```

### Fase 5 — Iterasjon

Brukeren gjennomgar innholdet og gir tilbakemelding. Hovedagenten redigerer filene direkte:

- Juster enkeltinnhold basert på feedback
- Oppdater innholdsfiler direkte i kampanjemappen
- Brukeren kan be om endringer i tone, vinkel, lengde, eller spesifikke seksjoner
- Bilder kan byttes ved å dispatche `image-curator` på nytt med nye sokeord

## Regler

- Briefen er interaktiv — alltid vent på godkjenning
- **Etter brief-godkjenning kjorer alt autonomt.** Research, innholdsproduksjon, bildesok — ingen stopp-punkter. Sub-agenter produserer forsteutkast. Bilder hentes via Pexels MCP. Brukeren ser resultatet i Fase 5.
- Sub-agenter produserer forsteutkast uten å sporre brukeren
- Alle innholdstyper er valgfrie — kampanjen kan bestå av bare artikkel + LinkedIn, bare annonser, eller alle typer
- Research blokkerer innholdsproduksjon hvis den er valgt
- Annonse-output folger eksakt samme JSON-format som `/ad`-kommandoen
