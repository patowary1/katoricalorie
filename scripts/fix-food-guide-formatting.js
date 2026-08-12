const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

const foodFiles = [
  'food/masor-tenga-recipe-nutrition.html',
  'food/omita-khar-nutrition.html',
  'food/aloo-pitika-calories.html',
  'food/dosa-sambar-calories.html',
  'food/naga-pork-bamboo-shoot.html',
  'food/til-pitha-portion-control.html'
];

let fixedCount = 0;

for (const relPath of foodFiles) {
  const filePath = path.join(projectRoot, relPath);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix unclosed <strong> tags inside <li> elements
  content = content.replace(/<li><strong>([^<:]+):([^<]+)<\/li>/gi, '<li><strong>$1:</strong>$2</li>');
  
  // Fix unclosed <strong> when </strong> is missing before text ends
  content = content.replace(/<li><strong>([^<]+)<\/li>/gi, (match, p1) => {
    if (p1.includes(':') && !p1.includes('</strong>')) {
      const parts = p1.split(':');
      return `<li><strong>${parts[0]}:</strong>${parts.slice(1).join(':')}</li>`;
    }
    return match;
  });

  // Fix any unclosed ** markdown
  content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  fs.writeFileSync(filePath, content, 'utf-8');
  fixedCount++;
  console.log(`Verified and formatted recipe step list on ${relPath}`);
}

console.log(`Successfully checked all ${fixedCount} food guides.`);
