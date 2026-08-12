# CLAUDE_REVIEW.md — Batch 2 APPROVED ✅ / Batch 3 brief

## Batch 2: approved

All three round-3 fixes verified:

- Pills are neutral dark with colour dots matching the donut segments — the contradiction is gone
- Values legible in white on dark
- `bug-blog.jpg` no longer renders a fabricated macro chart
- Assamese renders correctly across all cards

**Merge `repair/batch-2-cleanup` to `main` and deploy.** Then run the full suite against `https://www.katoricalorie.in` and report the result before starting Batch 3.

*(Tiny, optional: `bug-blog.jpg` still carries the footer "Official KatoriCalorie Verified Nutrition Card" on a card that isn't about nutrition. Swap to a neutral footer line for non-food cards when convenient.)*

---

# BATCH 3 — Authorship, originality, and metadata

Branch: `repair/batch-3-authorship`

Ridip's instruction for this batch: **the site must read as written by a person, and the Assamese must be correct.** That shapes everything below.

## Understand the goal before you start

Google does **not** penalise AI-assisted writing. It penalises *scaled content abuse* — pages mass-produced with nothing a reader couldn't get elsewhere. This site currently shows that pattern: 11 articles with an identical skeleton, published close together, bylined to entities that don't exist, no photographs, no first-hand detail.

So the objective is **not** to run a find-and-replace on "AI words." It's to add what a machine cannot produce: a real author, real experience, real regional specifics, and genuine variation. Cosmetic word-swapping without that changes nothing.

**Where you are uncertain about a fact, a local detail, or an Assamese phrasing, do not invent it. Leave a `<!-- RIDIP: ... -->` comment asking him.** A gap he fills is worth more than a plausible sentence you generated. This is the most important instruction in the batch.

---

## TASK 1 — Give the site a real author

1. Replace every instance of **"By the KatoriCalorie Editorial Board"** and **"Reviewed by Metabolic Sciences Group"** with **"By Ridip Patowary"**. Neither entity exists; on health content that's a genuine trust problem, and arguably misleading.
2. Create `/author/ridip-patowary` with:
   - Who he is, in his own voice
   - Why he built this — he couldn't find calorie data for the food he actually eats
   - His connection to Assamese food and to Assam
   - A photo *(leave a `RIDIP:` placeholder — do not generate one)*
   - Links to real social profiles once they exist
3. `Person` schema on that page; `author` on every Article and Recipe pointing to its `@id`.
4. Add the page to the sitemap, nav or footer, and link to it from every article byline.
5. Visible **Published** and **Updated** dates on every article, matching `datePublished` / `dateModified` in schema.

---

## TASK 2 — Rewrite in plain human language

Apply to all 11 blog posts and 6 food guides.

**Remove:**

- "In today's fast-paced world", "It is important to note that", "delve into", "when it comes to", "plays a crucial role", "unlock", "harness", "elevate"
- Chains of "Moreover / Furthermore / Additionally"
- Inflated register: "utilise" → "use", "commence" → "start", "purchase" → "buy"
- Corporate self-description: "India's specialized Regional & National Food Nutrition platform" → say what it does in plain words
- Empty hedging that commits to nothing

**Vary the shape.** Every article currently runs intro → numbered sections → FAQ → sources. Real writing doesn't. Some pieces should be 600 words, some 1,800. Some open with a story, some with a number. Not every article needs an FAQ.

**Write short sentences next to long ones.** Uniform sentence length is the strongest tell there is.

**Keep:** the nutrition tables, the numbers, the scientific references. Those are accurate and useful. This is a rewrite of prose, not of data.

---

## TASK 3 — Add what only a human can

This is the part that actually matters, and most of it needs Ridip.

For each food guide and article, insert a `<!-- RIDIP: -->` prompt asking for:

- **Regional variation** — "Upper Assam does this differently from Lower Assam because…"
- **Family practice** — "My grandmother uses thekera instead of tomato in summer"
- **Real measurement** — "I weighed a katori of rice in my own kitchen: 148 g cooked"
- **An actual opinion** — "Most calorie sites list dosa at 130 kcal. That assumes no oil, which nobody does."
- **Where he disagrees** with the standard figures, and why
- **What he got wrong** while building the site

Draft around these gaps; don't fill them with plausible invention. Two or three genuine sentences per article will do more for this site than a thousand polished ones.

---

## TASK 4 — Assamese and Hindi quality

**You cannot self-approve the Assamese. Ridip must read it.**

Machine-translated Assamese tends to come out stiff, over-Sanskritised, or subtly Bengali-inflected. It's technically correct and sounds wrong to a native speaker — and Assamese readers are the audience this site most needs to win.

1. Produce `TRANSLATION_REVIEW.md` listing every Assamese string with its English source, grouped by page, formatted so Ridip can correct it inline.
2. Same for Hindi.
3. Flag anything you're unsure of with `⚠️ CHECK`.
4. Once he returns it, move all strings into a single i18n file so nothing drifts again.
5. Finish the remaining untranslated `/as` UI strings (food names, "Browse Foods", "My Thali", "Save Image", "Empty Thali", "Scientific Insights", footer).

---

## TASK 5 — Keyword-first titles and descriptions

| Page | New title |
|---|---|
| Home | `Indian & Assamese Food Calorie Calculator - KatoriCalorie` |
| `/blog` | `Indian Food Nutrition Guides & Articles - KatoriCalorie` |
| `/food` | `Indian Food Calorie Charts by Dish - KatoriCalorie` |
| Dish pages | `<Dish> Calories - <N> kcal per Katori \| KatoriCalorie` |

Under 60 characters, keyword first, brand last. Meta descriptions 140–160 characters, primary keyword in the first half, written to earn a click rather than to describe the page. Put the calorie number in the title wherever it's known.

---

## TASK 6 — Remaining structured data

- `Article` on all 11 blog posts with the real author, `datePublished`, `dateModified`
- `BreadcrumbList` on every inner page, plus **visible** breadcrumbs — the site still has none
- Keep `FAQPage` where FAQs genuinely exist; remove it where the FAQ is filler
- Still no `aggregateRating`, still no `video`

---

## Verification

Extend the suite:

- No page contains "Editorial Board" or "Metabolic Sciences Group"
- Every article has a visible author link to `/author/ridip-patowary`
- Every article shows a visible published date
- `/author/ridip-patowary` returns 200 and is in the sitemap
- No page contains any banned phrase from Task 2's list
- Every title is under 60 characters and unique
- Every meta description is 140–160 characters and unique
- Every page has `BreadcrumbList` and visible breadcrumbs
- All Batch 1 + 2 assertions still pass

Run against a **Vercel preview**, then report. Do not merge.

---

## A note on how to work this batch

Batches 1 and 2 were mechanical — a check either passes or it doesn't. Batch 3 is judgement work, and a green test suite will not tell you whether the writing sounds human or the Assamese reads naturally. It can only tell you the banned phrases are gone.

So: **flag rather than fabricate.** Every `RIDIP:` comment you leave is a place the site gets something real. Every gap you quietly fill with confident-sounding text is a place it stays generic.
