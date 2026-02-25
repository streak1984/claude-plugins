---
description: Create paid ad campaigns for Facebook, LinkedIn, and Google — structured JSON output
argument-hint: "<brief or product description>"
---

# /ad — $ARGUMENTS

Lag betalte annonsekampanjer for Facebook, LinkedIn og Google for **$ARGUMENTS**. Genererer strukturert JSON.

**Tip**: Kjor `/brief $ARGUMENTS` forst for en strukturert brief. Kjor `/research $ARGUMENTS` for datagrunnlag.

## Context

!references/anti-patterns.md
!references/templates/ad-default.md
!references/psychology.md

## Language

**Bokmal** by default. English only if explicitly requested.

- Naturlig bokmal — ikke oversatt engelsk
- Norske termer der de finnes, med mindre det engelske er standard i fagfeltet
- Annonsetekst skal vaere plattformnativ — skriv som om en erfaren norsk markedsforer formulerte det

## Klientens skrivestil

Sjekk om `clients/<slug>/style-guide.md` finnes. Hvis ja:
- Les stilguiden og internalisér stemmesammendraget
- Match klientens tone, ordforråd og stilmønstre gjennom hele teksten
- Bruk referansetekstene som kvalitetsstandard
- Følg "Skriv slik / Ikke slik"-eksemplene

Hvis stilguiden ikke finnes, fortsett uten — bruk klientprofilen for tone-veiledning.

## Workflow

### 1. Brief

Etabler for du skriver noe:

- **Produkt/tjeneste**: Hva spesifikt om $ARGUMENTS?
- **Mal**: Trafikk, leads, konvertering, merkevarebevissthet, eller app-installasjoner?
- **Malgruppe**: Hvem er dette for? Demografi, interesser, smertepunkter.
- **Plattformer**: Facebook, LinkedIn, Google, eller flere?
- **Formater**: Feed, karusell, stories, sok (Google Search), display (Google Display), eller alle?
- **Budskap**: Hva er kjernebudskapet? Hva skiller dette fra konkurrentene?
- **CTA**: Hva skal mottakeren gjore? (Prov gratis, Les mer, Last ned, Kontakt oss, etc.)
- **Tone**: Profesjonell, uformell, inspirerende, urgende?
- **Merkevareinformasjon**: Firmanavn, logo-URL, nettside, folgertalll
- **Bilde-/mediedirektiv**: Beskriv onsket visuelt uttrykk eller oppgi URL-er til bilder

Presenter briefen. **Vent pa godkjenning for du gar videre.**

### 2. Konsepter

Presenter 2-3 annonsevinker:

**Med strukturell mal:** Bruk malen for standard annonsesett (antall og formater per plattform). Tilpass konseptene til briefen.

For hver vinkel:
- **Vinkel**: Kort beskrivelse av tilnaermingen
- **Primaertekst**: Utkast til annonseteksten (plattformtilpasset)
- **Overskrift**: 2-3 varianter
- **CTA**: Valgt handlingsoppfordring
- **Begrunnelse**: Hvorfor denne vinkelen fungerer for malgruppen

Presenter konseptene. **Vent pa godkjenning for du genererer JSON.**

### 3. Generer JSON

**Med klientprofil:** Fyll `defaults` fra profilens `defaults`-seksjon. Bruk profilens tone for plattformtilpasset kopi.

Skriv validert JSON til kampanjemappen.

**JSON-strukturen:**

```json
{
  "meta": {
    "campaign": "Kampanjenavn",
    "client": "Klientnavn",
    "date": "YYYY-MM-DD",
    "language": "nb"
  },
  "defaults": {
    "page_name": "Firmanavn",
    "profile_image": "https://...",
    "follower_count": "4 823 følgere"
  },
  "ads": [...]
}
```

**Annonseobjekter — bruk riktig format:**

**Feed-annonse:**
```json
{
  "platform": "facebook",
  "format": "feed",
  "primary_text": "Annonseteksten...",
  "headline": "Overskrift",
  "description": "Beskrivelse",
  "cta_text": "Les mer",
  "image_url": "images/fb-ad-filnavn.jpg",
  "display_url": "domene.no",
  "link_url": "https://domene.no/landingsside"
}
```

**Karusell-annonse:**
```json
{
  "platform": "facebook",
  "format": "carousel",
  "primary_text": "Annonseteksten...",
  "cards": [
    {
      "image_url": "images/carousel-kort.jpg",
      "headline": "Kort overskrift",
      "description": "Beskrivelse",
      "cta_text": "Les mer"
    }
  ],
  "display_url": "domene.no",
  "link_url": "https://domene.no/landingsside"
}
```

**Story-annonse:**
```json
{
  "platform": "facebook",
  "format": "stories",
  "image_url": "images/stories-filnavn.jpg",
  "overlay_headline": "Kort, slagkraftig tekst",
  "overlay_position": "center",
  "cta_text": "Les mer",
  "link_url": "https://domene.no/landingsside"
}
```

**Google Search-annonse:**
```json
{
  "platform": "google",
  "format": "search",
  "headlines": ["Overskrift maks 30 tegn", "Fordel + sokeord", "Tydelig CTA"],
  "descriptions": [
    "Beskrivelse opptil 90 tegn. Spesifikk verdi og handling.",
    "Alternativ beskrivelse med annen vinkel. Sterk CTA."
  ],
  "display_url": "domene.no",
  "paths": ["tjenester", "prov-gratis"],
  "sitelinks": [
    { "headline": "Priser", "description": "Se våre priser og pakker" },
    { "headline": "Om oss", "description": "Bli kjent med teamet" }
  ],
  "link_url": "https://domene.no/landingsside"
}
```

**Google Display-annonse:**
```json
{
  "platform": "google",
  "format": "display",
  "size": "300x250",
  "headline": "Kort overskrift (maks 30 tegn)",
  "description": "Beskrivelse maks 90 tegn",
  "cta_text": "Prov gratis",
  "cta_color": "#4285F4",
  "background_color": "#333333",
  "image_url": "images/display-filnavn.jpg",
  "logo_url": "https://placehold.co/100x100",
  "link_url": "https://domene.no/landingsside"
}
```

**Regler for JSON-generering:**
- Plattformnativ kopi — ikke samme tekst pa Facebook og LinkedIn
- Facebook: kortere, mer uformell, emosjonell appell
- LinkedIn: profesjonell, datadrevet, B2B-fokusert
- Karusell: bygg narrativ bue over kortene — forste kort = hook, siste = CTA
- Stories: minimal tekst i overlay — maks 8-10 ord
- Google Search: fokuser pa sokeintensjon — overskrifter matcher sokeord, beskrivelser gir spesifikk verdi
- Google Search: varier overskrifter — bland fordeler, sokeord og CTA-er
- Google Display: kort og visuelt — overskrift fanger oppmerksomhet, CTA er tydelig
- Sitelinks: 2-4 relevante undersider, korte etiketter (1-3 ord)
- Bruk `https://placehold.co/` for plassholderbilder med riktig aspektforhold:
  - Feed: `1200x628` (Facebook) eller `1200x628` (LinkedIn)
  - Karusell Facebook: `600x600` (1:1)
  - Karusell LinkedIn: `800x1000` (4:5)
  - Stories: `1080x1920` (9:16)
  - Google Display: `300x250`, `728x90`, `160x600`, eller `300x600`
- Alle felt bruker snake_case — ikke camelCase
- `link_url` er obligatorisk pa alle annonser
- `image_url` er flat — ikke nestet under `media`
- Sitelinks er objekter med `headline` og `description` — ikke bare strenger

### 4. Forhandsvisning og iterasjon

Skriv `ads.json` til kampanjemappen. Kjor `/c-marketing:export` for visuell forhåndsvisning.

- Juster JSON basert pa tilbakemelding
- Finjuster tekst, overskrifter, CTA, og engasjementstall etter behov

## Annonse-anti-patterns

Utover den delte anti-patterns-filen, unnga disse annonsespesifikke fellene:

- **Generiske passtander**: "Markedets beste losning" — vær spesifikk
- **For mye tekst**: Facebook straffer teksttunge bilder. Hold overlay-tekst under 20% av bildearealet.
- **Identisk tekst pa tvers av plattformer**: Brukere ser begge — det virker lat
- **CTA-overload**: En handling per annonse. Ikke "Les mer, prov gratis, og folg oss!"
- **Kjedelige tall**: "Over 100 kunder" — vær presis: "143 norske bedrifter bruker..."
- **Stockfoto-sprak**: Unnga bilder som skriker "stockfoto" — autentisitet konverterer bedre
- **Clickbait uten substans**: Hooken ma levere det den lover

## Kvalitetsstandard

Malet: annonser en norsk fagperson ville stoppet opp ved i feeden — fordi budskapet er relevant, teksten er skarp, og CTA-en gir mening. Ikke "reklame" — verdifullt innhold med en tydelig handling.

### Forbilder for betalte annonser
- **Jasmin Alic** — LinkedIn-annonser som foler organiske i feeden
- **Harry Dry** (Marketing Examples) — Kopitekst som konverterer med faerre ord
- **Eddie Shleyner** ("Very Good Copy") — Mikrotekst som driver handling
