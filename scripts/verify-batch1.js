const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

let pass = true;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
  } else {
    console.error(`[FAIL] ${message}`);
    pass = false;
  }
}

// 1. Verify robots.txt
const robotsPath = path.join(projectRoot, 'robots.txt');
assert(fs.existsSync(robotsPath), 'robots.txt exists in root');
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf-8').trim();
  const expectedRobots = `User-agent: *\nAllow: /\n\nSitemap: https://www.katoricalorie.in/sitemap.xml`;
  assert(robotsContent === expectedRobots, 'robots.txt formatting matches exact spec');
}

// 2. Verify vercel.json
const vercelPath = path.join(projectRoot, 'vercel.json');
assert(fs.existsSync(vercelPath), 'vercel.json exists');
if (fs.existsSync(vercelPath)) {
  const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
  assert(vercel.trailingSlash === false, 'vercel.json has trailingSlash: false');
  assert(Array.isArray(vercel.redirects) && vercel.redirects.length >= 2, 'vercel.json has 301 redirects');
  assert(!vercel.rewrites.some(r => r.source === '/(.*)'), 'vercel.json has no catch-all rewrite');
}

// 3. Verify 404.html
const page404Path = path.join(projectRoot, '404.html');
assert(fs.existsSync(page404Path), '404.html exists in root');

// 4. Verify Raw HTML source of blog/index.html and food/index.html
const blogIndexPath = path.join(projectRoot, 'blog', 'index.html');
const blogHtml = fs.readFileSync(blogIndexPath, 'utf-8');
const blogCardLinks = blogHtml.match(/href="\/blog\/[^"]+"/g) || [];
assert(blogCardLinks.length === 11, `blog/index.html raw HTML contains 11 static article links (Found: ${blogCardLinks.length})`);
assert(!blogHtml.includes('href="/blog/calculator-accuracy-decimal-feet-bug.html"'), 'blog/index.html has no .html links');

const foodIndexPath = path.join(projectRoot, 'food', 'index.html');
const foodHtml = fs.readFileSync(foodIndexPath, 'utf-8');
const foodCardLinks = foodHtml.match(/href="\/food\/[^"]+"/g) || [];
assert(foodCardLinks.length === 6, `food/index.html raw HTML contains 6 static food guide links (Found: ${foodCardLinks.length})`);

// 5. Verify sitemap.xml
const sitemapPath = path.join(projectRoot, 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'sitemap.xml exists');
if (fs.existsSync(sitemapPath)) {
  const sitemapXml = fs.readFileSync(sitemapPath, 'utf-8');
  const locMatches = sitemapXml.match(/<loc>(.*?)<\/loc>/g) || [];
  assert(locMatches.length === 40, `sitemap.xml lists exactly 40 canonical URLs (Found: ${locMatches.length})`);
  assert(!sitemapXml.includes('<priority>'), 'sitemap.xml omits <priority>');
  assert(!sitemapXml.includes('<changefreq>'), 'sitemap.xml omits <changefreq>');
  assert(!sitemapXml.includes('.html</loc>'), 'sitemap.xml contains no .html URLs');
  assert(!sitemapXml.includes('cornerstone-articles'), 'sitemap.xml contains no redirected URLs');
}

// 6. Verify hi/compare canonical
const hiComparePath = path.join(projectRoot, 'hi', 'compare.html');
const hiCompareHtml = fs.readFileSync(hiComparePath, 'utf-8');
assert(hiCompareHtml.includes('<link rel="canonical" href="https://www.katoricalorie.in/hi/compare">'), '/hi/compare canonical is clean (no .html)');

if (pass) {
  console.log('\n=== ALL BATCH 1 VERIFICATION TESTS PASSED ===');
} else {
  console.error('\n=== BATCH 1 VERIFICATION FAILED ===');
  process.exit(1);
}
