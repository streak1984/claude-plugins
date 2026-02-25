---
description: Analyze and improve pages for conversions — audit, hypotheses, and prioritized recommendations
argument-hint: "<URL or page description>"
---

# /cro — $ARGUMENTS

Analyze **$ARGUMENTS** for conversion optimization. Identify what's working, what's not, and deliver actionable improvements.

**Complements the ad/campaign workflow**: You create traffic with `/ad` and `/campaign` — this skill optimizes where that traffic lands.

## Context

!references/anti-patterns.md
!references/experiments.md
!references/psychology.md

## Language

**Bokmål** by default for copy alternatives. English if the page is English.

Match the language of the page being analyzed.

## Workflow

### 1. Brief

Before analyzing anything, establish:

- **Page content**: URL, screenshot, copy, or description of the page
- **Page type**: Landing page, homepage, pricing, feature, blog, demo request, checkout, other?
- **Current conversion rate**: If known (helps prioritize recommendations)
- **Primary conversion goal**: What counts as a conversion? (signup, purchase, demo request, download, contact)
- **Traffic source**: Where do visitors come from? (paid ads, organic, email, social, direct)
- **Audience**: Who lands on this page? What do they already know/want?
- **Known issues**: Anything already identified as a problem?

Present the brief. **Wait for approval before analyzing.**

### 2. Analyze

Evaluate the page in priority order. Not all apply to every page — skip what's irrelevant.

**Priority 1 — Value Proposition Clarity**
- Can a visitor understand what you offer in 5 seconds?
- Is the benefit specific or generic? ("Spar 40% på regnskapet" vs. "Effektiv løsning")
- Does the value prop match the traffic source promise?

**Priority 2 — Headline**
- Does it state the primary benefit, not a feature?
- Is it specific enough to differentiate?
- Does it match visitor intent from the traffic source?

**Priority 3 — Call to Action**
- Is there one primary CTA? (Multiple CTAs split attention)
- Does the CTA copy name a benefit? ("Start gratis prøveperiode" vs. "Registrer deg")
- Is it visually prominent and above the fold?
- Is there a low-commitment alternative for hesitant visitors?

**Priority 4 — Visual Hierarchy**
- Does the eye flow naturally: headline → supporting copy → CTA?
- Is there too much competing for attention?
- Are key elements above the fold?

**Priority 5 — Trust Signals**
- Social proof: testimonials, logos, numbers, case studies?
- Are trust signals specific? ("143 norske bedrifter" vs. "Tusenvis av kunder")
- Security signals near conversion points? (payment, forms)

**Priority 6 — Objection Handling**
- Are common objections addressed before the CTA?
- FAQ or comparison section for complex products?
- Risk reversal: guarantee, free trial, easy cancellation?

**Priority 7 — Friction Points**
- Form length — is every field necessary?
- Page load speed
- Mobile experience
- Distracting elements (navigation, sidebars, competing links)

### 3. Deliver Recommendations

Organize findings into:

**Quick Wins** (implement today, high confidence)
- Copy changes, CTA rewording, removing friction
- Usually high impact, low effort

**High-Impact Changes** (requires more work, significant upside)
- Structural changes, new sections, redesign of key elements
- Include reasoning and expected impact

**A/B Test Ideas** (uncertain, worth testing)
- Use reference experiments file for inspiration
- Specific hypothesis for each: "Changing X from Y to Z will increase [metric] because [reason]"

**Copy Alternatives**
- Rewrite key elements: headline, subheadline, CTA, value prop
- 2-3 options each with different angles
- Match the page's language and tone

### 4. Page-Type Checklists

Apply the relevant checklist after the main analysis.

**Landing Page:**
- [ ] Single focus — one offer, one CTA
- [ ] Message match with traffic source (ad copy → landing page headline)
- [ ] No main navigation (reduce exit paths)
- [ ] Social proof near CTA
- [ ] Mobile-optimized form
- [ ] Clear benefit in headline (not feature, not company name)

**Homepage:**
- [ ] Clear value prop above the fold
- [ ] Primary CTA visible without scrolling
- [ ] Key audience segments can self-identify
- [ ] Social proof (logos, numbers, testimonials)
- [ ] Clear path to next step for each visitor type

**Pricing Page:**
- [ ] Recommended plan is visually highlighted
- [ ] Feature comparison is scannable
- [ ] Prices are clear (no hidden costs)
- [ ] FAQ addresses pricing objections
- [ ] CTA on every plan
- [ ] Annual vs. monthly toggle if applicable

**Feature Page:**
- [ ] Benefit headline (not feature name)
- [ ] Specific use case or example
- [ ] Screenshot or visual of the feature in action
- [ ] CTA relevant to this feature
- [ ] Link to related features

**Blog / Content Page:**
- [ ] CTA relevant to the content topic
- [ ] Email capture or lead magnet
- [ ] Internal links to product/service pages
- [ ] Author credibility signals
- [ ] Content upgrade offer where relevant

**Demo Request / Contact:**
- [ ] Minimal form fields (name, email, company — essentials only)
- [ ] What happens after submission is clear
- [ ] Alternative contact method available
- [ ] Social proof / trust signals near form
- [ ] Expected response time stated

## Output

Deliver as a structured markdown document:

```markdown
## Page Analysis: [Page name/URL]
**Page type:** ...
**Conversion goal:** ...
**Date:** YYYY-MM-DD

### Summary
[2-3 sentence overview of main findings]

### Quick Wins
1. ...
2. ...

### High-Impact Changes
1. ...
2. ...

### A/B Test Ideas
1. **Hypothesis:** ...
   **Test:** ...
   **Expected impact:** ...

### Copy Alternatives
**Headline options:**
1. ...
2. ...

**CTA options:**
1. ...
2. ...

### Checklist Results
[Relevant page-type checklist with pass/fail]
```

## Quality Standard

The goal: specific, actionable recommendations a marketing team can implement this week — not generic CRO theory. Every recommendation should explain *why* it matters for this specific page and audience. Prioritize impact over completeness.
