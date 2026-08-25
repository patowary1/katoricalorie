const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

function relPath(p) {
  return path.relative(projectRoot, p).replace(/\\/g, '/');
}

function getAllRepoFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const relative = relPath(filePath);

    if (relative.startsWith('.git') || relative.startsWith('backups') || relative.startsWith('node_modules') || relative.startsWith('scratch')) {
      continue;
    }

    if (fs.statSync(filePath).isDirectory()) {
      getAllRepoFiles(filePath, fileList);
    } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.json')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const repoFiles = getAllRepoFiles(projectRoot);

// 4. SEARCH INTENT & METADATA AUDIT
const gscPages = [
  'index.html',
  'hi/index.html',
  'as/index.html',
  'blog/bao-dhan-red-rice-superfood.html',
  'blog/joha-rice-antioxidants-benefits.html',
  'food/til-pitha-portion-control.html',
  'blog/brown-basmati-rice-weight-loss.html',
  'blog/bora-saul-sticky-rice-glycemic-index.html',
  'why-accuracy.html',
  'hi/compare.html',
  'hi/why-accuracy.html'
];

console.log('====================================================');
console.log(' 4. SEARCH-INTENT & METADATA AUDIT (11 PAGES)');
console.log('====================================================');

gscPages.forEach(p => {
  const filePath = path.join(projectRoot, p);
  if (!fs.existsSync(filePath)) {
    console.log(`Page MISSING: ${p}`);
    return;
  }
  const html = fs.readFileSync(filePath, 'utf-8');

  // Title
  const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || 'NONE';
  // Meta description
  const metaDesc = (html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i) || [])[1] || 'NONE';
  // H1
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim() || 'NONE';
  // First 150 words (strip HTML tags)
  const bodyText = html.replace(/<head>[\s\S]*?<\/head>/i, '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const first150Words = bodyText.split(' ').slice(0, 150).join(' ');

  // Structured Data Types
  const jsonLdBlocks = html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi) || [];
  const sdTypes = [];
  jsonLdBlocks.forEach(b => {
    const typeMatches = b.match(/"@type"\s*:\s*"([^"]+)"/g) || [];
    typeMatches.forEach(tm => sdTypes.push(tm.replace(/"@type"\s*:\s*"/, '').replace('"', '')));
  });

  // Outgoing internal links
  const outgoingLinks = new Set();
  const linkMatches = html.match(/href="(\/[^"]*)"/g) || [];
  linkMatches.forEach(lm => {
    const href = lm.replace(/href="/, '').replace('"', '');
    if (!href.startsWith('//') && !href.startsWith('/assets') && !href.startsWith('/css') && !href.startsWith('/js')) {
      outgoingLinks.add(href);
    }
  });

  // Incoming internal links from other files
  const pageUrl = '/' + p.replace('index.html', '').replace('.html', '').replace(/\/$/, '');
  const targetUrl = pageUrl === '' ? '/' : pageUrl;
  const incomingFiles = [];
  repoFiles.forEach(rf => {
    if (rf !== filePath) {
      const rfContent = fs.readFileSync(rf, 'utf-8');
      if (rfContent.includes(`href="${targetUrl}"`) || (targetUrl !== '/' && rfContent.includes(`href="${targetUrl}/"`)) || (targetUrl !== '/' && rfContent.includes(`href="${targetUrl}.html"`))) {
        incomingFiles.push(relPath(rf));
      }
    }
  });

  console.log(`\nURL: ${targetUrl}`);
  console.log(`  File: ${p}`);
  console.log(`  Title: ${title}`);
  console.log(`  Meta Desc: ${metaDesc}`);
  console.log(`  H1: ${h1}`);
  console.log(`  First 150 words: ${first150Words.slice(0, 200)}...`);
  console.log(`  Structured Data Types: [${sdTypes.join(', ')}]`);
  console.log(`  Incoming Internal Links (${incomingFiles.length}): [${incomingFiles.slice(0, 10).join(', ')}]`);
  console.log(`  Outgoing Internal Links (${outgoingLinks.size}): [${Array.from(outgoingLinks).join(', ')}]`);
});

// 5. HOMEPAGE DATA DUPLICATION
console.log('\n====================================================');
console.log(' 5. HOMEPAGE DATA DUPLICATION AUDIT');
console.log('====================================================');

const foodDbPath = path.join(projectRoot, 'js', 'food-db.js');
if (fs.existsSync(foodDbPath)) {
  const foodDbContent = fs.readFileSync(foodDbPath, 'utf-8');
  const targetDupes = ['Brown Basmati Rice', 'Boiled Egg', 'Moong Dal', 'Masoor Dal', 'Bora Saul', 'Til Pitha', 'Masor Tenga', 'Omita Khar', 'Joha Rice', 'Bao Dhan'];

  targetDupes.forEach(foodName => {
    const regex = new RegExp(`name:\\s*"${foodName}"`, 'gi');
    const matches = foodDbContent.match(regex) || [];
    console.log(`Food Database (${foodName}): found ${matches.length} occurrences in js/food-db.js`);
  });
}

// 8. UMAMI EVENT AUDIT
console.log('\n====================================================');
console.log(' 8. UMAMI EVENT TRACKING AUDIT');
console.log('====================================================');

const analyticsMatches = [];
repoFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf-8');
  const relative = relPath(f);

  if (/umami|data-website-id|umami\.track|gtag|ga\(/i.test(content)) {
    analyticsMatches.push(relative);
  }
});
console.log(`Files referencing analytics scripts (${analyticsMatches.length}): [${analyticsMatches.join(', ')}]`);
