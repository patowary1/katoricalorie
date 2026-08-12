# CLAUDE_REVIEW.md — Batch 1 review, round 3

**Preview URL (live, protection disabled):**
`https://katoricalorie-git-repair-batch-1-seo-ridip-s-projects.vercel.app`

Deployment Protection is now off, so the preview is reachable by automated tools. This is the first time anything has been testable for real.

---

## What I verified myself against the live preview

I spot-checked these directly. All correct:

| Check | Result |
|---|---|
| `/cornerstone-articles` → `/blog` | ✅ redirects, lands on `/blog` |
| `/blog` article count | ✅ **11 articles** in the served HTML |
| `/food` guide count | ✅ **6 guides** |
| `/food/bao-dhan-nutrition` → `/blog/bao-dhan-red-rice-superfood` | ✅ orphan redirect works |
| `/why-accuracy.html` → `/why-accuracy` | ✅ legacy redirect preserved |
| `/hi/about` | ✅ resolves, fully Hindi, canonical `https://www.katoricalorie.in/hi/about`, localized OG |
| Canonicals on preview | ✅ correctly point at the **production** domain, not the preview host |
| `sitemap.xml` | ✅ served as `application/xml` |
| `/backups/backup_2026_06_11/`, `/PROJECT_BRIEF.md` | ✅ no content returned — `.vercelignore` appears to be working |

The routing work is sound. Well done.

---

## ⬛ The one remaining task

I can fetch pages but **I cannot read HTTP status codes** with my tooling. So for these I can see an empty response but can't distinguish a genuine `404` from a `200` with an empty body — which is exactly the bug we're trying to eliminate.

You can. Run the full suite against the real preview host:

```bash
node scripts/run-verify-live.js https://katoricalorie-git-repair-batch-1-seo-ridip-s-projects.vercel.app
```

(or `bash scripts/verify-live.sh <same url>`)

**Pay closest attention to these, since they're the ones I couldn't confirm:**

1. `/this-page-does-not-exist-xyz123` → must be **404**, not 200
2. `/blog/no-such-article-abc` → **404**
3. `/YOUR_FACEBOOK_URL` and `/blog/YOUR_FACEBOOK_URL` → **404**
4. `/backups/backup_2026_06_11/`, `/backups/backup_2026_06_13_1225/compare`, `/scratch/`, `/PROJECT_BRIEF.md`, `/CLAUDE_REVIEW.md` → all **404**
5. `/js/blog-db.js` → **200** (the app needs it — make sure `.vercelignore` didn't over-exclude)
6. `/assets/og-banner.jpg` → **200**
7. All 40 sitemap URLs → **200** (strip the production host, request each path against the preview host)
8. `/cornerstone-articles` and `/food-guides` → status exactly **301**, not 302 or 308
9. `/blog/` (trailing slash) → **301/308** to `/blog`

Also report the exact `content-type` header on `/sitemap.xml`. Vercel returns `application/xml` without a charset parameter; that is fine and does not need changing — just record the real value rather than the one the local simulator produced.

Skip the non-www check on the preview host; it only applies to production.

---

## Reporting

Overwrite `CLAUDE_HANDOFF.md` with:

- The preview URL you tested against (must be the `*.vercel.app` host, not localhost)
- The complete output, including the status code for every check above
- Any failures and how you fixed them
- Anything you changed

Then stop. Do not merge — Ridip and I will review and approve.

---

## Known and intentionally deferred to Batch 2

Not bugs in Batch 1, no action now:

- `YOUR_FACEBOOK_URL` / `YOUR_INSTAGRAM_URL` / `YOUR_YOUTUBE_URL` links are still in the footer (visible on `/why-accuracy` among others). Batch 1 only needs them to return **404** rather than 200; removing them is Batch 2.
- "Sponsored Ad Placement" boxes still visible.
- `class="compliance-title"` and the empty `src=""` hero image.
- "KatoriCalorie Editorial Board" bylines — Batch 3.

---

## Housekeeping — after Batch 1 merges

Two small things, not blockers:

1. **Line endings.** `git diff -w` is empty across ~80 files, meaning the whole repo has been rewritten CRLF↔LF. It makes diffs unreadable and is why `backups/` kept reappearing as modified. Add a `.gitattributes`:
   ```
   * text=auto eol=lf
   ```
   then commit the normalisation as its own separate commit.

2. **`og-banner.jpg`** is 1376×768 and 834 KB. The standard is 1200×630, and social previews should be under ~300 KB. Resize and compress in Batch 2.
