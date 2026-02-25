---
description: Export a campaign as a self-contained HTML file for review and sharing
argument-hint: "<campaign-dir>"
---

# /export — $ARGUMENTS

Eksporterer en kampanje til en selvforsynt HTML-fil med plattformtro forhåndsvisninger av alt innhold.

## Language

**Bokmål** by default. English only if explicitly requested.

## Workflow

### Fase 1 — Finn kampanje

- Hvis `$ARGUMENTS` er oppgitt: bruk den som kampanjesti (relativ til plugin-roten)
- Hvis ikke: finn den nyeste kampanjemappen i `clients/*/campaigns/` (sorter etter dato i mappenavnet)
- Bekreft at mappen finnes og inneholder minst én kampanjefil

Les `clients/<slug>/profile.md` hvis den finnes — brukes for klientnavn, avsendernavn og profilbilder.

### Fase 2 — Kjør eksportskriptet

Kjør:

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/export.js <campaign-dir>
```

Hvor `<campaign-dir>` er den fulle stien til kampanjemappen.

Skriptet:
1. Leser klientprofil, scaffold, komponentmaler og kampanjefiler
2. Konverterer markdown til HTML og fyller inn alle plassholdere
3. Fjerner tomme seksjoner og ubrukte navigasjonslenker
4. Skriver ferdig HTML til `exports/<klient>-<kampanje>.html`
5. Skriver JSON-sammendrag til stdout

### Fase 3 — Bekreft

Les JSON-utskriften fra skriptet og rapporter:

```
Eksport ferdig!

HTML: exports/<filnavn>.html

Innhold:
- [liste over innholdstyper fra JSON]
```

## Regler

- Filen skal være 100% selvforsynt — ingen eksterne CSS, JS, eller fonter
- Ikke endre kildefilene — kun les og eksporter
- Hvis skriptet feiler (exit-kode ≠ 0): les feilmeldingen og hjelp brukeren
