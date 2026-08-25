const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const canonicalDbPath = path.join(projectRoot, 'data', 'nutrition-db.json');
const foodDbJsPath = path.join(projectRoot, 'js', 'food-db.js');

const canonicalDb = JSON.parse(fs.readFileSync(canonicalDbPath, 'utf-8'));
const items = Object.values(canonicalDb);

console.log(`Generating js/food-db.js from ${items.length} canonical food items...`);

let jsContent = `// KatoriCalorie Interactive Food Database
// Canonical Source: data/nutrition-db.json

const foodDatabase = [
`;

// Group by category if possible
const categories = ['assamese', 'northeast', 'staples', 'burn'];

categories.forEach(cat => {
  const catItems = items.filter(item => item.category === cat);
  if (catItems.length > 0) {
    jsContent += `  // --- ${cat.toUpperCase()} ---\n`;
    catItems.forEach(item => {
      jsContent += `  {\n`;
      jsContent += `    id: ${JSON.stringify(item.id)},\n`;
      jsContent += `    name: ${JSON.stringify(item.name)},\n`;
      if (item.nameRegional) {
        jsContent += `    nameRegional: ${JSON.stringify(item.nameRegional)},\n`;
      }
      jsContent += `    calories: ${item.nutrition.calories},\n`;
      jsContent += `    protein: ${item.nutrition.protein_g},\n`;
      jsContent += `    carbs: ${item.nutrition.carbs_g},\n`;
      jsContent += `    fat: ${item.nutrition.fat_g},\n`;
      jsContent += `    fiber: ${item.nutrition.fiber_g},\n`;
      jsContent += `    unit: ${JSON.stringify(item.serving.label)},\n`;
      jsContent += `    desc: ${JSON.stringify(item.desc || '')},\n`;
      jsContent += `    category: ${JSON.stringify(item.category)}\n`;
      jsContent += `  },\n`;
    });
  }
});

// Any other items
const otherItems = items.filter(item => !categories.includes(item.category));
otherItems.forEach(item => {
  jsContent += `  {\n`;
  jsContent += `    id: ${JSON.stringify(item.id)},\n`;
  jsContent += `    name: ${JSON.stringify(item.name)},\n`;
  if (item.nameRegional) {
    jsContent += `    nameRegional: ${JSON.stringify(item.nameRegional)},\n`;
  }
  jsContent += `    calories: ${item.nutrition.calories},\n`;
  jsContent += `    protein: ${item.nutrition.protein_g},\n`;
  jsContent += `    carbs: ${item.nutrition.carbs_g},\n`;
  jsContent += `    fat: ${item.nutrition.fat_g},\n`;
  jsContent += `    fiber: ${item.nutrition.fiber_g},\n`;
  jsContent += `    unit: ${JSON.stringify(item.serving.label)},\n`;
  jsContent += `    desc: ${JSON.stringify(item.desc || '')},\n`;
  jsContent += `    category: ${JSON.stringify(item.category)}\n`;
  jsContent += `  },\n`;
});

// Remove trailing comma
jsContent = jsContent.replace(/,\n$/, '\n');
jsContent += `];\n\n`;

jsContent += `// Backward compatibility alias map for legacy persisted client state (localStorage / bookmarks)
const foodAliases = {
  'brown-basmati': 'brown-basmati-rice',
  'hard-boiled-egg': 'boiled-egg'
};

function getFoodById(id) {
  if (!id) return undefined;
  const canonicalId = foodAliases[id] || id;
  return foodDatabase.find(f => f.id === canonicalId);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { foodDatabase, foodAliases, getFoodById };
}
`;

fs.writeFileSync(foodDbJsPath, jsContent, 'utf-8');
console.log(`Successfully generated clean js/food-db.js with ${items.length} unique items and alias compatibility.`);
