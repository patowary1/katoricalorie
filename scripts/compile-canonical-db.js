const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const foodDbFile = path.join(projectRoot, 'js', 'food-db.js');
const rawContent = fs.readFileSync(foodDbFile, 'utf-8');

let items;
try {
  items = require('../js/food-db.js').foodDatabase;
} catch (e) {
  const sandbox = { foodDatabase: [] };
  eval(rawContent.replace(/const foodDatabase\s*=/, 'sandbox.foodDatabase ='));
  items = sandbox.foodDatabase;
}

console.log(`Successfully parsed ${items.length} items from js/food-db.js`);

const canonicalDb = {};

// Clean and populate canonical items
items.forEach(item => {
  if (canonicalDb[item.id]) {
    console.log(`Skipping duplicate item ID during canonical ingestion: ${item.id}`);
    return;
  }

  // Determine serving quantity and unit
  let qty = 1;
  let unit = 'serving';
  let label = item.unit || '1 serving';

  if (item.unit) {
    const gMatch = item.unit.match(/(\d+)\s*g/i);
    const mlMatch = item.unit.match(/(\d+)\s*ml/i);
    const pcMatch = item.unit.match(/(\d+)\s*(piece|pc|roti)/i);
    const plateMatch = item.unit.match(/(\d+)\s*plate/i);
    const bowlMatch = item.unit.match(/(\d+)\s*bowl/i);
    const cupMatch = item.unit.match(/(\d+)\s*cup/i);

    if (gMatch) {
      qty = parseInt(gMatch[1], 10);
      unit = 'g';
    } else if (mlMatch) {
      qty = parseInt(mlMatch[1], 10);
      unit = 'ml';
    } else if (pcMatch) {
      qty = parseInt(pcMatch[1], 10);
      unit = 'piece';
    } else if (plateMatch) {
      qty = parseInt(plateMatch[1], 10);
      unit = 'plate';
    } else if (bowlMatch) {
      qty = parseInt(bowlMatch[1], 10);
      unit = 'bowl';
    } else if (cupMatch) {
      qty = parseInt(cupMatch[1], 10);
      unit = 'cup';
    }
  }

  let evidence = {
    status: 'verified',
    sourceType: 'katoricalorie-curated-standard',
    sourceNote: ''
  };

  // Specific overrides according to Phase 3B-1 requirements
  if (item.id === 'joha-rice') {
    item.calories = 150;
    item.protein = 3.8;
    item.carbs = 31.5;
    item.fat = 1.0;
    item.fiber = 1.2;
    item.unit = '1 katori cooked (150g)';
    qty = 150;
    unit = 'g';
    label = '1 katori cooked (150g)';
    evidence = {
      status: 'verified',
      sourceType: 'regional-grain-standard',
      sourceNote: 'Cooked aromatic indigenous Assam short/medium-grain rice (150 kcal / 150g cooked katori).'
    };
  } else if (item.id === 'bao-dhan') {
    item.calories = 155;
    item.protein = 4.2;
    item.carbs = 32.0;
    item.fat = 1.1;
    item.fiber = 2.8;
    item.unit = '1 katori cooked (150g)';
    qty = 150;
    unit = 'g';
    label = '1 katori cooked (150g)';
    evidence = {
      status: 'verified',
      sourceType: 'regional-grain-standard',
      sourceNote: 'Cooked Assam deep-water red rice rich in mineral ash and anthocyanins (155 kcal / 150g cooked katori).'
    };
  } else if (item.id === 'bora-saul') {
    item.calories = 180;
    item.protein = 3.2;
    item.carbs = 38.0;
    item.fat = 0.8;
    item.fiber = 0.8;
    item.unit = '1 katori cooked (150g)';
    qty = 150;
    unit = 'g';
    label = '1 katori cooked (150g)';
    evidence = {
      status: 'verified',
      sourceType: 'regional-grain-standard',
      sourceNote: 'Cooked waxy glutinous rice with high amylopectin starch content (180 kcal / 150g cooked katori).'
    };
  } else if (item.id === 'til-pitha') {
    item.calories = 110;
    item.protein = 2.94;
    item.carbs = 15.03;
    item.fat = 4.21;
    item.fiber = 1.05;
    item.unit = '1 piece (~30g)';
    qty = 30;
    unit = 'g';
    label = '1 piece (~30g)';
    evidence = {
      status: 'verified',
      sourceType: 'assam-agricultural-university-ijtk',
      sourceNote: 'Assam Agricultural University / IJTK published composition: 365.88 kcal, 9.81g P, 50.11g C, 14.02g F per 100g. Derived 30g piece = ~110 kcal.'
    };
  } else if (item.id === 'aloo-pitika') {
    item.calories = 90;
    item.unit = '1 serving (100g)';
    qty = 100;
    unit = 'g';
    label = '1 serving (100g)';
    evidence = {
      status: 'verified_calories_macros_pending_review',
      sourceType: 'standard-simple-prep',
      sourceNote: 'Approved standard prep calorie basis = 90 kcal / 100g (boiled potato + raw mustard oil drizzle + onion/chili). Macro breakdown flagged pending definitive assay.'
    };
  } else if (item.id === 'dosa-sambar' || item.id === 'plain-dosa-sambar') {
    item.calories = 240;
    item.protein = 6.5;
    item.carbs = 44.0;
    item.fat = 3.8;
    item.fiber = 4.2;
    item.unit = '1 plate (1 Dosa + Sambar)';
    qty = 1;
    unit = 'plate';
    label = '1 plate (1 Dosa + Sambar)';
    evidence = {
      status: 'verified',
      sourceType: 'standard-combination-portion',
      sourceNote: 'Standard plain fermented rice-lentil crepe (~125 kcal) + 1 cup vegetable-lentil sambar (~110 kcal) = ~235-240 kcal.'
    };
  } else if (item.id === 'omita-khar') {
    evidence = {
      status: 'pending_review',
      sourceType: 'unresolved-discrepancy',
      sourceNote: 'Discrepancy between 65 kcal in app food-db vs 55 kcal in recipe guide/cards for 150g serving. Unresolved pending standardized recipe calculation. Values kept as pending_review without guessing.'
    };
  }

  canonicalDb[item.id] = {
    id: item.id,
    name: item.name,
    nameRegional: item.nameRegional || '',
    category: item.category || 'staples',
    serving: {
      label: label,
      quantity: qty,
      unit: unit
    },
    nutrition: {
      calories: item.calories,
      protein_g: item.protein,
      carbs_g: item.carbs,
      fat_g: item.fat,
      fiber_g: item.fiber !== undefined ? item.fiber : 0.0
    },
    desc: item.desc || '',
    evidence: evidence
  };
});

const dataDir = path.join(projectRoot, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const outputPath = path.join(dataDir, 'nutrition-db.json');
fs.writeFileSync(outputPath, JSON.stringify(canonicalDb, null, 2), 'utf-8');
console.log(`Saved canonical nutrition database to data/nutrition-db.json with ${Object.keys(canonicalDb).length} items.`);
