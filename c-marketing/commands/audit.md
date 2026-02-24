---
description: Audit GA4, GTM, Google Ads, HubSpot, SEO, or code — structured findings and recommendations
argument-hint: "<scope: ga4|gtm|ads|hubspot|seo|code>"
---

# /audit

Systematic audit of marketing platforms, tracking setups, or code.

## References

!references/event-library.md

## Supported Audit Types

### GA4 Audit
- Property configuration (data retention, filters, cross-domain)
- Event tracking completeness (recommended + custom events)
- Conversion setup and attribution settings
- Data stream configuration
- Audiences and segments
- Integration with Google Ads, BigQuery, Search Console
- Debug view / real-time validation

### GTM Audit
- Container organization (naming, folders)
- Tag firing rules and trigger logic
- Variable configuration
- Consent mode implementation
- Data layer structure and completeness
- Version control and workspace hygiene
- Server-side vs client-side setup

### Google Ads Audit
- Campaign structure and naming conventions
- Keyword strategy (match types, negatives)
- Ad copy quality and extensions
- Conversion tracking and attribution
- Bidding strategy alignment
- Budget allocation and pacing
- Quality Score analysis

### HubSpot Audit
- Contact properties and data hygiene
- Lifecycle stages and lead scoring
- Workflow automation logic
- Email deliverability and engagement
- Forms and landing pages
- CRM pipeline configuration
- Integration health

### SEO Audit
- **Technical SEO**: Crawlability (robots.txt, sitemap), indexation status, page speed (Core Web Vitals), mobile-friendliness, HTTPS, URL structure, canonical tags, hreflang
- **On-page SEO**: Title tags, meta descriptions, heading hierarchy (H1-H3), content quality and length, image alt text and optimization, internal linking structure
- **E-E-A-T signals**: Author pages with credentials, sources and citations, content freshness and update dates, about page, contact information
- **AI search readiness**: Schema markup (FAQ, HowTo, Article), self-contained answer blocks, structured data, FAQ sections, definition blocks that AI can extract and cite

### Code Audit
- Code quality and consistency
- Security vulnerabilities (OWASP top 10)
- Performance bottlenecks
- Test coverage
- Documentation gaps
- Dependency health

## Workflow

### 1. Scope
- Confirm what to audit and access method
- If files/exports provided, read them
- If URLs provided, note what can be assessed externally

### 2. Checklist
Present the relevant checklist and walk through each item systematically.

### 3. Findings
For each item, rate as:
- **OK** — meets best practices
- **Warning** — works but could be improved
- **Issue** — needs attention
- **Critical** — fix immediately

### 4. Report
Generate a markdown report with:
- Executive summary (1-2 paragraphs)
- Findings table (item, status, details)
- Prioritized action items
- Quick wins vs strategic improvements

## Output
Markdown report saved to file. Filename format: `audit-<type>-<YYYY-MM-DD>.md`
