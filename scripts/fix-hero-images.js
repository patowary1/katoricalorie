const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const relPath = path.relative(projectRoot, filePath).replace(/\\/g, '/');

    if (relPath.startsWith('backups/') || relPath.startsWith('scratch/') || relPath.startsWith('.git/')) {
      continue;
    }

    if (fs.statSync(filePath).isDirectory()) {
      getAllHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(projectRoot);
let fixedCount = 0;

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');

  if (content.includes('src=""')) {
    // Replace empty src="" with src="/assets/og-banner.jpg"
    content = content.replace(/src=""/g, 'src="/assets/og-banner.jpg"');
    fs.writeFileSync(filePath, content, 'utf-8');
    fixedCount++;
  }
}

console.log(`Successfully fixed empty src="" on ${fixedCount} HTML files.`);
