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

// 1. English Homepage Metadata & Single H1
console.log('--- 1. English Homepage Intent & H1 ---');
const indexHtml = fs.readFileSync('index.html', 'utf-8');
const indexTitle = (indexHtml.match(/<title>([^<]+)<\/title>/i) || [])[1];
const h1Matches = indexHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
const indexH1 = h1Matches.length > 0 ? h1Matches[0].replace(/<[^>]+>/g, '').trim() : '';
const indexOgTitle = (indexHtml.match(/<meta property="og:title" content="([^"]+)"/i) || [])[1];

assert(indexTitle === 'Indian &amp; Assamese Food Calories by Katori | KatoriCalorie' || indexTitle === 'Indian & Assamese Food Calories by Katori | KatoriCalorie', 'Homepage <title> matches approved intent');
assert(h1Matches.length === 1, `Exactly one <h1> present on homepage (Found: ${h1Matches.length})`);
assert(indexH1 === 'Indian &amp; Assamese Food Calories by Katori' || indexH1 === 'Indian & Assamese Food Calories by Katori', `Homepage <h1> matches approved text: "${indexH1}"`);
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

// 3. Food Content Mapping & Detail Links (Trust Gate Verification)
console.log('\n--- 3. Food-to-Content Mapping (Trust Gate & Internal Discovery) ---');
const rawMap = JSON.parse(fs.readFileSync('data/food-content-map.json', 'utf-8'));
const mapKeys = Object.keys(rawMap);

assert(!mapKeys.includes('omita-khar'), 'omita-khar is NOT in food-content-map.json (deferred pending calorie review)');
assert(!mapKeys.includes('brown-basmati-rice'), 'brown-basmati-rice is NOT in food-content-map.json (deferred pending claim cleanup)');
assert(!mapKeys.includes('naga-pork'), 'naga-pork is NOT in food-content-map.json (deferred pending portion table alignment)');
assert(mapKeys.length === 7, `Mapped food items count is exactly 7 verified foods (Found: ${mapKeys.length})`);

const mappedUrls = new Set();
mapKeys.forEach(foodId => {
  const mapping = rawMap[foodId];
  const targetFile = `${mapping.primaryUrl.slice(1)}.html`;
  const exists = fs.existsSync(targetFile);
  assert(exists, `Mapping target file for "${foodId}" exists at "${targetFile}"`);
  assert(!mappedUrls.has(mapping.primaryUrl), `Mapped URL "${mapping.primaryUrl}" is unique`);
  mappedUrls.add(mapping.primaryUrl);
});

// Check food cards render real <a> link and preserve Add to Plate
const calcJs = fs.readFileSync('js/calculator.js', 'utf-8');
assert(calcJs.includes('class="food-detail-link"'), 'Calculator renders .food-detail-link class');
assert(calcJs.includes('href="${foodContentMap[item.id].primaryUrl}"'), 'Calculator detail links use real <a href>');
assert(calcJs.includes('class="btn-add-plate'), 'Add to Plate button is preserved intact');

// 4. Static Internal Discovery & Related Sections in RAW HTML
console.log('\n--- 4. Static Discovery & Related Sections in Raw HTML ---');
assert(indexHtml.includes('id="guides-heading"'), 'Homepage contains Popular Guides static section in raw HTML');
assert(indexHtml.includes('/blog/bao-dhan-red-rice-superfood'), 'Homepage raw HTML links to Bao Dhan guide');
assert(indexHtml.includes('/blog/joha-rice-antioxidants-benefits'), 'Homepage raw HTML links to Joha Rice guide');
assert(indexHtml.includes('/food/til-pitha-portion-control'), 'Homepage raw HTML links to Til Pitha guide');
assert(indexHtml.includes('/blog/bora-saul-sticky-rice-glycemic-index'), 'Homepage raw HTML links to Bora Saul guide');
assert(indexHtml.includes('/food/masor-tenga-recipe-nutrition'), 'Homepage raw HTML links to Masor Tenga guide');

priorityPages.forEach(p => {
  const html = fs.readFileSync(p.file, 'utf-8');
  assert(html.includes('Related Regional Food Guides'), `${p.file} contains contextual Related Guides block`);
});

// 5. Analytics Safety & TDEE Semantics
console.log('\n--- 5. Umami Analytics Privacy & TDEE Semantics ---');
assert(typeof trackKatoriEvent === 'function', 'trackKatoriEvent is exported and callable');

// Test that trackKatoriEvent does not throw when umami is missing
let threw = false;
try {
  trackKatoriEvent('test_event', { sample: 123 });
} catch (e) {
  threw = true;
}
assert(!threw, 'trackKatoriEvent fails silently when window.umami is undefined');

// Test that calculateBMR does NOT contain trackKatoriEvent('tdee_calculated')
const bmrFnMatch = calcJs.match(/function calculateBMR\(\)[\s\S]*?return state\.bmr;\s*\}/);
assert(bmrFnMatch && !bmrFnMatch[0].includes('trackKatoriEvent'), 'calculateBMR() does NOT fire trackKatoriEvent (slider movements do not emit telemetry)');

// Test that btnApplyTarget click DOES trigger trackKatoriEvent('tdee_calculated')
assert(calcJs.includes("trackKatoriEvent('tdee_calculated')"), "btnApplyTarget click triggers trackKatoriEvent('tdee_calculated') on intentional application");

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

// Test language code normalization
assert(calcJs.includes("function getCurrentLangCode()"), 'getCurrentLangCode normalizer exists in calculator.js');
assert(calcJs.includes("from: fromLang,\n          to: toLang"), 'Language switch events use normalized language codes (en / as / hi)');

console.log('\n====================================================');
console.log(` RESULTS: ${pass} PASSED | ${fail} FAILED`);
console.log('====================================================');

if (fail > 0) process.exit(1);
