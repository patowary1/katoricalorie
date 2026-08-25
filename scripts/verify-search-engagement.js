const fs = require('fs');
const path = require('path');
const { foodDatabase, foodContentMap } = require('../js/food-db');
const { trackKatoriEvent, sanitizeData } = require('../js/analytics');

let pass = 0;
let fail = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    pass++;
  } else {
    console.error(`[FAIL] ${message}`);
    fail++;
  }
}

console.log('====================================================');
console.log(' KATORICALORIE PHASE 3B-2A SEARCH & ENGAGEMENT TEST');
console.log('====================================================\n');

// 1. English Homepage Metadata & H1
console.log('--- 1. English Homepage Intent ---');
const indexHtml = fs.readFileSync('index.html', 'utf-8');
const indexTitle = (indexHtml.match(/<title>([^<]+)<\/title>/i) || [])[1];
const indexH1 = (indexHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]?.trim();
const indexOgTitle = (indexHtml.match(/<meta property="og:title" content="([^"]+)"/i) || [])[1];

assert(indexTitle === 'Indian &amp; Assamese Food Calories by Katori | KatoriCalorie' || indexTitle === 'Indian & Assamese Food Calories by Katori | KatoriCalorie', 'Homepage <title> matches approved intent');
assert(indexH1 === 'Indian &amp; Assamese Food Calories by Katori' || indexH1 === 'Indian & Assamese Food Calories by Katori', 'Homepage <h1> matches approved intent');
assert(indexOgTitle === 'Indian &amp; Assamese Food Calories by Katori | KatoriCalorie' || indexOgTitle === 'Indian & Assamese Food Calories by Katori | KatoriCalorie', 'Homepage og:title aligns with title');

// 2. Regional Priority Pages
console.log('\n--- 2. Regional Priority Pages Metadata & H1 ---');
const priorityPages = [
  {
    file: 'blog/bao-dhan-red-rice-superfood.html',
    expectedTitle: 'Bao Dhan Red Rice Calories & Nutrition | KatoriCalorie',
    expectedH1: 'Bao Dhan Red Rice: Calories & Nutrition',
    expectedCanonical: 'https://www.katoricalorie.in/blog/bao-dhan-red-rice-superfood'
  },
  {
    file: 'blog/joha-rice-antioxidants-benefits.html',
    expectedTitle: 'Joha Rice Calories, Nutrition & Benefits | KatoriCalorie',
    expectedH1: 'Joha Rice: Calories, Nutrition & Benefits',
    expectedCanonical: 'https://www.katoricalorie.in/blog/joha-rice-antioxidants-benefits'
  },
  {
    file: 'food/til-pitha-portion-control.html',
    expectedTitle: 'Til Pitha Calories per Piece & Portion Guide | KatoriCalorie',
    expectedH1: 'Til Pitha Calories & Portion Guide',
    expectedCanonical: 'https://www.katoricalorie.in/food/til-pitha-portion-control'
  },
  {
    file: 'blog/bora-saul-sticky-rice-glycemic-index.html',
    expectedTitle: 'Bora Saul Calories & Nutrition | KatoriCalorie',
    expectedH1: 'Bora Saul: Calories & Nutrition',
    expectedCanonical: 'https://www.katoricalorie.in/blog/bora-saul-sticky-rice-glycemic-index'
  }
];

priorityPages.forEach(p => {
  const html = fs.readFileSync(p.file, 'utf-8');
  const title = (html.match(/<title>([^<]+)<\/title>/i) || [])[1]?.trim();
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]?.trim();
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/i) || [])[1];

  assert(title === p.expectedTitle, `${p.file} <title> is: "${title}"`);
  assert(h1 === p.expectedH1, `${p.file} <h1> is: "${h1}"`);
  assert(canonical === p.expectedCanonical, `${p.file} canonical is preserved: "${canonical}"`);
});

// 3. Food Content Mapping & Detail Links
console.log('\n--- 3. Food-to-Content Mapping (Internal Discovery) ---');
const rawMap = JSON.parse(fs.readFileSync('data/food-content-map.json', 'utf-8'));
const mapKeys = Object.keys(rawMap);
assert(mapKeys.length >= 10, `Mapped food items count is ${mapKeys.length} (>= 10)`);

mapKeys.forEach(foodId => {
  const mapping = rawMap[foodId];
  const targetFile = mapping.primaryUrl.startsWith('/food/') ? `${mapping.primaryUrl.slice(1)}.html` : `${mapping.primaryUrl.slice(1)}.html`;
  const exists = fs.existsSync(targetFile);
  assert(exists, `Mapping target file for "${foodId}" exists at "${targetFile}"`);
});

// Check food cards render real <a> link
const calcJs = fs.readFileSync('js/calculator.js', 'utf-8');
assert(calcJs.includes('class="food-detail-link"'), 'Calculator renders .food-detail-link class');
assert(calcJs.includes('href="${foodContentMap[item.id].primaryUrl}"'), 'Calculator detail links use real <a href> without javascript:void');

// 4. Static Internal Discovery & Related Links
console.log('\n--- 4. Static Discovery & Related Sections ---');
assert(indexHtml.includes('id="guides-heading"'), 'Homepage contains Popular Guides static section');
assert(indexHtml.includes('/blog/bao-dhan-red-rice-superfood'), 'Homepage links to Bao Dhan guide');
assert(indexHtml.includes('/blog/joha-rice-antioxidants-benefits'), 'Homepage links to Joha Rice guide');
assert(indexHtml.includes('/food/til-pitha-portion-control'), 'Homepage links to Til Pitha guide');
assert(indexHtml.includes('/blog/bora-saul-sticky-rice-glycemic-index'), 'Homepage links to Bora Saul guide');

priorityPages.forEach(p => {
  const html = fs.readFileSync(p.file, 'utf-8');
  assert(html.includes('Related Regional Food Guides'), `${p.file} contains contextual Related Guides block`);
});

// 5. Analytics Safety & Privacy Enforcement
console.log('\n--- 5. Umami Analytics Privacy & Safety ---');
assert(typeof trackKatoriEvent === 'function', 'trackKatoriEvent is exported and callable');

// Test that trackKatoriEvent does not throw when umami is missing
let threw = false;
try {
  trackKatoriEvent('test_event', { sample: 123 });
} catch (e) {
  threw = true;
}
assert(!threw, 'trackKatoriEvent fails silently when window.umami is undefined');

// Test privacy sanitizer stripping sensitive fields
const dirtyPayload = {
  food_id: 'bao-dhan',
  age: 30,
  weight: 70,
  height: 175,
  gender: 'male',
  bmr: 1650,
  tdee: 2200,
  query: 'masor tenga recipe',
  category: 'rice'
};
const cleaned = sanitizeData(dirtyPayload);
assert(cleaned.food_id === 'bao-dhan', 'Sanitizer preserves allowed food_id');
assert(cleaned.category === 'rice', 'Sanitizer preserves allowed category');
assert(cleaned.age === undefined, 'Sanitizer strips sensitive age');
assert(cleaned.weight === undefined, 'Sanitizer strips sensitive weight');
assert(cleaned.height === undefined, 'Sanitizer strips sensitive height');
assert(cleaned.gender === undefined, 'Sanitizer strips sensitive gender');
assert(cleaned.bmr === undefined, 'Sanitizer strips sensitive bmr');
assert(cleaned.tdee === undefined, 'Sanitizer strips sensitive tdee');
assert(cleaned.query === undefined, 'Sanitizer strips sensitive search query');

console.log('\n====================================================');
console.log(` RESULTS: ${pass} PASSED | ${fail} FAILED`);
console.log('====================================================');

if (fail > 0) process.exit(1);
