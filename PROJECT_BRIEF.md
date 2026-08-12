# KatoriCalorie — Project Brief for Antigravity

**Give this file to Antigravity first, before any task.** Save it in the repo root as `PROJECT_BRIEF.md` (or `AGENTS.md`) so it stays in context across sessions. Everything after it references this document.

---

## 1. Read this before touching any code

You are working on **katoricalorie.in**, a free Indian and Assamese food calorie tracker owned and directed by **Ridip Patowary**. The site is already built and live. Your job over the next several sessions is **not** to add features. It is to repair the site's technical foundation so Google can find it, then improve how it looks and reads.

### Current situation

The site has good content and a working interactive calculator, but it receives essentially zero organic traffic. A full audit found three root causes:

1. **Google cannot discover the site properly.** `robots.txt` is empty, `sitemap.xml` does not serve valid XML, and the site has never been submitted to Google Search Console.
2. **No page targets a real search query.** Titles are written in internal branding language ("Premium Regional & National Food Nutrition Platform") rather than what people type.
3. **The site is broadcasting unfinished-build signals.** Placeholder social links, placeholder ad boxes, duplicate URLs, broken images, and broken Markdown rendering are live in production.

### The strategy in one paragraph

We are not competing with HealthifyMe or MyFitnessPal for "calorie calculator." We are claiming a niche nobody has served: **calorie and nutrition data for Assamese and Northeast Indian food** — masor tenga, omita khar, til pitha, bora saul, joha rice, axone. Competition for these queries is close to zero. We win those first, build authority, then expand outward to pan-Indian terms. Every decision you make should be judged against that goal.

### Non-negotiable constraints

- **Do not change any existing URL** unless a task explicitly says to. URLs already known to Google must stay stable.
- **Do not add new features.** No new calculators, no accounts, no gamification. Repair and polish only.
- **Do not mass-generate new articles.** The site already reads as AI-produced; adding volume makes that worse. Google's 2026 scaled-content policies penalise exactly this pattern.
- **Every change must be verifiable.** After each batch, state what you changed and how to check it.
- **Ship in small batches** in the order below. Do not jump ahead.

---

## 2. The photo situation — read this, it affects several tasks

Ridip does not currently have original photographs of the dishes. This matters because Google's **Recipe rich results require a real image**, and image-less pages look unfinished.

**How we handle it:**

| Approach | Verdict |
|---|---|
| Generic stock "Indian curry" photos labelled as Masor Tenga | ❌ **No.** Deceptive, and a visitor from Assam will spot it instantly. Destroys trust with exactly the audience we want. |
| AI-generated food images | ❌ **No** for dish pages. AI renders Assamese dishes wrong, and presenting a fake image as the real dish in Recipe schema is a quality risk. |
| Wikimedia Commons photos | ⚠️ **Sparingly.** A few genuine Assamese dish photos exist there. Only use if the licence is CC BY or CC BY-SA, and only with visible attribution and a link to the source. Check each licence individually. |
| **Original designed graphics** | ✅ **Yes — this is the Phase 1 answer.** |
| Real photographs | ✅ **The Phase 3 answer.** Ridip will shoot them progressively. |

### The Phase 1 image system you will build

Instead of photos, build a **reusable SVG/CSS graphic system** so every dish page has original, honest, on-brand visual content from day one:

1. **Dish cards** — a stylised top-down katori (brass bowl) illustration, colour-coded by category (rice = warm cream, fish = pale blue-grey, greens = green, sweets = amber). Same shape, different fill and garnish marks per dish. One SVG component, parameterised.
2. **Nutrition rings** — a donut chart per dish showing protein / carbs / fat split, with the calorie number in the centre. Generated from the nutrition data already in the page.
3. **Katori scale graphic** — three bowls side by side (S / M / L) with actual ml values. This doubles as the fix for the confusing "x0.7 / x1.0 / x1.4" labels.
4. **Comparison bars** — for pages like "Roti vs Rice", a simple horizontal bar comparison.

These are original work, they can't be accused of being stock or AI slop, they render instantly, they're accessible, and they make the site look *designed* rather than empty.

### Critical requirement — build the swap in now

Every dish page must use an **image container component** that:

- accepts an optional `photoUrl` prop,
- renders the real photograph when `photoUrl` is present,
- falls back to the generated SVG graphic when it is absent,
- and includes the `image` field in Recipe schema **only when a real photo exists**.

This means when Ridip starts shooting photos, adding them is a one-line data change per dish with zero refactoring, and Recipe rich results switch on automatically.

Store dish data (name, Assamese name, calories, macros, category, `photoUrl`) in a single structured data file so photos can be added in one place.

---

## 3. Work order

Do these in sequence. Do not start a batch until the previous one is confirmed working.

### ⬛ BATCH 1 — Crawlability and duplicate URLs
*No visible change to the site. This is the highest-priority work — nothing else matters until Google can crawl the site cleanly.*

1. Create `/robots.txt`:
   ```
   User-agent: *
   Allow: /

   Sitemap: https://www.katoricalorie.in/sitemap.xml
   ```
2. Fix `/sitemap.xml`. It currently returns an unparseable/binary response. It must serve valid XML with `Content-Type: application/xml; charset=utf-8`, and list **every** live URL: all English pages, all `/as/*`, all `/hi/*`, all 11 blog posts, all 6 food guides. No placeholder URLs, no duplicates, no redirect targets. Validate before moving on.
3. **Resolve duplicate hub pages.** `/cornerstone-articles` and `/blog` currently serve the same content; so do `/food-guides` and `/food`. Keep `/blog` and `/food`. 301-redirect `/cornerstone-articles` → `/blog` and `/food-guides` → `/food`.
4. **Fix the stale hub.** `/blog` currently renders only 7 articles while `/cornerstone-articles` renders 11. Four articles (brown-basmati-rice-weight-loss, bora-saul-sticky-rice-glycemic-index, joha-rice-antioxidants-benefits, bao-dhan-red-rice-superfood) are unreachable from `/blog`. Both hubs must render from one shared data source so this cannot drift again.
5. **Unify footer links.** The footer currently links to `/blog` and `/food` on some pages but `/cornerstone-articles` and `/food-guides` on others. It must link to `/blog` and `/food` everywhere, in every language.
6. **Add a self-referencing `<link rel="canonical">` to every page.** Currently only `/` and `/as` have one.
7. **Fix internal links that point at redirects.** The homepage links to `/why-accuracy.html` and `/blog` links to `/blog/calculator-accuracy-decimal-feet-bug.html`. Both 301 correctly, but internal links must point at the final extensionless URL directly.
8. **Add reciprocal hreflang** to the `<head>` of every page:
   ```html
   <link rel="alternate" hreflang="en-IN" href="https://www.katoricalorie.in/" />
   <link rel="alternate" hreflang="as"    href="https://www.katoricalorie.in/as" />
   <link rel="alternate" hreflang="hi-IN" href="https://www.katoricalorie.in/hi" />
   <link rel="alternate" hreflang="x-default" href="https://www.katoricalorie.in/" />
   ```
   Each page must reference its own language equivalents, and they must point back at each other.
9. **Fix Open Graph on translated pages.** `/as` currently declares `og:url`, `og:title` and `og:description` from the English homepage. Each language version needs its own.

**Definition of done:** `robots.txt` loads, sitemap validates, both duplicate URLs 301 correctly, every page has a canonical, `/blog` shows all 11 articles, no internal link points at a redirect.

---

### ⬛ BATCH 2 — Remove broken and placeholder content
*Small visible changes. Fast. High impact on perceived quality.*

10. **Delete the placeholder social links.** The footer contains literal `YOUR_FACEBOOK_URL`, `YOUR_INSTAGRAM_URL`, `YOUR_YOUTUBE_URL`. Because they aren't absolute URLs, browsers resolve them relatively, producing soft-404s like `/YOUR_FACEBOOK_URL`, `/blog/YOUR_FACEBOOK_URL`, `/as/YOUR_FACEBOOK_URL` across the whole site. Remove all three entirely (Ridip has no live profiles yet). Make the footer render social links only from a config array, so it renders nothing when the array is empty.
11. **Hide the ad placeholders.** Four boxes currently read "Sponsored Ad Placement — Leaderboard Space / In-Feed Banner / Column Banner / Blog Portal Banner". Put them behind a feature flag that is **off** by default.
12. **Fix the broken hero image.** On `/` and `/as`, the "Traditional regional Indian nutritional setup banner" image has `src=""`. Replace with the new SVG graphic system, or remove the element.
13. **Verify `/assets/og-banner.jpg` returns 200.** It is referenced in every OG tag and controls WhatsApp/Facebook link previews. If missing, generate one (1200×630).
14. **Fix the Markdown rendering bug.** On `/food/masor-tenga-recipe-nutrition` the step list renders every item as "2.", bold markers are unclosed and bleed formatting into the footer, and steps 1 and 2 are merged. Find the parser fault and check all six food guides for it.

**Definition of done:** no placeholder text anywhere in rendered HTML, no broken image, all six food guides render clean ordered lists.

---

### ⬛ BATCH 3 — Metadata, schema and authorship

15. **Rewrite every title tag** keyword-first, under 60 characters, brand last:
    - Home → `Indian & Assamese Food Calorie Calculator - KatoriCalorie`
    - `/blog` → `Indian Food Nutrition Guides & Articles - KatoriCalorie`
    - `/food` → `Indian Food Calorie Charts by Dish - KatoriCalorie`
    - Dish pages → `<Dish> Calories & Nutrition (Per Katori) - KatoriCalorie`
    - Where a calorie number is known, put it in the title: `Masor Tenga Calories - 140 kcal per Katori`
16. **Rewrite every meta description**, 140–160 characters, primary keyword in the first half, written to be clicked.
17. **Replace the fake bylines.** Articles currently say "By the KatoriCalorie Editorial Board | Reviewed by Metabolic Sciences Group". Neither entity exists. This is a serious trust problem on health content. Replace with **Ridip Patowary** and create `/author/ridip-patowary` — a real page with who he is, why he built the site, his connection to Assamese food, and links to real profiles when they exist.
18. **Show `datePublished` and `dateModified`** visibly on every article and in schema.
19. **Add JSON-LD structured data:**
    - `Recipe` + `NutritionInformation` on every `/food/*` page — include the `image` field **only** when a real photo exists (see §2)
    - `Article` on every `/blog/*` page, with `author` as a `Person`
    - `WebApplication` and `Organization` on the homepage
    - `BreadcrumbList` on every inner page
    Full code examples are in `katoricalorie-seo-audit.md` §3.
20. **Add visible breadcrumbs** matching the schema. The site currently has none, which also weakens internal linking.

**Definition of done:** every page validates clean at validator.schema.org, no page has a duplicate title, no fake author remains on the site.

---

### ⬛ BATCH 4 — Language and content completeness

21. **Finish the Assamese translation of `/as`.** Still in English: all food names, "Browse Foods", "My Thali", "Select Food or Activity", "Adjust Katori Portion", Small/Medium/Large, "Save Image", "Bookmark Meal", "Empty Thali", "Active Plate", "Clear Plate", the entire "Scientific Insights" section, and the whole footer. Also remove the duplicated English "How KatoriCalorie Works" heading that appears above the Assamese one, and point `/as` footer links to their `/as/*` equivalents.
22. **Then do the same for `/hi`.**
23. **Move all UI strings into a proper i18n file** so no language version can drift out of sync again.

---

### ⬛ BATCH 5 — UX and visual redesign
*Only after Batches 1–4 are live and verified.*

24. **Split the homepage into two explicit steps:** "1 — How many calories do you need?" then "2 — Build your thali." Do not render step 2 until step 1 is answered. Right now a first-time visitor sees six zeros and three empty panels simultaneously.
25. **Replace portion multipliers with real volumes.** `x0.7 / x1.0 / x1.4` means nothing to a home cook. Use `Small ~120 ml`, `Medium ~200 ml`, `Large ~280 ml`, with the katori scale graphic from §2.
26. **Plain-language labels.** "Metabolic Target Calculator" → "How many calories do you need?"; "Biological Gender" → "Are you male or female?"; "Physical Activity Factor" → "How active are you?"; "Active TDEE Budget" → "Your daily calorie budget". Keep BMR/TDEE available as small "what's this?" tooltips.
27. **Explain the result in a sentence,** not just a number: *"You need about 1,850 kcal a day — roughly 4 katoris of rice plus 2 servings of curry, spread across three meals."*
28. **Pre-load a sample thali** (rice + masor tenga + aloo pitika) with a "Clear and start mine" button, instead of an empty state.
29. **Add a "Share on WhatsApp" button** beside the existing "Save Image". WhatsApp is the primary distribution channel for this audience.
30. **Consolidate the category filters.** "Pan-India & Regional Items" currently appears three times as a heading, a list item, and a filter chip. One row, six chips maximum.
31. **Promote the accuracy claim.** The decimal-height-bug note is buried inside the calculator, and it is the site's single most distinctive, checkable differentiator. Make it a visible badge near the calculator.
32. **Run PageSpeed Insights on mobile.** Target LCP under 2.5s and CLS under 0.1.

---

## 4. What Ridip does himself (not Antigravity's job)

| Task | When |
|---|---|
| Verify the domain in **Google Search Console**, submit the sitemap | Immediately after Batch 1 ships |
| Verify in **Bing Webmaster Tools** | Same day |
| Request indexing on the homepage + 10 strongest articles | After Batch 3 |
| Create real Facebook / Instagram / YouTube profiles | Before Batch 2's config array is useful |
| Write the `/author/ridip-patowary` bio in his own words | During Batch 3 |
| Photograph dishes — 1–2 per week, own kitchen, daylight, real katori | Ongoing from now |
| Outreach to Assam media, Reddit, Facebook groups | Month 3+ |

---

## 5. Reporting format

After each batch, report back in this form:

```
BATCH <n> COMPLETE
Changed:   <files touched, one line each>
Verify:    <exact URLs or commands Ridip can check>
Skipped:   <anything not done, and why>
Questions: <anything blocking the next batch>
```

Do not mark a batch complete if any item in it is unresolved. check the opus plan
