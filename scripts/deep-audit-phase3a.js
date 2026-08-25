const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

// Helper to get relative path
function rel(p) {
  return path.relative(projectRoot, p).replace(/\\/g, '/');
}

// 1. Scan for JS files that contain food data arrays
console.log('--- SCANNING JS DATA FILES ---');
const jsFiles = ['js/app.js', 'js/calculator.js', 'js/blog-db.js', 'scripts/generate-card-images.js', 'scripts/fix-food-recipe-schema.js'];
jsFiles.forEach(f => {
  const full = path.join(projectRoot, f);
  if (fs.existsSync(full)) {
    console.log(`Found JS file: ${f} (${fs.statSync(full).size} bytes)`);
  } else {
    console.log(`JS file missing: ${f}`);
  }
});

// Let's search for food database definitions across all JS files in js/
const jsDir = path.join(projectRoot, 'js');
if (fs.existsSync(jsDir)) {
  fs.readdirSync(jsDir).forEach(file => {
    console.log(`js/${file} - ${fs.statSync(path.join(jsDir, file)).size} bytes`);
  });
}
