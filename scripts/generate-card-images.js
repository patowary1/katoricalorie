const fs = require('fs');
const path = require('path');
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');

const projectRoot = path.join(__dirname, '..');
const assetsDir = path.join(projectRoot, 'assets');
const fontsDir = path.join(assetsDir, 'fonts');

// 1. Register Noto Sans Bengali Font
const fontPathBold = path.join(fontsDir, 'NotoSansBengali-Bold.ttf');
const fontPathRegular = path.join(fontsDir, 'NotoSansBengali-Regular.ttf');

if (!fs.existsSync(fontPathBold) || !fs.existsSync(fontPathRegular)) {
  throw new Error('Noto Sans Bengali font files missing from assets/fonts/ — aborting');
}

const isBoldOk = GlobalFonts.registerFromPath(fontPathBold, 'Noto Sans Bengali');
const isRegOk = GlobalFonts.registerFromPath(fontPathRegular, 'Noto Sans Bengali Regular');

if (!isBoldOk) {
  throw new Error('Bengali font (Bold) failed to register in GlobalFonts — aborting');
}

// Verification Assertion for Font Registration
const testCanvas = createCanvas(200, 100);
const testCtx = testCanvas.getContext('2d');
testCtx.font = '30px sans-serif';
const fallbackWidth = testCtx.measureText('মাছৰ').width;

testCtx.font = '30px "Noto Sans Bengali"';
const registeredWidth = testCtx.measureText('মাছৰ').width;

if (Math.abs(registeredWidth - fallbackWidth) < 1) {
  throw new Error(`Font rendering test failed! Assamese text width (${registeredWidth}) matches fallback (${fallbackWidth}). Tofu box bug unresolved — aborting.`);
}
console.log(`[PASS] Noto Sans Bengali font registered and verified! ('মাছৰ' width: ${registeredWidth.toFixed(1)}px vs fallback: ${fallbackWidth.toFixed(1)}px)`);

// 17 Card Specifications
const cards = [
  {
    file: 'masor-tenga.jpg',
    title: 'Masor Tenga (Assamese Fish Curry)',
    assamese: 'মাছৰ টেঙা',
    calories: '140 kcal / katori',
    isFood: true,
    protein: '14.5g', carbs: '4.0g', fat: '6.8g',
    proteinG: 14.5, carbsG: 4.0, fatG: 6.8,
    category: 'TRADITIONAL FISH CURRY',
    primaryColor: '#4A90E2',
    bgColor: '#0F1A24',
    accentColor: '#64B5F6'
  },
  {
    file: 'omita-khar.jpg',
    title: 'Omita Khar (Green Papaya)',
    assamese: 'ওমিতা খাৰ',
    calories: '55 kcal / portion',
    isFood: true,
    protein: '1.2g', carbs: '9.8g', fat: '0.2g',
    proteinG: 1.2, carbsG: 9.8, fatG: 0.2,
    category: 'ALKALINE STARTER',
    primaryColor: '#4CAF50',
    bgColor: '#0E2214',
    accentColor: '#81C784'
  },
  {
    file: 'aloo-pitika.jpg',
    title: 'Aloo Pitika (Mashed Potato)',
    assamese: 'আলু পিটিকা',
    calories: '90 kcal / serving',
    isFood: true,
    protein: '2.0g', carbs: '18.5g', fat: '2.1g',
    proteinG: 2.0, carbsG: 18.5, fatG: 2.1,
    category: 'ASSAMESE COMFORT SIDE',
    primaryColor: '#EC407A',
    bgColor: '#220E18',
    accentColor: '#F48FB1'
  },
  {
    file: 'dosa-sambar.jpg',
    title: 'Dosa & Sambar',
    assamese: 'দচু আৰু চম্বাৰ',
    calories: '240 kcal / plate',
    isFood: true,
    protein: '6.5g', carbs: '44.0g', fat: '3.8g',
    proteinG: 6.5, carbsG: 44.0, fatG: 3.8,
    category: 'SOUTH INDIAN BREAKFAST',
    primaryColor: '#FF6B35',
    bgColor: '#24140E',
    accentColor: '#FF9E79'
  },
  {
    file: 'naga-pork.jpg',
    title: 'Naga Pork with Bamboo Shoot',
    assamese: 'নাগা পোৰ্ক',
    calories: '320 kcal / serving',
    isFood: true,
    protein: '28.0g', carbs: '4.2g', fat: '18.5g',
    proteinG: 28.0, carbsG: 4.2, fatG: 18.5,
    category: 'NORTHEAST MEAT SPECIALTY',
    primaryColor: '#E53935',
    bgColor: '#240F11',
    accentColor: '#EF5350'
  },
  {
    file: 'til-pitha.jpg',
    title: 'Til Pitha (Sesame Rice Roll)',
    assamese: 'তিল পিঠা',
    calories: '110 kcal / piece (~30g)',
    isFood: true,
    protein: '2.9g', carbs: '15.0g', fat: '4.2g',
    proteinG: 2.9, carbsG: 15.0, fatG: 4.2,
    category: 'BIHU SWEET DELICACY',
    primaryColor: '#FF9800',
    bgColor: '#24180E',
    accentColor: '#FFB74D'
  },

  // Blog Cards
  {
    file: 'khar-blog.jpg',
    title: 'Khar Calories & Alkaline Benefits',
    assamese: 'অসমীয়া খাৰ আৰু মেটাবলিজম',
    calories: '55 kcal / portion',
    isFood: true,
    protein: '1.2g', carbs: '9.8g', fat: '0.2g',
    proteinG: 1.2, carbsG: 9.8, fatG: 0.2,
    category: 'NUTRITION ARTICLE',
    primaryColor: '#66BB6A',
    bgColor: '#102416',
    accentColor: '#A5D6A7'
  },
  {
    file: 'pitha-blog.jpg',
    title: 'Bihu Pitha Carbohydrates & Portion Control',
    assamese: 'বিহু পিঠা কেলৰি আৰু পৰিমাণ নিৰূপণ',
    calories: '110 kcal / piece',
    isFood: true,
    protein: '2.9g', carbs: '15.0g', fat: '4.2g',
    proteinG: 2.9, carbsG: 15.0, fatG: 4.2,
    category: 'CORNERSTONE ARTICLE',
    primaryColor: '#FFA726',
    bgColor: '#241A10',
    accentColor: '#FFCC80'
  },
  {
    file: 'roti-rice-blog.jpg',
    title: 'Roti vs Rice for Indian Weight Loss',
    assamese: 'ৰুটি নে ভাত? ওজন হ্ৰাসৰ নিৰ্ণয়',
    calories: '120 kcal / portion',
    isFood: true,
    protein: '3.5g', carbs: '23.0g', fat: '1.5g',
    proteinG: 3.5, carbsG: 23.0, fatG: 1.5,
    category: 'DIET AUDIT',
    primaryColor: '#FF7043',
    bgColor: '#241410',
    accentColor: '#FFAB91'
  },
  {
    file: 'masor-tenga-blog.jpg',
    title: 'Masor Tenga Nutrition & Heart Acids',
    assamese: 'মাছৰ টেঙাৰ স্বাস্থ্য গুণাগুণ',
    calories: '140 kcal / katori',
    isFood: true,
    protein: '14.5g', carbs: '4.0g', fat: '6.8g',
    proteinG: 14.5, carbsG: 4.0, fatG: 6.8,
    category: 'HEALTH ARTICLE',
    primaryColor: '#42A5F5',
    bgColor: '#0F1A24',
    accentColor: '#90CAF9'
  },
  {
    file: 'fermented-foods-blog.jpg',
    title: 'Fermented Foods of Northeast India',
    assamese: 'উত্তৰ-পূবৰ অণুজীৱ কিণ্বিত খাদ্য',
    calories: '85 kcal / portion',
    isFood: true,
    protein: '4.5g', carbs: '11.0g', fat: '2.1g',
    proteinG: 4.5, carbsG: 11.0, fatG: 2.1,
    category: 'WELLNESS ARTICLE',
    primaryColor: '#AB47BC',
    bgColor: '#201024',
    accentColor: '#CE93D8'
  },
  {
    file: 'herbs-blog.jpg',
    title: 'Traditional Assamese Herbs & Health',
    assamese: 'অসমীয়া থলুৱা শাক-পাচলি আৰু স্বাস্থ্য',
    calories: '40 kcal / portion',
    isFood: true,
    protein: '2.0g', carbs: '6.5g', fat: '0.4g',
    proteinG: 2.0, carbsG: 6.5, fatG: 0.4,
    category: 'HERBAL WELLNESS',
    primaryColor: '#26A69A',
    bgColor: '#102220',
    accentColor: '#80CBC4'
  },
  {
    file: 'bug-blog.jpg',
    title: 'Calculator Accuracy: BMR Feet Bug',
    assamese: 'কেলকুলেটৰ সঠিকতা বিশ্লেষণ',
    calories: 'Mifflin-St Jeor Audit',
    isFood: false, // Non-food article: skips fake macro donut & fake pills
    category: 'TECH CASE STUDY',
    primaryColor: '#26C6DA',
    bgColor: '#0F2224',
    accentColor: '#80DEEA'
  },
  {
    file: 'brown-basmati-blog.jpg',
    title: 'Brown Basmati Rice Weight Loss',
    assamese: 'ব্ৰাউন বাছমতী চাউলৰ প্ৰভাৱ',
    calories: '160 kcal / katori',
    isFood: true,
    protein: '4.5g', carbs: '33.0g', fat: '1.2g',
    proteinG: 4.5, carbsG: 33.0, fatG: 1.2,
    category: 'GRAIN GUIDE',
    primaryColor: '#EC407A',
    bgColor: '#24101A',
    accentColor: '#F48FB1'
  },
  {
    file: 'bora-saul-blog.jpg',
    title: 'Bora Saul Sticky Rice Glycemic Index',
    assamese: 'বৰা চাউলৰ এমিলা পেক্টিন বিশ্লেষণ',
    calories: '180 kcal / katori',
    isFood: true,
    protein: '3.2g', carbs: '38.0g', fat: '0.8g',
    proteinG: 3.2, carbsG: 38.0, fatG: 0.8,
    category: 'GRAIN AUDIT',
    primaryColor: '#FFA726',
    bgColor: '#241A10',
    accentColor: '#FFE082'
  },
  {
    file: 'joha-rice-blog.jpg',
    title: 'Joha Rice Antioxidants & Benefits',
    assamese: 'জোহা চাউলৰ সুগন্ধি আৰু পুষ্টি',
    calories: '150 kcal / katori',
    isFood: true,
    protein: '3.8g', carbs: '31.5g', fat: '1.0g',
    proteinG: 3.8, carbsG: 31.5, fatG: 1.0,
    category: 'SUPERFOOD GUIDE',
    primaryColor: '#5C6BC0',
    bgColor: '#141824',
    accentColor: '#9FA8DA'
  },
  {
    file: 'bao-dhan-blog.jpg',
    title: 'Bao Dhan Red Rice Superfood',
    assamese: 'বাও ধান ৰঙা চাউলৰ লৌহ উপাদান',
    calories: '155 kcal / katori',
    isFood: true,
    protein: '4.2g', carbs: '32.0g', fat: '1.1g',
    proteinG: 4.2, carbsG: 32.0, fatG: 1.1,
    category: 'RED RICE GUIDE',
    primaryColor: '#EF5350',
    bgColor: '#241012',
    accentColor: '#EF9A9A'
  }
];

// Assert food cards have non-empty protein, carbs, and fat values
cards.forEach(card => {
  if (card.isFood) {
    if (!card.protein || !card.carbs || !card.fat) {
      throw new Error(`Food card ${card.file} missing macro data! protein='${card.protein}', carbs='${card.carbs}', fat='${card.fat}'`);
    }
  }
});

const width = 1200;
const height = 900;

function renderCard(card) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background Fill
  ctx.fillStyle = card.bgColor;
  ctx.fillRect(0, 0, width, height);

  // Outer Decorative Frame
  ctx.strokeStyle = card.primaryColor;
  ctx.lineWidth = 14;
  ctx.strokeRect(14, 14, width - 28, height - 28);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, width - 56, height - 56);

  // Category Tag Header Bar
  ctx.fillStyle = card.primaryColor;
  ctx.fillRect(40, 40, width - 80, 85);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(card.category, 65, 95);

  // Brand Name in Top Right
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('KatoriCalorie', width - 65, 95);

  // Main English Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 50px sans-serif';
  ctx.textAlign = 'left';

  const words = card.title.split(' ');
  let line = '';
  let yPos = 205;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 1070 && n > 0) {
      ctx.fillText(line.trim(), 65, yPos);
      line = words[n] + ' ';
      yPos += 62;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), 65, yPos);

  // Assamese Dish Subtitle (Rendered with verified Noto Sans Bengali font)
  yPos += 70;
  ctx.fillStyle = card.accentColor;
  ctx.font = 'bold 42px "Noto Sans Bengali"';
  ctx.fillText(card.assamese, 65, yPos);

  // Calorie Badge Box
  yPos += 60;
  ctx.fillStyle = 'rgba(255, 107, 53, 0.15)';
  ctx.strokeStyle = '#FF6B35';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(65, yPos, 480, 105, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FF6B35';
  ctx.font = 'bold 38px sans-serif';
  ctx.fillText(card.calories, 90, yPos + 65);

  if (card.isFood) {
    // REAL MACRO DONUT CHART (Right Side Graphic)
    const cx = 880;
    const cy = 510;
    const radius = 170;
    const strokeW = 32;

    const pVal = card.proteinG * 4;
    const cVal = card.carbsG * 4;
    const fVal = card.fatG * 9;
    const totalCal = pVal + cVal + fVal || 100;

    const pAngle = (pVal / totalCal) * (Math.PI * 2);
    const cAngle = (cVal / totalCal) * (Math.PI * 2);
    const fAngle = (fVal / totalCal) * (Math.PI * 2);

    let startAngle = -Math.PI / 2;

    // 1. Protein Segment (Blue/Primary accent)
    ctx.strokeStyle = card.primaryColor;
    ctx.lineWidth = strokeW;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, startAngle + pAngle);
    ctx.stroke();
    startAngle += pAngle;

    // 2. Carbs Segment (Orange #FF9800)
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = strokeW;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, startAngle + cAngle);
    ctx.stroke();
    startAngle += cAngle;

    // 3. Fat Segment (Red #E53935)
    ctx.strokeStyle = '#E53935';
    ctx.lineWidth = strokeW;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, startAngle + fAngle);
    ctx.stroke();

    // Donut Inner Circle & Center Text
    ctx.fillStyle = card.bgColor;
    ctx.beginPath();
    ctx.arc(cx, cy, radius - (strokeW / 2) - 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 34px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MACRO', cx, cy - 15);
    ctx.fillStyle = card.accentColor;
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('SPLIT', cx, cy + 25);

    // FIX 1 & 2: NEUTRAL DARK PILL BACKGROUNDS WITH COLOR-CODED DOTS
    const pillY = 665;

    // 1. Protein Pill (Neutral dark background, color dot = card.primaryColor)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 2;

    // Protein Box
    ctx.beginPath(); ctx.roundRect(65, pillY, 200, 80, 12); ctx.fill(); ctx.stroke();
    // Color Dot (12px radius)
    ctx.fillStyle = card.primaryColor;
    ctx.beginPath(); ctx.arc(95, pillY + 30, 8, 0, Math.PI * 2); ctx.fill();
    // Label & Value in high-contrast crisp white/accent
    ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('PROTEIN', 112, pillY + 35);
    ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 24px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(card.protein, 165, pillY + 65);

    // 2. Carbs Pill (Neutral dark background, color dot = #FF9800)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath(); ctx.roundRect(290, pillY, 200, 80, 12); ctx.fill(); ctx.stroke();
    // Color Dot (Orange)
    ctx.fillStyle = '#FF9800';
    ctx.beginPath(); ctx.arc(325, pillY + 30, 8, 0, Math.PI * 2); ctx.fill();
    // Label & Value
    ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('CARBS', 342, pillY + 35);
    ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 24px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(card.carbs, 390, pillY + 65);

    // 3. Fat Pill (Neutral dark background, color dot = #E53935, label = FAT)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath(); ctx.roundRect(515, pillY, 200, 80, 12); ctx.fill(); ctx.stroke();
    // Color Dot (Red)
    ctx.fillStyle = '#E53935';
    ctx.beginPath(); ctx.arc(555, pillY + 30, 8, 0, Math.PI * 2); ctx.fill();
    // Label & Value
    ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('FAT', 572, pillY + 35);
    ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 24px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(card.fat, 615, pillY + 65);

  } else {
    // NON-FOOD META/TECH ARTICLE CARD (Skipped fake donut & fake pills)
    const cx = 880;
    const cy = 510;

    ctx.fillStyle = 'rgba(38, 198, 218, 0.12)';
    ctx.strokeStyle = card.primaryColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(700, 360, 360, 300, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TECHNICAL', cx, cy - 20);
    ctx.fillStyle = card.accentColor;
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('AUDIT', cx, cy + 30);
  }

  // Footer Verification Bar
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.fillRect(40, height - 100, width - 80, 60);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '22px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Official KatoriCalorie Verified Nutrition Card • Formulated under ICMR-NIN Data', 65, height - 62);

  ctx.fillStyle = card.primaryColor;
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('www.katoricalorie.in', width - 65, height - 62);

  // Encode canvas to Buffer (JPEG format)
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.78 });
  const targetPath = path.join(assetsDir, card.file);
  fs.writeFileSync(targetPath, buffer);

  const sizeKb = (buffer.length / 1024).toFixed(1);
  console.log(`Generated ${card.file} (${width}x${height}, ${sizeKb} KB, isFood: ${card.isFood})`);
}

console.log('Generating 17 card graphics (neutral dark pills, legend dots, and clean non-food tech cards)...');
cards.forEach(renderCard);
console.log('All 17 distinct card graphics successfully created in assets/ directory.');
