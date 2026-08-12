const fs = require('fs');
const path = require('path');
const { blogPosts, foodGuides } = require('../js/blog-db.js');

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
  assert(Array.isArray(vercel.redirects) && vercel.redirects.length >= 6, 'vercel.json has 301 redirects including deleted food pages');
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
let sitemapUrls = [];
if (fs.existsSync(sitemapPath)) {
  const sitemapXml = fs.readFileSync(sitemapPath, 'utf-8');
  const locMatches = sitemapXml.match(/<loc>(.*?)<\/loc>/g) || [];
  sitemapUrls = locMatches.map(m => m.replace(/<\/?loc>/g, ''));
  assert(locMatches.length === 40, `sitemap.xml lists exactly 40 canonical URLs (Found: ${locMatches.length})`);
  assert(!sitemapXml.includes('<priority>'), 'sitemap.xml omits <priority>');
  assert(!sitemapXml.includes('<changefreq>'), 'sitemap.xml omits <changefreq>');
  assert(!sitemapXml.includes('.html</loc>'), 'sitemap.xml contains no .html URLs');
  assert(!sitemapXml.includes('cornerstone-articles'), 'sitemap.xml contains no redirected URLs');
}

// 6. Guard Test: Enumerate all HTML files outside backups/, scratch/, and 404.html
function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const relPath = path.relative(projectRoot, filePath).replace(/\\/g, '/');

    if (relPath.startsWith('backups/') || relPath.startsWith('scratch/') || relPath.startsWith('.git/')) {
      continue;
    }

const ALLOWED_UNREGISTERED = ['404.html', 'google07b32f334e7f727f.html'];

    if (fs.statSync(filePath).isDirectory()) {
      getAllHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html') && !ALLOWED_UNREGISTERED.includes(file)) {
      fileList.push(relPath);
    }
  }
  return fileList;
}

const allHtmlFiles = getAllHtmlFiles(projectRoot);
assert(allHtmlFiles.length === 40, `All active HTML files in repo match sitemap count (Found: ${allHtmlFiles.length})`);

function relPathToCanonicalUrl(relPath) {
  if (relPath === 'index.html') return 'https://www.katoricalorie.in/';
  if (relPath === 'as/index.html') return 'https://www.katoricalorie.in/as';
  if (relPath === 'hi/index.html') return 'https://www.katoricalorie.in/hi';

  const cleanPath = relPath.replace(/\.html$/, '').replace(/\/index$/, '').replace(/(^|\/)compliance\//, '$1');
  return `https://www.katoricalorie.in/${cleanPath}`;
}

let unmappedFiles = 0;
for (const relPath of allHtmlFiles) {
  const expectedUrl = relPathToCanonicalUrl(relPath);
  const isInSitemap = sitemapUrls.includes(expectedUrl);

  if (!isInSitemap) {
    console.error(`[FAIL] Unmapped HTML file found: ${relPath} (Expected URL: ${expectedUrl})`);
    unmappedFiles++;
    pass = false;
  }
}
assert(unmappedFiles === 0, 'No orphaned or unmapped HTML files exist in project');

// 7. Verify hi/compare canonical
const hiComparePath = path.join(projectRoot, 'hi', 'compare.html');
const hiCompareHtml = fs.readFileSync(hiComparePath, 'utf-8');
assert(hiCompareHtml.includes('<link rel="canonical" href="https://www.katoricalorie.in/hi/compare">'), '/hi/compare canonical is clean (no .html)');

// 8. Verify as/index.html Open Graph translation
const asIndexHtml = fs.readFileSync(path.join(projectRoot, 'as', 'index.html'), 'utf-8');
assert(asIndexHtml.includes('অসমীয়া আৰু ভাৰতীয় খাদ্যৰ পুষ্টি আৰু কেলৰি নিৰূপণ'), 'as/index.html OG title is in Assamese');

if (pass) {
  console.log('\n=== ALL BATCH 1 VERIFICATION TESTS PASSED ===');
} else {
  console.error('\n=== BATCH 1 VERIFICATION FAILED ===');
  process.exit(1);
}
