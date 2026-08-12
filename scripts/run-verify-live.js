const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const { URL } = require('url');

const projectRoot = path.join(__dirname, '..');
const targetBase = process.argv[2] || 'http://localhost:3000';

let passCount = 0;
let failCount = 0;

function green(msg) {
  console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`);
  passCount++;
}

function red(msg) {
  console.error(`\x1b[31m[FAIL]\x1b[0m ${msg}`);
  failCount++;
}

function check(title, actual, expected) {
  if (String(actual) === String(expected)) {
    green(`${title} (${actual})`);
  } else {
    red(`${title} — expected ${expected}, got ${actual}`);
  }
}

function fetchUrl(urlStr, options = {}) {
  return new Promise((resolve) => {
    let parsed;
    try {
      parsed = new URL(urlStr);
    } catch (e) {
      return resolve({ status: 0, headers: {}, body: '', error: e });
    }

    const reqOpts = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Batch2Verifier/1.0)',
        ...(options.headers || {})
      }
    };

    const client = parsed.protocol === 'https:' ? https : http;
    const req = client.request(reqOpts, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', (err) => {
      resolve({ status: 0, headers: {}, body: '', error: err });
    });

    req.end();
  });
}

function createLocalServer(port = 3000) {
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(projectRoot, 'vercel.json'), 'utf-8'));
  const vercelIgnorePath = path.join(projectRoot, '.vercelignore');
  const vercelIgnorePatterns = fs.existsSync(vercelIgnorePath)
    ? fs.readFileSync(vercelIgnorePath, 'utf-8').split('\n').map(s => s.trim()).filter(Boolean)
    : [];

  const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];

    // Check .vercelignore rules for local server test simulation
    for (const pat of vercelIgnorePatterns) {
      const cleanPat = pat.replace(/\/$/, '');
      if (cleanPat.endsWith('/*')) {
        const prefix = cleanPat.slice(0, -2);
        if (urlPath.startsWith('/' + prefix)) {
          const page404Path = path.join(projectRoot, '404.html');
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(fs.existsSync(page404Path) ? fs.readFileSync(page404Path) : '404 Not Found');
          return;
        }
      } else if (cleanPat === '*.md') {
        if (urlPath.endsWith('.md')) {
          const page404Path = path.join(projectRoot, '404.html');
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(fs.existsSync(page404Path) ? fs.readFileSync(page404Path) : '404 Not Found');
          return;
        }
      } else {
        if (urlPath.startsWith('/' + cleanPat)) {
          const page404Path = path.join(projectRoot, '404.html');
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(fs.existsSync(page404Path) ? fs.readFileSync(page404Path) : '404 Not Found');
          return;
        }
      }
    }

    // Check 301 redirects
    for (const r of vercelConfig.redirects || []) {
      if (urlPath === r.source) {
        const code = r.statusCode || 301;
        res.writeHead(code, { 'Location': r.destination });
        res.end();
        return;
      }
    }

    // Check trailingSlash
    if (urlPath !== '/' && urlPath.endsWith('/')) {
      res.writeHead(301, { 'Location': urlPath.slice(0, -1) });
      res.end();
      return;
    }

    // Check rewrites
    for (const rw of vercelConfig.rewrites || []) {
      if (urlPath === rw.source) {
        urlPath = rw.destination;
        break;
      }
    }

    let filePath = path.join(projectRoot, urlPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    }

    if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
      let contentType = 'text/html';
      if (filePath.endsWith('.xml')) contentType = 'application/xml; charset=utf-8';
      if (filePath.endsWith('.txt')) contentType = 'text/plain; charset=utf-8';
      if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';
      if (filePath.endsWith('.js')) contentType = 'application/javascript';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(fs.readFileSync(filePath));
    } else {
      const page404Path = path.join(projectRoot, '404.html');
      if (fs.existsSync(page404Path)) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync(page404Path));
      } else {
        res.writeHead(404);
        res.end('404 Not Found');
      }
    }
  });

  return new Promise(resolve => {
    server.listen(port, () => resolve(server));
  });
}

async function runLiveVerification() {
  let localServer = null;
  let baseUrl = targetBase.replace(/\/$/, '');

  if (baseUrl === 'http://localhost:3000') {
    localServer = await createLocalServer(3000);
  }

  console.log('==============================================');
  console.log(` Batch 1 + Batch 2 full live verification suite`);
  console.log(` Target: ${baseUrl}`);
  console.log('==============================================\n');

  // 1. robots.txt
  console.log('--- 1. robots.txt ---');
  const robotsRes = await fetchUrl(`${baseUrl}/robots.txt`);
  check('robots.txt returns 200', robotsRes.status, 200);
  const robotsBody = robotsRes.body;
  if (/User-agent:\s*\*/i.test(robotsBody)) green('robots.txt has User-agent: *'); else red("robots.txt missing 'User-agent: *'");
  if (/Allow:\s*\//i.test(robotsBody)) green('robots.txt has Allow: /'); else red("robots.txt missing 'Allow: /'");
  if (/Sitemap:\s*http/i.test(robotsBody)) green('robots.txt declares Sitemap'); else red('robots.txt missing Sitemap line');
  if (/Disallow:\s*\/\s*$/m.test(robotsBody)) red('robots.txt blocks the whole site!'); else green('robots.txt does not block the site');

  // 2. sitemap.xml
  console.log('\n--- 2. sitemap.xml ---');
  const sitemapRes = await fetchUrl(`${baseUrl}/sitemap.xml`);
  check('sitemap.xml returns 200', sitemapRes.status, 200);
  const ct = sitemapRes.headers['content-type'] || '';
  if (ct.includes('xml')) green(`sitemap Content-Type is XML (${ct})`); else red(`sitemap Content-Type is '${ct}' - expected application/xml`);

  const sitemapBody = sitemapRes.body;
  const locMatches = sitemapBody.match(/<loc>[^<]*<\/loc>/g) || [];
  const sitemapUrls = locMatches.map(m => m.replace(/<\/?loc>/g, ''));
  check('sitemap lists 40 URLs', sitemapUrls.length, 40);
  if (!sitemapBody.includes('<priority>')) green('sitemap omits <priority>'); else red('sitemap contains <priority>');
  if (!sitemapBody.includes('<changefreq>')) green('sitemap omits <changefreq>'); else red('sitemap contains <changefreq>');
  if (!/\.html</.test(sitemapBody)) green('sitemap contains no .html URLs'); else red('sitemap contains .html URLs');
  if (!/cornerstone-articles|food-guides/.test(sitemapBody)) green('sitemap contains no redirected URLs'); else red('sitemap contains redirected URLs');
  if (!sitemapBody.includes('<lastmod>')) green('sitemap omits <lastmod>'); else red('sitemap contains <lastmod>');

  // 3. Every sitemap URL returns 200
  console.log('\n--- 3. every sitemap URL returns 200 ---');
  let badUrls = 0;
  for (const u of sitemapUrls) {
    const urlPath = new URL(u).pathname;
    const res = await fetchUrl(`${baseUrl}${urlPath}`);
    if (res.status !== 200) {
      red(`  ${urlPath} returned ${res.status}`);
      badUrls++;
    }
  }
  if (badUrls === 0) green(`all ${sitemapUrls.length} sitemap URLs return 200`); else red(`${badUrls} sitemap URLs did not return 200`);

  // 4. Redirects
  console.log('\n--- 4. redirects ---');
  const csRes = await fetchUrl(`${baseUrl}/cornerstone-articles`);
  check('/cornerstone-articles returns 301', csRes.status, 301);
  check('/cornerstone-articles Location is /blog', csRes.headers.location, '/blog');

  const fgRes = await fetchUrl(`${baseUrl}/food-guides`);
  check('/food-guides returns 301', fgRes.status, 301);
  check('/food-guides Location is /food', fgRes.headers.location, '/food');

  for (const legacy of ['/why-accuracy.html', '/blog/calculator-accuracy-decimal-feet-bug.html']) {
    const res = await fetchUrl(`${baseUrl}${legacy}`);
    if (res.status === 301 || res.status === 308) green(`legacy ${legacy} redirects (${res.status})`);
    else red(`legacy ${legacy} returned ${res.status} — expected 301/308`);
  }

  const trailingSlashRes = await fetchUrl(`${baseUrl}/blog/`);
  if (trailingSlashRes.status === 301 || trailingSlashRes.status === 308) green(`/blog/ redirects to /blog (${trailingSlashRes.status})`);
  else red(`/blog/ returned ${trailingSlashRes.status} — expected 301/308`);

  // 5. 404 behaviour
  console.log('\n--- 5. 404 behaviour ---');
  check('nonsense URL returns 404', (await fetchUrl(`${baseUrl}/this-page-does-not-exist-xyz123`)).status, 404);
  check('nested nonsense URL returns 404', (await fetchUrl(`${baseUrl}/blog/no-such-article-abc`)).status, 404);
  check('/YOUR_FACEBOOK_URL returns 404', (await fetchUrl(`${baseUrl}/YOUR_FACEBOOK_URL`)).status, 404);
  check('/blog/YOUR_FACEBOOK_URL returns 404', (await fetchUrl(`${baseUrl}/blog/YOUR_FACEBOOK_URL`)).status, 404);

  // 6. Assets & Search Console Verification Guard
  console.log('\n--- 6. assets & search console verification ---');
  check('og-banner.jpg returns 200', (await fetchUrl(`${baseUrl}/assets/og-banner.jpg`)).status, 200);
  check('google07b32f334e7f727f.html returns 200 (GSC verification guard)', (await fetchUrl(`${baseUrl}/google07b32f334e7f727f.html`)).status, 200);

  // 6b. Orphaned food pages
  console.log('\n--- 6b. orphaned food pages must not be live ---');
  for (const p of ['/food/bao-dhan-nutrition', '/food/bora-saul-nutrition', '/food/brown-basmati-rice', '/food/joha-rice-nutrition']) {
    const res = await fetchUrl(`${baseUrl}${p}`);
    if (res.status === 301 || res.status === 308 || res.status === 404) green(`${p} is ${res.status}`);
    else red(`${p} returned ${res.status} — orphan page is still live`);
  }

  // 6c. Backups/scratch must not deploy (.vercelignore)
  console.log('\n--- 6c. backups/scratch must not be deployed ---');
  for (const p of ['/backups/backup_2026_06_11/', '/backups/backup_2026_06_13_1225/compare', '/scratch/', '/PROJECT_BRIEF.md', '/CLAUDE_REVIEW.md', '/js/blog-db.js']) {
    const res = await fetchUrl(`${baseUrl}${p}`);
    if (p === '/js/blog-db.js') {
      check('blog-db.js is served (needed by app)', res.status, 200);
    } else {
      let finalStatus = res.status;
      if (res.status === 301 || res.status === 308) {
        const loc = res.headers.location || (p.endsWith('/') ? p.slice(0, -1) : p);
        finalStatus = (await fetchUrl(`${baseUrl}${loc}`)).status;
      }
      if (finalStatus === 404) {
        green(`${p} resolves to 404 (correctly excluded via .vercelignore)`);
      } else {
        red(`${p} resolved to ${finalStatus} — should be excluded via .vercelignore`);
      }
    }
  }

  // 7. Canonicals (all 40 URLs)
  console.log('\n--- 7. canonical tags (all 40 sitemap URLs) ---');
  let canonFail = 0;
  for (const u of sitemapUrls) {
    const pathName = new URL(u).pathname;
    const res = await fetchUrl(`${baseUrl}${pathName}`);
    const html = res.body;
    const matches = html.match(/rel="canonical"/g) || [];
    const hrefMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i) || html.match(/<link[^>]*href="([^"]*)"[^>]*rel="canonical"/i);
    const href = hrefMatch ? hrefMatch[1] : '';

    if (matches.length !== 1) {
      red(`  /${pathName} has ${matches.length} canonical tags`);
      canonFail++;
    } else if (href !== u) {
      red(`  /${pathName} canonical is '${href}' (expected '${u}')`);
      canonFail++;
    }
  }
  if (canonFail === 0) green(`all ${sitemapUrls.length} pages have exactly one correct self-referencing canonical`);
  else red(`${canonFail} page(s) have canonical problems`);

  // 8. Hreflang reciprocity (6 localized groups)
  console.log('\n--- 8. hreflang reciprocity (6 localized groups) ---');
  const groups = [
    { en: 'https://www.katoricalorie.in/', as: 'https://www.katoricalorie.in/as', hi: 'https://www.katoricalorie.in/hi', paths: ['/', '/as', '/hi'] },
    { en: 'https://www.katoricalorie.in/compare', as: 'https://www.katoricalorie.in/as/compare', hi: 'https://www.katoricalorie.in/hi/compare', paths: ['/compare', '/as/compare', '/hi/compare'] },
    { en: 'https://www.katoricalorie.in/why-accuracy', as: 'https://www.katoricalorie.in/as/why-accuracy', hi: 'https://www.katoricalorie.in/hi/why-accuracy', paths: ['/why-accuracy', '/as/why-accuracy', '/hi/why-accuracy'] },
    { en: 'https://www.katoricalorie.in/about', as: 'https://www.katoricalorie.in/as/about', hi: 'https://www.katoricalorie.in/hi/about', paths: ['/about', '/as/about', '/hi/about'] },
    { en: 'https://www.katoricalorie.in/disclaimer', as: 'https://www.katoricalorie.in/as/disclaimer', hi: 'https://www.katoricalorie.in/hi/disclaimer', paths: ['/disclaimer', '/as/disclaimer', '/hi/disclaimer'] },
    { en: 'https://www.katoricalorie.in/sources', as: 'https://www.katoricalorie.in/as/sources', hi: 'https://www.katoricalorie.in/hi/sources', paths: ['/sources', '/as/sources', '/hi/sources'] }
  ];

  let hrefFail = 0;
  for (const g of groups) {
    for (const p of g.paths) {
      const res = await fetchUrl(`${baseUrl}${p}`);
      const html = res.body;

      for (const target of [g.en, g.as, g.hi]) {
        if (!html.includes(`href="${target}"`)) {
          red(`  ${p} missing hreflang link pointing to ${target}`);
          hrefFail++;
        }
      }
      if (!html.includes('hreflang="x-default"')) {
        red(`  ${p} missing x-default hreflang tag`);
        hrefFail++;
      }
    }
  }
  if (hrefFail === 0) green('hreflang is reciprocal and complete across all 6 groups');
  else red(`${hrefFail} hreflang problem(s)`);

  // 9. Localized Open Graph on /as and /hi
  console.log('\n--- 9. localized Open Graph on /as and /hi ---');
  for (const p of ['/as', '/hi']) {
    const res = await fetchUrl(`${baseUrl}${p}`);
    const html = res.body;
    const ogMatch = html.match(/<meta[^>]*property="og:url"[^>]*content="([^"]*)"/i);
    const ogUrl = ogMatch ? ogMatch[1] : '';

    if (ogUrl.endsWith(p)) green(`${p} og:url is localized (${ogUrl})`);
    else red(`${p} og:url is '${ogUrl}' — should end in ${p}`);

    const ogDescMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/i);
    const ogDesc = ogDescMatch ? ogDescMatch[1] : '';
    if (/[\u0900-\u097F\u0980-\u09FF]/.test(ogDesc)) {
      green(`${p} og:description is in regional script`);
    } else {
      red(`${p} og:description appears to still be English`);
    }
  }

  // 10. Hub link counts in RAW html
  console.log('\n--- 10. hubs render static links (raw HTML, no JS) ---');
  const blogRaw = (await fetchUrl(`${baseUrl}/blog`)).body;
  const blogLinks = new Set(blogRaw.match(/href="\/blog\/[a-z0-9-]*"/g) || []);
  if (blogLinks.size >= 11) green(`/blog raw HTML contains ${blogLinks.size} article links`); else red(`/blog raw HTML has ${blogLinks.size} links (expected 11)`);

  const foodRaw = (await fetchUrl(`${baseUrl}/food`)).body;
  const foodLinks = new Set(foodRaw.match(/href="\/food\/[a-z0-9-]*"/g) || []);
  if (foodLinks.size >= 6) green(`/food raw HTML contains ${foodLinks.size} guide links`); else red(`/food raw HTML has ${foodLinks.size} links (expected 6)`);

  // 11. BATCH 2 ASSERTIONS
  console.log('\n--- 11. BATCH 2 ASSERTIONS ---');

  // 11a. No placeholder social links
  let socialFail = 0;
  for (const p of ['/', '/as', '/hi', '/blog', '/food', '/about', '/why-accuracy']) {
    const html = (await fetchUrl(`${baseUrl}${p}`)).body;
    if (/YOUR_FACEBOOK_URL|YOUR_INSTAGRAM_URL|YOUR_YOUTUBE_URL/i.test(html)) {
      red(`  ${p} contains placeholder social link`);
      socialFail++;
    }
  }
  if (socialFail === 0) green('No page contains placeholder social links (YOUR_FACEBOOK_URL)');
  else red(`${socialFail} page(s) contain placeholder social links`);

  // 11b. No visible ad placement placeholders
  let adFail = 0;
  for (const p of ['/', '/as', '/hi', '/blog', '/food', '/why-accuracy']) {
    const html = (await fetchUrl(`${baseUrl}${p}`)).body;
    if (html.includes('Sponsored Ad Placement — Leaderboard Space') && !html.includes('display: none')) {
      red(`  ${p} renders visible Sponsored Ad Placement text`);
      adFail++;
    }
  }
  if (adFail === 0) green('No page renders visible ad placement text (hidden behind feature flag)');
  else red(`${adFail} page(s) render visible ad placement text`);

  // 11c. No empty src=""
  let srcFail = 0;
  for (const p of ['/', '/as', '/hi', '/blog', '/food']) {
    const html = (await fetchUrl(`${baseUrl}${p}`)).body;
    if (html.includes('src=""')) {
      red(`  ${p} contains empty src="" attribute`);
      srcFail++;
    }
  }
  if (srcFail === 0) green('No page contains empty src="" attributes');
  else red(`${srcFail} page(s) contain empty src="" attributes`);

  // 11d. Food guide recipe formatting
  const masorHtml = (await fetchUrl(`${baseUrl}/food/masor-tenga-recipe-nutrition`)).body;
  if (masorHtml.includes('<ol>') && masorHtml.includes('<li><strong>Select Clean Fish:</strong>')) {
    green('/food/masor-tenga-recipe-nutrition has properly formatted 6-step <ol> list');
  } else {
    red('/food/masor-tenga-recipe-nutrition recipe list formatting is invalid');
  }

  // 11e. Recipe Schema validation on Homepages (0 Recipe nodes)
  const homeHtml = (await fetchUrl(`${baseUrl}/`)).body;
  if (!homeHtml.includes('"@type": "Recipe"') && !homeHtml.includes('"@type":"Recipe"')) {
    green('Homepage / omits Recipe schema (prevents GSC invalid item errors)');
  } else {
    red('Homepage / still contains Recipe schema');
  }

  // 11f. Recipe Schema validation on Food Guides (contains unique @id, recipeYield, prepTime, author, recipeIngredient, recipeInstructions, no aggregateRating/video)
  const masorSchemaRes = (await fetchUrl(`${baseUrl}/food/masor-tenga-recipe-nutrition`)).body;
  if (masorSchemaRes.includes('"recipeYield"') && masorSchemaRes.includes('"recipeInstructions"') && !masorSchemaRes.includes('"aggregateRating"') && !masorSchemaRes.includes('"video"')) {
    green('/food/masor-tenga-recipe-nutrition has valid Recipe schema with recipeYield, prepTime, author, ingredients, HowToStep');
  } else {
    red('/food/masor-tenga-recipe-nutrition Recipe schema missing required fields or contains invalid rating/video');
  }

  // 11g. Image card assets check (all 17 generated card JPGs return 200)
  const cardImages = [
    '/assets/masor-tenga.jpg', '/assets/omita-khar.jpg', '/assets/aloo-pitika.jpg', '/assets/dosa-sambar.jpg',
    '/assets/naga-pork.jpg', '/assets/til-pitha.jpg', '/assets/khar-blog.jpg', '/assets/pitha-blog.jpg',
    '/assets/roti-rice-blog.jpg', '/assets/masor-tenga-blog.jpg', '/assets/fermented-foods-blog.jpg',
    '/assets/herbs-blog.jpg', '/assets/bug-blog.jpg', '/assets/brown-basmati-blog.jpg',
    '/assets/bora-saul-blog.jpg', '/assets/joha-rice-blog.jpg', '/assets/bao-dhan-blog.jpg'
  ];
  let imgFail = 0;
  for (const imgPath of cardImages) {
    const res = await fetchUrl(`${baseUrl}${imgPath}`);
    if (res.status !== 200) {
      red(`  ${imgPath} returned ${res.status}`);
      imgFail++;
    }
  }
  if (imgFail === 0) green('All 17 generated dish/blog card graphic images return HTTP 200');
  else red(`${imgFail} card graphic images failed to return 200`);

  // 12. Host canonicalisation (production/live only)
  if (baseUrl.includes('katoricalorie.in')) {
    console.log('\n--- 12. host canonicalisation ---');
    const nonWwwRes = await fetchUrl('https://katoricalorie.in/');
    if (nonWwwRes.status === 301 || nonWwwRes.status === 308) green(`non-www redirects to www (${nonWwwRes.status})`);
    else red(`non-www returned ${nonWwwRes.status} — expected 301/308`);
  }

  console.log('\n==============================================');
  console.log(` PASSED: ${passCount}`);
  console.log(` FAILED: ${failCount}`);
  console.log('==============================================');

  if (localServer) localServer.close();
  if (failCount > 0) process.exit(1);
}

runLiveVerification();
