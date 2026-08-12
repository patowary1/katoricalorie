# CLAUDE_REVIEW.md — Batch 2 review

**Branch:** `repair/batch-2-cleanup` @ `342a459`
**Verdict: one blocker. Everything else is approved.** Do not merge yet.

---

## Verified correct — good work

I checked these directly in the repo, not just the test output:

- **Recipe schema on the 6 food guides is excellent.** Unique `@id` per page, `recipeYield: "1 katori (200 ml)"`, `prepTime`/`cookTime`/`totalTime` as valid ISO 8601, `author` as a Person, `datePublished`, 7 `recipeIngredient` entries, 6 `HowToStep` instructions, `keywords`. And `aggregateRating` and `video` correctly omitted rather than invented — thank you for holding that line.
- **Recipe schema removed from `/`, `/as`, `/hi`**, `WebSite`/`WebApplication`/`Organization` retained. `@id` collision resolved.
- **Food guide formatting fixed.** `/food/masor-tenga-recipe-nutrition` now has exactly one `<ol>` with 6 correctly numbered `<li>` items and zero stray `**` markers.
- **Placeholder social links gone** — `grep` returns zero.
- **`og-banner.jpg` is right.** 1200×630, 192 KB, image intact after the resize. I viewed it.
- All Batch 1 guarantees still hold on the preview.

---

## 🔴 BLOCKER — the 17 card images are blank

The test says:

```
[PASS] All 17 generated dish/blog card graphic images return HTTP 200
```

They do return 200. They are also **empty**.

I opened `assets/masor-tenga.jpg`. It contains a dark rectangle, a teal border, and three concentric circles. **No dish name. No calorie figure. No Assamese text. No branding. No katori.** The two horizontal bands where text should sit are blank.

### Why it happened

`scripts/generate-card-images.js` uses `jpeg-js`:

```js
const jpeg = require('jpeg-js');
...
const frameData = Buffer.alloc(width * height * 4);
```

`jpeg-js` is a raw pixel encoder. **It cannot draw text at all.** The spec array defines `title: 'Roti vs Rice Weight Loss'` and `subtitle` for each card, but there was no code path that could render them, so those fields were silently discarded and only `color` and `bg` reached the output.

### The consequence

Because colour and background were the only differentiators, the 17 files collapse into **8 unique images**. Verified by hash:

```
masor-tenga.jpg  ==  masor-tenga-blog.jpg  ==  joha-rice-blog.jpg
omita-khar.jpg   ==  khar-blog.jpg         ==  herbs-blog.jpg
til-pitha.jpg    ==  pitha-blog.jpg        ==  bora-saul-blog.jpg
aloo-pitika.jpg  ==  brown-basmati-blog.jpg
naga-pork.jpg    ==  bao-dhan-blog.jpg
dosa-sambar.jpg  ==  roti-rice-blog.jpg
```

The Joha Rice article and the Masor Tenga recipe are serving the byte-identical image. If a recipe rich result ever rendered with one of these, it would look broken — worse for the user than no image at all.

### Fix

**Use a renderer that can draw text.** `jpeg-js` cannot. Two options:

**Option A — headless browser screenshot (recommended).** Build one HTML/CSS card template, render with Playwright or Puppeteer, screenshot at 1200×900.

- Handles Bengali-Assamese and Devanagari correctly — critical, since the cards carry dish names in Assamese script
- Full CSS layout, so the design is easy to iterate
- You can eyeball the output as a real page while building it

**Option B — `@napi-rs/canvas`** with Noto Sans Bengali / Noto Sans Devanagari / Inter explicitly registered via `registerFont`. Lighter than a browser, but you must verify the Indic fonts actually load — silent font fallback is exactly the failure mode we just hit.

**Each card must contain:**

1. Dish name in English
2. Dish name in Assamese script where one exists
3. Calorie figure, large, e.g. `140 kcal per katori`
4. Macro ring or bar — protein / carbs / fat, from the data already in the page
5. A stylised katori shape (drawn, not photographic)
6. `KatoriCalorie` wordmark, small, bottom corner
7. Category colour: rice = warm cream · fish = pale river blue · greens = green · sweets = amber · fermented = deep ochre

1200×900, under 200 KB each.

### Fix the test too

The current assertion checks that files exist. Replace it with assertions that check they're *correct*:

```
- all 17 images return 200
- all 17 images are exactly 1200×900
- all 17 MD5 hashes are DISTINCT        ← would have caught this
- each image is between 30 KB and 200 KB
- each image's mean pixel variance exceeds a floor  ← catches near-blank output
```

The distinct-hash check is the important one. Add it.

---

## 🟡 Minor — ad placeholders are hidden, not removed

`grep "Sponsored Ad Placement"` still returns 8 occurrences; they're suppressed with `display: none !important` in `css/style.css`.

This is acceptable — Google ignores `display:none` content and there's no deception here, so it isn't a real risk. But the brief asked for a feature flag that doesn't *render* the markup. Shipping dead text in every page's HTML is untidy and it will confuse whoever reads this code in six months.

Not a blocker. Tidy it when convenient: wrap in a conditional so the markup isn't emitted at all when the flag is off.

---

## A pattern worth naming

This is the third time a test has passed while the underlying thing was wrong:

1. **Batch 1** — `food/index.html contains 6 guide links (Found: 6)` passed, while four unregistered food pages sat orphaned. The assertion encoded our assumption instead of checking reality.
2. **Batch 1** — "lastmod dates vary" was satisfied by inventing dates rather than reading them.
3. **Batch 2** — "17 images return 200" passed on 17 files that are blank and 8 of them duplicates.

The common thread: the assertions confirm that *work was attempted*, not that the *outcome is right*. A file exists. A field is non-empty. A count matches what we guessed.

When writing a test, the question to ask is: **"if this task had been done badly, would this assertion fail?"** For all three above, the answer was no.

Concretely, prefer:

- distinct hashes over file counts
- rendered pixel content over HTTP status
- values derived from a source of truth over values matching a hardcoded expectation
- enumerate-and-compare over assert-a-number

This is genuinely the only recurring issue in otherwise strong work. The Recipe schema in this batch is a good example of the opposite — carefully done, and you declined to fabricate `aggregateRating` when it would have made a checker happier. Same instinct, applied to the tests.

---

## To do

1. Rewrite `scripts/generate-card-images.js` using Playwright or `@napi-rs/canvas`
2. Regenerate all 17 cards with real text and per-dish content
3. Upgrade the image assertions as above
4. Optionally tidy the ad placeholder markup
5. Push, re-run the full suite against a fresh preview
6. **Attach 2–3 of the generated cards to your handoff** (or state their paths) so I can view them before approving
7. Update `CLAUDE_HANDOFF.md`, do not merge

Everything else in Batch 2 is ready to ship the moment the cards are right.
