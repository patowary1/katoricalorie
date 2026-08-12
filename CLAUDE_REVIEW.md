# CLAUDE_REVIEW.md — Batch 1 CLOSED ✅ / Batch 2 brief

Batch 1 is merged, live on production, and verified (45/45). Google Search Console is set up and the sitemap is submitted. Nothing further needed on Batch 1.

Start Batch 2 on a new branch: `repair/batch-2-cleanup`

---

## ⚠️ READ FIRST — do not delete this file

```
google07b32f334e7f727f.html
```

This is Google Search Console's ownership verification file. It is what verified the property. **If it is deleted, Search Console loses verification and all indexing data stops.**

The unregistered-HTML guard you added to `scripts/verify-batch1.js` in Batch 1 will flag this file, because it isn't in `blog-db.js` or the sitemap. **Whitelist it now**, along with `404.html`:

```js
const ALLOWED_UNREGISTERED = ['404.html', 'google07b32f334e7f727f.html'];
```

Do not add it to the sitemap — it should stay out of the index.

---

## ⬛ BATCH 2 — Remove broken and placeholder content

All of this is user-visible. It's what makes the site look unfinished to both visitors and Google's quality systems.

---

### TASK 0 — Fix the Recipe structured data (NEW — highest priority)

Google Search Console URL Inspection on `https://www.katoricalorie.in/` reports **2 invalid Recipe items**, each with 1 critical issue and 8 non-critical. Confirmed directly in Search Console:

**Critical (blocks rich results):**

```
Missing field "recipeYield"
```

**Non-critical (recommended):** `cookTime`, `prepTime`, `author`, `recipeIngredient`, `recipeInstructions`, `keywords`, `aggregateRating`, `video`

There are **18 Recipe blocks across the site**, not just the two on the homepage.

**First, remove Recipe schema from the three homepages entirely** — `index.html`, `as/index.html`, `hi/index.html`.

Two reasons:

1. **The homepage is not a recipe page.** Its main content is a calorie calculator. Google requires structured data to describe the page's primary content; Recipe markup on a calculator page is a mismatch, and it's why Search Console reports invalid items on `/`, `/as` and `/hi` alike.
2. **Duplicate `@id` collision.** All three language homepages declare the *same* identifiers:
   ```
   /     "@id": "https://www.katoricalorie.in/#recipe-masor-tenga"
   /as   "@id": "https://www.katoricalorie.in/#recipe-masor-tenga"   ← identical
   /hi   "@id": "https://www.katoricalorie.in/#recipe-masor-tenga"   ← identical
   ```
   Three URLs asserting they are the same entity. Confirmed live: Search Console shows the same 2 invalid Recipe items on both `/` and `/hi`.

Keep `WebSite`, `WebApplication` and `Organization` on the homepages — those are correct there.

**Then fix the Recipe schema on the six `/food/*` pages**, which is where the actual recipes live. Give each a unique `@id` matching its own URL, e.g. `https://www.katoricalorie.in/food/masor-tenga-recipe-nutrition#recipe`.

**Add to every Recipe node:**

| Field | Value |
|---|---|
| `recipeYield` | **Required.** e.g. `"1 katori (200 ml)"` or `"4 servings"` — must match the serving the nutrition figures describe |
| `prepTime` / `cookTime` / `totalTime` | ISO 8601 durations, e.g. `"PT10M"`, `"PT20M"`, `"PT30M"` |
| `author` | `{"@type":"Person","name":"Ridip Patowary"}` |
| `recipeIngredient` | Array of ingredient strings with quantities |
| `recipeInstructions` | Array of `HowToStep` objects. The food guide pages already have `HowToStep` markup — reuse that content rather than rewriting it |
| `datePublished` | Real date |
| `keywords` | e.g. `"masor tenga calories, assamese fish curry, low calorie indian curry"` |

**Two things NOT to do:**

- ❌ **Do not add `aggregateRating`.** There are no real user ratings on this site. Inventing rating values violates Google's structured data spam policy and risks a manual action. Leave it missing — "non-critical" means exactly that.
- ❌ **Do not add `video`.** There are no videos. Same reasoning.

Validate every page at `https://validator.schema.org` and Google's Rich Results Test before reporting.

---

### TASK 0b — The 17 missing schema images

Structured data across the site references **17 image files**. Only one exists:

```
Referenced:  masor-tenga.jpg, omita-khar.jpg, aloo-pitika.jpg, dosa-sambar.jpg,
             naga-pork.jpg, til-pitha.jpg, khar-blog.jpg, pitha-blog.jpg,
             roti-rice-blog.jpg, masor-tenga-blog.jpg, fermented-foods-blog.jpg,
             herbs-blog.jpg, bug-blog.jpg, brown-basmati-blog.jpg,
             bora-saul-blog.jpg, joha-rice-blog.jpg, bao-dhan-blog.jpg
Present:     og-banner.jpg only
```

All 16 others return 404. Google didn't flag this as critical in the Rich Results check, but **a Recipe rich result will not display without a fetchable image**, so this still blocks the outcome we want.

Ridip has no photographs yet. So build a **generated card system**:

- One reusable template rendered to **JPG at 1200×900** (4:3, Google's preferred Recipe ratio)
- Contents: dish name (English + Assamese script), calorie figure, a macro donut (protein/carbs/fat), a stylised brass katori illustration, KatoriCalorie branding
- Colour-code by category: rice = warm cream, fish = pale blue-grey, greens = green, sweets = amber
- Generate all 17 from the data already in `js/blog-db.js` and the nutrition tables
- Each under 200 KB

These are original graphics, not stock and not fake photography — honest and defensible. **Do not use AI-generated photorealistic images of the dishes.**

Build the image reference so a real photograph can replace a card by changing one path in a data file, with no other edits.

---

### TASK 1 — Delete the placeholder social links

Every page in all three languages has these in the footer:

```
YOUR_FACEBOOK_URL   YOUR_INSTAGRAM_URL   YOUR_YOUTUBE_URL
```

They aren't absolute URLs, so browsers resolve them relatively — `/YOUR_FACEBOOK_URL`, `/blog/YOUR_FACEBOOK_URL`, `/as/YOUR_FACEBOOK_URL`, and so on. They now correctly 404 (Batch 1), but they are still rendered as visible broken links on every page.

Ridip has no live social profiles yet, so:

- Remove all three links from the footer everywhere (EN, `/as`, `/hi`, all subdirectories)
- Refactor the footer to render social links from a config array, so an empty array renders nothing at all
- When Ridip creates real profiles, adding them becomes a one-line change

Verify with: `grep -rn "YOUR_.*_URL" --include='*.html' . | grep -v backups` → must return nothing.

### TASK 2 — Hide the ad placeholders

Four boxes render live text to real visitors:

- "Sponsored Ad Placement — Leaderboard Space"
- "Sponsored Ad Placement — In-Feed Banner"
- "Sponsored Ad Placement — Column Banner"
- "Sponsored Ad Placement — Blog Portal Banner"

Put them behind a single feature flag, **off by default**, so the markup stays for later but nothing renders now. Also translate/handle the `/as` and `/hi` equivalents (`প্ৰায়োজিত...`, `प्रायोजित विज्ञापन स्थान`).

### TASK 3 — Fix the broken hero image

On `/` and `/as` (check `/hi` too):

```html
<img alt="Traditional regional Indian nutritional setup banner" src="">
```

Empty `src`. Either point it at a real image or remove the element entirely. Do not leave an empty `src` — browsers re-request the page URL as an image.

### TASK 4 — Fix the Markdown rendering bug in the food guides

On `/food/masor-tenga-recipe-nutrition` the "Step-by-Step Healthy Preparation Guide" list is broken:

- Every step renders as "2." instead of 1–6
- Steps 1 and 2 are merged into a single item
- An unclosed `**` bleeds bold formatting through the rest of the page and into the footer

Find the parser/template fault and **check all six food guides** for the same problem. This is the most damaging item in Batch 2 — these are the pages we're trying to rank, and they currently look broken to a reader.

### TASK 5 — Optimise the OG banner

`assets/og-banner.jpg` is currently 1376×768 and 834 KB.

- Resize to **1200×630** (the standard OG ratio — at 1376×768 social platforms crop it)
- Compress to **under 300 KB**
- Verify it still returns 200 and renders correctly

### TASK 6 — Line endings

Add `.gitattributes`:

```
* text=auto eol=lf
```

Commit the normalisation as its **own separate commit** so the Batch 2 diff stays readable. Then `git checkout -- backups/` and confirm `git status --short | grep backups` is empty.

---

## Verification

Extend `scripts/run-verify-live.js` with Batch 2 assertions:

- No page contains the string `YOUR_FACEBOOK_URL`, `YOUR_INSTAGRAM_URL` or `YOUR_YOUTUBE_URL`
- No page contains `Sponsored Ad Placement` (or its Assamese/Hindi equivalents)
- No page contains `src=""`
- `/food/masor-tenga-recipe-nutrition` contains a correctly numbered `<ol>` with 6 distinct `<li>` items
- `og-banner.jpg` returns 200, is 1200×630, and is under 300 KB
- `/google07b32f334e7f727f.html` still returns **200** — regression guard on Search Console verification

Then run the full suite (Batch 1 + Batch 2 assertions) against a **Vercel preview URL**, not localhost.

## Reporting

Overwrite `CLAUDE_HANDOFF.md` using the same format as before: preview URL, full output, failures and fixes, anything changed outside the task list. Do not merge until approved.

---

## Deferred to Batch 3 (do not start)

- Keyword-first title tags and meta descriptions
- Recipe / Article / BreadcrumbList / WebApplication JSON-LD
- Replacing the "KatoriCalorie Editorial Board" byline with Ridip Patowary + an author page
- Visible published/updated dates
- Visible breadcrumbs

See `PROJECT_BRIEF.md`.
