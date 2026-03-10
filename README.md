# soneBlog Theme

A minimalist, monospace Hugo theme. Zero frameworks, pure CSS, HSL color system.

**Demo**: [s1.work](https://s1.work/)

![soneBlog Theme](https://img.shields.io/badge/Hugo-0.120+-ff4088?logo=hugo) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## Features

- **HSL 3-Variable Color System** — Change 3 CSS variables to control the entire palette (light & dark)
- **Dark Mode** — Auto-detects system preference, smooth transition, localStorage persistence
- **Mouse Ripple Effect** — Subtle expanding wave rings follow cursor movement (desktop only)
- **Code Copy Button** — One-click copy with language label and visual feedback
- **Reading Progress Bar** — Fixed top progress indicator for articles
- **Back to Top** — Appears on scroll, smooth scroll back
- **Collapsible TOC** — Table of contents with `<details>` toggle
- **Featured Hero Card** — Latest post as large card on homepage
- **Compact Post Cards** — Thumbnail + metadata + excerpt layout
- **Breadcrumb Navigation** — With JSON-LD structured data
- **SEO Optimized** — Open Graph, Twitter Cards, JSON-LD (BlogPosting, BreadcrumbList, CollectionPage)
- **AI Crawler Blocking** — robots.txt blocks 30+ AI bots
- **Baidu SEO** — Dedicated Baidu sitemap
- **Responsive** — Mobile-first, works on all devices
- **CJK Ready** — `hasCJKLanguage: true`, optimized for Chinese content
- **Pure CSS Animations** — fadeInUp, hover transitions, staggered delays, 60fps
- **Fuse.js Search** — Client-side full-text search
- **Zero Dependencies** — No Tailwind, no Bootstrap, no JS frameworks

## Quick Start

### As Hugo Module (recommended)

```bash
hugo mod init your-site
```

Add to `hugo.yaml`:

```yaml
module:
  imports:
    - path: github.com/upgiorgio/soneblog-theme
```

### As Git Submodule

```bash
git submodule add https://github.com/upgiorgio/soneblog-theme.git themes/soneblog
```

Add to `hugo.yaml`:

```yaml
theme: soneblog
```

### As Direct Download

Download and extract to `themes/soneblog/`.

## Configuration

Minimal `hugo.yaml`:

```yaml
baseURL: "https://your-site.com/"
languageCode: "zh-CN"
title: "Your Blog"
paginate: 10
hasCJKLanguage: true

params:
  description: "Your blog description"
  author: "Your Name"

taxonomies:
  category: categories
  tag: tags

menu:
  main:
    - name: "首页"
      url: /
      weight: 1
    - name: "分类"
      url: /categories/
      weight: 2
    - name: "标签"
      url: /tags/
      weight: 3
    - name: "搜索"
      url: /search/
      weight: 4

markup:
  goldmark:
    renderer:
      unsafe: true
  highlight:
    noClasses: false
    lineNos: true
    lineNumbersInTable: true
  tableOfContents:
    startLevel: 2
    endLevel: 4

outputs:
  home:
    - HTML
    - RSS
    - JSON
```

## Color Customization

The entire color scheme is controlled by 3 HSL variables in `assets/css/main.css`:

```css
:root {
  --bg-h: 0;      /* Hue (0-360) */
  --bg-s: 0%;     /* Saturation */
  --bg-l: 99%;    /* Lightness — light mode */
}

.dark {
  --bg-l: 12%;    /* Lightness — dark mode */
}
```

All other colors (text, borders, shadows, selections) are **automatically derived**. Change these 3 values and everything adapts.

Examples:
- Warm paper: `--bg-h: 40; --bg-s: 20%; --bg-l: 97%`
- Cool blue tint: `--bg-h: 210; --bg-s: 15%; --bg-l: 98%`
- Pure white: `--bg-h: 0; --bg-s: 0%; --bg-l: 100%`

## Article Frontmatter

```yaml
---
title: "Article Title"
date: 2026-01-01T12:00:00+08:00
slug: "article-slug"
description: "SEO description"
cover: "/images/covers/my-cover.jpg"
categories:
  - "Category"
tags:
  - "tag1"
  - "tag2"
keywords:
  - "keyword1"
---
```

## File Structure

```
soneblog-theme/
├── archetypes/posts.md          # Article template
├── assets/
│   ├── css/main.css             # All styles (~1700 lines)
│   └── js/
│       ├── theme.js             # Dark mode toggle
│       ├── code-copy.js         # Code copy + back-to-top + reading progress
│       ├── search.js            # Fuse.js search
│       └── ripple.js            # Mouse ripple effect
├── layouts/
│   ├── _default/
│   │   ├── baseof.html          # Base template
│   │   ├── single.html          # Article page
│   │   ├── list.html            # List page
│   │   ├── search.html          # Search page
│   │   └── terms.html           # Taxonomy page
│   ├── partials/
│   │   ├── head.html            # SEO meta + JSON-LD
│   │   ├── header.html          # Sticky header
│   │   ├── footer.html          # Footer
│   │   ├── breadcrumb.html      # Breadcrumb + JSON-LD
│   │   └── toc.html             # Table of contents
│   ├── index.html               # Homepage
│   ├── 404.html                 # 404 page with ASCII art
│   └── page/single.html         # Static pages
├── static/fonts/                # JetBrains Mono WOFF2
├── theme.toml                   # Theme metadata
└── LICENSE                      # MIT
```

## Credits

- Font: [JetBrains Mono](https://www.jetbrains.com/lp/mono/) (SIL Open Font License)
- Search: [Fuse.js](https://fusejs.io/) (Apache 2.0)
- Built with [Hugo](https://gohugo.io/)

## License

MIT License. See [LICENSE](LICENSE).
