CRITICAL REQUIREMENT:

This is an existing production application.

Do NOT modify:
- /demo
- /demo?client=*
- Existing API endpoints
- Existing pages
- Existing navigation logic

The blog must be implemented as an additive feature only.

Create new routes exclusively under:

/blog
/blog/[slug]
/blog/category/[slug]
/blog/tag/[slug]

No existing routes should be changed or removed.

The implementation must be backward compatible and preserve all current functionality.

go through the website www.smartvoiceai.in and prepare the project structure by adding the blog page below is the detailed prompt 

# Project
Build a production-grade, SEO-friendly, AI-powered blog system for:

https://smarvoiceai.in

The website is already deployed on Netlify:
https://smartvoiceai.netlify.app

The blog should be integrated into the existing website.

---

# Objectives

Create:

1. Blog Listing Page
2. Dynamic Blog Post Pages
3. Markdown-based CMS
4. Category Pages
5. Tag Pages
6. Search
7. RSS Feed
8. Sitemap
9. SEO Metadata
10. OpenGraph Images
11. Reading Time
12. Related Articles
13. Newsletter Form
14. Pagination
15. Syntax Highlighting
16. Dark Mode
17. Responsive Design
18. Automatic deployment via GitHub + Netlify

The system must support future AI auto-publishing pipelines.

---

# Tech Stack

Framework:
Next.js 15 (App Router)

Language:
TypeScript

Styling:
Tailwind CSS

Content:
Markdown (.md)

Markdown Parser:
gray-matter
remark
rehype

SEO:
next-seo
next-sitemap

Search:
Fuse.js

RSS:
rss package

Deployment:
Netlify

Version Control:
GitHub

---

# Directory Structure

app/
├── page.tsx
├── blog/
│   ├── page.tsx
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── tag/
│   │   └── [slug]/
│   │       └── page.tsx
│   └── [slug]/
│       └── page.tsx

components/
├── BlogCard.tsx
├── BlogHero.tsx
├── SearchBar.tsx
├── CategoryPills.tsx
├── RelatedPosts.tsx
├── Newsletter.tsx
├── ReadingProgress.tsx
├── ShareButtons.tsx

content/
├── ai-voice-agents/
├── tutorials/
├── case-studies/
├── product-updates/

lib/
├── posts.ts
├── seo.ts
├── rss.ts
├── sitemap.ts
├── search.ts

public/
├── images/
├── og/
├── robots.txt

---

# Blog Frontmatter

Every markdown file must support:

---
title:
description:
date:
updatedDate:
author:
category:
tags:
image:
featured:
draft:
---

Example:

---
title: How AI Voice Agents Are Transforming Customer Support
description: Complete guide to AI Voice Agents
date: 2026-07-10
author: Smart Voice AI
category: AI Voice Agents
tags:
  - AI
  - Voice Agent
  - Automation
image: /images/voice-agents.jpg
featured: true
draft: false
---

# Introduction

Article content.

---

# URL Structure

Homepage:

/

Blog:

/blog

Categories:

/blog/category/ai-voice-agents

/blog/category/tutorials

Tags:

/blog/tag/automation

Post:

/blog/how-ai-voice-agents-are-transforming-customer-support

---

# Blog Listing Requirements

Display:

Featured Image
Title
Description
Published Date
Reading Time
Category
Tags
Author
View Count Placeholder
Share Buttons

Cards should be responsive.

---

# Blog Details Page

Show:

Hero Image
Title
Description
Date
Reading Time
Author
Table of Contents
Progress Bar
Social Sharing
Previous Article
Next Article
Related Articles
Newsletter Signup

---

# Search

Implement client-side search using Fuse.js.

Search by:

Title
Description
Content
Tags
Category

---

# SEO Requirements

Generate:

Title
Meta Description
Canonical URL
OpenGraph Tags
Twitter Cards
Structured Data
Breadcrumb Schema
Article Schema

Generate sitemap.xml automatically.

Generate RSS feed automatically.

Generate robots.txt automatically.

---

# Performance

Lighthouse goals:

Performance > 95
Accessibility > 95
Best Practices > 95
SEO > 95

---

# Styling

Design language:

Minimal
Professional
Modern SaaS

Colors:

Use existing SmartVoiceAI brand colors.

Animations:

Subtle fade
Hover effects
No heavy animations.

---

# Newsletter

Create reusable newsletter component.

API endpoint:

/api/newsletter

Implementation placeholder only.

---

# Future AI Auto Publishing Requirements

The system must support adding articles by simply creating:

content/my-new-article.md

After deployment, article automatically appears:

/blog/my-new-article

No database required.

No CMS required.

Everything should be Git-based.

---

# Create Sample Content

Generate:

1. How AI Voice Agents Work
2. AI Call Center Automation Guide
3. Building a WhatsApp AI Assistant
4. AI Appointment Booking System
5. Future of Conversational AI

Generate complete markdown articles with images and metadata.

---

# Deliverables

Generate:

Complete Next.js project
All pages
Components
Markdown engine
SEO system
Search system
RSS generation
Sitemap generation
Responsive design
Netlify configuration
README
Deployment instructions