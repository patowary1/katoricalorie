#!/usr/bin/env bash
# verify-live.sh — Batch 1 live HTTP verification for katoricalorie.in
#
# Usage:
#   ./verify-live.sh https://your-preview-url.vercel.app
#   ./verify-live.sh https://www.katoricalorie.in
#
# Requires: curl, grep, sed. Run in bash (Git Bash / WSL / macOS / Linux).

set -uo pipefail

BASE="${1:-}"
if [[ -z "$BASE" ]]; then
  echo "Usage: $0 <base-url>   e.g. $0 https://www.katoricalorie.in"
  exit 1
fi
BASE="${BASE%/}"

PASS=0; FAIL=0
UA="Mozilla/5.0 (compatible; Batch1Verifier/1.0)"

green() { printf '\033[32m%s\033[0m\n' "$1"; }
red()   { printf '\033[31m%s\033[0m\n' "$1"; }
head_o() { curl -sS -A "$UA" -o /dev/null -D - --max-time 20 "$1"; }
status() { curl -sS -A "$UA" -o /dev/null -w '%{http_code}' --max-time 20 "$1"; }
location() { head_o "$1" | grep -i '^location:' | tr -d '\r' | sed 's/^[Ll]ocation: *//'; }
body() { curl -sSL -A "$UA" --max-time 25 "$1"; }

ok()   { green "[PASS] $1"; PASS=$((PASS+1)); }
bad()  { red   "[FAIL] $1"; FAIL=$((FAIL+1)); }
check(){ if [[ "$2" == "$3" ]]; then ok "$1 ($2)"; else bad "$1 — expected $3, got $2"; fi; }

echo "=============================================="
echo " Batch 1 live verification"
echo " Target: $BASE"
echo "=============================================="

# ---------------------------------------------------------------- 1. robots
echo; echo "--- robots.txt ---"
check "robots.txt returns 200" "$(status "$BASE/robots.txt")" "200"
ROBOTS="$(body "$BASE/robots.txt")"
grep -qi '^User-agent: \*'  <<<"$ROBOTS" && ok "robots.txt has User-agent: *"  || bad "robots.txt missing 'User-agent: *'"
grep -qi '^Allow: /'        <<<"$ROBOTS" && ok "robots.txt has Allow: /"       || bad "robots.txt missing 'Allow: /'"
grep -qi '^Sitemap: http'   <<<"$ROBOTS" && ok "robots.txt declares Sitemap"   || bad "robots.txt missing Sitemap line"
grep -qi 'Disallow: /$'     <<<"$ROBOTS" && bad "robots.txt blocks the whole site!" || ok "robots.txt does not block the site"

# ---------------------------------------------------------------- 2. sitemap
echo; echo "--- sitemap.xml ---"
check "sitemap.xml returns 200" "$(status "$BASE/sitemap.xml")" "200"
CT="$(head_o "$BASE/sitemap.xml" | grep -i '^content-type:' | tr -d '\r' | sed 's/^[Cc]ontent-[Tt]ype: *//')"
if grep -qi 'xml' <<<"$CT"; then ok "sitemap Content-Type is XML ($CT)"; else bad "sitemap Content-Type is '$CT' — expected application/xml"; fi

SITEMAP="$(body "$BASE/sitemap.xml")"
mapfile -t URLS < <(grep -o '<loc>[^<]*</loc>' <<<"$SITEMAP" | sed 's|</\?loc>||g')
COUNT="${#URLS[@]}"
check "sitemap lists 40 URLs" "$COUNT" "40"
grep -q '<priority>'   <<<"$SITEMAP" && bad "sitemap contains <priority>"   || ok "sitemap omits <priority>"
grep -q '<changefreq>' <<<"$SITEMAP" && bad "sitemap contains <changefreq>" || ok "sitemap omits <changefreq>"
grep -q '\.html<'      <<<"$SITEMAP" && bad "sitemap contains .html URLs"   || ok "sitemap contains no .html URLs"
grep -qE 'cornerstone-articles|food-guides' <<<"$SITEMAP" \
  && bad "sitemap contains redirected URLs" || ok "sitemap contains no redirected URLs"
LASTMODS="$(grep -o '<lastmod>[^<]*</lastmod>' <<<"$SITEMAP" | sed 's|</\?lastmod>||g' | sort -u | wc -l)"
if [[ "$LASTMODS" -le 1 && "$COUNT" -gt 1 ]]; then
  bad "all lastmod dates are identical — looks synthetic"
else
  ok "lastmod dates vary ($LASTMODS distinct values)"
fi

# ---------------------------------------------------------------- 3. every sitemap URL is 200
echo; echo "--- every sitemap URL returns 200 ---"
BAD_URLS=0
for u in "${URLS[@]}"; do
  # test against $BASE so this works on preview deployments too
  path="${u#*://*/}"; [[ "$path" == "$u" ]] && path=""
  s="$(status "$BASE/$path")"
  if [[ "$s" != "200" ]]; then red "  [FAIL] $s  /$path"; BAD_URLS=$((BAD_URLS+1)); fi
done
if [[ "$BAD_URLS" -eq 0 ]]; then ok "all $COUNT sitemap URLs return 200"
else bad "$BAD_URLS sitemap URL(s) did not return 200"; fi

# ---------------------------------------------------------------- 4. redirects
echo; echo "--- redirects ---"
check "/cornerstone-articles returns 301" "$(status "$BASE/cornerstone-articles")" "301"
LOC="$(location "$BASE/cornerstone-articles")"
[[ "$LOC" == *"/blog" ]] && ok "/cornerstone-articles → /blog" || bad "/cornerstone-articles → '$LOC' (expected /blog)"

check "/food-guides returns 301" "$(status "$BASE/food-guides")" "301"
LOC="$(location "$BASE/food-guides")"
[[ "$LOC" == *"/food" ]] && ok "/food-guides → /food" || bad "/food-guides → '$LOC' (expected /food)"

# legacy .html URLs Google may already know — these must NOT break
for legacy in "/why-accuracy.html" "/blog/calculator-accuracy-decimal-feet-bug.html"; do
  s="$(status "$BASE$legacy")"
  if [[ "$s" == "301" || "$s" == "308" ]]; then ok "legacy $legacy still redirects ($s)"
  else bad "legacy $legacy returned $s — expected 301/308"; fi
done

# trailing slash normalisation
s="$(status "$BASE/blog/")"
if [[ "$s" == "301" || "$s" == "308" ]]; then ok "/blog/ redirects to /blog ($s)"
else bad "/blog/ returned $s — trailingSlash:false should redirect"; fi

# ---------------------------------------------------------------- 5. 404 behaviour
echo; echo "--- 404 behaviour ---"
check "nonsense URL returns 404" "$(status "$BASE/this-page-does-not-exist-xyz123")" "404"
check "nested nonsense URL returns 404" "$(status "$BASE/blog/no-such-article-abc")" "404"
check "/YOUR_FACEBOOK_URL returns 404" "$(status "$BASE/YOUR_FACEBOOK_URL")" "404"
check "/blog/YOUR_FACEBOOK_URL returns 404" "$(status "$BASE/blog/YOUR_FACEBOOK_URL")" "404"

# ---------------------------------------------------------------- 6. assets
echo; echo "--- assets ---"
check "og-banner.jpg returns 200" "$(status "$BASE/assets/og-banner.jpg")" "200"

# ------------------------------------------------- 6b. orphan food pages gone
echo; echo "--- orphaned food pages must not be live ---"
for p in "/food/bao-dhan-nutrition" "/food/bora-saul-nutrition" \
         "/food/brown-basmati-rice" "/food/joha-rice-nutrition"; do
  s="$(status "$BASE$p")"
  if [[ "$s" == "301" || "$s" == "308" || "$s" == "404" ]]; then ok "$p is $s (removed/redirected)"
  else bad "$p returned $s — orphan page is still live"; fi
done

# ------------------------------------------------- 6c. backups must not deploy
echo; echo "--- backups/scratch must not be deployed ---"
for p in "/backups/backup_2026_06_11/" "/backups/backup_2026_06_13_1225/compare" \
         "/scratch/" "/PROJECT_BRIEF.md" "/CLAUDE_REVIEW.md" "/js/blog-db.js"; do
  s="$(status "$BASE$p")"
  if [[ "$p" == "/js/blog-db.js" ]]; then
    check "blog-db.js is served (needed by the app)" "$s" "200"
  elif [[ "$s" == "404" ]]; then ok "$p is 404 (correctly excluded)"
  else bad "$p returned $s — should be excluded via .vercelignore"; fi
done

# ---------------------------------------------------------------- 7. canonicals
echo; echo "--- canonical tags (all sitemap URLs) ---"
CANON_FAIL=0
for u in "${URLS[@]}"; do
  path="${u#*://*/}"; [[ "$path" == "$u" ]] && path=""
  html="$(body "$BASE/$path")"
  n="$(grep -o 'rel="canonical"' <<<"$html" | wc -l | tr -d ' ')"
  c="$(grep -o '<link[^>]*rel="canonical"[^>]*>' <<<"$html" | grep -o 'href="[^"]*"' | head -1 | sed 's/href="//;s/"//')"
  if [[ "$n" -ne 1 ]]; then red "  [FAIL] /$path has $n canonical tags"; CANON_FAIL=$((CANON_FAIL+1)); continue; fi
  if [[ "$c" != "$u" ]]; then red "  [FAIL] /$path canonical is '$c' (expected '$u')"; CANON_FAIL=$((CANON_FAIL+1)); continue; fi
done
if [[ "$CANON_FAIL" -eq 0 ]]; then ok "all $COUNT pages have exactly one correct self-referencing canonical"
else bad "$CANON_FAIL page(s) have canonical problems"; fi

# ---------------------------------------------------------------- 8. hreflang reciprocity
echo; echo "--- hreflang reciprocity (6 localized groups) ---"
GROUPS=( "/|/as|/hi" "/compare|/as/compare|/hi/compare" "/why-accuracy|/as/why-accuracy|/hi/why-accuracy" \
         "/about|/as/about|/hi/about" "/disclaimer|/as/disclaimer|/hi/disclaimer" "/sources|/as/sources|/hi/sources" )
HREF_FAIL=0
for g in "${GROUPS[@]}"; do
  IFS='|' read -r en as hi <<<"$g"
  for p in "$en" "$as" "$hi"; do
    html="$(body "$BASE$p")"
    for target in "$en" "$as" "$hi"; do
      if ! grep -q "hreflang=\"[^\"]*\"[^>]*href=\"[^\"]*${target}\"" <<<"$html" \
         && ! grep -q "href=\"[^\"]*${target}\"[^>]*hreflang=" <<<"$html"; then
        red "  [FAIL] $p missing hreflang → $target"; HREF_FAIL=$((HREF_FAIL+1))
      fi
    done
    grep -q 'hreflang="x-default"' <<<"$html" || { red "  [FAIL] $p missing x-default"; HREF_FAIL=$((HREF_FAIL+1)); }
  done
done
if [[ "$HREF_FAIL" -eq 0 ]]; then ok "hreflang is reciprocal and complete across all 6 groups"
else bad "$HREF_FAIL hreflang problem(s)"; fi

# ---------------------------------------------------------------- 9. localized OG tags
echo; echo "--- localized Open Graph on /as and /hi ---"
for p in "/as" "/hi"; do
  html="$(body "$BASE$p")"
  ogurl="$(grep -o '<meta[^>]*property="og:url"[^>]*>' <<<"$html" | grep -o 'content="[^"]*"' | head -1 | sed 's/content="//;s/"//')"
  if [[ "$ogurl" == *"$p" ]]; then ok "$p og:url is localized ($ogurl)"
  else bad "$p og:url is '$ogurl' — should end in $p"; fi
  ogdesc="$(grep -o '<meta[^>]*property="og:description"[^>]*>' <<<"$html" | head -1)"
  if grep -qP '[\x{0900}-\x{097F}\x{0980}-\x{09FF}]' <<<"$ogdesc" 2>/dev/null; then
    ok "$p og:description is in local script"
  else
    bad "$p og:description appears to still be English"
  fi
done

# ---------------------------------------------------------------- 10. hub link counts in RAW html
echo; echo "--- hubs render static links (raw HTML, no JS) ---"
BLOG_RAW="$(curl -sS -A "$UA" --max-time 25 "$BASE/blog")"
N="$(grep -o 'href="[^"]*/blog/[a-z0-9-]*"' <<<"$BLOG_RAW" | sort -u | wc -l | tr -d ' ')"
if [[ "$N" -ge 11 ]]; then ok "/blog raw HTML contains $N article links"; else bad "/blog raw HTML has only $N article links (expected 11)"; fi
FOOD_RAW="$(curl -sS -A "$UA" --max-time 25 "$BASE/food")"
N="$(grep -o 'href="[^"]*/food/[a-z0-9-]*"' <<<"$FOOD_RAW" | sort -u | wc -l | tr -d ' ')"
if [[ "$N" -ge 6 ]]; then ok "/food raw HTML contains $N guide links"; else bad "/food raw HTML has only $N guide links (expected 6)"; fi

# ---------------------------------------------------------------- 11. host canonicalisation (production only)
if [[ "$BASE" == *"katoricalorie.in"* ]]; then
  echo; echo "--- host canonicalisation ---"
  s="$(status "https://katoricalorie.in/")"
  if [[ "$s" == "301" || "$s" == "308" ]]; then ok "non-www redirects to www ($s)"
  else bad "non-www returned $s — expected 301/308"; fi
fi

# ---------------------------------------------------------------- summary
echo
echo "=============================================="
green " PASSED: $PASS"
[[ "$FAIL" -gt 0 ]] && red " FAILED: $FAIL" || green " FAILED: 0"
echo "=============================================="
[[ "$FAIL" -eq 0 ]] || exit 1
