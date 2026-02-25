# Export Script Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the slow LLM-driven HTML export with a fast Node.js script that assembles campaign previews in ~200ms.

**Architecture:** Single `scripts/export.js` file with zero npm dependencies. The export command delegates assembly to the script via `node scripts/export.js <campaign-dir>`. The script reads the scaffold, component templates, and campaign files, fills tokens, and writes a self-contained HTML file.

**Tech Stack:** Node.js built-ins only (`fs`, `path`). No npm install needed.

---

### Task 1: Create script skeleton with CLI parsing and path resolution

**Files:**
- Create: `scripts/export.js`

**Step 1: Write the script entry point with path resolution**

```js
#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// ── CLI ──────────────────────────────────────────────
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const campaignArg = process.argv[2];

if (!campaignArg) {
  console.error('Usage: node scripts/export.js <campaign-dir>');
  process.exit(1);
}

// Resolve campaign dir (relative to plugin root or absolute)
const campaignDir = path.isAbsolute(campaignArg)
  ? campaignArg
  : path.resolve(PLUGIN_ROOT, campaignArg);

if (!fs.existsSync(campaignDir)) {
  console.error(`Campaign directory not found: ${campaignDir}`);
  process.exit(1);
}

// Derive slugs from directory structure:
// clients/<client-slug>/campaigns/<campaign-slug>/
const parts = campaignDir.split(path.sep);
const campaignsIdx = parts.lastIndexOf('campaigns');
const clientSlug = campaignsIdx >= 2 ? parts[campaignsIdx - 1] : 'unknown';
const campaignSlug = parts[parts.length - 1];

// Resolve key paths
const clientDir = path.resolve(campaignDir, '..', '..');
const profilePath = path.join(clientDir, 'profile.md');
const scaffoldPath = path.join(PLUGIN_ROOT, 'references', 'export', 'scaffold.html');
const componentsDir = path.join(PLUGIN_ROOT, 'references', 'export', 'components');
const exportsDir = path.join(PLUGIN_ROOT, 'exports');
const outputFile = path.join(exportsDir, `${clientSlug}-${campaignSlug}.html`);

// Image path prefix: from exports/ back to campaign images
const imagePrefix = path.posix.join(
  '..',
  'clients', clientSlug, 'campaigns', campaignSlug
);

// ── Read helper ──────────────────────────────────────
function readFile(p) {
  return fs.readFileSync(p, 'utf-8');
}

function fileExists(p) {
  return fs.existsSync(p);
}
```

**Step 2: Verify it runs**

Run: `cd /Users/thomasnesmyhre/claude-skills/claude-plugins/c-marketing && node scripts/export.js clients/nordlys-teknologi/campaigns/2026-02-25-smartere-arbeidsflyt`
Expected: No output, no errors (script exits cleanly at end of file)

**Step 3: Commit**

```bash
git add scripts/export.js
git commit -m "feat(export): scaffold export.js with CLI parsing and path resolution"
```

---

### Task 2: Add YAML frontmatter parser and markdown-to-HTML converter

**Files:**
- Modify: `scripts/export.js`

**Step 1: Add the YAML frontmatter parser**

Append after the read helpers:

```js
// ── YAML frontmatter parser ─────────────────────────
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  let currentKey = null;
  for (const line of match[1].split('\n')) {
    const kvMatch = line.match(/^(\w[\w_]*):\s*(.*)$/);
    if (kvMatch) {
      const [, key, rawVal] = kvMatch;
      let val = rawVal.trim();
      // Strip surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      meta[key] = val === '' ? [] : val;
      currentKey = val === '' ? key : null;
    } else if (currentKey && line.match(/^\s+-\s+/)) {
      const item = line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, '');
      if (!Array.isArray(meta[currentKey])) meta[currentKey] = [];
      meta[currentKey].push(item);
    }
  }
  return { meta, body: match[2] };
}
```

**Step 2: Add the markdown-to-HTML converter**

```js
// ── Markdown → HTML ──────────────────────────────────
function md(text) {
  if (!text) return '';
  const lines = text.split('\n');
  const out = [];
  let inUl = false, inOl = false;

  function closeList() {
    if (inUl) { out.push('</ul>'); inUl = false; }
    if (inOl) { out.push('</ol>'); inOl = false; }
  }

  function inline(s) {
    return s
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headings
    if (line.startsWith('### ')) { closeList(); out.push(`<h3>${inline(line.slice(4))}</h3>`); continue; }
    if (line.startsWith('## ')) { closeList(); out.push(`<h2>${inline(line.slice(3))}</h2>`); continue; }
    if (line.startsWith('# ')) { closeList(); out.push(`<h1>${inline(line.slice(2))}</h1>`); continue; }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) { closeList(); out.push('<hr>'); continue; }

    // Unordered list
    if (/^[-*]\s+/.test(line)) {
      if (!inUl) { closeList(); out.push('<ul>'); inUl = true; }
      out.push(`<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      if (!inOl) { closeList(); out.push('<ol>'); inOl = true; }
      out.push(`<li>${inline(line.replace(/^\d+\.\s+/, ''))}</li>`);
      continue;
    }

    // Blank line
    if (line.trim() === '') { closeList(); continue; }

    // Paragraph (collect consecutive non-blank lines)
    closeList();
    const pLines = [line];
    while (i + 1 < lines.length && lines[i + 1].trim() !== '' && !/^#{1,3}\s/.test(lines[i + 1]) && !/^[-*]\s/.test(lines[i + 1]) && !/^\d+\.\s/.test(lines[i + 1]) && !/^---+$/.test(lines[i + 1].trim())) {
      i++;
      pLines.push(lines[i]);
    }
    out.push(`<p>${inline(pLines.join('\n'))}</p>`);
  }
  closeList();
  return out.join('\n');
}
```

**Step 3: Quick smoke test**

Add temporarily at the bottom of the script:

```js
// Smoke test (remove later)
const testMd = parseFrontmatter(readFile(path.join(campaignDir, 'article.md')));
console.log('Title:', testMd.meta.title);
console.log('Keywords:', testMd.meta.keywords);
console.log('Body HTML (first 200 chars):', md(testMd.body).slice(0, 200));
```

Run: `cd /Users/thomasnesmyhre/claude-skills/claude-plugins/c-marketing && node scripts/export.js clients/nordlys-teknologi/campaigns/2026-02-25-smartere-arbeidsflyt`
Expected: Title, keywords array, and HTML snippet printed

**Step 4: Remove smoke test, commit**

Remove the smoke test lines, then:
```bash
git add scripts/export.js
git commit -m "feat(export): add YAML parser and markdown-to-HTML converter"
```

---

### Task 3: Add profile parser and campaign file discovery

**Files:**
- Modify: `scripts/export.js`

**Step 1: Add profile parsing and campaign discovery**

Append after the `md()` function:

```js
// ── Resolve image paths ──────────────────────────────
function resolveImagePath(src) {
  if (!src) return '';
  // Already absolute URL — keep as-is
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  // Relative path like images/foo.jpg → prefix with path from exports/ to campaign dir
  return path.posix.join(imagePrefix, src);
}

// ── Parse client profile ─────────────────────────────
let profile = { name: clientSlug, defaults: {} };
if (fileExists(profilePath)) {
  const { meta } = parseFrontmatter(readFile(profilePath));
  profile.name = meta.name || clientSlug;
  profile.defaults = {
    page_name: meta.defaults?.page_name || meta.name || clientSlug,
    profile_image: meta.defaults?.profile_image || '',
    follower_count: meta.defaults?.follower_count || '',
    author_name: meta.defaults?.author_name || meta.sender_name || meta.name || clientSlug,
    author_headline: meta.defaults?.author_headline || '',
  };
}
```

Wait — the profile YAML has nested `defaults:` with sub-keys. The simple parser from Task 2 won't handle nested YAML. We need to extend it slightly.

**Step 2: Upgrade frontmatter parser to handle one level of nesting**

Replace the `parseFrontmatter` function with this version that handles indented sub-keys:

```js
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  let currentKey = null;
  let currentIsMap = false;

  for (const line of match[1].split('\n')) {
    // Top-level key: value
    const kvMatch = line.match(/^(\w[\w_]*):\s*(.*)$/);
    if (kvMatch) {
      const [, key, rawVal] = kvMatch;
      let val = rawVal.trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (val === '') {
        // Could be a list or map — determined by next line
        meta[key] = {};
        currentKey = key;
        currentIsMap = false;
      } else {
        meta[key] = val;
        currentKey = null;
      }
      continue;
    }

    // Array item:   - value
    if (currentKey && /^\s+-\s+/.test(line)) {
      const item = line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, '');
      if (!Array.isArray(meta[currentKey])) meta[currentKey] = [];
      meta[currentKey].push(item);
      continue;
    }

    // Map item:   sub_key: value
    if (currentKey && /^\s+\w/.test(line)) {
      const subMatch = line.match(/^\s+(\w[\w_]*):\s*(.*)$/);
      if (subMatch) {
        let val = subMatch[2].trim().replace(/^["']|["']$/g, '');
        if (typeof meta[currentKey] !== 'object' || Array.isArray(meta[currentKey])) {
          meta[currentKey] = {};
        }
        meta[currentKey][subMatch[1]] = val;
      }
    }
  }
  return { meta, body: match[2] };
}
```

**Step 3: Add campaign file discovery**

```js
// ── Discover campaign files ──────────────────────────
const CAMPAIGN_FILES = {
  article: 'article.md',
  linkedin: 'linkedin.md',
  social: 'social.md',
  ads: 'ads.json',
  newsletter: 'newsletter.md',
  emailSequence: 'email-sequence.md',
};

const found = {};
for (const [key, filename] of Object.entries(CAMPAIGN_FILES)) {
  const p = path.join(campaignDir, filename);
  if (fileExists(p)) found[key] = p;
}

// Derive campaign title from directory name (strip date prefix)
const campaignTitle = campaignSlug.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const campaignDate = (campaignSlug.match(/^(\d{4}-\d{2}-\d{2})/) || ['', ''])[1];
```

**Step 4: Smoke test and commit**

Add a temporary log: `console.log({ profile: profile.name, found: Object.keys(found), campaignTitle, campaignDate });`

Run: `node scripts/export.js clients/nordlys-teknologi/campaigns/2026-02-25-smartere-arbeidsflyt`
Expected: `{ profile: 'Nordlys Teknologi', found: ['article','linkedin','social','ads','newsletter','emailSequence'], campaignTitle: 'Smartere Arbeidsflyt', campaignDate: '2026-02-25' }`

Remove temp log, commit:
```bash
git add scripts/export.js
git commit -m "feat(export): add profile parser and campaign file discovery"
```

---

### Task 4: Build the scaffold assembly with campaign-level tokens

**Files:**
- Modify: `scripts/export.js`

**Step 1: Read scaffold and fill top-level tokens**

```js
// ── Read scaffold ────────────────────────────────────
let html = readFile(scaffoldPath);

// Count content types for badge
const contentTypes = [];
if (found.article) contentTypes.push('Artikkel');
if (found.linkedin) contentTypes.push('LinkedIn-innlegg');
if (found.social) contentTypes.push('Sosiale medier');
if (found.ads) {
  const adsData = JSON.parse(readFile(found.ads));
  for (const ad of adsData.ads) {
    const label = `${ad.platform === 'facebook' ? 'Facebook' : ad.platform === 'linkedin' ? 'LinkedIn' : 'Google'} ${ad.format === 'feed' ? 'Feed' : ad.format === 'carousel' ? 'Karusell' : ad.format === 'stories' ? 'Stories' : ad.format === 'search' ? 'Search' : 'Display'}`;
    contentTypes.push(label);
  }
}
if (found.newsletter) contentTypes.push('Nyhetsbrev');
if (found.emailSequence) contentTypes.push('E-postsekvens');

const badgeHtml = `<span class="badge">${contentTypes.length} innholdstyper</span>`;

html = html
  .replace(/\{\{CAMPAIGN_TITLE\}\}/g, campaignTitle)
  .replace(/\{\{CLIENT_NAME\}\}/g, profile.name)
  .replace(/\{\{CAMPAIGN_DATE\}\}/g, campaignDate)
  .replace(/\{\{CONTENT_COUNT_BADGE\}\}/g, badgeHtml);
```

**Step 2: Commit**

```bash
git add scripts/export.js
git commit -m "feat(export): scaffold assembly with campaign-level tokens"
```

---

### Task 5: Build organic content assemblers (article, linkedin, social)

**Files:**
- Modify: `scripts/export.js`

**Step 1: Add a token replacer helper**

```js
// ── Token replacer ───────────────────────────────────
function fillTokens(template, tokens) {
  let result = template;
  for (const [key, val] of Object.entries(tokens)) {
    result = result.split(`{{${key}}}`).join(val || '');
  }
  return result;
}

function wrapComponent(id, title, inner) {
  return `<div class="component-card" id="${id}"><h3>${title}</h3>\n${inner}\n</div>`;
}

function insertInto(marker, content) {
  html = html.replace(`<!-- INSERT:${marker} -->`, content);
}
```

**Step 2: Article assembler**

```js
// ── Article ──────────────────────────────────────────
if (found.article) {
  const tpl = readFile(path.join(componentsDir, 'article-preview.html'));
  const { meta, body } = parseFrontmatter(readFile(found.article));
  const keywords = (Array.isArray(meta.keywords) ? meta.keywords : [])
    .map(k => `<span class="meta-keyword-pill">${k}</span>`).join(' ');
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / 200);

  const filled = fillTokens(tpl, {
    TITLE: meta.title || '',
    DESCRIPTION: meta.description || '',
    SLUG: meta.slug || '',
    KEYWORDS: keywords,
    DATE: meta.date || campaignDate,
    HERO_IMAGE: resolveImagePath(meta.heroImage),
    ARTICLE_HTML: md(body),
    READING_TIME: String(readingTime),
  });
  insertInto('article', wrapComponent('article', 'Artikkel', filled));
}
```

**Step 3: LinkedIn post assembler**

```js
// ── LinkedIn post ────────────────────────────────────
if (found.linkedin) {
  const tpl = readFile(path.join(componentsDir, 'linkedin-post.html'));
  const raw = readFile(found.linkedin);
  // Split post text from hashtags (last line starting with #)
  const lines = raw.trim().split('\n');
  let hashtagLine = '';
  let postLines = [...lines];
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim().startsWith('#')) {
      hashtagLine = lines[i].trim();
      postLines = lines.slice(0, i);
      break;
    }
  }

  const filled = fillTokens(tpl, {
    PROFILE_IMAGE: profile.defaults.profile_image,
    AUTHOR_NAME: profile.defaults.author_name,
    AUTHOR_HEADLINE: profile.defaults.author_headline,
    TIMESTAMP: 'Nylig',
    POST_TEXT: postLines.join('\n').trim(),
    HASHTAGS: hashtagLine,
    REACTION_COUNT: '47',
    COMMENT_COUNT: '12',
    SHARE_COUNT: '5',
  });
  insertInto('linkedin-post', wrapComponent('linkedin-post', 'LinkedIn-innlegg', filled));
}
```

**Step 4: Social cards assembler**

```js
// ── Social cards ─────────────────────────────────────
if (found.social) {
  const tpl = readFile(path.join(componentsDir, 'social-cards.html'));
  const raw = readFile(found.social);

  // Split by ## headers
  const sections = {};
  let currentSection = null;
  for (const line of raw.split('\n')) {
    const headerMatch = line.match(/^##\s+(.+)/);
    if (headerMatch) {
      currentSection = headerMatch[1].trim().toLowerCase();
      sections[currentSection] = [];
    } else if (currentSection) {
      sections[currentSection].push(line);
    }
  }

  const igText = (sections['instagram'] || []).join('\n').trim();
  // Strip alt-text line from IG caption
  const igCaption = igText.replace(/\n*Alt-tekst:.*$/s, '').trim();
  const fbText = (sections['facebook'] || []).join('\n').trim();
  const xText = (sections['x / twitter'] || sections['x'] || []).join('\n').trim();

  // Derive username from client slug
  const username = clientSlug.replace(/-/g, '');

  const filled = fillTokens(tpl, {
    IG_USERNAME: username,
    IG_IMAGE: resolveImagePath('images/ig-team-digital.jpg'),
    IG_CAPTION: igCaption,
    IG_LIKE_COUNT: '89',
    FB_AUTHOR_NAME: profile.name,
    FB_TIMESTAMP: 'Nylig',
    FB_TEXT: fbText,
    FB_IMAGE: resolveImagePath('images/fb-samarbeid.jpg'),
    X_DISPLAY_NAME: profile.name,
    X_HANDLE: `@${username}`,
    X_TIMESTAMP: '2t',
    X_TEXT: xText,
    X_REPLY_COUNT: '3',
    X_REPOST_COUNT: '8',
    X_LIKE_COUNT: '24',
    X_VIEW_COUNT: '1,2K',
  });
  insertInto('social', wrapComponent('social', 'Sosiale medier', filled));
}
```

**Step 5: Commit**

```bash
git add scripts/export.js
git commit -m "feat(export): organic content assemblers (article, linkedin, social)"
```

---

### Task 6: Build paid ad assemblers (all 6 ad formats)

**Files:**
- Modify: `scripts/export.js`

**Step 1: Parse ads.json and build ad component map**

```js
// ── Ads ──────────────────────────────────────────────
if (found.ads) {
  const adsData = JSON.parse(readFile(found.ads));
  const defaults = adsData.defaults || {};
  const pageTokens = {
    PAGE_NAME: defaults.page_name || profile.name,
    PAGE_IMAGE: defaults.profile_image || profile.defaults.profile_image,
    FOLLOWER_COUNT: (defaults.follower_count || '').replace(/\s*følgere$/, ''),
  };

  // Component template file map
  const AD_COMPONENTS = {
    'facebook-feed': 'facebook-feed-ad.html',
    'facebook-carousel': 'facebook-carousel-ad.html',
    'facebook-stories': 'facebook-stories-ad.html',
    'linkedin-feed': 'linkedin-sponsored-ad.html',
    'google-search': 'google-search-ad.html',
    'google-display': 'google-display-ad.html',
  };

  // Cache loaded templates
  const tplCache = {};
  function getAdTemplate(key) {
    if (!tplCache[key]) tplCache[key] = readFile(path.join(componentsDir, AD_COMPONENTS[key]));
    return tplCache[key];
  }

  // INSERT marker map
  const INSERT_MAP = {
    'facebook-feed': 'facebook-feed-ad',
    'facebook-carousel': 'facebook-carousel-ad',
    'facebook-stories': 'facebook-stories-ad',
    'linkedin-feed': 'linkedin-sponsored-ad',
    'google-search': 'google-search-ad',
    'google-display': 'google-display-ad',
  };

  for (const ad of adsData.ads) {
    const key = `${ad.platform}-${ad.format}`;
    if (!AD_COMPONENTS[key]) continue;

    let tpl = getAdTemplate(key);
    let filled = '';

    if (key === 'facebook-feed') {
      filled = fillTokens(tpl, {
        ...pageTokens,
        PRIMARY_TEXT: ad.primary_text || '',
        IMAGE_URL: resolveImagePath(ad.image_url),
        DISPLAY_URL: ad.display_url || '',
        HEADLINE: ad.headline || '',
        DESCRIPTION: ad.description || '',
        CTA_TEXT: ad.cta_text || '',
        REACTION_COUNT: '34',
        COMMENT_COUNT: '8',
        SHARE_COUNT: '3',
      });
      filled = wrapComponent('facebook-feed-ad', 'Facebook Feed-annonse', filled);
    }

    else if (key === 'facebook-carousel') {
      // Fill header-level tokens
      filled = fillTokens(tpl, { ...pageTokens, PRIMARY_TEXT: ad.primary_text || '', REACTION_COUNT: '28', COMMENT_COUNT: '5', SHARE_COUNT: '2' });
      // Replace card placeholders — the template has 4 card slots
      const cards = ad.cards || [];
      // Extract one card block as a pattern
      const cardPattern = /<div class="fb-carousel-card">\s*<img class="fb-carousel-card-image"[^>]*>\s*<div class="fb-carousel-card-footer">[\s\S]*?<\/div>\s*<\/div>/;
      const cardBlocks = filled.match(new RegExp(cardPattern.source, 'g')) || [];
      if (cardBlocks.length > 0) {
        const templateCard = cardBlocks[0];
        const newCards = [];
        for (let i = 0; i < Math.max(cards.length, cardBlocks.length); i++) {
          const card = cards[Math.min(i, cards.length - 1)];
          newCards.push(fillTokens(templateCard, {
            CARD_IMAGE: resolveImagePath(card.image_url),
            CARD_HEADLINE: card.headline || '',
            CARD_DESCRIPTION: card.description || '',
            CARD_CTA: card.cta_text || '',
          }));
        }
        // Replace all card blocks with new ones
        let idx = 0;
        filled = filled.replace(new RegExp(cardPattern.source, 'g'), () => newCards[idx++] || '');
      }
      filled = wrapComponent('facebook-carousel-ad', 'Facebook Karusell-annonse', filled);
    }

    else if (key === 'facebook-stories') {
      filled = fillTokens(tpl, {
        ...pageTokens,
        IMAGE_URL: resolveImagePath(ad.image_url),
        OVERLAY_HEADLINE: ad.overlay_headline || '',
        OVERLAY_POSITION: ad.overlay_position || 'center',
        CTA_TEXT: ad.cta_text || '',
      });
      // Fix min-height: 100vh to auto so it doesn't break layout
      filled = filled.replace('min-height: 100vh', 'min-height: auto');
      filled = wrapComponent('facebook-stories-ad', 'Facebook Stories-annonse', filled);
    }

    else if (key === 'linkedin-feed') {
      filled = fillTokens(tpl, {
        ...pageTokens,
        PRIMARY_TEXT: ad.primary_text || '',
        IMAGE_URL: resolveImagePath(ad.image_url),
        HEADLINE: ad.headline || '',
        DISPLAY_URL: ad.display_url || '',
        CTA_TEXT: ad.cta_text || '',
        REACTION_COUNT: '52',
        COMMENT_COUNT: '14',
        SHARE_COUNT: '7',
      });
      // LinkedIn sponsored template already has its own component-card wrapper — don't double-wrap
    }

    else if (key === 'google-search') {
      const headlines = (ad.headlines || []).join(' | ');
      const descriptions = (ad.descriptions || []).join(' ');
      const paths = (ad.paths || []).join(' › ');
      const sitelinksHtml = (ad.sitelinks || []).map(sl =>
        `<div class="gs-ad-sitelink"><a class="gs-ad-sitelink-title" href="#">${sl.headline}</a><div class="gs-ad-sitelink-desc">${sl.description}</div></div>`
      ).join('\n');

      filled = fillTokens(tpl, {
        DISPLAY_URL: ad.display_url || '',
        PATHS: paths,
        HEADLINES: headlines,
        DESCRIPTIONS: descriptions,
        SITELINKS: sitelinksHtml,
      });
      filled = wrapComponent('google-search-ad', 'Google Search-annonse', filled);
    }

    else if (key === 'google-display') {
      filled = fillTokens(tpl, {
        BACKGROUND_COLOR: ad.background_color || '#333',
        IMAGE_URL: resolveImagePath(ad.image_url),
        LOGO_URL: ad.logo_url || '',
        HEADLINE: ad.headline || '',
        DESCRIPTION: ad.description || '',
        CTA_TEXT: ad.cta_text || '',
        CTA_COLOR: ad.cta_color || '#4285F4',
      });
      filled = wrapComponent('google-display-ad', 'Google Display-annonse', filled);
    }

    insertInto(INSERT_MAP[key], filled);
  }
}
```

**Step 2: Commit**

```bash
git add scripts/export.js
git commit -m "feat(export): paid ad assemblers (6 formats)"
```

---

### Task 7: Build email assemblers (newsletter, email-sequence)

**Files:**
- Modify: `scripts/export.js`

**Step 1: Newsletter assembler**

```js
// ── Newsletter ───────────────────────────────────────
if (found.newsletter) {
  let tpl = readFile(path.join(componentsDir, 'newsletter-preview.html'));
  const { meta, body } = parseFrontmatter(readFile(found.newsletter));

  // Remove header image tag if no headerImage
  if (!meta.headerImage) {
    tpl = tpl.replace(/<img class="email-header-image"[^>]*>/, '');
  }

  const filled = fillTokens(tpl, {
    SENDER_NAME: profile.name,
    SUBJECT: meta.subject || '',
    PREHEADER: meta.preheader || '',
    DATE: meta.date || campaignDate,
    HEADER_IMAGE: meta.headerImage ? resolveImagePath(meta.headerImage) : '',
    EMAIL_HTML: md(body),
    CTA_URL: '#',
    CTA_TEXT: 'Les hele artikkelen',
  });
  insertInto('newsletter', wrapComponent('newsletter', 'Nyhetsbrev', filled));
}
```

**Step 2: Email sequence assembler**

This is the trickiest part. The template has 4 fixed email nodes. We need to extract one node as a repeatable pattern and generate N nodes from the campaign data.

```js
// ── Email sequence ───────────────────────────────────
if (found.emailSequence) {
  const tpl = readFile(path.join(componentsDir, 'email-sequence.html'));
  const { meta, body } = parseFrontmatter(readFile(found.emailSequence));

  // Parse individual emails from body
  // Format: ### E-post N\n**Delay:** ...\n**Subject:** ...\n**Preheader:** ...\n\nbody...\n---
  const emailBlocks = body.split(/(?=###\s+E-post\s+\d+)/i).filter(b => b.trim());
  const emails = emailBlocks.map((block, idx) => {
    const delayMatch = block.match(/\*\*Delay:\*\*\s*(.+)/);
    const subjectMatch = block.match(/\*\*Subject:\*\*\s*(.+)/);
    const preheaderMatch = block.match(/\*\*Preheader:\*\*\s*(.+)/);
    // Body is everything after the preheader line
    const bodyStart = block.indexOf(preheaderMatch ? preheaderMatch[0] : '');
    const emailBody = bodyStart >= 0
      ? block.slice(bodyStart + (preheaderMatch ? preheaderMatch[0].length : 0)).replace(/^---\s*$/gm, '').trim()
      : '';
    return {
      number: idx + 1,
      delay: delayMatch ? delayMatch[1].trim() : '',
      subject: subjectMatch ? subjectMatch[1].trim() : '',
      preheader: preheaderMatch ? preheaderMatch[1].trim() : '',
      bodyHtml: md(emailBody),
    };
  });

  // Build summary table
  const tableRows = emails.map(e =>
    `<tr><td>${e.number}</td><td>${e.delay}</td><td>${e.subject}</td></tr>`
  ).join('\n');
  const tableHtml = `<table class="seq-table"><thead><tr><th>#</th><th>Delay</th><th>Emnelinje</th></tr></thead><tbody>${tableRows}</tbody></table>`;

  // Extract one email node pattern from the template
  const nodePattern = /<!-- =+ EMAIL NODE \d+ =+ -->\s*(<div style="position:relative;padding-bottom:(?:32px|0);">[\s\S]*?<\/details>\s*<\/div>\s*<\/div>\s*<\/div>)/g;
  const nodeMatches = [...tpl.matchAll(nodePattern)];

  if (nodeMatches.length > 0) {
    // Use first node as template pattern
    const nodeTemplate = nodeMatches[0][1];
    // Build all email nodes
    const nodesHtml = emails.map((e, i) => {
      const paddingBottom = i < emails.length - 1 ? '32px' : '0';
      let node = nodeTemplate.replace(/padding-bottom:\s*(?:32px|0)/, `padding-bottom:${paddingBottom}`);
      return fillTokens(node, {
        EMAIL_NUMBER: String(e.number),
        DELAY: e.delay,
        SUBJECT: e.subject,
        PREHEADER: e.preheader,
        EMAIL_BODY_HTML: e.bodyHtml,
      });
    }).join('\n\n');

    // Replace all existing nodes in the template with our generated ones
    let seqHtml = tpl;
    // Remove all email nodes
    const allNodesRegex = /<!-- =+ EMAIL NODE \d+ =+ -->\s*<div style="position:relative;padding-bottom:(?:32px|0);">[\s\S]*?<\/details>\s*<\/div>\s*<\/div>\s*<\/div>/g;
    seqHtml = seqHtml.replace(allNodesRegex, '');
    // Insert our nodes before the closing </div> of the timeline container
    const timelineClose = seqHtml.lastIndexOf('</div>');
    const beforeTimeline = seqHtml.lastIndexOf('</div>', timelineClose - 1);
    // Find the timeline div and insert nodes inside it
    seqHtml = seqHtml.replace(
      /(<!-- =+ TIMELINE =+ -->[\s\S]*?<!-- Vertical connecting line -->[\s\S]*?<\/div>)\s*/,
      `$1\n\n${nodesHtml}\n\n`
    );

    seqHtml = fillTokens(seqHtml, {
      SEQUENCE_NAME: meta.sequence_name || '',
      SEQUENCE_TYPE: meta.type || '',
      TRIGGER: meta.trigger || '',
      TOTAL_EMAILS: String(meta.emails || emails.length),
      SEQUENCE_TABLE_HTML: tableHtml,
    });

    insertInto('email-sequence', wrapComponent('email-sequence', 'E-postsekvens', seqHtml));
  }
}
```

**Step 3: Commit**

```bash
git add scripts/export.js
git commit -m "feat(export): email assemblers (newsletter + email-sequence)"
```

---

### Task 8: Add cleanup, file output, and JSON summary

**Files:**
- Modify: `scripts/export.js`

**Step 1: Clean up unfilled markers and empty sections**

```js
// ── Cleanup ──────────────────────────────────────────
// Remove unfilled INSERT markers
html = html.replace(/\s*<!-- INSERT:\S+ -->\s*/g, '\n');

// Remove empty category sections (sections that only have the header, no component-cards)
const sectionIds = ['organic', 'paid', 'email'];
for (const id of sectionIds) {
  const sectionRegex = new RegExp(
    `<section id="${id}" class="category-section">[\\s\\S]*?<\\/section>`,
    'g'
  );
  html = html.replace(sectionRegex, (match) => {
    // If the section contains no component-card divs, remove it
    if (!match.includes('component-card')) return '';
    return match;
  });

  // Remove corresponding nav links if section was removed
  if (!html.includes(`id="${id}"`)) {
    // Remove the nav-group for this category
    const navGroupRegex = new RegExp(
      `<div class="nav-group">[\\s\\S]*?${id}[\\s\\S]*?<\\/div>\\s*<\\/div>`,
      'g'
    );
    html = html.replace(navGroupRegex, '');
  }
}

// Remove nav links pointing to non-existent component IDs
html = html.replace(/<li><a href="#([^"]+)"[^>]*>[^<]*<\/a><\/li>/g, (match, id) => {
  // Keep the link only if the target ID exists in the HTML
  if (html.includes(`id="${id}"`)) return match;
  return '';
});
```

**Step 2: Write output file and print summary**

```js
// ── Write output ─────────────────────────────────────
fs.mkdirSync(exportsDir, { recursive: true });
fs.writeFileSync(outputFile, html, 'utf-8');

// ── Summary ──────────────────────────────────────────
const summary = {
  output: outputFile,
  client: profile.name,
  campaign: campaignTitle,
  date: campaignDate,
  contentTypes: contentTypes,
  totalTypes: contentTypes.length,
};

console.log(JSON.stringify(summary, null, 2));
```

**Step 3: Run the full export**

Run: `cd /Users/thomasnesmyhre/claude-skills/claude-plugins/c-marketing && node scripts/export.js clients/nordlys-teknologi/campaigns/2026-02-25-smartere-arbeidsflyt`
Expected: JSON summary printed, HTML file written to `exports/nordlys-teknologi-smartere-arbeidsflyt.html`

**Step 4: Verify output**

Run: `grep -c '{{' exports/nordlys-teknologi-smartere-arbeidsflyt.html`
Expected: 0

Run: `grep -c '<!-- INSERT:' exports/nordlys-teknologi-smartere-arbeidsflyt.html`
Expected: 0

Run: `open exports/nordlys-teknologi-smartere-arbeidsflyt.html` (or inspect visually)

**Step 5: Commit**

```bash
git add scripts/export.js
git commit -m "feat(export): cleanup, file output, and JSON summary"
```

---

### Task 9: Update the export command to delegate to the script

**Files:**
- Modify: `commands/export.md`

**Step 1: Replace the export command**

Overwrite `commands/export.md` with a simplified version:

```markdown
---
description: Export a campaign as a self-contained HTML file for review and sharing
argument-hint: "<campaign-dir>"
---

# /export — $ARGUMENTS

Eksporterer en kampanje til en selvforsynt HTML-fil med plattformtro forhåndsvisninger av alt innhold.

## Language

**Bokmål** by default. English only if explicitly requested.

## Workflow

### Fase 1 — Finn kampanje

- Hvis `$ARGUMENTS` er oppgitt: bruk den som kampanjesti (relativ til plugin-roten)
- Hvis ikke: finn den nyeste kampanjemappen i `clients/*/campaigns/` (sorter etter dato i mappenavnet)
- Bekreft at mappen finnes og inneholder minst én kampanjefil

Les `clients/<slug>/profile.md` hvis den finnes — brukes for klientnavn, avsendernavn og profilbilder.

### Fase 2 — Kjør eksportskriptet

Kjør:

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/export.js <campaign-dir>
```

Hvor `<campaign-dir>` er den fulle stien til kampanjemappen.

Skriptet:
1. Leser klientprofil, scaffold, komponentmaler og kampanjefiler
2. Konverterer markdown til HTML og fyller inn alle plassholdere
3. Fjerner tomme seksjoner og ubrukte navigasjonslenker
4. Skriver ferdig HTML til `exports/<klient>-<kampanje>.html`
5. Skriver JSON-sammendrag til stdout

### Fase 3 — Bekreft

Les JSON-utskriften fra skriptet og rapporter:

```
Eksport ferdig!

HTML: exports/<filnavn>.html

Innhold:
- [liste over innholdstyper fra JSON]
```

## Regler

- Filen skal være 100% selvforsynt — ingen eksterne CSS, JS, eller fonter
- Ikke endre kildefilene — kun les og eksporter
- Hvis skriptet feiler (exit-kode ≠ 0): les feilmeldingen og hjelp brukeren
```

**Step 2: Commit**

```bash
git add commands/export.md
git commit -m "feat(export): simplify command to delegate to Node.js script"
```

---

### Task 10: End-to-end test and timing verification

**Files:**
- No new files

**Step 1: Time the script execution**

Run: `cd /Users/thomasnesmyhre/claude-skills/claude-plugins/c-marketing && time node scripts/export.js clients/nordlys-teknologi/campaigns/2026-02-25-smartere-arbeidsflyt`
Expected: Under 1 second, JSON summary printed

**Step 2: Verify HTML output quality**

Run: `wc -l exports/nordlys-teknologi-smartere-arbeidsflyt.html` — should be 2000+ lines
Run: `grep -c '{{' exports/nordlys-teknologi-smartere-arbeidsflyt.html` — should be 0
Run: `grep -c '<!-- INSERT:' exports/nordlys-teknologi-smartere-arbeidsflyt.html` — should be 0
Run: `grep -c 'component-card' exports/nordlys-teknologi-smartere-arbeidsflyt.html` — should be 11
Run: `grep -c 'images/' exports/nordlys-teknologi-smartere-arbeidsflyt.html` — should be 11+

**Step 3: Open in browser and verify visually**

Run: `open exports/nordlys-teknologi-smartere-arbeidsflyt.html`
Verify: All sections render, images load, navigation works, no broken layouts.

**Step 4: Fix any issues found during testing**

Debug cycle: fix → re-run script → verify → repeat until all checks pass.

**Step 5: Final commit**

```bash
git add -A
git commit -m "test: verify export script end-to-end with Nordlys campaign"
```
