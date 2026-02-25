# Export Pixel-Perfect Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the generic export command with a three-layer system (lean command + HTML scaffold + per-platform component templates) that produces consistent, pixel-perfect campaign HTML exports.

**Architecture:** The export command (`commands/export.md`) becomes a pure orchestrator. A full HTML scaffold (`references/export/scaffold.html`) provides the outer shell with nav, categories, and responsive layout. Individual component files in `references/export/components/` provide pixel-perfect platform mockups with `{{PLACEHOLDER}}` tokens. Claude reads only what's needed and assembles the final HTML.

**Tech Stack:** HTML5, CSS3 (inline, no external deps), semantic markup. All files in the c-marketing plugin under `references/export/`.

---

## Shared CSS Design Tokens

These values are used across multiple components. Reference this section when building any component.

### Platform Brand Colors
```
LinkedIn Blue:    #0A66C2
Facebook Blue:    #1877F2
Google Blue:      #4285F4
Google Green:     #34A853 (display URL)
Google Ad Label:  #202124 (text on light pill)
Gmail Red:        #EA4335
X/Twitter Black:  #0F1419
Instagram Grad:   #E4405F → #FCAF45
```

### LinkedIn Feed UI
```
Page background:     #f4f2ee
Card background:     #ffffff
Card border:         1px solid #e0dfdc
Card border-radius:  8px
Font family:         -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Fira Sans', Ubuntu, Oxygen, 'Droid Sans', sans-serif
Profile pic:         48px circle
Name:                14px, 600 weight, #000000e6
Headline:            12px, 400 weight, #00000099
Timestamp:           12px, 400 weight, #00000099
Body text:           14px/20px, 400 weight, #000000e6
"...see more":       14px, 600 weight, #00000099
Reaction icons:      16px, grouped left
Reaction count:      12px, #00000099
Action bar:          height 40px, icons 24px, text 14px, #00000099
Action bar border:   1px solid #e0dfdc (top)
Like/Comment/Repost/Send: evenly spaced flex
```

### Facebook Feed UI
```
Page background:     #f0f2f5
Card background:     #ffffff
Card border-radius:  8px
Card shadow:         0 1px 2px rgba(0,0,0,0.1)
Font family:         Helvetica, Arial, sans-serif
Page name:           15px, 600 weight, #050505
"Sponsored":         13px, 400 weight, #65676b
Body text:           15px/20px, 400 weight, #050505
Media aspect:        1200x628 (1.91:1)
Headline area bg:    #f0f2f5
Headline:            16px, 600 weight, #050505
Description:         14px, 400 weight, #65676b
CTA button:          14px, 600 weight, #050505, bg #e4e6eb, border-radius 6px, padding 8px 16px
Reaction bar:        emoji row (16px) + count text (15px, #65676b)
Action bar:          Like/Comment/Share, 15px, #65676b, height 44px
```

### Google Search SERP
```
Background:          #ffffff
Font family:         Arial, sans-serif
"Sponsored" label:   12px, 400 weight, #202124, bold "Sponsored" prefix
Favicon:             26px circle with 18px icon, margin-right 12px
Display URL:         14px, 400 weight, #202124 (domain), 12px breadcrumb arrows
Headline:            20px, 400 weight, #1a0dab
Description:         14px/22px, 400 weight, #4d5156
Sitelink:            14px, #1a0dab, in 2-column grid
Sitelink desc:       12px, #4d5156
Vertical spacing:    result block padding 12px 0
```

### Google Display Ad
```
Container:           fixed dimensions (300x250 default)
Border:              1px solid #e0e0e0
Border-radius:       0 (standard) or 8px (responsive)
"Ad" badge:          10px, #ffffff on rgba(0,0,0,0.6), top-right corner
Font family:         'Google Sans', Roboto, Arial, sans-serif
Headline:            18px, 500 weight
Description:         12px, 400 weight
CTA button:          padding 6px 16px, border-radius 4px, 14px 500 weight
```

### Gmail / Email Preview
```
Inbox row height:    40px
Inbox background:    #ffffff
Inbox hover:         #f2f2f2
Sender:              14px, 700 weight (unread) / 400 (read), #202124
Subject:             14px, 700 weight (unread) / 400 (read), #202124
Snippet:             14px, 400 weight, #5f6368, preceded by " - "
Timestamp:           12px, 400 weight, #5f6368, right-aligned
Star icon:           20px, #5f6368 (outline), #f4b400 (filled)
Email body width:    600px centered
Email body font:     14px/24px, 'Google Sans', Roboto, Arial
Email body bg:       #ffffff, card shadow 0 1px 3px rgba(0,0,0,0.12)
```

---

## Task 1: Create Directory Structure

**Files:**
- Create: `c-marketing/references/export/` (directory)
- Create: `c-marketing/references/export/components/` (directory)

**Step 1: Create directories**

```bash
mkdir -p c-marketing/references/export/components
```

**Step 2: Verify**

```bash
ls -la c-marketing/references/export/
ls -la c-marketing/references/export/components/
```

Expected: Both directories exist, empty.

**Step 3: Commit**

```bash
git add c-marketing/references/export/
git commit -m "chore: create export template directory structure"
```

Note: git won't track empty dirs — this commit happens after first file is created in Task 2.

---

## Task 2: Build scaffold.html

**Files:**
- Create: `c-marketing/references/export/scaffold.html`

This is the outer HTML shell. A complete, runnable HTML page with the nav, category sections, responsive layout, and CSS custom properties. Component snippets get inserted into the marked sections.

**Step 1: Write scaffold.html**

The scaffold must include:

1. **DOCTYPE and head** — charset, viewport, title with `{{CAMPAIGN_TITLE}}`, all CSS in a `<style>` block
2. **CSS custom properties** block at `:root` for shared tokens (colors, spacing, fonts)
3. **CSS reset** — minimal: box-sizing, margin/padding zero, system font
4. **Layout CSS** — `.export-container` max-width 1100px centered, sidebar nav + main content grid on desktop, stacked on mobile
5. **Navigation** — sticky sidebar (desktop) / collapsible hamburger (mobile). Three category groups: Organisk innhold, Betalt annonsering, E-post. Each with anchor links to sections. Active state highlighting via simple JS scroll spy.
6. **Category sections** — three `<section>` elements with IDs: `organic`, `paid`, `email`. Each has a category header with distinct accent color:
   - Organic: green accent `#057642`
   - Paid: blue accent `#1877F2`
   - Email: purple accent `#7c3aed`
7. **Insertion markers** as HTML comments:
   - `<!-- INSERT:article -->` inside `#organic`
   - `<!-- INSERT:linkedin-post -->` inside `#organic`
   - `<!-- INSERT:social -->` inside `#organic`
   - `<!-- INSERT:facebook-feed-ad -->` inside `#paid`
   - `<!-- INSERT:facebook-carousel-ad -->` inside `#paid`
   - `<!-- INSERT:facebook-stories-ad -->` inside `#paid`
   - `<!-- INSERT:linkedin-sponsored-ad -->` inside `#paid`
   - `<!-- INSERT:google-search-ad -->` inside `#paid`
   - `<!-- INSERT:google-display-ad -->` inside `#paid`
   - `<!-- INSERT:newsletter -->` inside `#email`
   - `<!-- INSERT:email-sequence -->` inside `#email`
8. **Campaign header** — at top of main content, showing `{{CAMPAIGN_TITLE}}`, `{{CLIENT_NAME}}`, `{{CAMPAIGN_DATE}}`, and a summary badge row (number of content types produced)
9. **Footer** — "Eksportert fra c-marketing" + date
10. **Print styles** — `@media print` that hides nav, removes shadows, max-width 100%
11. **Responsive** — sidebar collapses below 768px, components stack vertically
12. **Minimal JS** — only for: nav hamburger toggle, scroll spy active highlighting, collapsible sections (no external deps)

**Placeholder tokens used in scaffold:**
- `{{CAMPAIGN_TITLE}}` — campaign topic/name
- `{{CLIENT_NAME}}` — client name from profile
- `{{CAMPAIGN_DATE}}` — YYYY-MM-DD
- `{{CONTENT_COUNT_BADGE}}` — e.g. "6 innholdstyper"
- Each `<!-- INSERT:xxx -->` marker is replaced with rendered component HTML or removed entirely if that content type doesn't exist

**CSS structure:**

```css
:root {
  /* Platform colors */
  --li-blue: #0A66C2;
  --fb-blue: #1877F2;
  --g-blue: #4285F4;
  --g-green: #34A853;
  --x-black: #0F1419;

  /* Category accents */
  --organic-accent: #057642;
  --paid-accent: #1877F2;
  --email-accent: #7c3aed;

  /* Layout */
  --nav-width: 240px;
  --content-max: 800px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 40px;

  /* Typography */
  --font-system: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  --font-serif: Georgia, 'Times New Roman', serif;

  /* Surfaces */
  --bg-page: #f8f9fa;
  --bg-card: #ffffff;
  --border-light: #e0e0e0;
  --text-primary: #1a1a2e;
  --text-secondary: #65676b;
}
```

**Step 2: Verify standalone**

Open `c-marketing/references/export/scaffold.html` in a browser. Should show:
- Navigation sidebar with three categories
- Empty category sections with headers
- Placeholder campaign header
- Responsive: resize to mobile width, nav collapses

**Step 3: Commit**

```bash
git add c-marketing/references/export/scaffold.html
git commit -m "feat: add export HTML scaffold with nav, categories, and responsive layout"
```

---

## Task 3: Build linkedin-post.html (organic)

**Files:**
- Create: `c-marketing/references/export/components/linkedin-post.html`

A self-contained `<div>` that renders as a pixel-perfect LinkedIn organic post. Uses the LinkedIn design tokens from the shared section above.

**Step 1: Write linkedin-post.html**

The component must render:

1. **Wrapper**: `<div class="li-post">` with LinkedIn page background color, padding to simulate feed
2. **Card**: white background, border, border-radius 8px
3. **Post header row**:
   - Profile picture: 48px gray circle placeholder (or `{{PROFILE_IMAGE}}` if available)
   - Name column: `{{AUTHOR_NAME}}` (bold), `{{AUTHOR_HEADLINE}}` (gray), `{{TIMESTAMP}}` + globe icon (gray)
   - Three-dot menu icon (right-aligned)
4. **Post body**: `{{POST_TEXT}}` — rendered with line breaks preserved (`white-space: pre-wrap`). Include a "...se mer" link styled correctly if text exceeds ~5 lines
5. **Engagement row** (below body, above action bar):
   - Reaction emoji cluster (👍 ❤️ 👏) as small overlapping circles, left-aligned
   - `{{REACTION_COUNT}}` text
   - Right side: `{{COMMENT_COUNT}} kommentarer · {{SHARE_COUNT}} delinger`
6. **Action bar** (bottom):
   - 4 evenly spaced buttons: Liker, Kommenter, Del, Send
   - Each with an SVG icon + label
   - Top border separator
7. **Hashtags**: below action bar, `{{HASHTAGS}}` in LinkedIn blue

**Placeholder tokens:**
- `{{AUTHOR_NAME}}`, `{{AUTHOR_HEADLINE}}`, `{{PROFILE_IMAGE}}` (optional, falls back to initials circle)
- `{{TIMESTAMP}}` (e.g., "2d")
- `{{POST_TEXT}}`
- `{{REACTION_COUNT}}`, `{{COMMENT_COUNT}}`, `{{SHARE_COUNT}}`
- `{{HASHTAGS}}`

**SVG icons:** Inline simple SVG for thumbs-up, comment bubble, repost arrows, send/paper-plane. Keep minimal — 16-20px viewBox.

**Step 2: Verify standalone**

Wrap the component in a minimal HTML page to preview:
```html
<!-- Preview: open this file directly in a browser -->
<!-- <html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="background:#f4f2ee;padding:40px;display:flex;justify-content:center"> -->
```

The component should look indistinguishable from a real LinkedIn feed post at first glance.

**Step 3: Commit**

```bash
git add c-marketing/references/export/components/linkedin-post.html
git commit -m "feat: add pixel-perfect LinkedIn organic post component"
```

---

## Task 4: Build facebook-feed-ad.html

**Files:**
- Create: `c-marketing/references/export/components/facebook-feed-ad.html`

**Step 1: Write facebook-feed-ad.html**

Pixel-perfect Facebook sponsored feed ad. Must render:

1. **Card**: white, border-radius 8px, shadow
2. **Header row**:
   - Page profile pic: 40px circle
   - `{{PAGE_NAME}}` (bold) + "Sponset · " + globe icon — stacked layout
3. **Primary text**: `{{PRIMARY_TEXT}}` with "Se mer" truncation styling
4. **Media area**: `{{IMAGE_URL}}` or gray placeholder, aspect ratio 1.91:1 (1200x628)
5. **Link preview bar** (below image, gray background `#f0f2f5`):
   - `{{DISPLAY_URL}}` (uppercase, 13px, gray)
   - `{{HEADLINE}}` (16px, bold, black)
   - `{{DESCRIPTION}}` (14px, gray)
   - CTA button right-aligned: `{{CTA_TEXT}}` in Facebook button style
6. **Engagement row**: emoji reactions + `{{REACTION_COUNT}}` left, `{{COMMENT_COUNT}} kommentarer {{SHARE_COUNT}} delinger` right
7. **Action bar**: Liker, Kommenter, Del — with icons

**Placeholder tokens:**
- `{{PAGE_NAME}}`, `{{PAGE_IMAGE}}`, `{{PRIMARY_TEXT}}`
- `{{IMAGE_URL}}` (falls back to placeholder gradient)
- `{{DISPLAY_URL}}`, `{{HEADLINE}}`, `{{DESCRIPTION}}`, `{{CTA_TEXT}}`
- `{{REACTION_COUNT}}`, `{{COMMENT_COUNT}}`, `{{SHARE_COUNT}}`

**Step 2: Verify standalone** — should look like a real Facebook feed ad.

**Step 3: Commit**

```bash
git add c-marketing/references/export/components/facebook-feed-ad.html
git commit -m "feat: add pixel-perfect Facebook feed ad component"
```

---

## Task 5: Build facebook-carousel-ad.html

**Files:**
- Create: `c-marketing/references/export/components/facebook-carousel-ad.html`

**Step 1: Write facebook-carousel-ad.html**

Same Facebook chrome as feed ad (header, primary text, engagement, action bar), but media area is a horizontal scrollable carousel.

1. **Carousel container**: `overflow-x: auto`, `scroll-snap-type: x mandatory`, horizontal flex
2. **Per card**: `scroll-snap-align: start`, fixed width ~280px, 1:1 image (or 4:5 for LinkedIn carousel variant)
   - Image area
   - Card footer: `{{CARD_HEADLINE}}`, `{{CARD_DESCRIPTION}}`, `{{CARD_CTA}}`
3. **Navigation arrows**: left/right chevron overlays on the carousel edges (CSS-only, decorative)
4. **Card count indicator**: dots below carousel

**Placeholder tokens:**
- Same header tokens as feed ad
- `{{CARDS}}` — array token. The export command renders each card by repeating the card template within the carousel. Each card has: `{{CARD_IMAGE}}`, `{{CARD_HEADLINE}}`, `{{CARD_DESCRIPTION}}`, `{{CARD_CTA}}`

**Step 2: Verify — should show horizontal scrollable cards.**

**Step 3: Commit**

```bash
git add c-marketing/references/export/components/facebook-carousel-ad.html
git commit -m "feat: add pixel-perfect Facebook carousel ad component"
```

---

## Task 6: Build facebook-stories-ad.html

**Files:**
- Create: `c-marketing/references/export/components/facebook-stories-ad.html`

**Step 1: Write facebook-stories-ad.html**

9:16 aspect ratio stories format:

1. **Container**: 360px × 640px (scaled), border-radius 12px, overflow hidden
2. **Background**: `{{IMAGE_URL}}` as `background-size: cover` or gradient placeholder
3. **Header overlay**: `{{PAGE_NAME}}` + avatar + "Sponset" label, semi-transparent bg, top area
4. **Text overlay**: `{{OVERLAY_HEADLINE}}` centered on `{{OVERLAY_POSITION}}` (top/center/bottom), semi-transparent backdrop `rgba(0,0,0,0.5)`, white text, large bold font
5. **Swipe-up CTA**: bottom area, `{{CTA_TEXT}}` with upward chevron icon, frosted glass effect

**Step 2: Verify — should look like a stories ad preview.**

**Step 3: Commit**

```bash
git add c-marketing/references/export/components/facebook-stories-ad.html
git commit -m "feat: add pixel-perfect Facebook stories ad component"
```

---

## Task 7: Build linkedin-sponsored-ad.html

**Files:**
- Create: `c-marketing/references/export/components/linkedin-sponsored-ad.html`

**Step 1: Write linkedin-sponsored-ad.html**

Same LinkedIn chrome as organic post, but with these differences:

1. **Header**: Company page format — logo (smaller, square with rounded corners), `{{PAGE_NAME}}`, `{{FOLLOWER_COUNT}} følgere`, "Forfremmet" label instead of personal connection info
2. **Body text**: `{{PRIMARY_TEXT}}` with "...se mer"
3. **Media area**: image at 1.91:1 ratio
4. **Link preview**: below image — `{{HEADLINE}}`, `{{DISPLAY_URL}}`, `{{CTA_TEXT}}` as LinkedIn-styled button (blue background, white text, rounded)
5. **Engagement + action bar**: same as organic but with engagement numbers

**Step 2: Verify — should look like LinkedIn sponsored content.**

**Step 3: Commit**

```bash
git add c-marketing/references/export/components/linkedin-sponsored-ad.html
git commit -m "feat: add pixel-perfect LinkedIn sponsored ad component"
```

---

## Task 8: Build google-search-ad.html

**Files:**
- Create: `c-marketing/references/export/components/google-search-ad.html`

**Step 1: Write google-search-ad.html**

Google SERP ad result:

1. **Container**: white, max-width 600px, padding, no border/shadow (flat like Google SERP)
2. **"Sponset" label**: small bold text, left-aligned above the result
3. **URL row**: favicon circle (26px, gray placeholder) + `{{DISPLAY_URL}}` with breadcrumb-style path segments (`{{PATHS}}` array), small down-chevron
4. **Headline**: `{{HEADLINES}}` joined by " | " — blue link color `#1a0dab`, 20px, hover underline
5. **Description**: `{{DESCRIPTIONS}}` — gray `#4d5156`, 14px, up to 2 lines
6. **Sitelinks** (if present): 2-column grid below description
   - Each sitelink: blue link text `{{SITELINK_TITLE}}` + gray description `{{SITELINK_DESC}}`
   - Max 4 sitelinks

**Placeholder tokens:**
- `{{DISPLAY_URL}}`, `{{PATHS}}` (array)
- `{{HEADLINES}}` (array, joined by " | ")
- `{{DESCRIPTIONS}}` (array)
- `{{SITELINKS}}` (array of {title, description})

**Step 2: Verify — should look like a Google Search ad result.**

**Step 3: Commit**

```bash
git add c-marketing/references/export/components/google-search-ad.html
git commit -m "feat: add pixel-perfect Google Search SERP ad component"
```

---

## Task 9: Build google-display-ad.html

**Files:**
- Create: `c-marketing/references/export/components/google-display-ad.html`

**Step 1: Write google-display-ad.html**

Standard 300x250 display ad:

1. **Container**: exact 300x250px (with note that size can be `{{AD_SIZE}}`), 1px border `#e0e0e0`
2. **Background**: `{{IMAGE_URL}}` or brand color gradient
3. **Logo**: `{{LOGO_URL}}` in top-left or top-right, 40px
4. **Headline**: `{{HEADLINE}}`, large bold text, contrasting color
5. **Description**: `{{DESCRIPTION}}`, smaller text
6. **CTA button**: `{{CTA_TEXT}}`, rounded, brand-colored
7. **"Ad" badge**: top-right corner, small `rgba(0,0,0,0.6)` bg with white text

**Step 2: Verify — should look like a Google display banner.**

**Step 3: Commit**

```bash
git add c-marketing/references/export/components/google-display-ad.html
git commit -m "feat: add pixel-perfect Google Display ad component"
```

---

## Task 10: Build article-preview.html

**Files:**
- Create: `c-marketing/references/export/components/article-preview.html`

**Step 1: Write article-preview.html**

Clean article/blog preview:

1. **Metadata card**: light background card showing YAML frontmatter data — `{{TITLE}}`, `{{DESCRIPTION}}` (meta), `{{SLUG}}`, `{{KEYWORDS}}` as pills
2. **Article body**: serif font (Georgia), max-width 680px, proper typography:
   - H1: 36px, bold, `--text-primary`
   - H2: 24px, bold, margin-top 32px
   - H3: 18px, bold
   - Body: 18px/30px, `#333`
   - Blockquotes: left border 3px, italic, gray
   - Lists: proper indentation, bullet styling
   - Links: underlined, accent color
3. **Hero image**: `{{HERO_IMAGE}}` if present, full-width, rounded corners
4. **Reading time badge**: estimated from word count

**Placeholder tokens:**
- `{{TITLE}}`, `{{DESCRIPTION}}`, `{{SLUG}}`, `{{DATE}}`, `{{KEYWORDS}}`
- `{{HERO_IMAGE}}` (optional)
- `{{ARTICLE_HTML}}` — the article body already rendered from markdown to HTML

**Step 2: Verify — should look like a clean Medium/Substack article.**

**Step 3: Commit**

```bash
git add c-marketing/references/export/components/article-preview.html
git commit -m "feat: add article preview component with clean typography"
```

---

## Task 11: Build social-cards.html

**Files:**
- Create: `c-marketing/references/export/components/social-cards.html`

**Step 1: Write social-cards.html**

Multi-platform social post display. Each platform gets its own card:

1. **Instagram card**:
   - White card with Instagram header: profile pic + username + three-dot menu
   - Image area (1:1 square or carousel indicator)
   - Heart/comment/share/save icon row
   - "Liked by ..." text
   - Caption with `{{IG_CAPTION}}`, truncated with "...mer"
   - Hashtags in gray
   - Carousel suggestion note if applicable

2. **Facebook organic card**:
   - Similar to ad but no "Sponsored" label
   - Profile pic + name + timestamp + globe
   - `{{FB_TEXT}}` body
   - Optional image
   - Reaction + action bar

3. **X (Twitter) card**:
   - White card, profile pic (40px circle) + display name + @handle (gray) + timestamp
   - `{{X_TEXT}}` — monospace-feeling, 15px
   - Engagement row: replies, reposts, likes, views — with icons and counts
   - Border-bottom: 1px solid `#eff3f4`

**Each platform card is wrapped in a labeled section** so they display as a vertical stack.

**Step 2: Verify — each platform card looks native.**

**Step 3: Commit**

```bash
git add c-marketing/references/export/components/social-cards.html
git commit -m "feat: add social media cards component (Instagram, Facebook, X)"
```

---

## Task 12: Build newsletter-preview.html

**Files:**
- Create: `c-marketing/references/export/components/newsletter-preview.html`

**Step 1: Write newsletter-preview.html**

Two-part display:

1. **Gmail inbox row mockup** (top):
   - Light background card with inbox-style row
   - Checkbox + star icon + `{{SENDER_NAME}}` (bold) + `{{SUBJECT}}` (bold) + ` - {{PREHEADER}}` (gray, fade) + `{{DATE}}` right-aligned
   - Hover state styling
   - Below the row: a "clicked open" visual separator

2. **Email body** (below):
   - Centered 600px white card with shadow
   - Optional `{{HEADER_IMAGE}}` full-width at top
   - Email content: `{{EMAIL_HTML}}` — rendered from newsletter markdown
   - H2 headings, paragraphs, CTA button (centered, rounded, accent color, 16px bold, padding 12px 32px)
   - PS section in slightly lighter text
   - Footer: gray separator, "Avmeld" link, company address placeholder, small text

**Placeholder tokens:**
- `{{SENDER_NAME}}`, `{{SUBJECT}}`, `{{PREHEADER}}`, `{{DATE}}`
- `{{HEADER_IMAGE}}` (optional)
- `{{EMAIL_HTML}}`

**Step 2: Verify — should look like opening an email from Gmail inbox.**

**Step 3: Commit**

```bash
git add c-marketing/references/export/components/newsletter-preview.html
git commit -m "feat: add newsletter preview component with Gmail inbox mockup"
```

---

## Task 13: Build email-sequence.html

**Files:**
- Create: `c-marketing/references/export/components/email-sequence.html`

**Step 1: Write email-sequence.html**

Timeline + expandable emails:

1. **Sequence header**: `{{SEQUENCE_NAME}}`, type badge (`{{SEQUENCE_TYPE}}`), trigger info (`{{TRIGGER}}`), total count
2. **Timeline**: vertical line (2px, gray) with numbered circles (32px, accent-colored) per email
3. **Per email node**:
   - Circle with number + connecting line
   - Card (right of timeline): delay badge (`{{DELAY}}`), subject line (`{{SUBJECT}}`), preheader preview
   - Expandable: `<details><summary>` wrapping the full email content
   - Inside expanded: full email body rendered as HTML
4. **Summary table** at top: # | Delay | Jobb | Emnelinje — matching the sequence plan table format

**Placeholder tokens:**
- `{{SEQUENCE_NAME}}`, `{{SEQUENCE_TYPE}}`, `{{TRIGGER}}`, `{{TOTAL_EMAILS}}`
- `{{SEQUENCE_TABLE_HTML}}` — rendered sequence plan table
- `{{EMAIL_NODES}}` — repeated per email with: `{{EMAIL_NUMBER}}`, `{{DELAY}}`, `{{SUBJECT}}`, `{{PREHEADER}}`, `{{EMAIL_BODY_HTML}}`

**Step 2: Verify — timeline with expandable cards.**

**Step 3: Commit**

```bash
git add c-marketing/references/export/components/email-sequence.html
git commit -m "feat: add email sequence timeline component"
```

---

## Task 14: Rewrite commands/export.md

**Files:**
- Modify: `c-marketing/commands/export.md`

This is the core task — replacing the current export command with the lean orchestrator.

**Step 1: Rewrite export.md**

The new command must:

1. **Frontmatter**: same `description` and `argument-hint`
2. **Reference**: `!references/export/scaffold.html` — the scaffold is always loaded
3. **NO references to individual components** in the frontmatter. Instead, the workflow tells Claude to READ the relevant component file when needed using the Read tool.
4. **Language section**: Bokmål default

5. **Workflow**:

   **Fase 1 — Finn kampanje**: Same as current (resolve path or find latest)

   **Fase 2 — Les kampanjefiler**: Read all available files. Build a content manifest:
   ```
   Organic:  article.md?, linkedin.md?, social.md?
   Paid:     ads.json? (parse to identify formats: feed, carousel, stories, search, display)
   Email:    newsletter.md?, email-sequence.md?
   Also:     brief.md, research.md, campaign-summary.md, images-metadata.json
   ```

   **Fase 3 — Les scaffold**: Read `references/export/scaffold.html`. This is the outer HTML.

   **Fase 4 — Bygg innhold per type**: For each content type found:

   a. **Read the component template** from `references/export/components/<name>.html`
   b. **Parse the campaign file** — extract YAML frontmatter and body content
   c. **Convert markdown body to HTML** — headings, paragraphs, lists, bold, italic, links
   d. **Fill placeholders** — replace all `{{TOKEN}}` with actual campaign data
   e. **Insert into scaffold** — replace the corresponding `<!-- INSERT:xxx -->` marker

   Special handling:
   - `ads.json`: Parse JSON. Group ads by format. For each format, read the matching component. Render one component per ad, wrapped in a labeled container.
   - `linkedin.md`: Map directly to linkedin-post component. Extract hashtags from bottom of content.
   - `social.md`: Parse per-platform sections (## LinkedIn, ## Instagram, ## Facebook, ## X). Feed each into the social-cards component.
   - `newsletter.md`: Extract YAML (subject, preheader, date), render body to HTML.
   - `email-sequence.md`: Extract YAML (sequence, type, emails, trigger), parse per-email sections, render each.
   - `article.md`: Extract YAML (title, description, slug, keywords), render body.
   - Client profile data (`{{PAGE_NAME}}`, `{{AUTHOR_NAME}}`, etc.): Read from `clients/<slug>/profile.md` — if not available, use placeholder text.

   **Fase 5 — Fjern ubrukte seksjoner**: Remove any `<!-- INSERT:xxx -->` markers that weren't filled. Remove entire category sections (`#organic`, `#paid`, `#email`) if they contain no content.

   **Fase 6 — Skriv HTML**: Write to `exports/<client>-<campaign-slug>.html`. Create `exports/` if needed.

   **Fase 7 — Bekreft**: Tell user the file path and suggest opening in browser.

6. **Regler**:
   - Self-contained: no external CSS, JS, fonts, or images (except campaign images via relative paths)
   - Read component files on demand — only the ones needed
   - Convert markdown to HTML yourself — don't use external tools
   - Preserve image references from campaign files as relative paths
   - If `images/` exist in campaign dir, use `{{IMAGE}}` tokens; if not, use placeholder gradients
   - Don't modify source campaign files

7. **Component file mapping table**:

   | Campaign file | Category | Component template |
   |---|---|---|
   | `article.md` | Organisk | `references/export/components/article-preview.html` |
   | `linkedin.md` | Organisk | `references/export/components/linkedin-post.html` |
   | `social.md` | Organisk | `references/export/components/social-cards.html` |
   | `ads.json` (format=feed, platform=facebook) | Betalt | `references/export/components/facebook-feed-ad.html` |
   | `ads.json` (format=carousel) | Betalt | `references/export/components/facebook-carousel-ad.html` |
   | `ads.json` (format=stories) | Betalt | `references/export/components/facebook-stories-ad.html` |
   | `ads.json` (format=feed, platform=linkedin) | Betalt | `references/export/components/linkedin-sponsored-ad.html` |
   | `ads.json` (format=search) | Betalt | `references/export/components/google-search-ad.html` |
   | `ads.json` (format=display) | Betalt | `references/export/components/google-display-ad.html` |
   | `newsletter.md` | E-post | `references/export/components/newsletter-preview.html` |
   | `email-sequence.md` | E-post | `references/export/components/email-sequence.html` |

**Step 2: Verify reference integrity**

```bash
cd c-marketing && grep -rh '^!' commands/export.md | sort -u
```

Confirm `!references/export/scaffold.html` resolves to an existing file.

**Step 3: Commit**

```bash
git add c-marketing/commands/export.md
git commit -m "feat: rewrite export command as lean orchestrator with component references"
```

---

## Task 15: Bump version + final verification

**Files:**
- Modify: `c-marketing/.claude-plugin/plugin.json` — bump version to `1.1.0`

**Step 1: Bump version**

Change `"version": "1.0.0"` to `"version": "1.1.0"` in `c-marketing/.claude-plugin/plugin.json`.

**Step 2: Run reference integrity check**

```bash
cd c-marketing && grep -rh '^!' commands/ skills/ | sort -u | while read ref; do path="${ref#!}"; [ ! -f "$path" ] && echo "BROKEN: $ref"; done
```

Expected: No broken references.

**Step 3: Verify all export files exist**

```bash
ls -la references/export/scaffold.html
ls -la references/export/components/
```

Expected: scaffold.html + 11 component files.

**Step 4: Commit**

```bash
git add c-marketing/.claude-plugin/plugin.json
git commit -m "chore: bump c-marketing version to 1.1.0 for export redesign"
```

---

## Execution Notes

### Parallelization

Tasks 3-13 (all component files) are independent of each other and can be built in parallel by subagents. Each subagent needs:
- The shared CSS design tokens (from this plan's top section)
- The component specification (from the task description)
- The path to write to

Task 14 (rewrite export.md) depends on all components existing.
Task 15 depends on Task 14.

**Recommended parallel batches:**
- Batch 1: Tasks 1-2 (structure + scaffold) — sequential
- Batch 2: Tasks 3-13 (all 11 components) — ALL IN PARALLEL
- Batch 3: Tasks 14-15 (command rewrite + version bump) — sequential

### Visual Verification

After all tasks complete, create a test campaign directory with sample content and run the export to verify:
1. All platform mockups render correctly
2. Navigation works
3. Empty sections are hidden
4. Responsive layout works at mobile widths
5. Print layout is clean
