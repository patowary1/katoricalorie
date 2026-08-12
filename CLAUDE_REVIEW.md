# CLAUDE_REVIEW.md — Batch 1: APPROVED ✅

**Reviewed:** `CLAUDE_HANDOFF.md` + `repair/batch-1-seo` (pushed to origin) + live preview
**Verdict: Batch 1 is complete. Approved to merge.**

---

## Verification

The suite was run against the real preview host this time — `https://katoricalorie-git-repair-batch-1-seo-ridip-s-projects.vercel.app` — not a local simulator. 44/44 passed.

I independently confirmed on disk and against the live preview:

- Branch is pushed: `origin/repair/batch-1-seo` exists
- `vercel.json` — 8 redirects, all `statusCode: 301`; 12 rewrites; `cleanUrls: true`; `trailingSlash: false`
- No uncommitted content changes (`git diff -w` is empty — remaining noise is line-endings only)
- `/cornerstone-articles` → `/blog`, `/food/bao-dhan-nutrition` → its blog article, `/why-accuracy.html` → `/why-accuracy`
- `/blog` = 11 static article links, `/food` = 6, both in raw HTML
- `/hi/about` and `/as/sources` resolve via rewrite, fully localized, correct canonicals
- `.vercelignore` working — `/backups/*`, `/scratch/`, `/PROJECT_BRIEF.md` all excluded, `/js/blog-db.js` still served

**Note on the 308s:** `/why-accuracy.html` and `/blog/calculator-...html` return 308 rather than 301 because `cleanUrls` handles them before your redirect rules fire. That's fine — Google treats 308 as equivalent to 301. Leave the explicit rules in place as belt-and-braces.

Round 3 was solid work: real host, honest labelling, complete coverage.

---

## ⬛ Merge steps

1. Open a PR from `repair/batch-1-seo` → `main` on GitHub (or merge directly).
2. Merge. Vercel will deploy `main` to production automatically.
3. Wait for the production deploy to finish, then run:
   ```bash
   node scripts/run-verify-live.js https://www.katoricalorie.in
   ```
   Everything should pass, **plus** the non-www check (`katoricalorie.in` → `www.katoricalorie.in`), which was skipped on preview.
4. If anything fails on production, report it immediately — do not start Batch 2.
5. Write the production run output to `CLAUDE_HANDOFF.md`.

Then **stop and wait.** Ridip has a Search Console step before Batch 2 begins.

---

## ⬛ Housekeeping (do these in the same PR or straight after)

1. **Line endings.** Add `.gitattributes`:
   ```
   * text=auto eol=lf
   ```
   Commit the normalisation on its own so future diffs are readable. This is why `backups/` kept reappearing as modified.

2. **`git checkout -- backups/`** once more after the `.gitattributes` commit, and confirm `git status --short | grep backups` is empty.

---

## Batch 2 — do not start until Ridip says so

For context, in priority order:

1. Remove `YOUR_FACEBOOK_URL` / `YOUR_INSTAGRAM_URL` / `YOUR_YOUTUBE_URL` from the footer sitewide, in all three languages. Render social links from a config array so an empty array renders nothing.
2. Hide the four "Sponsored Ad Placement" boxes behind a feature flag, off by default.
3. Fix the empty `src=""` hero image on `/` and `/as` ("Traditional regional Indian nutritional setup banner").
4. Fix the Markdown rendering bug in the food guides — on `/food/masor-tenga-recipe-nutrition` every step renders as "2.", steps 1 and 2 are merged, and unclosed `**` bleeds bold formatting into the footer. Check all six guides.
5. Resize `og-banner.jpg` to 1200×630 and compress to under ~300 KB (currently 1376×768, 834 KB).

See `PROJECT_BRIEF.md` for the full plan.
