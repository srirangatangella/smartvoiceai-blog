# Smart Voice AI App & Blog System

A production-grade, SEO-friendly, AI-powered blog and interactive voice demo system integrated into the Next.js 15 App Router website for [Smart Voice AI](https://smarvoiceai.in).

## Features

1. **Modern Migrated Landing Page**: The main homepage at `/` matches the original landing page with 100% design fidelity, custom styling, and lead intake hook.
2. **Interactive Vapi AI Demo Page**: Ported the dynamic call experience at `/demo` using the Vapi HTML SDK. Supports client switching (My Home Apas, ASBL Loft), active calling statuses, pulsing audio waves, and custom voice-triggered floor plan overlays.
3. **Git-Based Markdown CMS**: Add articles by adding a `.md` file to the `content/` folders. It parses metadata automatically (title, author, image, featured status).
4. **Markdown Rendering & Syntax Highlighting**: Translates markdown posts to HTML and applies code block styling utilizing `remark`, `rehype`, and `rehype-highlight`.
5. **Search**: Client-side search bar powered by `Fuse.js` for scanning titles, tags, and descriptions.
6. **SEO & Structured Data**: Native dynamic sitemaps, robots configuration, and structured `JSON-LD` schemas for Google Search crawlers.
7. **RSS Feed**: Auto-generated feed conforming to XML specifications at `/blog/rss.xml`.
8. **Reading Progress & TOC**: Page scroll percentage display and clickable Table of Contents anchor list dynamically parsed from content.

---

## Directory Structure

```
smartvoiceai-blog/
├── app/
│   ├── page.tsx             # Migrated homepage
│   ├── layout.tsx           # Global fonts and SEO
│   ├── globals.css          # Theme variables & syntax styles
│   ├── sitemap.ts           # Dynamic XML sitemap
│   ├── robots.ts            # Dynamic robots configuration
│   ├── demo/
│   │   └── page.tsx         # Vapi calling page
│   └── blog/
│       ├── page.tsx         # Blog listing dashboard
│       ├── rss.xml/
│       │   └── route.ts     # XML RSS feed route
│       ├── [slug]/
│       │   └── page.tsx     # Dynamic article reader
│       ├── category/
│       │   └── [slug]/
│       │       └── page.tsx # Category filter list
│       └── tag/
│           └── [slug]/
│               └── page.tsx # Tag filter list
├── components/              # Shared UI components
│   ├── BlogCard.tsx
│   ├── BlogHero.tsx
│   ├── SearchBar.tsx
│   ├── CategoryPills.tsx
│   ├── RelatedPosts.tsx
│   ├── Newsletter.tsx
│   ├── ReadingProgress.tsx
│   └── ShareButtons.tsx
├── content/                 # Git-based articles divided by folder
│   ├── ai-voice-agents/
│   ├── tutorials/
│   └── case-studies/
└── lib/
    ├── posts.ts             # Markdown query service
    └── clients.ts           # Vapi assistant profiles
```

---

## Local Development

Install dependencies:
```bash
npm install
```

Start the local server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

Build the application for production:
```bash
npm run build
```

---

## Publishing New Articles

To publish a new blog post, create a markdown file under `content/` (e.g. `content/tutorials/my-new-article.md`) with the following frontmatter metadata:

```yaml
---
title: How to Deploy Voice AI in Real Estate
description: A complete walkthrough of designing sales agents for property site visits.
date: 2026-07-10
author: Smart Voice AI
category: Tutorials
tags:
  - Real Estate
  - Voice Agents
  - Automation
image: /images/voice-agents.jpg
featured: false
draft: false
---

# Introduction

Your markdown content starts here...
```

Once committed to Git and pushed, the article will automatically appear at `/blog/how-to-deploy-voice-ai-in-real-estate` and register in `/blog`, search indices, the RSS feed, and the XML sitemap. No database or CMS admin dashboard is required.
