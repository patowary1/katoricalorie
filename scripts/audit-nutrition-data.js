const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

// Helper to recursively get all files
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const relPath = path.relative(projectRoot, filePath).replace(/\\/g, '/');

    if (relPath.startsWith('.git') || relPath.startsWith('backups') || relPath.startsWith('node_modules')) {
      continue;
    }

    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.json')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = getAllFiles(projectRoot);
console.log(`Auditing ${allFiles.length} files for nutrition data...`);

// Let's inspect js/blog-db.js, scripts/generate-card-images.js, scripts/fix-food-recipe-schema.js, food/*.html, blog/*.html, index.html, as/index.html, hi/index.html, compare.html
const targetFoods = [
  'masor-tenga', 'omita-khar', 'til-pitha', 'joha-rice', 'bao-dhan', 'bora-saul', 'aloo-pitika', 'dosa-sambar', 'naga-pork', 'brown-basmati'
];

for (const filePath of allFiles) {
  const relPath = path.relative(projectRoot, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf-8');

  for (const food of targetFoods) {
    if (content.toLowerCase().includes(food.replace('-', ' ')) || content.toLowerCase().includes(food)) {
      // Find line numbers
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/calorie|kcal|protein|carbs|carbohydrate|fat|serving|katori|gram/i.test(line) && (line.toLowerCase().includes(food) || line.toLowerCase().includes(food.replace('-', ' ')))) {
          // Record finding
        }
      });
    }
  }
}
