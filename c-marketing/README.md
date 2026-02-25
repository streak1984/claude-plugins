# c-marketing

Content marketing plugin for Claude Code and Cowork. Campaigns, articles, ads, social media, newsletters, and more — all in Norwegian Bokmål by default.

Designed for teams and agencies. Install the plugin, run `/c-marketing:onboarding`, and start producing campaigns.

## Installation

**Development / testing:**

```bash
claude --plugin-dir ./c-marketing
```

**Via marketplace:**

```bash
claude plugin marketplace add <org>/c-marketing
claude plugin install c-marketing
```

## Commands

| Command | Description |
|---------|-------------|
| `/onboarding` | Set up your marketing workspace — create client directories, configure API keys |
| `/profile` | Generate a client profile from web sources |
| `/campaign` | Full campaign — brief, research, parallel content production, images, export |
| `/brief` | Turn a rough idea into a structured brief |
| `/research` | Deep topic research — web search, structured findings |
| `/article` | Long-form article or blog post with SEO |
| `/newsletter` | Newsletter issue — subject line, preheader, body, CTA |
| `/linkedin` | Organic LinkedIn post — algorithm-optimized |
| `/social` | Multi-platform social posts (LinkedIn, Instagram, Facebook, X) |
| `/ad` | Paid ad campaigns for Facebook, LinkedIn, Google — JSON output |
| `/email-sequence` | Multi-email drip campaigns |
| `/gap` | Competitor gap analysis |
| `/cro` | Conversion rate optimization analysis |
| `/audit` | Analytics/tracking audit (GA4, GTM, SEO) |
| `/review` | Content quality review before publication |
| `/export` | Export campaign as self-contained HTML for sharing |

## Getting Started

```
/c-marketing:onboarding
```

The onboarding command walks you through:
1. Creating your first client directory
2. Generating a client profile from their website
3. Setting up the Pexels API key for stock images

After onboarding, run your first campaign:

```
/c-marketing:campaign "smartlading for elbiler"
```

## Prerequisites

- **Pexels API key** for stock images. Get one free at [pexels.com/api](https://www.pexels.com/api/). The `/onboarding` command will ask for the key and save it to `.c-marketing.json`.

## Workspace Layout

Created by `/onboarding`:

```
clients/
└── <client-slug>/
    ├── profile.md              # Client identity, tone, audience
    ├── campaigns/
    │   └── YYYY-MM-DD-<topic>/
    │       ├── brief.md
    │       ├── article.md
    │       ├── newsletter.md
    │       ├── linkedin.md
    │       ├── social.md
    │       ├── ads.json
    │       ├── email-sequence.md
    │       ├── research.md
    │       ├── images/
    │       └── campaign-summary.md
    ├── research/               # Reusable research across campaigns
    └── templates/              # Client-specific template overrides
exports/                        # Self-contained HTML exports
```

## Language

Norwegian Bokmål by default. English only when explicitly requested.

## Based on

Adapted from [c-marketing](https://github.com/streak1984/c-marketing) — a portable Claude Code workspace for content marketing.
