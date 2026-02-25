# Export Command Redesign — Pixel-Perfect Platform Mockups

**Date:** 2026-02-25
**Status:** Approved

## Problem

The current `/export` command contains vague CSS guidelines and lets Claude generate HTML from scratch each time. Output varies between runs, looks generic, and doesn't resemble the actual platforms (LinkedIn, Facebook, Google, Gmail). The plugin will be distributed to others via Cowork, so export quality must be consistent and professional.

## Solution

Three-layer architecture: lean command, HTML scaffold, per-platform component templates.

### Layer 1 — `commands/export.md` (orchestrator)

- Workflow-only: discover campaign files, categorize, assemble HTML
- No HTML/CSS — only logic and references
- Under 100 lines of markdown
- Tells Claude which component to look up per content type
- References the scaffold via `!references/export/scaffold.html`

### Layer 2 — `references/export/scaffold.html` (shell)

- Complete runnable HTML file (`<!DOCTYPE html>` through `</html>`)
- Outer layout: sticky nav, three category sections, responsive grid
- CSS custom properties for theming
- Marked insertion points: `<!-- SECTION: organic -->`, `<!-- SECTION: paid -->`, `<!-- SECTION: email -->`
- Print styles, responsive breakpoints
- Empty categories hidden by Claude (omit sections with no content)

### Layer 3 — `references/export/components/` (platform mockups)

One HTML snippet per platform. Each is a self-contained `<div>` with scoped CSS. Uses `{{PLACEHOLDER}}` tokens for content. Claude reads only the components needed.

## File Structure

```
references/export/
├── scaffold.html
└── components/
    ├── article-preview.html
    ├── linkedin-post.html
    ├── social-cards.html
    ├── facebook-feed-ad.html
    ├── facebook-carousel-ad.html
    ├── facebook-stories-ad.html
    ├── linkedin-sponsored-ad.html
    ├── google-search-ad.html
    ├── google-display-ad.html
    ├── newsletter-preview.html
    └── email-sequence.html
```

## Content Categories

### Organisk innhold (Organic)
- Article — blog/article preview with serif typography
- LinkedIn post — organic feed mockup (profile, text, reactions, action bar)
- Social media — platform-native cards (Instagram, Facebook, X)

### Betalt annonsering (Paid Ads)
- Facebook/Meta feed ads
- Facebook/Meta carousel ads
- Facebook/Meta stories ads
- LinkedIn sponsored posts
- Google Search ads (SERP with sitelinks)
- Google Display ads (banner)

### E-post (Email)
- Newsletter — Gmail-style inbox row + centered 600px email body
- Email sequence — timeline view + expandable individual emails

## Platform Visual Specifications

### LinkedIn Post (organic)
- Background: `#f3f2ef`
- Card: white, `border-radius: 8px`, `box-shadow: 0 0 0 1px rgba(0,0,0,0.08)`
- Profile: 48px circle, name (bold), headline (gray), "Follow" button
- Post text with `...see more` truncation styling
- Reaction bar: Like/Celebrate/Support emoji icons + count
- Action bar: Like, Comment, Repost, Send — gray icons
- Accent: `#0A66C2`

### Facebook Feed Ad
- Card: white, subtle shadow
- Page name + "Sponsored" + globe icon + three-dot menu
- Primary text area
- Media: 1200x628 aspect ratio
- Below media: headline (bold) + description + CTA button (right-aligned)
- Reaction count bar with emoji faces
- Action row: Like, Comment, Share
- Accent: `#1877F2`

### Facebook Carousel Ad
- Same chrome as feed ad
- Horizontal scrollable card row (arrow navigation indicators)
- Per card: image (1:1 or 4:5), headline, description, CTA
- First card visible, subsequent cards peeking

### Facebook Stories Ad
- 9:16 aspect ratio container
- Full-bleed image background
- Text overlay with semi-transparent backdrop
- "Sponsored" label top-left
- Swipe-up CTA at bottom
- Profile circle + page name at top

### LinkedIn Sponsored Ad
- Same as organic LinkedIn post but with "Promoted" label instead of connection info
- CTA button below media
- Company page format (logo, company name, follower count)

### Google Search Ad
- White background
- "Sponsored" label: small black text pill
- Favicon (16px circle placeholder) + display URL in green
- Headline: blue link text (`#1a0dab`), up to 3 parts joined by ` | `
- Description: gray text (`#4d5156`), up to 2 lines
- Sitelink grid: 2x2 or 4x1 blue links with descriptions
- Font: Arial/sans-serif, exact Google spacing

### Google Display Ad
- Fixed size container (300x250 default)
- Background image or color
- Logo in corner
- Headline text (bold, large)
- Description text (smaller)
- CTA button (rounded, brand color)
- "Ad" label in corner

### Newsletter Preview
- Inbox row: sender avatar circle, sender name (bold), subject line, preheader (gray fade), timestamp
- Below: centered 600px email body
- Email body: clean typography, H2 sections, single-column
- CTA button: centered, rounded, brand color
- Footer: unsubscribe link, address (grayed out)

### Email Sequence
- Timeline: vertical line with numbered circles per email
- Per email: date/delay badge, subject line, preview text
- Expandable: click to show full email content
- Sequence metadata header: type, trigger, total emails

## Export Command Workflow

1. **Find campaign** — resolve path or find latest in `clients/*/campaigns/`
2. **Read campaign files** — list what exists
3. **Categorize** — map each file to category + component template
4. **Read scaffold** — `references/export/scaffold.html`
5. **Per content type**: read matching component, parse campaign file, fill `{{PLACEHOLDERS}}`, insert into scaffold
6. **ads.json**: parse JSON, determine formats, read only those ad components
7. **Write HTML** — `exports/<client>-<campaign-slug>.html`
8. **Confirm** — output path to user

## Design Principles

- Command is orchestration only — no HTML/CSS in the command
- Component files are literal HTML/CSS code — not instructions
- Only read what's needed — lazy loading of components
- Categories provide navigable structure
- Pixel-perfect = exact platform colors, spacing, typography, UI chrome
- Self-contained = no external dependencies (fonts, CSS, JS CDNs)
- Responsive = works on mobile and desktop
- Print-friendly = clean output when printed
