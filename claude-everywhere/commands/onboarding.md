---
description: Set up your marketing workspace — create client directories, configure API keys, get started
argument-hint: "[client name or domain]"
---

# /onboarding — $ARGUMENTS

Sett opp et nytt arbeidsområde for en klient. Opprett mapper, konfigurer API-nøkler, og kom i gang med claude-everywhere.

## Språk

**Bokmål** som standard. Engelsk kun dersom brukeren eksplisitt ber om det.

## Workflow

### Steg 1 — Velkommen

Start med en kort velkomstmelding:

```
Velkommen til claude-everywhere!

Dette er et markedsføringsplugin for Claude Code som hjelper deg med å:
- Planlegge og gjennomføre kampanjer fra brief til ferdig innhold
- Skrive artikler, LinkedIn-innlegg, nyhetsbrev og annet innhold
- Finne og kuratere bilder fra Pexels
- Bygge klientprofiler automatisk fra nettkilder
- Kvalitetssikre alt innhold mot norske språkregler og beste praksis

Tilgjengelige kommandoer:
- /claude-everywhere:onboarding — dette oppsettet
- /claude-everywhere:campaign <tema> — full kampanjeproduksjon
- /claude-everywhere:brief <tema> — lag et kampanjebrief
- /claude-everywhere:article <tema> — skriv en artikkel
- /claude-everywhere:linkedin <tema> — skriv et LinkedIn-innlegg
- /claude-everywhere:profile <domene> — generer klientprofil fra nettkilder

La oss komme i gang med oppsettet!
```

### Steg 2 — Identifiser klient

Sjekk om `$ARGUMENTS` er oppgitt:

- **Hvis `$ARGUMENTS` er oppgitt:** Bruk det som klientnavn eller domene. Gå videre til Steg 3.
- **Hvis `$ARGUMENTS` er tomt:** Spør brukeren:

```
Hva heter klienten din, eller hva er domenet deres?
```

**Vent på svar fra brukeren.**

### Steg 3 — Avled slug

Lag en slug fra klientnavnet eller domenet:

- Fjern TLD fra domener: `acme.no` → `acme`, `example.com` → `example`
- Konverter mellomrom og spesialtegn til bindestreker: `Acme Corp` → `acme-corp`
- Konverter til lowercase: `MinKlient` → `minklient`
- Fjern ledende/etterfølgende bindestreker

Eksempler:
- `Acme Corp` → `acme-corp`
- `acme.no` → `acme`
- `Norsk Digital Byrå AS` → `norsk-digital-byra-as`
- `example.com` → `example`

### Steg 4 — Opprett mappestruktur

Bruk `mkdir -p` for å opprette følgende mapper:

```bash
mkdir -p clients/<slug>/campaigns/
mkdir -p clients/<slug>/research/
mkdir -p clients/<slug>/templates/
```

Sjekk at mappene ble opprettet. Hvis `clients/<slug>/` allerede finnes, informer brukeren:

```
Mappen clients/<slug>/ finnes allerede. Eksisterende filer blir ikke overskrevet.
```

### Steg 5 — Tilby klientprofil

Vis følgende melding:

```
Vil du at jeg genererer en klientprofil automatisk fra nettkilder?

Kjør: /claude-everywhere:profile <domene>

En profil inneholder tone of voice, målgruppe, CTA-mønstre og konkurranseanalyse — alt som trengs for å produsere innhold som matcher klientens merkevare.
```

### Steg 6 — API-nøkler

Vis veiledning for API-oppsett:

```
For stockbilder i kampanjer, trenger du en Pexels API-nøkkel.

Sett PEXELS_API_KEY som miljøvariabel:
  export PEXELS_API_KEY="din-nøkkel-her"

Hent gratis nøkkel på: https://www.pexels.com/api/

Uten denne nøkkelen vil bildesøk i kampanjer bli hoppet over.
```

### Steg 7 — Oppsummering

Vis en oppsummering av hva som ble opprettet og neste steg:

```
Arbeidsområde for <klientnavn> (<slug>) er klart!

Opprettet:
  clients/<slug>/campaigns/
  clients/<slug>/research/
  clients/<slug>/templates/

Neste steg — nyttige kommandoer:
  /claude-everywhere:campaign <tema>  — full kampanjeproduksjon med brief, innhold og bilder
  /claude-everywhere:brief <tema>     — lag et kampanjebrief
  /claude-everywhere:article <tema>   — skriv en artikkel
  /claude-everywhere:linkedin <tema>  — skriv et LinkedIn-innlegg

Tips: Start med å lage en klientprofil for best mulig innholdskvalitet:
  /claude-everywhere:profile <domene>
```

## Regler

- **Ikke skriv filer** utover å opprette mapper. Profilen lages av `/profile`-kommandoen.
- **Ikke overskrive eksisterende filer.** Hvis mapper finnes, informer brukeren og fortsett.
- **Vis alltid slug** som brukes, slik at brukeren kan verifisere.
- **Vent på svar** i Steg 2 hvis `$ARGUMENTS` er tomt — ikke gjett klientnavn.
