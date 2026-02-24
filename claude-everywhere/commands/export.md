---
description: Export a campaign as a self-contained HTML file for review and sharing
argument-hint: "<campaign-dir>"
---

# /export — $ARGUMENTS

Eksporterer en kampanje til en selvforsynt HTML-fil for gjennomgang og deling.

## Workflow

### 1. Finn kampanjemappen

- Hvis `$ARGUMENTS` er oppgitt: bruk den som kampanjesti
- Hvis ikke: finn den nyeste kampanjemappen i `clients/*/campaigns/` (sorter etter dato i mappenavnet)
- Bekreft at mappen finnes og inneholder kampanjefiler

### 2. Les kampanjefiler

Les alle tilgjengelige filer fra kampanjemappen:
- `brief.md`
- `article.md`
- `newsletter.md`
- `linkedin.md`
- `social.md`
- `ads.json`
- `email-sequence.md`
- `research.md`
- `images-metadata.json`
- `campaign-summary.md`

Hopp over filer som ikke finnes — kampanjer kan ha ulike innholdstyper.

### 3. Generer HTML

Skriv en selvforsynt HTML-fil med alt innhold. Filen skal fungere uten eksterne avhengigheter — all CSS er inline.

**HTML-struktur:**

```html
<!DOCTYPE html>
<html lang="nb">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Kampanjenavn] — Kampanjeeksport</title>
  <style>
    /* Inline CSS — se designspesifikasjon nedenfor */
  </style>
</head>
<body>
  <nav><!-- Navigasjon med lenker til hver seksjon --></nav>
  <main>
    <!-- Innholdsseksjoner -->
  </main>
</body>
</html>
```

**CSS-designspesifikasjon:**
- System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Maks bredde: `900px`, sentrert
- Bakgrunn: `#f8f9fa`, innhold: `#ffffff` med skygge
- Overskrifter: mørk farge (`#1a1a2e`)
- Navigasjon: fast sidebar eller topp-nav med ankerlenker
- Seksjoner separert med tynt skillelinje

**Innholdsseksjoner (inkluder bare de som finnes):**

1. **Kampanjeoversikt** — fra `campaign-summary.md` eller `brief.md` (kjernebudskap, målgruppe, kanaler)

2. **Artikkel** — fra `article.md`:
   - Ren typografi (serif for brødtekst)
   - YAML frontmatter vises som metadata-kort (tittel, beskrivelse, søkeord)
   - Markdown rendret som HTML

3. **Nyhetsbrev** — fra `newsletter.md`:
   - E-post-stil layout (sentrert, maks 600px bredde)
   - Subject line og preheader vises som metadata
   - Enkel, lesbar design

4. **LinkedIn** — fra `linkedin.md`:
   - LinkedIn-stil mockup: profilbilde-plassholder, navn, tekst
   - Grå bakgrunn, hvitt kort, LinkedIn-blå aksent (`#0A66C2`)
   - Hashtags under innlegget

5. **Sosiale medier** — fra `social.md`:
   - Faner eller seksjoner per plattform
   - Enkel tekst-visning med plattform-indikator

6. **Annonser** — fra `ads.json`:
   - For hver annonse, vis en mockup basert på format:
     - **Feed**: Kort med bilde-plassholder, primærtekst, overskrift, CTA-knapp
     - **Karusell**: Horisontal rad med kort
     - **Stories**: Høyt format med overlay-tekst
     - **Google Search**: Søkeresultat-format (overskrifter, beskrivelse, URL)
     - **Google Display**: Banner-format
   - Plattform-farge: Facebook `#1877F2`, LinkedIn `#0A66C2`, Google `#4285F4`

7. **E-postsekvens** — fra `email-sequence.md`:
   - Sekvenstabell (e-post, timing, mål)
   - Utvidbar visning av hver e-post

8. **Research** — fra `research.md`:
   - Strukturert visning av funn, kilder, konfidenssnivåer

**Bilder:**
- Hvis `images/`-mappen finnes, referer til bilder med relative stier
- Vis alt-tekst fra `images-metadata.json`

### 4. Skriv fil

- Opprett `exports/`-mappen hvis den ikke finnes
- Skriv HTML-filen til `exports/<klient>-<kampanje-slug>.html`

### 5. Bekreft

```
Eksport ferdig!

HTML: exports/<klient>-<kampanje-slug>.html

Åpne i nettleser for å se forhåndsvisning, eller del filen med teamet.
```

## Regler

- Filen skal være 100% selvforsynt — ingen eksterne CSS, JS, eller fonter
- Bruk semantisk HTML (article, section, nav, header)
- Responsive design — fungerer på mobil og desktop
- Hvis en innholdstype mangler, hopp over den seksjonen
- Ikke endre kildefilene — kun les og eksporter
