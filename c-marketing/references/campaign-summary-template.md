# Kampanjeoversikt — Markdown-mal

Mal for `campaign-summary.md` som genereres i kampanjemappen etter at alle innholdstyper og bilder er produsert.

---

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
- Gjennomgå innholdet og gi tilbakemelding
- Kjør `/c-marketing:export` for HTML-forhåndsvisning
```
