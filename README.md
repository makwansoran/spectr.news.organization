# Spectr

A full-stack news application with a Bloomberg-inspired design: clean typography, high-contrast layouts (black, white, Bloomberg blue `#0000ff`), and a dense, data-driven information hierarchy.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend / DB:** Supabase (PostgreSQL) for articles
- **Fonts:** Public Sans (primary)
- **State / CMS:** Editor's Desk (admin) for posting; optional Contentful later

## File Directory Structure

```
Spectr/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, Market Ticker, Header, Ad leaderboard
│   │   ├── page.tsx             # Homepage (bento grid, top stories, categories)
│   │   ├── globals.css          # Bloomberg-style CSS variables
│   │   ├── news/
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # Dynamic article page
│   │   ├── politics/page.tsx    # Politics category
│   │   ├── finance/page.tsx     # Finance category
│   │   ├── economy/page.tsx     # Economy category
│   │   ├── companies/page.tsx   # Companies category
│   │   ├── subscribe/page.tsx   # Tiered pricing + paywall mockup
│   │   ├── admin/page.tsx       # Editor's Desk (post news)
│   │   └── api/
│   │       └── articles/
│   │           ├── route.ts     # GET articles
│   │           └── post/
│   │               └── route.ts # POST new article (admin)
│   ├── components/
│   │   ├── AdSlot.tsx           # AdSense placeholders (leaderboard, sidebar, mid-article)
│   │   ├── MarketTicker.tsx     # Simulated market ticker
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ArticleCard.tsx
│   │   ├── BreakingTicker.tsx
│   │   └── ShareButtons.tsx
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client
│   │   ├── articles.ts          # Fetch articles by category/slug/related
│   │   └── mock-articles.ts     # Fallback when DB not configured
│   └── types/
│       ├── database.ts          # Article, Category, Database types
│       └── index.ts
├── supabase/
│   └── migrations/
│       └── 001_articles.sql     # Articles table + RLS
├── tailwind.config.ts           # Bloomberg blue, globalist colors, fonts
├── next.config.js
├── package.json
├── .env.example
└── README.md
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage – Top Stories, Breaking ticker, Politics / Finance / Economy / Companies |
| `/news/[slug]` | Article page – reading view, related stories, share, AdSense mid-article & sidebar |
| `/politics` | Politics category |
| `/finance` | Finance category |
| `/economy` | Economy category |
| `/companies` | Companies category |
| `/subscribe` | Tiered pricing (Monthly, Yearly, Corporate) + paywall logic mockup |
| `/admin` | Editor's Desk – post articles (title, category, image, rich text body) |

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Supabase (database)**
   - Create a project at [supabase.com](https://supabase.com).
   - In SQL Editor, run `supabase/migrations/001_articles.sql`.
   - Copy `.env.example` to `.env.local` and set:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (for admin POST only)

3. **Run locally**
   ```bash
   npm run dev
   ```
   Without Supabase env vars, the app uses mock articles so you can still browse.

4. **AdSense**
   - Get approved (typically 15–20 quality articles).
   - Add `NEXT_PUBLIC_ADSENSE_CLIENT_ID` to `.env.local`.
   - In `src/components/AdSlot.tsx`, the component already uses this for real ads when set.

5. **Subscription / Paywall**
   - Use **Stripe** for payments. Gate `is_premium` articles by checking a logged-in user's subscription (e.g. Stripe Customer/Subscription) and show full content or a “Subscribe to read” CTA.

## Design

- **Colors:** Black `#000000`, white `#ffffff`, Bloomberg blue `#0000ff` (see `tailwind.config.ts` and `globals.css`).
- **Font:** Public Sans (with Roboto fallback).
- **Layout:** Bento-style grid on homepage; dense, data-driven hierarchy; mobile-responsive.

## AdSense Placements

- **Top Header Leaderboard:** In `layout.tsx` (below header).
- **Sidebar:** Article page and category pages (`AdSlot` format `sidebar`).
- **Mid-Article:** Article page (`AdSlot` format `mid-article`).

Paste your Google Client ID in env and in the AdSlot component once approved.
