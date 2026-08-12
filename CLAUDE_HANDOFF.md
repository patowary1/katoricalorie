# Batch 2 Handoff — Content Cleanup & Recipe Schema Fixes

## Preview URL
`https://katoricalorie-git-repair-batch-2-cleanup-ridip-s-projects.vercel.app`

## Full Live Verification Results (Target: Batch 2 Vercel Preview)
```text
==============================================
 Batch 1 + Batch 2 full live verification suite
 Target: https://katoricalorie-git-repair-batch-2-cleanup-ridip-s-projects.vercel.app
==============================================

--- 1. robots.txt ---
[PASS] robots.txt returns 200 (200)
[PASS] robots.txt has User-agent: *
[PASS] robots.txt has Allow: /
[PASS] robots.txt declares Sitemap
[PASS] robots.txt does not block the site

--- 2. sitemap.xml ---
[PASS] sitemap.xml returns 200 (200)
[PASS] sitemap Content-Type is XML (application/xml)
[PASS] sitemap lists 40 URLs (40)
[PASS] sitemap omits <priority>
[PASS] sitemap omits <changefreq>
[PASS] sitemap contains no .html URLs
[PASS] sitemap contains no redirected URLs
[PASS] sitemap omits <lastmod>

--- 3. every sitemap URL returns 200 ---
[PASS] all 40 sitemap URLs return 200

--- 4. redirects ---
[PASS] /cornerstone-articles returns 301 (301)
[PASS] /cornerstone-articles Location is /blog (/blog)
[PASS] /food-guides returns 301 (301)
[PASS] /food-guides Location is /food (/food)
[PASS] legacy /why-accuracy.html redirects (308)
[PASS] legacy /blog/calculator-accuracy-decimal-feet-bug.html redirects (308)
[PASS] /blog/ redirects to /blog (308)

--- 5. 404 behaviour ---
[PASS] nonsense URL returns 404 (404)
[PASS] nested nonsense URL returns 404 (404)
[PASS] /YOUR_FACEBOOK_URL returns 404 (404)
[PASS] /blog/YOUR_FACEBOOK_URL returns 404 (404)

--- 6. assets & search console verification ---
[PASS] og-banner.jpg returns 200 (200)
[PASS] google07b32f334e7f727f.html resolves to 200 (GSC verification guard) (200)

--- 6b. orphaned food pages must not be live ---
[PASS] /food/bao-dhan-nutrition is 301
[PASS] /food/bora-saul-nutrition is 301
[PASS] /food/brown-basmati-rice is 301
[PASS] /food/joha-rice-nutrition is 301

--- 6c. backups/scratch must not be deployed ---
[PASS] /backups/backup_2026_06_11/ resolves to 404 (correctly excluded via .vercelignore)
[PASS] /backups/backup_2026_06_13_1225/compare resolves to 404 (correctly excluded via .vercelignore)
[PASS] /scratch/ resolves to 404 (correctly excluded via .vercelignore)
[PASS] /PROJECT_BRIEF.md resolves to 404 (correctly excluded via .vercelignore)
[PASS] /CLAUDE_REVIEW.md resolves to 404 (correctly excluded via .vercelignore)
[PASS] blog-db.js is served (needed by app) (200)

--- 7. canonical tags (all 40 sitemap URLs) ---
[PASS] all 40 pages have exactly one correct self-referencing canonical

--- 8. hreflang reciprocity (6 localized groups) ---
[PASS] hreflang is reciprocal and complete across all 6 groups

--- 9. localized Open Graph on /as and /hi ---
[PASS] /as og:url is localized (https://www.katoricalorie.in/as)
[PASS] /as og:description is in regional script
[PASS] /hi og:url is localized (https://www.katoricalorie.in/hi)
[PASS] /hi og:description is in regional script

--- 10. hubs render static links (raw HTML, no JS) ---
[PASS] /blog raw HTML contains 11 article links
[PASS] /food raw HTML contains 6 guide links

--- 11. BATCH 2 ASSERTIONS ---
[PASS] No page contains placeholder social links (YOUR_FACEBOOK_URL)
[PASS] No page renders visible ad placement text (hidden behind feature flag)
[PASS] No page contains empty src="" attributes
[PASS] /food/masor-tenga-recipe-nutrition has properly formatted 6-step <ol> list
[PASS] Homepage / omits Recipe schema (prevents GSC invalid item errors)
[PASS] /food/masor-tenga-recipe-nutrition has valid Recipe schema with recipeYield, prepTime, author, ingredients, HowToStep
[PASS] All 17 generated dish/blog card graphic images return HTTP 200

==============================================
 PASSED: 52
 FAILED: 0
==============================================
```

## Tasks Completed in Batch 2
- **Search Console Verification Guard:** Whitelisted `google07b32f334e7f727f.html` alongside `404.html` in `scripts/verify-batch1.js`. Verified `google07b32f334e7f727f.html` returns HTTP 200 on preview.
- **Task 0 (Recipe Structured Data):**
  - Removed Recipe schema from homepages (`/`, `/as`, `/hi`). Retained valid `WebSite`, `WebApplication`, and `Organization` schemas on homepages to prevent GSC invalid item errors and `@id` collisions.
  - Updated Recipe schema on all 6 `/food/*` guides with unique `@id`s, `recipeYield`, `prepTime`, `cookTime`, `totalTime`, `datePublished`, `author`, `keywords`, `recipeIngredient`, and `HowToStep` instructions. Omitted unverified `aggregateRating` and `video`.
- **Task 0b (17 Card Graphics System):**
  - Generated all 17 branded dish & article card graphics at **1200x900 (4:3 ratio)** under 90 KB each in `assets/`.
- **Task 1 (Placeholder Social Links):**
  - Stripped `YOUR_FACEBOOK_URL`, `YOUR_INSTAGRAM_URL`, `YOUR_YOUTUBE_URL` from all footers sitewide. Checked `grep -rn "YOUR_.*_URL"` returns zero occurrences.
- **Task 2 (Ad Placeholders):**
  - Wrapped and hid all "Sponsored Ad Placement" boxes (and Assamese/Hindi equivalents) behind `display: none !important;` feature flag.
- **Task 3 (Hero Image `src=""`):**
  - Fixed empty `src=""` image tags sitewide.
- **Task 4 (Food Guide Recipe Formatting):**
  - Formatted recipe step lists across all 6 food guides with clean `<ol>` numbering, closed `<strong>` tags, and no Markdown syntax leaks.
- **Task 5 (Optimised OG Banner):**
  - Resized `assets/og-banner.jpg` to standard 1200x630 (16:9 ratio) and compressed to **187.6 KB**.
- **Task 6 (Line Endings & Git Cleanliness):**
  - Verified `.gitattributes` (`* text=auto eol=lf`) and `.gitignore` (`node_modules/`).

## Status
Branch `repair/batch-2-cleanup` is pushed to origin and verified. Ready for final review from Ridip and Claude! Do not merge until approved.
