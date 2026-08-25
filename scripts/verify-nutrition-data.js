const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

console.log('====================================================');
console.log(' KATORICALORIE DETERMINISTIC NUTRITION VALIDATION');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;
let pendingCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

function flagPending(foodId, message) {
  console.log(`[PENDING REVIEW] ${foodId}: ${message}`);
  pendingCount++;
}

// 1. Load Canonical Dataset
const canonicalPath = path.join(projectRoot, 'data', 'nutrition-db.json');
assert(fs.existsSync(canonicalPath), 'Canonical nutrition database exists at data/nutrition-db.json');

const canonicalDb = JSON.parse(fs.readFileSync(canonicalPath, 'utf-8'));
const canonicalIds = Object.keys(canonicalDb);
assert(canonicalIds.length > 0, `Canonical database loaded with ${canonicalIds.length} items`);

// 2. Verify js/food-db.js
const foodDbFile = path.join(projectRoot, 'js', 'food-db.js');
assert(fs.existsSync(foodDbFile), 'Interactive app database exists at js/food-db.js');

const foodDbContent = fs.readFileSync(foodDbFile, 'utf-8');
const idMatches = [...foodDbContent.matchAll(/id:\s*["']([^"']+)["']/g)].map(m => m[1]);

// Assert no duplicates in js/food-db.js
const seenIds = new Set();
const duplicateIds = [];
idMatches.forEach(id => {
  if (seenIds.has(id)) {
    duplicateIds.push(id);
  }
  seenIds.add(id);
});
assert(duplicateIds.length === 0, `Zero duplicate food IDs in js/food-db.js (Found: [${duplicateIds.join(', ')}])`);
assert(idMatches.length === canonicalIds.length, `Food database item count matches canonical count (${idMatches.length} vs ${canonicalIds.length})`);

// 3. Verify Specific Approved Foods
// Masor Tenga
const mt = canonicalDb['masor-tenga'];
assert(mt && mt.nutrition.calories === 140 && mt.nutrition.protein_g === 14.5 && mt.nutrition.carbs_g === 4.0 && mt.nutrition.fat_g === 6.8, 'Masor Tenga canonical values match approved basis (140 kcal, 14.5g P, 4.0g C, 6.8g F / 200ml)');

// Joha Rice
const jr = canonicalDb['joha-rice'];
assert(jr && jr.nutrition.calories === 150 && jr.nutrition.protein_g === 3.8 && jr.nutrition.carbs_g === 31.5 && jr.nutrition.fat_g === 1.0, 'Joha Rice canonical values match approved basis (150 kcal, 3.8g P, 31.5g C, 1.0g F / 150g)');

// Bao Dhan
const bd = canonicalDb['bao-dhan'];
assert(bd && bd.nutrition.calories === 155 && bd.nutrition.protein_g === 4.2 && bd.nutrition.carbs_g === 32.0 && bd.nutrition.fat_g === 1.1, 'Bao Dhan canonical values match approved basis (155 kcal, 4.2g P, 32.0g C, 1.1g F / 150g)');

// Bora Saul
const bs = canonicalDb['bora-saul'];
assert(bs && bs.nutrition.calories === 180 && bs.nutrition.protein_g === 3.2 && bs.nutrition.carbs_g === 38.0 && bs.nutrition.fat_g === 0.8, 'Bora Saul canonical values match approved basis (180 kcal, 3.2g P, 38.0g C, 0.8g F / 150g)');

// Til Pitha
const tp = canonicalDb['til-pitha'];
assert(tp && tp.nutrition.calories === 110 && tp.serving.quantity === 30, 'Til Pitha normalized to 110 kcal per 30g piece (derived from 366 kcal / 100g scientific composition)');

// Aloo Pitika
const ap = canonicalDb['aloo-pitika'];
assert(ap && ap.nutrition.calories === 90 && ap.serving.quantity === 100, 'Aloo Pitika normalized to approved 90 kcal / 100g simple preparation');

// Dosa Sambar
const ds = canonicalDb['dosa-sambar'];
assert(ds && ds.nutrition.calories === 240, 'Plain Dosa with Sambar normalized to approved 240 kcal / plate');

// Omita Khar
const ok = canonicalDb['omita-khar'];
if (ok && ok.evidence && ok.evidence.status === 'pending_review') {
  flagPending('omita-khar', 'production values differ (55 vs 65 kcal / 150g) — flagged as pending_review without guessing');
} else {
  assert(false, 'Omita Khar must be explicitly flagged with status: pending_review');
}

// 4. Verify Food Guide Recipes Schema
const guides = [
  { file: 'food/masor-tenga-recipe-nutrition.html', expectedCal: '140 calories' },
  { file: 'food/omita-khar-nutrition.html', expectedCal: '55 calories' },
  { file: 'food/aloo-pitika-calories.html', expectedCal: '90 calories' },
  { file: 'food/dosa-sambar-calories.html', expectedCal: '240 calories' },
  { file: 'food/naga-pork-bamboo-shoot.html', expectedCal: '320 calories' },
  { file: 'food/til-pitha-portion-control.html', expectedCal: '110 calories' }
];

guides.forEach(g => {
  const filePath = path.join(projectRoot, g.file);
  const html = fs.readFileSync(filePath, 'utf-8');
  const calMatch = html.match(/"calories":\s*"([^"]+)"/);
  const hasCal = calMatch && calMatch[1] === g.expectedCal;
  assert(hasCal, `${g.file} Recipe JSON-LD schema matches canonical calories (${g.expectedCal})`);
});

// 5. Verify Clean Removal of Duplicate Foods
assert(!foodDbContent.includes('id: "brown-basmati",'), 'Duplicate brown-basmati ID removed from js/food-db.js');
assert(foodDbContent.includes('id: "brown-basmati-rice",'), 'Canonical brown-basmati-rice ID preserved in js/food-db.js');

console.log('\n====================================================');
console.log(` RESULTS: ${passCount} PASSED | ${pendingCount} PENDING REVIEW | ${failCount} FAILED`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
}
