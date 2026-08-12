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
let adCount = 0;

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');

  if (/Sponsored Ad Placement|প্ৰায়োজিত|प्रायोजित विज्ञापन/i.test(content)) {
    // Add style="display: none !important;" to ad containers or ad placeholders
    content = content.replace(/(<div[^>]*class="[^"]*(?:ad-placeholder|ad-unit|ad-banner|sponsored-ad)[^"]*"[^>]*)/gi, (match) => {
      if (!match.includes('display: none')) {
        return match.replace(/style="([^"]*)"/i, 'style="$1; display: none !important;"').replace(/(<div[^>]*class="[^"]*")/i, '$1 style="display: none !important;"');
      }
      return match;
    });

    // Also wrap elements containing the text if not caught by class
    content = content.replace(/(<div[^>]*>[\s\S]*?(?:Sponsored Ad Placement|প্ৰায়োজিত|प्रायोजित विज्ञापन)[\s\S]*?<\/div>)/gi, (match) => {
      if (!match.includes('display: none')) {
        return `<div style="display: none !important;">${match}</div>`;
      }
      return match;
    });

    fs.writeFileSync(filePath, content, 'utf-8');
    adCount++;
  }
}

console.log(`Successfully hid ad placeholders on ${adCount} HTML files.`);
