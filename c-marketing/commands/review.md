---
description: Pre-publication content review — check against anti-patterns, brand voice, factual claims
argument-hint: "[content file or campaign-dir]"
---

# /review — $ARGUMENTS

Gjennomgå innhold før publisering. Gir en ærlig vurdering av kvalitet, merkevare-konsistens og faktagrunnlag.

Hvis `$ARGUMENTS` er en fil, gjennomgå den filen. Hvis det er en kampanjemappe, gjennomgå alle innholdsfiler i mappen.

## Context

!references/anti-patterns.md

## Workflow

### 1. Finn innholdet

- Hvis `$ARGUMENTS` peker til en fil: les den
- Hvis `$ARGUMENTS` peker til en kampanjemappe: les alle .md-filer og ads.json
- Hvis ingen argument: spør brukeren hvilken fil eller mappe som skal gjennomgås

### 2. Les klientprofil

Finn relevant klientprofil fra `clients/<slug>/profile.md`. Bruk den for tone, målgruppe og merkevare-kontekst.

### 3. Gjennomgang

Gå gjennom hver kategori. Rapporter bare **faktiske funn** — hopp over kategorier uten merknader.

**Anti-patterns:**
- Sjekk mot hele listen av forbudte fraser og AI-klisjeer
- Sjekk for engelske kalker (oversatte engelske uttrykk)
- Sjekk for strukturelle anti-patterns (dårlige åpninger, femavsnitt-maler, speil-konklusjoner)

**Merkevare-konsistens:**
- Er tonen konsistent med klientprofilen?
- Er målgruppen adressert riktig?
- Er CTA-mønstrene i tråd med profilens anbefalinger?

**Språkkvalitet:**
- Naturlig norsk bokmål (ikke oversatt engelsk)?
- Variasjon i setningslengde?
- Aktiv stemme fremfor passiv?
- Konkret fremfor abstrakt?

**Fakta og kilder:**
- Er påstander støttet av data eller kilder?
- Er tall og statistikk korrekte og oppdaterte?
- Mangler det bevis for sentrale påstander?

**Innholdsspesifikt:**
- Artikkel: SEO-elementer (tittel, meta, overskrifter, søkeord)?
- Nyhetsbrev: Subject line, preheader, CTA?
- LinkedIn: Hook, lengde, hashtags?
- Annonser: Platform-native kopi, JSON-format?

### 4. Konklusjon

Avslutt med en av tre:

- **Rent.** — Alt ser bra ut. Ingen problemer funnet.
- **Småting.** — Mindre ting å vurdere (list dem), men OK å publisere.
- **Fiks først.** — Problemer som bør løses før publisering (list dem).

## Regler

- Vær ærlig. Ikke si "ser bra ut" hvis det er problemer.
- Vær kort. En linje per funn, ikke avsnitt.
- Ikke foreslå omskrivinger, stilendringer eller forbedringer utover sjekklisten. Dette er en kvalitetssjekk, ikke en omskrivning.
- Ikke endre noen filer. Kun gjennomgang.
