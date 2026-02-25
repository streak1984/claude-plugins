# Campaign Dispatch Table

## Fase 3 — Parallell innholdsproduksjon

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
- Agentene skal IKKE spørre brukeren om godkjenning underveis — de produserer førsteutkast basert på briefen
- Artikkel-agenten inkluderer YAML frontmatter (title, description, slug, date, keywords)
- Nyhetsbrev-agenten inkluderer YAML frontmatter (subject, preheader, date)
- LinkedIn-agenten inkluderer hashtags
- Sosiale medier-agenten produserer platform-native versjoner for alle relevante plattformer
- Annonse-agenten skriver strukturert JSON (samme format som `/ad`)
- E-postsekvens-agenten inkluderer YAML frontmatter (sequence, type, emails, trigger, date) og sekvenstabell

## Fase 3b — Bilder

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
