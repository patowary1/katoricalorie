const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

function relPath(p) {
  return path.relative(projectRoot, p).replace(/\\/g, '/');
}

// 1. NUTRITION DATA SCRAMBLE
console.log('====================================================');
console.log(' 1. NUTRITION DATA CONSISTENCY SCRAMBLE');
console.log('====================================================');

const foodsToAudit = [
  'masor-tenga', 'omita-khar', 'til-pitha', 'joha-rice', 'bao-dhan', 'bora-saul', 'aloo-pitika', 'dosa-sambar', 'naga-pork', 'brown-basmati'
];

function getAllRepoFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const relative = relPath(filePath);

    if (relative.startsWith('.git') || relative.startsWith('backups') || relative.startsWith('node_modules') || relative.startsWith('scratch')) {
      continue;
    }

    if (fs.statSync(filePath).isDirectory()) {
      getAllRepoFiles(filePath, fileList);
    } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.json')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const repoFiles = getAllRepoFiles(projectRoot);

foodsToAudit.forEach(foodSlug => {
  console.log(`\n--- FOOD: ${foodSlug} ---`);
  const term = foodSlug.replace(/-/g, ' ');

  repoFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const relative = relPath(file);

    if (content.toLowerCase().includes(foodSlug) || content.toLowerCase().includes(term)) {
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/calorie|kcal|protein|carbs|carbohydrate|fat|serving|katori|140|65|55|90|95|110|280|320|150|160|180/i.test(line)) {
          if (line.trim().length > 0 && line.trim().length < 250) {
            // Check if line contains relevant info
            if (line.toLowerCase().includes(foodSlug) || line.toLowerCase().includes(term) || relative.includes(foodSlug)) {
              console.log(`  [${relative}:${idx + 1}] ${line.trim()}`);
            }
          }
        }
      });
    }
  });
});

// 3. HEALTH & ACCURACY CLAIMS SCAN
console.log('\n====================================================');
console.log(' 3. HEALTH & ACCURACY CLAIMS AUDIT');
console.log('====================================================');

const claimRegexes = [
  { name: '100% Accurate / Precision', regex: /100%\s*accurat|exact\s*calorie|100%\s*precision/gi },
  { name: 'Prebiotic / Probiotic', regex: /prebiotic|probiotic|microbiome/gi },
  { name: 'Alkaline / Neutralize Acidity', regex: /neutraliz\w*\s*acidity|alkaline\s*chemistry|alkaline\s*starter|alkaline\s*extract/gi },
  { name: 'Digestive Cleanse', regex: /digestive\s*cleanse|cleanses?\s*the?\s*digestive|soothe\s*the\s*digestive/gi },
  { name: 'Heart Healthy / Omega-3', regex: /heart-healthy|heart\s*healthy|omega-3/gi },
  { name: 'Glycemic / Insulin Claims', regex: /glycemic\s*index|glycemic\s*load|spik\w*\s*insulin|rapid\s*insulin/gi },
  { name: 'Metabolism Boosting', regex: /metabolism\s*boosting|boosts?\s*metabolism|preps?\s*your\s*metabolism/gi },
  { name: 'Medical / Anti-Diabetic', regex: /anti-diabetic|medicinal\s*properties|prevents?\s*disease/gi }
];

claimRegexes.forEach(claim => {
  console.log(`\nClaim Category: ${claim.name}`);
  let count = 0;
  repoFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const relative = relPath(file);
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
      if (claim.regex.test(line)) {
        if (line.trim().length > 0 && line.trim().length < 200) {
          console.log(`  [${relative}:${idx + 1}] ${line.trim()}`);
          count++;
        }
      }
    });
  });
  if (count === 0) console.log('  None found.');
});
