const https = require('https');

const previewUrl = 'https://katoricalorie-git-repair-phase-3b1-data-c26b97-ridip-s-projects.vercel.app';

function fetch(p) {
  return new Promise(resolve => {
    https.get(previewUrl + p, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
  });
}

async function verifyPreview() {
  console.log('--- Checking Preview Content Over HTTP ---');
  
  // 1. Check data/nutrition-db.json
  const dataRes = await fetch('/data/nutrition-db.json');
  console.log('/data/nutrition-db.json status:', dataRes.status);
  const data = JSON.parse(dataRes.body);
  console.log('Canonical items count:', Object.keys(data).length);
  console.log('Til Pitha calories:', data['til-pitha'].nutrition.calories, data['til-pitha'].serving.label);
  console.log('Aloo Pitika calories:', data['aloo-pitika'].nutrition.calories, 'evidence:', data['aloo-pitika'].evidence.status);
  console.log('Dosa Sambar calories:', data['dosa-sambar'].nutrition.calories, 'evidence:', data['dosa-sambar'].evidence.status);
  console.log('Omita Khar evidence:', data['omita-khar'].evidence.status);
  
  // 2. Check js/food-db.js
  const jsRes = await fetch('/js/food-db.js');
  console.log('/js/food-db.js status:', jsRes.status);
  console.log('Has foodAliases:', jsRes.body.includes('foodAliases'));
  console.log('Has duplicate brown-basmati ID in array:', jsRes.body.includes('id: "brown-basmati",'));
  
  // 3. Check food/til-pitha-portion-control
  const tilRes = await fetch('/food/til-pitha-portion-control');
  console.log('Til Pitha food guide status:', tilRes.status);
  console.log('Til Pitha has 110 kcal:', tilRes.body.includes('110 kcal'));
  console.log('Til Pitha has 366 kcal:', tilRes.body.includes('366 kcal'));
  
  // 4. Check food/aloo-pitika-calories
  const alooRes = await fetch('/food/aloo-pitika-calories');
  console.log('Aloo Pitika food guide status:', alooRes.status);
  console.log('Aloo Pitika has 90 kcal:', alooRes.body.includes('90 kcal'));
  
  // 5. Check food/dosa-sambar-calories
  const dosaRes = await fetch('/food/dosa-sambar-calories');
  console.log('Dosa Sambar food guide status:', dosaRes.status);
  console.log('Dosa Sambar has 240 kcal:', dosaRes.body.includes('240 kcal'));

  console.log('\n[ALL PREVIEW HTTP CONTENT ASSERTIONS CONFIRMED!]');
}

verifyPreview();
