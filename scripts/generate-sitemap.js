const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.join(__dirname, '..');

const urlMapping = [
  // Core EN (updated June 2026)
  { url: 'https://www.katoricalorie.in/', file: 'index.html', date: '2026-06-13' },
  { url: 'https://www.katoricalorie.in/compare', file: 'compare.html', date: '2026-06-13' },
  { url: 'https://www.katoricalorie.in/why-accuracy', file: 'why-accuracy.html', date: '2026-06-13' },
  { url: 'https://www.katoricalorie.in/about', file: 'compliance/about.html', date: '2026-06-13' },
  { url: 'https://www.katoricalorie.in/disclaimer', file: 'compliance/disclaimer.html', date: '2026-06-13' },
  { url: 'https://www.katoricalorie.in/sources', file: 'compliance/sources.html', date: '2026-06-13' },
  { url: 'https://www.katoricalorie.in/privacy', file: 'compliance/privacy.html', date: '2026-06-13' },
  { url: 'https://www.katoricalorie.in/terms', file: 'compliance/terms.html', date: '2026-06-13' },
  { url: 'https://www.katoricalorie.in/contact', file: 'compliance/contact.html', date: '2026-06-13' },

  // Blog Hub & Original Articles
  { url: 'https://www.katoricalorie.in/blog', file: 'blog/index.html', date: '2026-06-16' },
  { url: 'https://www.katoricalorie.in/blog/fermented-foods-northeast-india', file: 'blog/fermented-foods-northeast-india.html', date: '2026-06-11' },
  { url: 'https://www.katoricalorie.in/blog/khar-calories-alkaline-benefits', file: 'blog/khar-calories-alkaline-benefits.html', date: '2026-06-11' },
  { url: 'https://www.katoricalorie.in/blog/masor-tenga-nutrition-heart-healthy-acids', file: 'blog/masor-tenga-nutrition-heart-healthy-acids.html', date: '2026-06-11' },
  { url: 'https://www.katoricalorie.in/blog/pitha-carbohydrates-portion-control', file: 'blog/pitha-carbohydrates-portion-control.html', date: '2026-06-11' },
  { url: 'https://www.katoricalorie.in/blog/roti-vs-rice-indian-weight-loss', file: 'blog/roti-vs-rice-indian-weight-loss.html', date: '2026-06-11' },
  { url: 'https://www.katoricalorie.in/blog/traditional-assamese-herbs-metabolic-health', file: 'blog/traditional-assamese-herbs-metabolic-health.html', date: '2026-06-11' },
  { url: 'https://www.katoricalorie.in/blog/calculator-accuracy-decimal-feet-bug', file: 'blog/calculator-accuracy-decimal-feet-bug.html', date: '2026-06-13' },

  // Newer Blog Articles
  { url: 'https://www.katoricalorie.in/blog/brown-basmati-rice-weight-loss', file: 'blog/brown-basmati-rice-weight-loss.html', date: '2026-06-16' },
  { url: 'https://www.katoricalorie.in/blog/bora-saul-sticky-rice-glycemic-index', file: 'blog/bora-saul-sticky-rice-glycemic-index.html', date: '2026-06-16' },
  { url: 'https://www.katoricalorie.in/blog/joha-rice-antioxidants-benefits', file: 'blog/joha-rice-antioxidants-benefits.html', date: '2026-06-16' },
  { url: 'https://www.katoricalorie.in/blog/bao-dhan-red-rice-superfood', file: 'blog/bao-dhan-red-rice-superfood.html', date: '2026-06-16' },

  // Food Hub & Guides
  { url: 'https://www.katoricalorie.in/food', file: 'food/index.html', date: '2026-06-13' },
  { url: 'https://www.katoricalorie.in/food/aloo-pitika-calories', file: 'food/aloo-pitika-calories.html', date: '2026-06-13' },
  { url: 'https://www.katoricalorie.in/food/dosa-sambar-calories', file: 'food/dosa-sambar-calories.html', date: '2026-06-13' },
  { url: 'https://www.katoricalorie.in/food/masor-tenga-recipe-nutrition', file: 'food/masor-tenga-recipe-nutrition.html', date: '2026-06-13' },
  { url: 'https://www.katoricalorie.in/food/naga-pork-bamboo-shoot', file: 'food/naga-pork-bamboo-shoot.html', date: '2026-06-13' },
  { url: 'https://www.katoricalorie.in/food/omita-khar-nutrition', file: 'food/omita-khar-nutrition.html', date: '2026-06-13' },
  { url: 'https://www.katoricalorie.in/food/til-pitha-portion-control', file: 'food/til-pitha-portion-control.html', date: '2026-06-13' },

  // Assamese Pages (August 2026)
  { url: 'https://www.katoricalorie.in/as', file: 'as/index.html', date: '2026-08-11' },
  { url: 'https://www.katoricalorie.in/as/compare', file: 'as/compare.html', date: '2026-08-11' },
  { url: 'https://www.katoricalorie.in/as/why-accuracy', file: 'as/why-accuracy.html', date: '2026-08-11' },
  { url: 'https://www.katoricalorie.in/as/about', file: 'as/compliance/about.html', date: '2026-08-11' },
  { url: 'https://www.katoricalorie.in/as/disclaimer', file: 'as/compliance/disclaimer.html', date: '2026-08-11' },
  { url: 'https://www.katoricalorie.in/as/sources', file: 'as/compliance/sources.html', date: '2026-08-11' },

  // Hindi Pages (August 2026)
  { url: 'https://www.katoricalorie.in/hi', file: 'hi/index.html', date: '2026-08-12' },
  { url: 'https://www.katoricalorie.in/hi/compare', file: 'hi/compare.html', date: '2026-08-12' },
  { url: 'https://www.katoricalorie.in/hi/why-accuracy', file: 'hi/why-accuracy.html', date: '2026-08-12' },
  { url: 'https://www.katoricalorie.in/hi/about', file: 'hi/compliance/about.html', date: '2026-08-12' },
  { url: 'https://www.katoricalorie.in/hi/disclaimer', file: 'hi/compliance/disclaimer.html', date: '2026-08-12' },
  { url: 'https://www.katoricalorie.in/hi/sources', file: 'hi/compliance/sources.html', date: '2026-08-12' }
];

function generateSitemap() {
  console.log(`Generating sitemap for ${urlMapping.length} URLs...`);
  
  const urlEntries = urlMapping.map(entry => {
    return `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.date}</lastmod>
  </url>`;
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>
`;

  const sitemapPath = path.join(projectRoot, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xmlContent, 'utf-8');
  console.log(`sitemap.xml successfully created with ${urlMapping.length} canonical URLs.`);
}

generateSitemap();
