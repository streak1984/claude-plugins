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

// ── YAML frontmatter parser ─────────────────────────
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  let currentKey = null;

  for (const line of match[1].split('\n')) {
    // Top-level key: value
    const kvMatch = line.match(/^([\w][\w\-]*):\s*(.*)$/);
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
  const d = (typeof meta.defaults === 'object' && !Array.isArray(meta.defaults)) ? meta.defaults : {};
  profile.defaults = {
    page_name: d.page_name || meta.name || clientSlug,
    profile_image: d.profile_image || '',
    follower_count: d.follower_count || '',
    author_name: d.author_name || meta.sender_name || meta.name || clientSlug,
    author_headline: d.author_headline || '',
  };
}

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

// ── Read scaffold ────────────────────────────────────
let html = readFile(scaffoldPath);

// Count content types for badge
const contentTypes = [];
if (found.article) contentTypes.push('Artikkel');
if (found.linkedin) contentTypes.push('LinkedIn-innlegg');
if (found.social) contentTypes.push('Sosiale medier');
// Parse ads once — reused for both counting and assembly
const adsData = found.ads ? JSON.parse(readFile(found.ads)) : null;
if (adsData) {
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

  // TODO: Social image filenames are convention-based — campaigns should include these files
  const filled = fillTokens(tpl, {
    IG_USERNAME: username,
    IG_IMAGE: resolveImagePath('images/ig-team-digital.jpg'),
    IG_CAPTION: igCaption,
    IG_LIKE_COUNT: '89', // Placeholder metrics for visual preview
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

// ── Ads ──────────────────────────────────────────────
if (adsData) {
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
      // Replace card placeholders — the template has card slots
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

// ── Email sequence ───────────────────────────────────
if (found.emailSequence) {
  let seqHtml = readFile(path.join(componentsDir, 'email-sequence.html'));
  const { meta, body } = parseFrontmatter(readFile(found.emailSequence));

  // Parse individual emails from body
  // Format: ### E-post N\n**Delay:** ...\n**Subject:** ...\n**Preheader:** ...\n\nbody...\n---
  const emailBlocks = body.split(/(?=###\s+E-post\s+\d+)/i).filter(b => b.trim());
  const emails = emailBlocks.map((block, idx) => {
    const delayMatch = block.match(/\*\*Delay:\*\*\s*(.+)/);
    const subjectMatch = block.match(/\*\*Subject:\*\*\s*(.+)/);
    const preheaderMatch = block.match(/\*\*Preheader:\*\*\s*(.+)/);
    // Body is everything after the preheader line, strip trailing ---
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

  // Fill sequence header tokens
  seqHtml = fillTokens(seqHtml, {
    SEQUENCE_NAME: meta.sequence_name || '',
    SEQUENCE_TYPE: meta.type || '',
    TRIGGER: meta.trigger || '',
    TOTAL_EMAILS: String(meta.emails || emails.length),
    SEQUENCE_TABLE_HTML: tableHtml,
  });

  // Build email nodes dynamically (replacing the 4 hardcoded ones)
  // Node template - matches the structure in email-sequence.html
  const nodeTemplate = `    <!-- ========== EMAIL NODE {{EMAIL_NUMBER}} ========== -->
    <div style="position:relative;padding-bottom:{{PADDING}};">
      <div style="position:absolute;left:-60px;top:0;width:32px;height:32px;background:#7c3aed;color:#ffffff;border-radius:50%;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;z-index:1;">{{EMAIL_NUMBER}}</div>
      <div style="background:#ffffff;border:1px solid #e0e0e0;border-radius:8px;padding:16px;margin-left:4px;">
        <span style="background:#f0f0f0;color:#65676b;padding:2px 10px;border-radius:12px;font-size:12px;display:inline-block;">{{DELAY}}</span>
        <div style="margin-top:8px;font-size:15px;font-weight:600;color:#1a1a2e;">{{SUBJECT}}</div>
        <div style="margin-top:4px;font-size:13px;color:#65676b;">{{PREHEADER}}</div>
        <details style="margin-top:12px;">
          <summary>Vis innhold &#9662;</summary>
          <div class="email-body-content" style="padding:16px 0 0 0;border-top:1px solid #e8eaed;margin-top:12px;">
            {{EMAIL_BODY_HTML}}
          </div>
        </details>
      </div>
    </div>`;

  const nodesHtml = emails.map((e, i) => {
    return fillTokens(nodeTemplate, {
      PADDING: i < emails.length - 1 ? '32px' : '0',
      EMAIL_NUMBER: String(e.number),
      DELAY: e.delay,
      SUBJECT: e.subject,
      PREHEADER: e.preheader,
      EMAIL_BODY_HTML: e.bodyHtml,
    });
  }).join('\n\n');

  // Replace the original 4 nodes section with our generated nodes
  // Find the first node comment and remove everything from there to end of timeline
  const firstNodeIdx = seqHtml.indexOf('<!-- ========== EMAIL NODE 1');
  if (firstNodeIdx !== -1) {
    // Keep everything before the first node
    const beforeNodes = seqHtml.substring(0, firstNodeIdx);
    // The timeline ends with </div>\n</div> (timeline close + wrapper close)
    // Rebuild: our nodes + timeline close + wrapper close
    seqHtml = beforeNodes + nodesHtml + '\n\n  </div>\n</div>';
  }

  insertInto('email-sequence', wrapComponent('email-sequence', 'E-postsekvens', seqHtml));
}

// ── Cleanup ──────────────────────────────────────────
// Remove HTML comments containing unfilled tokens (template documentation)
html = html.replace(/<!--[\s\S]*?-->/g, (comment) => {
  return comment.includes('{{') ? '' : comment;
});

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
    if (!match.includes('component-card')) return '';
    return match;
  });

  // Remove corresponding nav links if section was removed
  if (!html.includes(`id="${id}"`)) {
    const navGroupRegex = new RegExp(
      `<div class="nav-group">[\\s\\S]*?${id}[\\s\\S]*?<\\/div>\\s*<\\/div>`,
      'g'
    );
    html = html.replace(navGroupRegex, '');
  }
}

// Remove nav links pointing to non-existent component IDs
html = html.replace(/<li><a href="#([^"]+)"[^>]*>[^<]*<\/a><\/li>/g, (match, id) => {
  if (html.includes(`id="${id}"`)) return match;
  return '';
});

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
