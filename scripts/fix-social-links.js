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
let cleanedCount = 0;

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (/YOUR_FACEBOOK_URL|YOUR_INSTAGRAM_URL|YOUR_YOUTUBE_URL/i.test(content)) {
    // Remove <a> tags containing YOUR_.*_URL or social link wrappers
    content = content.replace(/<a[^>]*href="[^"]*YOUR_[A-Z_]+_URL[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');
    // Also remove empty social container div if left behind
    content = content.replace(/<div[^>]*class="[^"]*social-links[^"]*"[^>]*>\s*<\/div>/gi, '');
    
    fs.writeFileSync(filePath, content, 'utf-8');
    cleanedCount++;
  }
}

console.log(`Successfully removed placeholder social links from ${cleanedCount} HTML files.`);
