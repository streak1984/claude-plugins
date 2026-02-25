---
name: campaign-orchestration
description: Use when managing multi-content campaign workflows with parallel production. Coordinates sub-agents, manages brief-to-content pipeline, and tracks campaign directory structure. Triggers on "campaign", "content campaign", "run a campaign", "brief to content", or multi-channel content production.
---

# Campaign Orchestration

Produser en komplett innholdskampanje fra brief til ferdig innhold — artikkel, nyhetsbrev, LinkedIn, sosiale medier, og annonser — alt i parallell. Brukerens kampanjetema/idé er oppgitt i meldingen deres eller via `/c-marketing:campaign`-kommandoen.

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
Les også `clients/<slug>/style-guide.md` hvis den finnes — hold den tilgjengelig for alle nedstrøms-agenter.

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

!references/campaign-brief-template.md

**Vent på godkjenning av briefen før du fortsetter.**

#### 1d. Kampanjeplan

Etter at briefen er godkjent, legg til en **Kampanjeplan**-seksjon. Bruk kampanjeplan-sjekklisten fra brief-malen over.

Presenter kampanjeplanen. **Vent på godkjenning av kampanjeplan før du fortsetter.**

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

Dispatch content-writer og image-curator agenter i parallell for alle valgte innholdstyper:

!references/campaign-dispatch-table.md

**Alle kampanjer MÅ ha minst 1 bilde.** Image-curator dispatches i parallell med content writers (se dispatch-tabellen over).

### Fase 4 — Samling

Når alle sub-agenter er ferdige (innhold + bilder):

1. **Les alle output-filer** fra kampanjemappen — verifiser at alle valgte innholdstyper er produsert
2. **Generer `campaign-summary.md`** i kampanjemappen med oversikt over alt som ble produsert:

!references/campaign-summary-template.md

3. **Fortell brukeren**:

```
Kampanjen er ferdig! Alle filer ligger i clients/<client-slug>/campaigns/YYYY-MM-DD-<topic-slug>/

Produsert:
- [liste over produserte innholdstyper]
- [antall] bilder

Kjør `/c-marketing:export` for HTML-forhåndsvisning.
```

### Fase 5 — Iterasjon

Brukeren gjennomgår innholdet og gir tilbakemelding. Hovedagenten redigerer filene direkte:

- Juster enkeltinnhold basert på feedback
- Oppdater innholdsfiler direkte i kampanjemappen
- Brukeren kan be om endringer i tone, vinkel, lengde, eller spesifikke seksjoner
- Bilder kan byttes ved å dispatche `image-curator` på nytt med nye søkeord

## Regler

- Briefen er interaktiv — alltid vent på godkjenning
- **Etter brief-godkjenning kjører alt autonomt.** Research, innholdsproduksjon, bildesøk — ingen stopp-punkter. Sub-agenter produserer førsteutkast. Bilder hentes via Pexels MCP. Brukeren ser resultatet i Fase 5.
- Sub-agenter produserer førsteutkast uten å spørre brukeren
- Alle innholdstyper er valgfrie — kampanjen kan bestå av bare artikkel + LinkedIn, bare annonser, eller alle typer
- Research blokkerer innholdsproduksjon hvis den er valgt
- Annonse-output følger eksakt samme JSON-format som `/ad`-kommandoen
