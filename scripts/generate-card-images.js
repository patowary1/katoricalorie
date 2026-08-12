const fs = require('fs');
const path = require('path');
const { createCanvas } = require('@napi-rs/canvas');

const projectRoot = path.join(__dirname, '..');
const assetsDir = path.join(projectRoot, 'assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 17 Card Specifications with exact distinct title, assamese text, calories, macros, category color
const cards = [
  {
    file: 'masor-tenga.jpg',
    title: 'Masor Tenga (Assamese Fish Curry)',
    assamese: 'মাছৰ টেঙা',
    calories: '140 kcal / katori',
    protein: '14.5g', carbs: '4.0g', fat: '6.8g',
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
    protein: '1.2g', carbs: '9.8g', fat: '0.2g',
    category: 'ALKALINE STARTER',
    primaryColor: '#4CAF50',
    bgColor: '#0E2214',
    accentColor: '#81C784'
  },
  {
    file: 'aloo-pitika.jpg',
    title: 'Aloo Pitika (Mashed Potato)',
    assamese: 'আলু পিটিকা',
    calories: '110 kcal / serving',
    protein: '2.5g', carbs: '21.0g', fat: '2.2g',
    category: 'ASSAMESE COMFORT SIDE',
    primaryColor: '#EC407A',
    bgColor: '#220E18',
    accentColor: '#F48FB1'
  },
  {
    file: 'dosa-sambar.jpg',
    title: 'Dosa & Sambar',
    assamese: 'দচু আৰু চম্বাৰ',
    calories: '280 kcal / plate',
    protein: '8.2g', carbs: '52.0g', fat: '4.5g',
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
    protein: '28.0g', carbs: '4.2g', fat: '18.5g',
    category: 'NORTHEAST MEAT SPECIALTY',
    primaryColor: '#E53935',
    bgColor: '#240F11',
    accentColor: '#EF5350'
  },
  {
    file: 'til-pitha.jpg',
    title: 'Til Pitha (Sesame Rice Roll)',
    assamese: 'তিল পিঠা',
    calories: '95 kcal / 2 pieces',
    protein: '2.1g', carbs: '16.5g', fat: '2.8g',
    category: 'BIHU SWEET DELICACY',
    primaryColor: '#FF9800',
    bgColor: '#24180E',
    accentColor: '#FFB74D'
  },

  // Blog Cards
  {
    file: 'khar-blog.jpg',
    title: 'Khar Calories & Alkaline Benefits',
    assamese: 'খাৰ আৰু মেটাবলিজম',
    calories: 'Cornerstone Guide',
    protein: 'Digestion', carbs: 'Alkaline', fat: 'Detox',
    category: 'NUTRITION ARTICLE',
    primaryColor: '#66BB6A',
    bgColor: '#102416',
    accentColor: '#A5D6A7'
  },
  {
    file: 'pitha-blog.jpg',
    title: 'Bihu Pitha Carbohydrates & Portion Control',
    assamese: 'পিঠা কেলৰি নিৰূপণ',
    calories: 'Glycemic Index Audit',
    protein: 'Carbs', carbs: 'Portions', fat: 'Bihu',
    category: 'CORNERSTONE ARTICLE',
    primaryColor: '#FFA726',
    bgColor: '#241A10',
    accentColor: '#FFCC80'
  },
  {
    file: 'roti-rice-blog.jpg',
    title: 'Roti vs Rice for Indian Weight Loss',
    assamese: 'ৰুটি নে ভাত?',
    calories: 'Calorie Comparison',
    protein: 'Fiber', carbs: 'Satiety', fat: 'Loss',
    category: 'DIET AUDIT',
    primaryColor: '#FF7043',
    bgColor: '#241410',
    accentColor: '#FFAB91'
  },
  {
    file: 'masor-tenga-blog.jpg',
    title: 'Masor Tenga Nutrition & Heart Acids',
    assamese: 'মাছৰ টেঙাৰ গুণাগুণ',
    calories: 'Omega-3 Analysis',
    protein: '14.5g', carbs: '4.0g', fat: 'Heart',
    category: 'HEALTH ARTICLE',
    primaryColor: '#42A5F5',
    bgColor: '#0F1A24',
    accentColor: '#90CAF9'
  },
  {
    file: 'fermented-foods-blog.jpg',
    title: 'Fermented Foods of Northeast India',
    assamese: 'উত্তৰ-পূবৰ অণুজীৱ খাদ্য',
    calories: 'Microbiome Guide',
    protein: 'Gut', carbs: 'Probiotic', fat: 'Health',
    category: 'WELLNESS ARTICLE',
    primaryColor: '#AB47BC',
    bgColor: '#201024',
    accentColor: '#CE93D8'
  },
  {
    file: 'herbs-blog.jpg',
    title: 'Traditional Assamese Herbs & Health',
    assamese: 'অসমীয়া শাক-পাচলি',
    calories: 'Metabolic Support',
    protein: 'Herbal', carbs: 'Healing', fat: 'Plates',
    category: 'HERBAL WELLNESS',
    primaryColor: '#26A69A',
    bgColor: '#102220',
    accentColor: '#80CBC4'
  },
  {
    file: 'bug-blog.jpg',
    title: 'Calculator Accuracy: BMR Feet Bug',
    assamese: 'কেলকুলেটৰ সঠিকতা',
    calories: 'Technical Case Study',
    protein: 'BMR', carbs: 'Mifflin', fat: 'Formula',
    category: 'TECH INSIGHT',
    primaryColor: '#26C6DA',
    bgColor: '#0F2224',
    accentColor: '#80DEEA'
  },
  {
    file: 'brown-basmati-blog.jpg',
    title: 'Brown Basmati Rice Weight Loss',
    assamese: 'ব্ৰাউন বাছমতী চাউল',
    calories: 'Fiber & Satiety',
    protein: 'Fiber', carbs: 'Low GI', fat: 'Loss',
    category: 'GRAIN GUIDE',
    primaryColor: '#EC407A',
    bgColor: '#24101A',
    accentColor: '#F48FB1'
  },
  {
    file: 'bora-saul-blog.jpg',
    title: 'Bora Saul Sticky Rice Glycemic Index',
    assamese: 'বৰা চাউলৰ প্ৰভাৱ',
    calories: 'Amylopectin Breakdown',
    protein: 'Sticky', carbs: 'Carbs', fat: 'Bihu',
    category: 'GRAIN AUDIT',
    primaryColor: '#FFA726',
    bgColor: '#241A10',
    accentColor: '#FFE082'
  },
  {
    file: 'joha-rice-blog.jpg',
    title: 'Joha Rice Antioxidants & Benefits',
    assamese: 'জোহা চাউলৰ সুগন্ধি',
    calories: 'Flavonoid Analysis',
    protein: 'Aroma', carbs: 'Antiox', fat: 'Grains',
    category: 'SUPERFOOD GUIDE',
    primaryColor: '#5C6BC0',
    bgColor: '#141824',
    accentColor: '#9FA8DA'
  },
  {
    file: 'bao-dhan-blog.jpg',
    title: 'Bao Dhan Red Rice Superfood',
    assamese: 'বাও ধান ৰঙা চাউল',
    calories: 'Iron & Complex Carbs',
    protein: 'Iron', carbs: 'Zinc', fat: 'Red Rice',
    category: 'RED RICE GUIDE',
    primaryColor: '#EF5350',
    bgColor: '#241012',
    accentColor: '#EF9A9A'
  }
];

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
  ctx.font = 'bold 54px sans-serif';
  ctx.textAlign = 'left';

  // Word wrap title if long
  const words = card.title.split(' ');
  let line = '';
  let yPos = 210;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 1070 && n > 0) {
      ctx.fillText(line.trim(), 65, yPos);
      line = words[n] + ' ';
      yPos += 68;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), 65, yPos);

  // Assamese Dish Subtitle (Regional Script)
  yPos += 75;
  ctx.fillStyle = card.accentColor;
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText(card.assamese, 65, yPos);

  // Calorie Badge Box
  yPos += 65;
  ctx.fillStyle = 'rgba(255, 107, 53, 0.15)';
  ctx.strokeStyle = '#FF6B35';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(65, yPos, 480, 110, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FF6B35';
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText(card.calories, 90, yPos + 68);

  // Macro Ring Graphics (Right Side Center Graphic)
  const cx = 880;
  const cy = 520;
  const outerR = 190;

  // Draw Brass Katori Outer Ring
  ctx.strokeStyle = card.primaryColor;
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = card.accentColor;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR - 25, 0, Math.PI * 2);
  ctx.stroke();

  // Katori Center Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('NUTRITION', cx, cy - 15);
  ctx.fillStyle = card.accentColor;
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText('PROFILE', cx, cy + 30);

  // Bottom Macro Pills (Protein, Carbs, Fat)
  const pillY = 660;

  // Protein Pill
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.strokeStyle = card.primaryColor;
  ctx.lineWidth = 2;

  ctx.beginPath(); ctx.roundRect(65, pillY, 200, 80, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('PROTEIN', 165, pillY + 35);
  ctx.fillStyle = card.accentColor; ctx.font = 'bold 26px sans-serif';
  ctx.fillText(card.protein, 165, pillY + 68);

  // Carbs Pill
  ctx.beginPath(); ctx.roundRect(290, pillY, 200, 80, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('CARBS', 390, pillY + 35);
  ctx.fillStyle = card.accentColor; ctx.font = 'bold 26px sans-serif';
  ctx.fillText(card.carbs, 390, pillY + 68);

  // Fat Pill
  ctx.beginPath(); ctx.roundRect(515, pillY, 200, 80, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('FAT / TYPE', 615, pillY + 35);
  ctx.fillStyle = card.accentColor; ctx.font = 'bold 26px sans-serif';
  ctx.fillText(card.fat, 615, pillY + 68);

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
  console.log(`Generated ${card.file} (${width}x${height}, ${sizeKb} KB)`);
}

console.log('Generating 17 distinct card graphics with text, Assamese script, and nutrition profiles...');
cards.forEach(renderCard);
console.log('All 17 distinct card graphics successfully created in assets/ directory.');
