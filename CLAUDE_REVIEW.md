# CLAUDE_REVIEW.md — Batch 1 code review

**Reviewer:** Claude, working directly in this repo
**Branch reviewed:** `repair/batch-1-seo` @ `8d6c20a`
**Date:** 12 August 2026

Antigravity: read this file, work the ⬛ TASKS section, then write your report to `CLAUDE_HANDOFF.md` in the repo root. Do not merge to `main` until the live verification passes.

---

## Verified working — no action needed

I checked these directly against the files on disk. All correct:

- **`vercel.json`** — `cleanUrls: true`, `trailingSlash: false`, both 301 redirects present, **all 12 rewrites present including `/hi/about`, `/hi/disclaimer`, `/hi/sources`**, and no catch-all rewrite. I predicted the `/hi/*` rewrites would be missing; they aren't. Good.
- **`robots.txt`** — exactly four lines, correct.
- **Canonicals** — all 23 core pages, all 11 blog posts and 6 registered food guides have **exactly one** self-referencing canonical pointing at the correct clean URL. Zero `.html` remaining in any canonical.
- **hreflang** — 4 tags (`en-IN`, `as`, `hi-IN`, `x-default`) on every page in all 6 localized groups, reciprocal and correct.
- **Hubs** — `blog/index.html` has 11 static `<a href>` article links and `food/index.html` has 6, present in raw HTML with no JS dependency. `js/blog-db.js` has 17 entries, consistent.
- **Internal links** — no `.html` hrefs remain in any live file.
- **`sitemap.xml`** — 40 URLs, real varying `lastmod` dates (5 distinct), no `priority`/`changefreq`.
- **`og:url`** — correctly localized on `/as` and `/hi`.

Solid work. Three real problems remain.

---

## ⬛ TASKS

### 🔴 TASK 1 — Four orphaned food pages will deploy

These files exist in `food/` but are **not** in `js/blog-db.js`, **not** in `sitemap.xml`, **not** linked from `/food`, and have **no canonical tag**:

```
food/bao-dhan-nutrition.html      (5,079 bytes)
food/bora-saul-nutrition.html     (5,042 bytes)
food/brown-basmati-rice.html      (5,146 bytes)
food/joha-rice-nutrition.html     (5,041 bytes)
```

Vercel will still serve them at `/food/bao-dhan-nutrition`, `/food/bora-saul-nutrition`, etc. They are roughly **half the size** of the real guides (which run 9.7–11.4 KB), they use `class="compliance-title"` so they were clearly generated from the compliance template, and each duplicates the topic of an existing blog post:

| Orphan file | Duplicates |
|---|---|
| `food/bao-dhan-nutrition.html` | `/blog/bao-dhan-red-rice-superfood` |
| `food/bora-saul-nutrition.html` | `/blog/bora-saul-sticky-rice-glycemic-index` |
| `food/brown-basmati-rice.html` | `/blog/brown-basmati-rice-weight-loss` |
| `food/joha-rice-nutrition.html` | `/blog/joha-rice-antioxidants-benefits` |

Thin, canonical-less, orphaned pages duplicating indexed content is precisely the pattern that triggers "Crawled – currently not indexed" and drags down sitewide quality scoring.

**Note how this got missed:** the test asserted `food/index.html contains 6 guide links (Found: 6)`. It passed because 6 was the number we assumed, not the number of files that exist. The test confirmed the assumption rather than checking reality. Going forward, assert that **every** HTML file in the repo is either registered in `blog-db.js` or explicitly excluded — don't hardcode expected counts.

**Do this:**

1. Delete the four files.
2. Add 301 redirects in `vercel.json` from each old path to its blog counterpart, in case Google already discovered them:
   ```json
   { "source": "/food/bao-dhan-nutrition",  "destination": "/blog/bao-dhan-red-rice-superfood",        "permanent": true },
   { "source": "/food/bora-saul-nutrition", "destination": "/blog/bora-saul-sticky-rice-glycemic-index","permanent": true },
   { "source": "/food/brown-basmati-rice",  "destination": "/blog/brown-basmati-rice-weight-loss",      "permanent": true },
   { "source": "/food/joha-rice-nutrition", "destination": "/blog/joha-rice-antioxidants-benefits",     "permanent": true }
   ```
3. Add a guard to `scripts/verify-batch1.js`: enumerate every `.html` file outside `backups/`, `scratch/` and `404.html`, and fail if any is absent from both `blog-db.js` and the sitemap.

*(If Ridip would rather keep these as real food guides later, that's a Batch 3 content decision — build them properly then. Do not ship them half-finished now.)*

---

### 🔴 TASK 2 — `backups/` and `scratch/` will be deployed publicly

The repo contains three complete copies of the site:

```
backups/backup_2026_06_11/
backups/backup_2026_06_11_2325/
backups/backup_2026_06_13_1225/     — 860 KB total
scratch/                             — 8 KB
```

There is **no `.vercelignore` and no `.gitignore`**, so Vercel deploys all of it. With `cleanUrls: true` these become live, crawlable duplicates of the entire site at `/backups/backup_2026_06_11/`, `/backups/backup_2026_06_13_1225/compare`, and so on.

The `optimize_seo` script also modified files inside `backups/` (visible in `git status`), which is harmless but confirms the tooling isn't scoped correctly.

**Do this:**

1. Create `.vercelignore` in the repo root:
   ```
   backups/
   scratch/
   scripts/
   *.md
   ```
2. Scope `scripts/optimize_seo.js` and `scripts/verify-batch1.js` to skip `backups/`, `scratch/` and `.git/`.
3. Revert the unintended modifications to files under `backups/` so the diff stays readable: `git checkout -- backups/`

Use `.vercelignore`, not `robots.txt` — a `Disallow` still lets the URLs be served and linked. Ignoring them means they never exist on the server at all.

---

### 🟠 TASK 3 — `/as` Open Graph is still in English

`og:url` was fixed, but the rest of the block on `as/index.html` was not. Currently:

```html
<meta property="og:title" content="KatoriCalorie | Premium Regional & National Food Nutrition Platform">
<meta property="og:description" content="Compute your BMR with the Mifflin-St Jeor formula and dynamically track calories for...">
<meta name="twitter:description" content="Compute your BMR with the Mifflin-St Jeor formula...">
```

`/hi` is correct — its `og:description` is properly in Hindi. `/as` needs the same treatment.

**Do this:** translate `og:title`, `og:description`, `twitter:title` and `twitter:description` on `as/index.html` into Assamese. Reuse the existing Assamese `<title>` and `meta description` already on that page as the basis. Then check the other `/as/*` pages for the same oversight.

---

### ⬛ TASK 4 — Deploy to preview and run the live verification

Nothing has been tested against a running server yet. All 17 existing tests read files from disk; none of them make an HTTP request. Vercel routing precedence does not always match what `vercel.json` appears to say, so the 404 behaviour, the 301s, the sitemap `Content-Type`, and the 200 status of all 40 sitemap URLs remain unverified.

I've placed `scripts/verify-live.sh` in this repo. It runs ~70 real HTTP checks.

**Do this:**

1. Complete Tasks 1–3.
2. Commit, then `git push origin repair/batch-1-seo`.
3. Get the Vercel preview URL.
4. Run:
   ```bash
   bash scripts/verify-live.sh https://<preview-url>.vercel.app
   ```
   If bash isn't available, port it to Node — but keep every check.
5. Fix each failure and re-run until it exits 0.
6. Write your report to `CLAUDE_HANDOFF.md` (see format below). **Do not merge.** Ridip will review, then I'll check your report and approve.

---

## Report format — write to `CLAUDE_HANDOFF.md`

```markdown
# Batch 1 Handoff

## Tasks completed
- Task 1: <what you did — files deleted, redirects added>
- Task 2: <.vercelignore contents, script scoping>
- Task 3: <the Assamese OG strings you wrote>

## Preview URL
<url>

## verify-live.sh output
<paste the full output, including any failures you then fixed>

## Failures encountered and how they were fixed
<one line each — this is the most useful part, don't skip it>

## Anything you changed that wasn't in the task list
<...>

## Blocked / needs a decision from Ridip
<...>
```

---

## After this passes — what comes next

Do not start these yet. For context only:

- **Ridip** verifies the domain in Google Search Console, submits `sitemap.xml`, requests indexing on the homepage plus the 10 strongest articles. This is the step that actually turns discovery on.
- **Batch 2** then begins: remove the `YOUR_FACEBOOK_URL` placeholder links sitewide, hide the "Sponsored Ad Placement" boxes behind a feature flag, fix the empty `src=""` hero image, verify `/assets/og-banner.jpg`, and fix the Markdown rendering bug in the food guides (all steps render as "2." and unclosed bold markers bleed into the footer).

See `PROJECT_BRIEF.md` for the full plan.
