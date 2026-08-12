const fs = require('fs');
const path = require('path');

const isDryRun = process.argv.includes('--dry-run');
const projectRoot = path.join(__dirname, '..');

// Map relative file paths to their canonical clean URLs
const canonicalMap = {
  'index.html': 'https://www.katoricalorie.in/',
  'compare.html': 'https://www.katoricalorie.in/compare',
  'why-accuracy.html': 'https://www.katoricalorie.in/why-accuracy',
  'compliance/about.html': 'https://www.katoricalorie.in/about',
  'compliance/disclaimer.html': 'https://www.katoricalorie.in/disclaimer',
  'compliance/sources.html': 'https://www.katoricalorie.in/sources',
  'compliance/privacy.html': 'https://www.katoricalorie.in/privacy',
  'compliance/terms.html': 'https://www.katoricalorie.in/terms',
  'compliance/contact.html': 'https://www.katoricalorie.in/contact',

  'blog/index.html': 'https://www.katoricalorie.in/blog',
  'blog/fermented-foods-northeast-india.html': 'https://www.katoricalorie.in/blog/fermented-foods-northeast-india',
  'blog/khar-calories-alkaline-benefits.html': 'https://www.katoricalorie.in/blog/khar-calories-alkaline-benefits',
  'blog/masor-tenga-nutrition-heart-healthy-acids.html': 'https://www.katoricalorie.in/blog/masor-tenga-nutrition-heart-healthy-acids',
  'blog/pitha-carbohydrates-portion-control.html': 'https://www.katoricalorie.in/blog/pitha-carbohydrates-portion-control',
  'blog/roti-vs-rice-indian-weight-loss.html': 'https://www.katoricalorie.in/blog/roti-vs-rice-indian-weight-loss',
  'blog/traditional-assamese-herbs-metabolic-health.html': 'https://www.katoricalorie.in/blog/traditional-assamese-herbs-metabolic-health',
  'blog/calculator-accuracy-decimal-feet-bug.html': 'https://www.katoricalorie.in/blog/calculator-accuracy-decimal-feet-bug',
  'blog/brown-basmati-rice-weight-loss.html': 'https://www.katoricalorie.in/blog/brown-basmati-rice-weight-loss',
  'blog/bora-saul-sticky-rice-glycemic-index.html': 'https://www.katoricalorie.in/blog/bora-saul-sticky-rice-glycemic-index',
  'blog/joha-rice-antioxidants-benefits.html': 'https://www.katoricalorie.in/blog/joha-rice-antioxidants-benefits',
  'blog/bao-dhan-red-rice-superfood.html': 'https://www.katoricalorie.in/blog/bao-dhan-red-rice-superfood',

  'food/index.html': 'https://www.katoricalorie.in/food',
  'food/aloo-pitika-calories.html': 'https://www.katoricalorie.in/food/aloo-pitika-calories',
  'food/dosa-sambar-calories.html': 'https://www.katoricalorie.in/food/dosa-sambar-calories',
  'food/masor-tenga-recipe-nutrition.html': 'https://www.katoricalorie.in/food/masor-tenga-recipe-nutrition',
  'food/naga-pork-bamboo-shoot.html': 'https://www.katoricalorie.in/food/naga-pork-bamboo-shoot',
  'food/omita-khar-nutrition.html': 'https://www.katoricalorie.in/food/omita-khar-nutrition',
  'food/til-pitha-portion-control.html': 'https://www.katoricalorie.in/food/til-pitha-portion-control',

  'as/index.html': 'https://www.katoricalorie.in/as',
  'as/compare.html': 'https://www.katoricalorie.in/as/compare',
  'as/why-accuracy.html': 'https://www.katoricalorie.in/as/why-accuracy',
  'as/compliance/about.html': 'https://www.katoricalorie.in/as/about',
  'as/compliance/disclaimer.html': 'https://www.katoricalorie.in/as/disclaimer',
  'as/compliance/sources.html': 'https://www.katoricalorie.in/as/sources',

  'hi/index.html': 'https://www.katoricalorie.in/hi',
  'hi/compare.html': 'https://www.katoricalorie.in/hi/compare',
  'hi/why-accuracy.html': 'https://www.katoricalorie.in/hi/why-accuracy',
  'hi/compliance/about.html': 'https://www.katoricalorie.in/hi/about',
  'hi/compliance/disclaimer.html': 'https://www.katoricalorie.in/hi/disclaimer',
  'hi/compliance/sources.html': 'https://www.katoricalorie.in/hi/sources'
};

const hreflangGroups = {
  'home': {
    en: 'https://www.katoricalorie.in/',
    as: 'https://www.katoricalorie.in/as',
    hi: 'https://www.katoricalorie.in/hi',
    xDefault: 'https://www.katoricalorie.in/'
  },
  'compare': {
    en: 'https://www.katoricalorie.in/compare',
    as: 'https://www.katoricalorie.in/as/compare',
    hi: 'https://www.katoricalorie.in/hi/compare',
    xDefault: 'https://www.katoricalorie.in/compare'
  },
  'why-accuracy': {
    en: 'https://www.katoricalorie.in/why-accuracy',
    as: 'https://www.katoricalorie.in/as/why-accuracy',
    hi: 'https://www.katoricalorie.in/hi/why-accuracy',
    xDefault: 'https://www.katoricalorie.in/why-accuracy'
  },
  'about': {
    en: 'https://www.katoricalorie.in/about',
    as: 'https://www.katoricalorie.in/as/about',
    hi: 'https://www.katoricalorie.in/hi/about',
    xDefault: 'https://www.katoricalorie.in/about'
  },
  'disclaimer': {
    en: 'https://www.katoricalorie.in/disclaimer',
    as: 'https://www.katoricalorie.in/as/disclaimer',
    hi: 'https://www.katoricalorie.in/hi/disclaimer',
    xDefault: 'https://www.katoricalorie.in/disclaimer'
  },
  'sources': {
    en: 'https://www.katoricalorie.in/sources',
    as: 'https://www.katoricalorie.in/as/sources',
    hi: 'https://www.katoricalorie.in/hi/sources',
    xDefault: 'https://www.katoricalorie.in/sources'
  }
};

function getHreflangGroupKey(relPath) {
  if (relPath === 'index.html' || relPath === 'as/index.html' || relPath === 'hi/index.html') return 'home';
  if (relPath === 'compare.html' || relPath === 'as/compare.html' || relPath === 'hi/compare.html') return 'compare';
  if (relPath === 'why-accuracy.html' || relPath === 'as/why-accuracy.html' || relPath === 'hi/why-accuracy.html') return 'why-accuracy';
  if (relPath === 'compliance/about.html' || relPath === 'as/compliance/about.html' || relPath === 'hi/compliance/about.html') return 'about';
  if (relPath === 'compliance/disclaimer.html' || relPath === 'as/compliance/disclaimer.html' || relPath === 'hi/compliance/disclaimer.html') return 'disclaimer';
  if (relPath === 'compliance/sources.html' || relPath === 'as/compliance/sources.html' || relPath === 'hi/compliance/sources.html') return 'sources';
  return null;
}

function preflightAudit(files) {
  console.log('=== PRE-FLIGHT AUDIT: Checking for .html in canonical/og:url/twitter:url ===');
  let count = 0;
  for (const relPath of files) {
    const fullPath = path.join(projectRoot, relPath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const matches = content.match(/<link rel="canonical"[^>]*\.html[^>]*>|<meta property="og:url"[^>]*\.html[^>]*>|<meta name="twitter:url"[^>]*\.html[^>]*>/gi);
    if (matches) {
      console.log(`[AUDIT MATCH] ${relPath}:`);
      matches.forEach(m => console.log(`   ${m}`));
      count += matches.length;
    }
  }
  console.log(`Total invalid .html tags found: ${count}\n`);
}

function processFiles() {
  const relPaths = Object.keys(canonicalMap);
  preflightAudit(relPaths);

  console.log(isDryRun ? '=== DRY RUN MODE (No changes written) ===' : '=== APPLYING CHANGES ===');

  let updatedFileCount = 0;

  for (const relPath of relPaths) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, 'utf-8');
    const originalContent = content;
    const cleanUrl = canonicalMap[relPath];

    // 1. Fix/Replace Canonical Tag
    const canonicalTag = `<link rel="canonical" href="${cleanUrl}">`;
    if (content.includes('<link rel="canonical"')) {
      content = content.replace(/<link rel="canonical"[^>]*>/gi, canonicalTag);
    } else {
      content = content.replace(/<\/head>/i, `  ${canonicalTag}\n</head>`);
    }

    // 2. Fix/Replace og:url
    const ogUrlTag = `<meta property="og:url" content="${cleanUrl}">`;
    if (content.includes('property="og:url"')) {
      content = content.replace(/<meta property="og:url"[^>]*>/gi, ogUrlTag);
    }

    // 3. Fix internal links pointing to redirects or .html
    content = content.replace(/href="\/why-accuracy\.html"/g, 'href="/why-accuracy"');
    content = content.replace(/href="\/compare\.html"/g, 'href="/compare"');
    content = content.replace(/href="\/cornerstone-articles"/g, 'href="/blog"');
    content = content.replace(/href="\/food-guides"/g, 'href="/food"');
    content = content.replace(/href="\/blog\/calculator-accuracy-decimal-feet-bug\.html"/g, 'href="/blog/calculator-accuracy-decimal-feet-bug"');

    // Fix relative links in compliance pages
    if (relPath.includes('compliance/')) {
      content = content.replace(/href="index\.html"/g, 'href="/"');
      content = content.replace(/href="about\.html"/g, 'href="/about"');
      content = content.replace(/href="disclaimer\.html"/g, 'href="/disclaimer"');
      content = content.replace(/href="sources\.html"/g, 'href="/sources"');
      content = content.replace(/href="privacy\.html"/g, 'href="/privacy"');
      content = content.replace(/href="terms\.html"/g, 'href="/terms"');
      content = content.replace(/href="contact\.html"/g, 'href="/contact"');
      content = content.replace(/href="blog\.html"/g, 'href="/blog"');
      content = content.replace(/href="food\.html"/g, 'href="/food"');
    }

    // 4. Reciprocal Hreflang Tags for qualifying 6 groups
    const groupKey = getHreflangGroupKey(relPath);
    if (groupKey) {
      const g = hreflangGroups[groupKey];
      const hreflangBlock = `  <link rel="alternate" hreflang="en-IN" href="${g.en}" />\n  <link rel="alternate" hreflang="as" href="${g.as}" />\n  <link rel="alternate" hreflang="hi-IN" href="${g.hi}" />\n  <link rel="alternate" hreflang="x-default" href="${g.xDefault}" />`;

      // Remove any existing hreflang tags first
      content = content.replace(/<link rel="alternate" hreflang="[^"]*"[^>]*>\s*/gi, '');

      // Insert fresh block right before </head>
      content = content.replace(/<\/head>/i, `${hreflangBlock}\n</head>`);
    }

    if (content !== originalContent) {
      updatedFileCount++;
      console.log(`[MODIFIED] ${relPath}`);
      if (!isDryRun) {
        fs.writeFileSync(fullPath, content, 'utf-8');
      }
    }
  }

  console.log(`\nProcessed ${relPaths.length} files. Total files updated: ${updatedFileCount}`);
}

processFiles();
