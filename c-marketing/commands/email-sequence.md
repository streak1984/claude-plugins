---
description: Design and draft multi-email drip campaigns — nurture, onboarding, re-engagement, launch
argument-hint: "<brief or sequence goal>"
---

# /email-sequence — $ARGUMENTS

Design og skriv e-postsekvenser for **$ARGUMENTS**. Strukturerte drip-kampanjer med timing, emnelinjer og innhold per e-post.

**Tip**: Kjor `/brief $ARGUMENTS` forst for en strukturert brief. Kjor `/research $ARGUMENTS` for datagrunnlag.

## Context

!references/anti-patterns.md
!references/copy-patterns.md
!references/templates/email-sequence-default.md
!references/templates/email-sequence-templates.md

## Language

**Bokmal** by default. English only if explicitly requested.

- Naturlig bokmal — ikke oversatt engelsk
- Norske termer der de finnes, med mindre det engelske er standard i fagfeltet
- E-posttekst skal vaere personlig og direkte — skriv som om en erfaren norsk markedsforer formulerte det

## Workflow

### 1. Brief

Etabler for du skriver noe:

- **Produkt/tjeneste**: Hva spesifikt om $ARGUMENTS?
- **Sekvenstype**: Welcome, nurture, re-engagement, onboarding, eller launch?
- **Malgruppe**: Hvem mottar disse e-postene? Demografi, atferd, smertepunkter.
- **Trigger**: Hva utloser sekvensen? (Signup, kjop, inaktivitet, dato, etc.)
- **Mal**: Hva skal sekvensen oppna? (Aktivering, konvertering, gjenvinning, etc.)
- **Tone**: Profesjonell, uformell, inspirerende, urgende?
- **CTA-retning**: Hva er hovedhandlingen sekvensen driver mot?
- **Merkevareinformasjon**: Firmanavn, avsendernavn, nettside
- **Eksisterende innhold**: Har dere artikler, guider, case studies som kan lenkes?

Presenter briefen. **Vent pa godkjenning for du gar videre.**

### 2. Sekvensplan

Presenter sekvensplanen som tabell:

| # | Delay | Jobb | Emne (utkast) | Notater |
|---|-------|------|----------------|---------|
| 1 | ... | ... | ... | ... |

**Sekvenstyper og lengde:**

| Type | Antall e-poster | Typisk bruk |
|------|----------------|-------------|
| Welcome | 7 | Nye abonnenter eller trial-signups |
| Nurture | 8 | Leads som har vist interesse men ikke konvertert |
| Re-engagement | 4 | Inaktive abonnenter (30-90 dager uten opens/clicks) |
| Onboarding | 7 | Nye kunder/brukere etter kjop eller signup |
| Launch | 5-7 | Produktlansering, kurslansering, eller event |

**Med strukturell mal:** Bruk malen for valgt sekvenstype. Tilpass timing og innhold til briefen.

Presenter planen. **Vent pa godkjenning for du skriver e-postene.**

### 3. Skriv e-poster

Skriv hver e-post med folgende struktur:

```yaml
---
sequence: <sekvensnavn>
type: <welcome|nurture|re-engagement|onboarding|launch>
emails: <totalt antall>
trigger: <hva som utloser sekvensen>
date: <YYYY-MM-DD>
---
```

**Per e-post:**

```
## E-post #N — {jobb}
**Delay:** {timing fra trigger/forrige e-post}
**Emnelinje:** {under 50 tegn}
**Preheader:** {under 90 tegn, utvider emnelinjen}

{Hook — 1-2 setninger, kobler til leserens situasjon}

{Kontekst — 1 kort avsnitt, hvorfor dette er relevant na}

{Verdi — kjottet, tilpasset e-postens jobb}

{CTA — en handling, fordelsdrevet}

PS: {valgfritt, sekundaer lenke eller mykere sporring}
```

**Regler for e-postskriving:**
- En CTA per e-post — ikke konkurrer med deg selv
- Emnelinjer under 50 tegn — spesifikke, ikke clickbait
- Preheader utvider emnelinjen — ikke gjenta den
- Forste setning er hooken — ikke kast bort den pa "Hei, [Navn]!"
- Bygg narrativ bue over sekvensen — hver e-post bygger pa forrige
- Varier lengde etter e-postens jobb (se lengderetningslinjer)
- Bruk copy-patterns fra referansefilen for hooks og CTA-er

### 4. Iterasjon

- Juster e-poster basert pa tilbakemelding
- Finjuster emnelinjer, timing, CTA, og innhold etter behov
- Presenter endringer som diff — vis hva som er endret og hvorfor

## E-post lengderetningslinjer

| E-posttype | Ordtelling | Nar du bruker det |
|-----------|-----------|-------------------|
| Transactional / trigger | 50-125 ord | Bekreftelser, paminnelser, statusoppdateringer |
| Educational / value | 150-300 ord | Tips, innsikt, rammeverk, quick wins |
| Story-driven / case study | 300-500 ord | Opprinnelseshistorier, case studies, dybdeartikler |
| Launch / sales | 200-400 ord | Tilbud, lanseringer, tidsbegrensede CTA-er |
| Re-engagement | 50-150 ord | Win-backs, check-ins, sunset-e-poster |

**Tommelfingerregel:** Hvis e-posten gjor en jobb godt, er den riktig lengde. Kutt til kutting ville fjernet mening.

## E-post-anti-patterns

Utover den delte anti-patterns-filen, unnga disse e-postspesifikke fellene:

- **Generiske emnelinjer**: "Viktig oppdatering" — vaer spesifikk om hva oppdateringen er
- **Flere CTA-er**: En handling per e-post. Ikke "Les artikkelen, folg oss pa LinkedIn, og book en demo!"
- **For lang oppvarming**: Kom til poenget. Forste setning er hooken.
- **Identiske emnelinjer**: Varier stilen — sporsmol, tall, pastand, nysgjerrighet
- **Spam-triggere**: Unnga "GRATIS", "Begrenset tilbud!!!", overdrevne utropstegn
- **Ignorere preheader**: Preheaderen er gratis eiendom i innboksen — bruk den
- **Ingen personalisering**: Bruk mottakerens kontekst der det er naturlig
- **For tette e-poster**: Gi leseren tid til a fordoye — respekter timing

## Kvalitetsstandard

Malet: e-poster mottakeren faktisk apner og leser — fordi emnelinjen er relevant, innholdet gir verdi, og CTA-en gir mening. Ikke spam — verdifull kommunikasjon med en tydelig handling.

### Forbilder for e-postsekvenser
- **Val Geisler** — Onboarding-sekvenser som aktiverer brukere uten a vaere pushy
- **Joanna Wiebe** (Copyhackers) — Konverteringsfokusert e-postkopi med personlighet
- **Eddie Shleyner** ("Very Good Copy") — Korte, skarpe e-poster som driver handling
