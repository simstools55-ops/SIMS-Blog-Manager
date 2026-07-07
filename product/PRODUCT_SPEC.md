# SIMS-Blog-Manager Product 3.2 Specification

## Purpose

Google Search Console データから、毎日改善すべきブログ記事と改善材料を提示する。

## In Scope

- Search Console integration
- Checklist setup UX
- Article cards
- Article diagnosis
- Opportunity Score
- Today's improvement brief
- Improvement log
- 14-day / 30-day measurement base

## Out of Scope

- Claude integration
- AI Exchange
- Knowledge Engine
- Learning Engine
- Publishing Engine

## Daily Flow

```text
Open spreadsheet
↓
If setup complete and not fetched today, ask user whether to fetch GSC data
↓
Fetch Search Console data
↓
Analyze articles and queries
↓
Build Today's Improvement
↓
User improves selected article
↓
User records completion
↓
Effectiveness is measured later
```

## Setup Flow

Product 3.2 does not use a continuous wizard. It uses a checklist because Apps Script cannot safely continue a wizard after opening an external Google Cloud URL.

1. Blog information input
2. Google Cloud API guide
3. Search Console connection test
4. First data fetch and analysis
