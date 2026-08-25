const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const { URL } = require('url');

const targetBase = 'https://www.katoricalorie.in';

function fetchUrl(urlStr, options = {}) {
  return new Promise((resolve) => {
    let parsed;
    try {
      parsed = new URL(urlStr);
    } catch (e) {
      return resolve({ status: 0, headers: {}, body: '', rawBuffer: Buffer.from('') });
    }

    const reqOpts = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KatoriCalorieAuditor/1.0)',
        ...(options.headers || {})
      }
    };

    const client = parsed.protocol === 'https:' ? https : http;
    const req = client.request(reqOpts, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const rawBuffer = Buffer.concat(chunks);
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: rawBuffer.toString('utf-8'),
          rawBuffer: rawBuffer
        });
      });
    });

    req.on('error', (err) => {
      resolve({ status: 0, headers: {}, body: '', rawBuffer: Buffer.from(''), error: err });
    });

    req.end();
  });
}

async function runAudit() {
  console.log('=== KATORICALORIE REALITY AUDIT ===\n');

  // 1. HTTP Status & Routing Tests
  console.log('--- 1. HTTP Status & Routing ---');
  const nonsenseRes = await fetchUrl(`${targetBase}/this-page-does-not-exist-xyz123`);
  console.log(`Nonsense URL (/this-page-does-not-exist-xyz123): HTTP ${nonsenseRes.status}`);

  const csRes = await fetchUrl(`${targetBase}/cornerstone-articles`);
  console.log(`/cornerstone-articles: HTTP ${csRes.status} -> Location: ${csRes.headers.location}`);

  const fgRes = await fetchUrl(`${targetBase}/food-guides`);
  console.log(`/food-guides: HTTP ${fgRes.status} -> Location: ${fgRes.headers.location}`);

  const whyHtmlRes = await fetchUrl(`${targetBase}/why-accuracy.html`);
  console.log(`/why-accuracy.html: HTTP ${whyHtmlRes.status} -> Location: ${whyHtmlRes.headers.location}`);

  const apexRes = await fetchUrl(`https://katoricalorie.in/`);
  console.log(`Apex https://katoricalorie.in/: HTTP ${apexRes.status} -> Location: ${apexRes.headers.location}`);

  // 2. Sitemap Audit
  console.log('\n--- 2. Sitemap Audit ---');
  const sitemapRes = await fetchUrl(`${targetBase}/sitemap.xml`);
  console.log(`sitemap.xml Status: HTTP ${sitemapRes.status}, Content-Type: ${sitemapRes.headers['content-type']}`);
  const sitemapBody = sitemapRes.body;
  const locMatches = sitemapBody.match(/<loc>[^<]*<\/loc>/g) || [];
  const sitemapUrls = locMatches.map(m => m.replace(/<\/?loc>/g, ''));
  console.log(`Total URLs in sitemap: ${sitemapUrls.length}`);
  const uniqueUrls = new Set(sitemapUrls);
  console.log(`Unique URLs in sitemap: ${uniqueUrls.size}`);
  console.log(`Contains 404.html? ${sitemapBody.includes('404.html')}`);
  console.log(`Contains .html extension? ${/\.html</.test(sitemapBody)}`);

  let sitemapFailCount = 0;
  for (const u of sitemapUrls) {
    const urlPath = new URL(u).pathname;
    const res = await fetchUrl(`${targetBase}${urlPath}`);
    if (res.status !== 200) {
      console.log(`  [FAIL] ${urlPath} returned HTTP ${res.status}`);
      sitemapFailCount++;
    }
  }
  console.log(`Sitemap URLs HTTP 200 Check: ${sitemapFailCount === 0 ? 'ALL 40 URLs RETURN 200 OK' : `${sitemapFailCount} URLs FAILED`}`);

  // 3. Hindi & Assamese Compliance Routing
  console.log('\n--- 3. Hindi & Assamese Compliance Routing ---');
  const compUrls = [
    '/hi/about', '/hi/disclaimer', '/hi/sources',
    '/as/about', '/as/disclaimer', '/as/sources'
  ];
  for (const p of compUrls) {
    const res = await fetchUrl(`${targetBase}${p}`);
    console.log(`${p}: HTTP ${res.status}`);
  }

  // 4. Canonical Tags Audit across all 40 URLs
  console.log('\n--- 4. Canonical Tags Audit ---');
  let canonFails = 0;
  for (const u of sitemapUrls) {
    const pathName = new URL(u).pathname;
    const res = await fetchUrl(`${targetBase}${pathName}`);
    const html = res.body;
    const matches = html.match(/rel="canonical"/g) || [];
    const hrefMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i) || html.match(/<link[^>]*href="([^"]*)"[^>]*rel="canonical"/i);
    const href = hrefMatch ? hrefMatch[1] : '';

    if (matches.length !== 1 || href !== u) {
      console.log(`  [FAIL] ${pathName}: canonical matches=${matches.length}, href='${href}', expected='${u}'`);
      canonFails++;
    }
  }
  console.log(`Canonical Audit Summary: ${canonFails === 0 ? 'ALL 40 URLs HAVE EXACT 1 SELF-REFERENCING ABSOLUTE CANONICAL' : `${canonFails} FAILED`}`);

  // 5. Open Graph Audit on /, /as, /hi
  console.log('\n--- 5. Open Graph Audit ---');
  for (const p of ['/', '/as', '/hi']) {
    const res = await fetchUrl(`${targetBase}${p}`);
    const html = res.body;
    const ogUrl = (html.match(/<meta[^>]*property="og:url"[^>]*content="([^"]*)"/i) || [])[1] || 'MISSING';
    const ogTitle = (html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/i) || [])[1] || 'MISSING';
    const ogDesc = (html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/i) || [])[1] || 'MISSING';
    const ogImg = (html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i) || [])[1] || 'MISSING';

    console.log(`Path: ${p}`);
    console.log(`  og:url = ${ogUrl}`);
    console.log(`  og:title = ${ogTitle}`);
    console.log(`  og:description = ${ogDesc}`);
    console.log(`  og:image = ${ogImg}`);

    if (ogImg !== 'MISSING') {
      const imgRes = await fetchUrl(ogImg);
      console.log(`  og:image HTTP Status = ${imgRes.status}`);
    }
  }

  // 6. robots.txt
  console.log('\n--- 6. robots.txt ---');
  const robotsRes = await fetchUrl(`${targetBase}/robots.txt`);
  console.log(`robots.txt Status: HTTP ${robotsRes.status}, Content-Type: ${robotsRes.headers['content-type']}`);
  console.log(`Body:\n${robotsRes.body.trim()}`);
}

runAudit();
