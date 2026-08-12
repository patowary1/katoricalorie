const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');

const projectRoot = path.join(__dirname, '..');
const ogPath = path.join(projectRoot, 'assets', 'og-banner.jpg');

if (!fs.existsSync(ogPath)) {
  console.error('assets/og-banner.jpg not found!');
  process.exit(1);
}

const inputBuffer = fs.readFileSync(ogPath);
let rawImage;
try {
  rawImage = jpeg.decode(inputBuffer, { useTArray: true });
} catch (e) {
  console.error('Error decoding og-banner.jpg:', e);
  process.exit(1);
}

const targetWidth = 1200;
const targetHeight = 630;

const outputFrame = Buffer.alloc(targetWidth * targetHeight * 4);

// Nearest neighbor / bilinear scaling from rawImage to 1200x630
const scaleX = rawImage.width / targetWidth;
const scaleY = rawImage.height / targetHeight;

for (let y = 0; y < targetHeight; y++) {
  const srcY = Math.min(rawImage.height - 1, Math.floor(y * scaleY));
  for (let x = 0; x < targetWidth; x++) {
    const srcX = Math.min(rawImage.width - 1, Math.floor(x * scaleX));

    const srcIdx = (srcY * rawImage.width + srcX) * 4;
    const destIdx = (y * targetWidth + x) * 4;

    outputFrame[destIdx] = rawImage.data[srcIdx];
    outputFrame[destIdx + 1] = rawImage.data[srcIdx + 1];
    outputFrame[destIdx + 2] = rawImage.data[srcIdx + 2];
    outputFrame[destIdx + 3] = 255;
  }
}

const encoded = jpeg.encode({ data: outputFrame, width: targetWidth, height: targetHeight }, 82);
fs.writeFileSync(ogPath, encoded.data);

const sizeKb = (encoded.data.length / 1024).toFixed(1);
console.log(`Optimized og-banner.jpg to ${targetWidth}x${targetHeight} (${sizeKb} KB)`);
