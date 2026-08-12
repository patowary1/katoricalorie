const fs = require('fs');
const path = require('path');
const https = require('https');

const projectRoot = path.join(__dirname, '..');
const fontsDir = path.join(projectRoot, 'assets', 'fonts');

if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Downloaded font to ${dest} (${fs.statSync(dest).size} bytes)`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

const urlsBold = [
  'https://github.com/notofonts/notofonts.github.io/raw/main/fonts/NotoSansBengali/full/ttf/NotoSansBengali-Bold.ttf',
  'https://github.com/google/fonts/raw/main/ofl/notosansbengali/NotoSansBengali-Bold.ttf',
  'https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io@main/fonts/NotoSansBengali/full/ttf/NotoSansBengali-Bold.ttf'
];

const urlsRegular = [
  'https://github.com/notofonts/notofonts.github.io/raw/main/fonts/NotoSansBengali/full/ttf/NotoSansBengali-Regular.ttf',
  'https://github.com/google/fonts/raw/main/ofl/notosansbengali/NotoSansBengali-Regular.ttf',
  'https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io@main/fonts/NotoSansBengali/full/ttf/NotoSansBengali-Regular.ttf'
];

async function tryDownload(urls, dest) {
  for (const url of urls) {
    try {
      console.log(`Trying to download from ${url}...`);
      await downloadFile(url, dest);
      return;
    } catch (e) {
      console.log(`Failed from ${url}: ${e.message}`);
    }
  }
  throw new Error(`All download URLs failed for ${dest}`);
}

async function main() {
  const destBold = path.join(fontsDir, 'NotoSansBengali-Bold.ttf');
  const destRegular = path.join(fontsDir, 'NotoSansBengali-Regular.ttf');

  await tryDownload(urlsBold, destBold);
  await tryDownload(urlsRegular, destRegular);
  console.log('Noto Sans Bengali fonts ready in assets/fonts/.');
}

main().catch(err => {
  console.error('Error downloading font:', err);
  process.exit(1);
});
