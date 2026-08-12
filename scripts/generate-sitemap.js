const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

const urlMapping = [
  // Core EN
  { url: 'https://www.katoricalorie.in/', file: 'index.html' },
  { url: 'https://www.katoricalorie.in/compare', file: 'compare.html' },
  { url: 'https://www.katoricalorie.in/why-accuracy', file: 'why-accuracy.html' },
  { url: 'https://www.katoricalorie.in/about', file: 'compliance/about.html' },
  { url: 'https://www.katoricalorie.in/disclaimer', file: 'compliance/disclaimer.html' },
  { url: 'https://www.katoricalorie.in/sources', file: 'compliance/sources.html' },
  { url: 'https://www.katoricalorie.in/privacy', file: 'compliance/privacy.html' },
  { url: 'https://www.katoricalorie.in/terms', file: 'compliance/terms.html' },
  { url: 'https://www.katoricalorie.in/contact', file: 'compliance/contact.html' },

  // Blog Hub & Articles
  { url: 'https://www.katoricalorie.in/blog', file: 'blog/index.html' },
  { url: 'https://www.katoricalorie.in/blog/fermented-foods-northeast-india', file: 'blog/fermented-foods-northeast-india.html' },
  { url: 'https://www.katoricalorie.in/blog/khar-calories-alkaline-benefits', file: 'blog/khar-calories-alkaline-benefits.html' },
  { url: 'https://www.katoricalorie.in/blog/masor-tenga-nutrition-heart-healthy-acids', file: 'blog/masor-tenga-nutrition-heart-healthy-acids.html' },
  { url: 'https://www.katoricalorie.in/blog/pitha-carbohydrates-portion-control', file: 'blog/pitha-carbohydrates-portion-control.html' },
  { url: 'https://www.katoricalorie.in/blog/roti-vs-rice-indian-weight-loss', file: 'blog/roti-vs-rice-indian-weight-loss.html' },
  { url: 'https://www.katoricalorie.in/blog/traditional-assamese-herbs-metabolic-health', file: 'blog/traditional-assamese-herbs-metabolic-health.html' },
  { url: 'https://www.katoricalorie.in/blog/calculator-accuracy-decimal-feet-bug', file: 'blog/calculator-accuracy-decimal-feet-bug.html' },
  { url: 'https://www.katoricalorie.in/blog/brown-basmati-rice-weight-loss', file: 'blog/brown-basmati-rice-weight-loss.html' },
  { url: 'https://www.katoricalorie.in/blog/bora-saul-sticky-rice-glycemic-index', file: 'blog/bora-saul-sticky-rice-glycemic-index.html' },
  { url: 'https://www.katoricalorie.in/blog/joha-rice-antioxidants-benefits', file: 'blog/joha-rice-antioxidants-benefits.html' },
  { url: 'https://www.katoricalorie.in/blog/bao-dhan-red-rice-superfood', file: 'blog/bao-dhan-red-rice-superfood.html' },

  // Food Hub & Guides
  { url: 'https://www.katoricalorie.in/food', file: 'food/index.html' },
  { url: 'https://www.katoricalorie.in/food/aloo-pitika-calories', file: 'food/aloo-pitika-calories.html' },
  { url: 'https://www.katoricalorie.in/food/dosa-sambar-calories', file: 'food/dosa-sambar-calories.html' },
  { url: 'https://www.katoricalorie.in/food/masor-tenga-recipe-nutrition', file: 'food/masor-tenga-recipe-nutrition.html' },
  { url: 'https://www.katoricalorie.in/food/naga-pork-bamboo-shoot', file: 'food/naga-pork-bamboo-shoot.html' },
  { url: 'https://www.katoricalorie.in/food/omita-khar-nutrition', file: 'food/omita-khar-nutrition.html' },
  { url: 'https://www.katoricalorie.in/food/til-pitha-portion-control', file: 'food/til-pitha-portion-control.html' },

  // Assamese Pages
  { url: 'https://www.katoricalorie.in/as', file: 'as/index.html' },
  { url: 'https://www.katoricalorie.in/as/compare', file: 'as/compare.html' },
  { url: 'https://www.katoricalorie.in/as/why-accuracy', file: 'as/why-accuracy.html' },
  { url: 'https://www.katoricalorie.in/as/about', file: 'as/compliance/about.html' },
  { url: 'https://www.katoricalorie.in/as/disclaimer', file: 'as/compliance/disclaimer.html' },
  { url: 'https://www.katoricalorie.in/as/sources', file: 'as/compliance/sources.html' },

  // Hindi Pages
  { url: 'https://www.katoricalorie.in/hi', file: 'hi/index.html' },
  { url: 'https://www.katoricalorie.in/hi/compare', file: 'hi/compare.html' },
  { url: 'https://www.katoricalorie.in/hi/why-accuracy', file: 'hi/why-accuracy.html' },
  { url: 'https://www.katoricalorie.in/hi/about', file: 'hi/compliance/about.html' },
  { url: 'https://www.katoricalorie.in/hi/disclaimer', file: 'hi/compliance/disclaimer.html' },
  { url: 'https://www.katoricalorie.in/hi/sources', file: 'hi/compliance/sources.html' }
];

function generateSitemap() {
  console.log(`Generating sitemap for ${urlMapping.length} URLs...`);
  
  const urlEntries = urlMapping.map(entry => {
    return `  <url>\n    <loc>${entry.url}</loc>\n  </url>`;
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
