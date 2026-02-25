---
description: Analyze client content to capture writing voice — produces a style guide for content commands
argument-hint: "<client-slug or domain> [URLs...]"
---

# /style-guide — $ARGUMENTS

Analyser eksisterende innhold fra klienten for å fange skrivestilen deres. Produserer `clients/<slug>/style-guide.md` som innholdskommandoer bruker for å matche klientens stemme.

## Language

**Bokmål** som standard. Engelsk kun dersom brukeren eksplisitt ber om det.

## Workflow

### Fase 1 — Identifiser klient og kilder

Sjekk om `$ARGUMENTS` inneholder en klient-slug eller et domene:

- Hvis klient-slug: sjekk at `clients/<slug>/` finnes. Les `clients/<slug>/profile.md` for kontekst.
- Hvis domene: avled slug, sjekk om klientmappen finnes.
- Hvis tomt: list opp tilgjengelige klienter fra `clients/`-mappen og spør.

Samle kilder:
1. **Nettside-innhold** — finn og les 3-5 bloggposter eller artikler fra klientens nettside (bruk WebFetch)
2. **LinkedIn-innlegg** — søk etter og les 5-10 nylige innlegg fra klientens side eller nøkkelpersoner (bruk WebSearch)
3. **Brukeroppgitte URL-er** — les alle URL-er oppgitt i `$ARGUMENTS`
4. **Innlimte tekster** — spør brukeren om de har tekster de vil lime inn direkte (brandguide, tone-of-voice-dokument, osv.)

Presenter listen over kilder som ble funnet. **Vent på godkjenning før du analyserer.**

### Fase 2 — Stilanalyse

Analyser alle innsamlede tekster på tvers av disse dimensjonene:

**Kvantitative mål:**
- Gjennomsnittlig setningslengde og variasjonsmønster (korte punch-setninger vs. lange forklarende)
- Avsnittsstruktur (typisk lengde, variasjon)
- Ordforråd — formelt/uformelt-spekter, bransjesjargong brukt vs. unngått

**Kvalitative mønstre:**
- Åpningsmønstre — hvordan starter de artikler, innlegg, e-poster?
- CTA-stil — direkte, myk, spørsmålsbasert?
- Tonemarkører — humornivå, autoritetsnivå, personlig vs. bedrift
- Norsk-spesifikt: bokmål-konsistens, anglisisme-toleranse, "du" vs. "dere" vs. "vi"

**Stemme-essens:**
- Hva gjør denne stemmen gjenkjennelig?
- Hva skiller den fra generisk bransjekommunikasjon?

### Fase 3 — Skriv stilguide

Produser `clients/<slug>/style-guide.md` med følgende struktur:

```
## Stemmesammendrag

[2-3 setninger som fanger essensen av klientens skrivestil. En skribent som leser bare dette avsnittet skal kunne skrive i riktig tone.]

## Skriv slik / Ikke slik

[3-5 konkrete eksempelpar hentet fra ekte innhold. Venstre kolonne: sitat fra klientens tekst som viser stilen. Høyre kolonne: generisk alternativ som viser hva som IKKE matcher.]

| Klientens stil | Generisk alternativ |
|---------------|-------------------|
| "[ekte sitat]" | "[generisk versjon]" |

## Referansetekster

[3-5 representative utdrag fra klientens beste innhold. Hvert utdrag er 2-4 setninger som setter kvalitetsstandarden.]

### Referanse 1: [kilde]
> [utdrag]

### Referanse 2: [kilde]
> [utdrag]

## Ordforråd

**Foretrekker:** [ord og uttrykk klienten bruker konsistent]
**Unngår:** [ord og uttrykk klienten aldri bruker]
**Bransjesjargong:** [fagtermer som er OK å bruke, med kontekst]

## Tone-parametre

- **Formelt ↔ Uformelt:** [plassering på skalaen med begrunnelse]
- **Personlig ↔ Bedrift:** [bruker "jeg", "vi", eller begge?]
- **Humor:** [nivå og type]
- **Autoritet:** [hevder ekspertise direkte, eller viser den gjennom innhold?]
- **Anglisismer:** [toleransenivå — bruker engelske termer fritt, eller foretrekker norske?]
```

Presenter utkastet. **Vent på godkjenning.**

### Fase 4 — Lagre

Skriv den godkjente stilguiden til `clients/<slug>/style-guide.md`.

Bekreft:
```
Stilguide lagret: clients/<slug>/style-guide.md

Denne filen brukes automatisk av innholdskommandoene (/article, /newsletter, /linkedin, /social, /ad, /email-sequence) for å matche klientens stemme.

Oppdater stilguiden når som helst med: /c-marketing:style-guide <slug>
```

## Regler

- Ikke gjett stemmen — baser alt på faktiske teksteksempler.
- Hvis det ikke finnes nok innhold å analysere (ny klient, lite publisert), si det og lag en minimal stilguide med det som er tilgjengelig. Marker gap med `<!-- FYLL INN: ... -->`.
- Stilguiden skal fungere som et referansedokument en skribent kan internalisere på 2 minutter.
- Ikke skriv over en eksisterende stilguide uten å spørre først.
