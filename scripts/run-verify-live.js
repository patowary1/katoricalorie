const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const projectRoot = path.join(__dirname, '..');
const targetBase = process.argv[2] || 'http://localhost:3000';

let passCount = 0;
let failCount = 0;

function ok(msg) {
  console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`);
  passCount++;
}

function bad(msg) {
  console.error(`\x1b[31m[FAIL]\x1b[0m ${msg}`);
  failCount++;
}

function check(title, actual, expected) {
  if (String(actual) === String(expected)) {
    ok(`${title} (${actual})`);
  } else {
    bad(`${title} — expected ${expected}, got ${actual}`);
  }
}

function fetchUrl(urlStr, options = {}) {
  return new Promise((resolve) => {
    const parsed = new URL(urlStr);
    const reqOpts = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Batch1Verifier/1.0)',
        ...(options.headers || {})
      }
    };

    const client = parsed.protocol === 'https:' ? require('https') : require('http');
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

  const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];

    // Check 301 redirects
    for (const r of vercelConfig.redirects || []) {
      if (urlPath === r.source) {
        res.writeHead(301, { 'Location': r.destination });
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
  console.log(` Batch 1 live verification`);
  console.log(` Target: ${baseUrl}`);
  console.log('==============================================\n');

  // 1. robots.txt
  console.log('--- robots.txt ---');
  const robotsRes = await fetchUrl(`${baseUrl}/robots.txt`);
  check('robots.txt returns 200', robotsRes.status, 200);
  if (robotsRes.body.includes('User-agent: *')) ok('robots.txt has User-agent: *'); else bad("robots.txt missing 'User-agent: *'");
  if (robotsRes.body.includes('Allow: /')) ok('robots.txt has Allow: /'); else bad("robots.txt missing 'Allow: /'");
  if (robotsRes.body.includes('Sitemap: http')) ok('robots.txt declares Sitemap'); else bad('robots.txt missing Sitemap line');

  // 2. sitemap.xml
  console.log('\n--- sitemap.xml ---');
  const sitemapRes = await fetchUrl(`${baseUrl}/sitemap.xml`);
  check('sitemap.xml returns 200', sitemapRes.status, 200);
  const ct = sitemapRes.headers['content-type'] || '';
  if (ct.includes('xml')) ok(`sitemap Content-Type is XML (${ct})`); else bad(`sitemap Content-Type is '${ct}' - expected xml`);

  const locMatches = sitemapRes.body.match(/<loc>[^<]*<\/loc>/g) || [];
  const sitemapUrls = locMatches.map(m => m.replace(/<\/?loc>/g, ''));
  check('sitemap lists 40 URLs', sitemapUrls.length, 40);
  if (!sitemapRes.body.includes('<priority>')) ok('sitemap omits <priority>'); else bad('sitemap contains <priority>');
  if (!sitemapRes.body.includes('<changefreq>')) ok('sitemap omits <changefreq>'); else bad('sitemap contains <changefreq>');
  if (!sitemapRes.body.includes('.html<')) ok('sitemap contains no .html URLs'); else bad('sitemap contains .html URLs');

  const lastmods = (sitemapRes.body.match(/<lastmod>[^<]*<\/lastmod>/g) || []).map(m => m.replace(/<\/?lastmod>/g, ''));
  const uniqueLastmods = new Set(lastmods);
  if (uniqueLastmods.size > 1) ok(`lastmod dates vary (${uniqueLastmods.size} distinct values)`); else bad('all lastmod dates are identical');

  // 3. Every sitemap URL returns 200
  console.log('\n--- every sitemap URL returns 200 ---');
  let badUrls = 0;
  for (const u of sitemapUrls) {
    const urlPath = new URL(u).pathname;
    const res = await fetchUrl(`${baseUrl}${urlPath}`);
    if (res.status !== 200) {
      bad(`  ${urlPath} returned ${res.status}`);
      badUrls++;
    }
  }
  if (badUrls === 0) ok(`all ${sitemapUrls.length} sitemap URLs return 200`); else bad(`${badUrls} sitemap URLs did not return 200`);

  // 4. Redirects
  console.log('\n--- redirects ---');
  const csRes = await fetchUrl(`${baseUrl}/cornerstone-articles`);
  check('/cornerstone-articles returns 301', csRes.status, 301);
  check('/cornerstone-articles Location is /blog', csRes.headers.location, '/blog');

  const fgRes = await fetchUrl(`${baseUrl}/food-guides`);
  check('/food-guides returns 301', fgRes.status, 301);
  check('/food-guides Location is /food', fgRes.headers.location, '/food');

  const trailingSlashRes = await fetchUrl(`${baseUrl}/blog/`);
  check('/blog/ redirects to /blog', trailingSlashRes.status, 301);

  // 5. 404 behaviour
  console.log('\n--- 404 behaviour ---');
  check('nonsense URL returns 404', (await fetchUrl(`${baseUrl}/this-page-does-not-exist-xyz123`)).status, 404);
  check('/YOUR_FACEBOOK_URL returns 404', (await fetchUrl(`${baseUrl}/YOUR_FACEBOOK_URL`)).status, 404);

  // 6. Deleted food pages
  console.log('\n--- orphaned food pages must not be live ---');
  for (const p of ['/food/bao-dhan-nutrition', '/food/bora-saul-nutrition', '/food/brown-basmati-rice', '/food/joha-rice-nutrition']) {
    const res = await fetchUrl(`${baseUrl}${p}`);
    if (res.status === 301 || res.status === 404) ok(`${p} is ${res.status}`); else bad(`${p} returned ${res.status}`);
  }

  // 7. Hubs render static links in raw HTML
  console.log('\n--- hubs render static links (raw HTML, no JS) ---');
  const blogRaw = (await fetchUrl(`${baseUrl}/blog`)).body;
  const blogLinks = new Set(blogRaw.match(/href="\/blog\/[a-z0-9-]*"/g) || []);
  if (blogLinks.size >= 11) ok(`/blog raw HTML contains ${blogLinks.size} article links`); else bad(`/blog raw HTML has ${blogLinks.size} links`);

  const foodRaw = (await fetchUrl(`${baseUrl}/food`)).body;
  const foodLinks = new Set(foodRaw.match(/href="\/food\/[a-z0-9-]*"/g) || []);
  if (foodLinks.size >= 6) ok(`/food raw HTML contains ${foodLinks.size} guide links`); else bad(`/food raw HTML has ${foodLinks.size} links`);

  console.log('\n==============================================');
  console.log(` PASSED: ${passCount}`);
  console.log(` FAILED: ${failCount}`);
  console.log('==============================================');

  if (localServer) localServer.close();
  if (failCount > 0) process.exit(1);
}

runLiveVerification();
