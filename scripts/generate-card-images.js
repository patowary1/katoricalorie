const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');

const projectRoot = path.join(__dirname, '..');
const assetsDir = path.join(projectRoot, 'assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 17 card specs (Dish & Blog graphics)
const cards = [
  { file: 'masor-tenga.jpg', title: 'Masor Tenga (Assamese Fish Curry)', subtitle: 'মাছৰ টেঙা • 140 kcal / katori', cat: 'fish', color: [43, 114, 133], bg: [18, 26, 30] },
  { file: 'omita-khar.jpg', title: 'Omita Khar (Green Papaya)', subtitle: 'অউ টেঙা / ওমিতা খাৰ • 55 kcal', cat: 'greens', color: [46, 125, 50], bg: [18, 30, 20] },
  { file: 'aloo-pitika.jpg', title: 'Aloo Pitika (Mashed Potato)', subtitle: 'আলু পিটিকা • 110 kcal / portion', cat: 'sides', color: [216, 112, 147], bg: [30, 20, 25] },
  { file: 'dosa-sambar.jpg', title: 'Dosa & Sambar', subtitle: 'দচু আৰু চম্বাৰ • 280 kcal / serving', cat: 'south', color: [230, 81, 0], bg: [32, 20, 15] },
  { file: 'naga-pork.jpg', title: 'Naga Pork with Bamboo Shoot', subtitle: 'নাগা পোৰ্ক • 320 kcal / serving', cat: 'pork', color: [183, 28, 28], bg: [30, 15, 15] },
  { file: 'til-pitha.jpg', title: 'Til Pitha (Sesame Rice Roll)', subtitle: 'তিল পিঠা • 95 kcal / piece', cat: 'sweets', color: [245, 124, 0], bg: [30, 22, 14] },

  // Blog Cards
  { file: 'khar-blog.jpg', title: 'Alkaline Khar Benefits', subtitle: 'Assamese Food & Metabolism', cat: 'blog', color: [46, 125, 50], bg: [18, 30, 20] },
  { file: 'pitha-blog.jpg', title: 'Bihu Pitha Carbohydrates', subtitle: 'Portion Control & Glycemic Index', cat: 'blog', color: [245, 124, 0], bg: [30, 22, 14] },
  { file: 'roti-rice-blog.jpg', title: 'Roti vs Rice Weight Loss', subtitle: 'Calorie & Micronutrient Audit', cat: 'blog', color: [230, 81, 0], bg: [32, 20, 15] },
  { file: 'masor-tenga-blog.jpg', title: 'Heart Healthy Masor Tenga', subtitle: 'Omega-3 & Organic Acids', cat: 'blog', color: [43, 114, 133], bg: [18, 26, 30] },
  { file: 'fermented-foods-blog.jpg', title: 'Fermented Foods NE India', subtitle: 'Gut Microbiome & Health', cat: 'blog', color: [142, 36, 170], bg: [26, 18, 30] },
  { file: 'herbs-blog.jpg', title: 'Traditional Assamese Herbs', subtitle: 'Metabolic & Digestive Wellness', cat: 'blog', color: [46, 125, 50], bg: [18, 30, 20] },
  { file: 'bug-blog.jpg', title: 'BMR Decimal Feet Bug', subtitle: 'Calculator Accuracy Audit', cat: 'blog', color: [0, 137, 123], bg: [15, 28, 28] },
  { file: 'brown-basmati-blog.jpg', title: 'Brown Basmati Rice', subtitle: 'Fiber & Weight Loss Guide', cat: 'blog', color: [216, 112, 147], bg: [30, 20, 25] },
  { file: 'bora-saul-blog.jpg', title: 'Bora Saul Sticky Rice', subtitle: 'Amylopectin & GI Impact', cat: 'blog', color: [245, 124, 0], bg: [30, 22, 14] },
  { file: 'joha-rice-blog.jpg', title: 'Joha Aromatic Rice', subtitle: 'Antioxidants & Health Benefits', cat: 'blog', color: [43, 114, 133], bg: [18, 26, 30] },
  { file: 'bao-dhan-blog.jpg', title: 'Bao Dhan Red Rice', subtitle: 'Iron-Rich Superfood of Assam', cat: 'blog', color: [183, 28, 28], bg: [30, 15, 15] }
];

const width = 1200;
const height = 900;

function drawCard(card) {
  const frameData = Buffer.alloc(width * height * 4);

  const [bgR, bgG, bgB] = card.bg;
  const [accentR, accentG, accentB] = card.color;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Outer border frame (12px)
      if (x < 16 || x >= width - 16 || y < 16 || y >= height - 16) {
        frameData[idx] = accentR;
        frameData[idx + 1] = accentG;
        frameData[idx + 2] = accentB;
        frameData[idx + 3] = 255;
        continue;
      }

      // Top banner accent bar (height 120px)
      if (y >= 16 && y < 136) {
        frameData[idx] = Math.min(255, accentR + 20);
        frameData[idx + 1] = Math.min(255, accentG + 20);
        frameData[idx + 2] = Math.min(255, accentB + 20);
        frameData[idx + 3] = 255;
        continue;
      }

      // Bottom footer branding bar (height 80px)
      if (y >= height - 96 && y < height - 16) {
        frameData[idx] = 20;
        frameData[idx + 1] = 14;
        frameData[idx + 2] = 12;
        frameData[idx + 3] = 255;
        continue;
      }

      // Main background with subtle gradient
      const gradY = (y / height) * 35;
      frameData[idx] = Math.max(0, Math.min(255, bgR + gradY));
      frameData[idx + 1] = Math.max(0, Math.min(255, bgG + gradY));
      frameData[idx + 2] = Math.max(0, Math.min(255, bgB + gradY));
      frameData[idx + 3] = 255;

      // Stylized Brass Katori Circle Graphic in center-right (cx: 850, cy: 500, r: 240)
      const dx = x - 850;
      const dy = y - 500;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist >= 210 && dist <= 240) {
        frameData[idx] = accentR;
        frameData[idx + 1] = accentG;
        frameData[idx + 2] = accentB;
      } else if (dist >= 170 && dist <= 185) {
        frameData[idx] = Math.min(255, accentR + 60);
        frameData[idx + 1] = Math.min(255, accentG + 60);
        frameData[idx + 2] = Math.min(255, accentB + 60);
      } else if (dist >= 90 && dist <= 110) {
        frameData[idx] = 255;
        frameData[idx + 1] = 107;
        frameData[idx + 2] = 53;
      }
    }
  }

  const rawImageData = {
    data: frameData,
    width: width,
    height: height
  };

  const jpegImageData = jpeg.encode(rawImageData, 85); // 85% quality
  const targetPath = path.join(assetsDir, card.file);
  fs.writeFileSync(targetPath, jpegImageData.data);

  const sizeKb = (jpegImageData.data.length / 1024).toFixed(1);
  console.log(`Generated ${card.file} (${width}x${height}, ${sizeKb} KB)`);
}

console.log('Generating 17 branded card graphics (1200x900, 4:3 ratio)...');
cards.forEach(drawCard);
console.log('All 17 card graphics successfully created in assets/ directory.');
