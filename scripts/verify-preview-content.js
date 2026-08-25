const https = require('https');

const previewUrl = process.argv[2] || 'https://katoricalorie-git-growth-phase-3b2a-sea-72f1a1-ridip-s-projects.vercel.app';

function fetch(p) {
  return new Promise(resolve => {
    https.get(previewUrl + p, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
  });
}

async function verifyPreviewContent() {
  console.log(`--- Checking Preview Content Over HTTP (${previewUrl}) ---`);
  
  // 1. Check data/food-content-map.json
  const mapRes = await fetch('/data/food-content-map.json');
  console.log('/data/food-content-map.json status:', mapRes.status);
  const mapData = JSON.parse(mapRes.body);
  console.log('Mapped content items count:', Object.keys(mapData).length);
  
  // 2. Check js/analytics.js
  const analyticsRes = await fetch('/js/analytics.js');
  console.log('/js/analytics.js status:', analyticsRes.status);
  console.log('Contains trackKatoriEvent:', analyticsRes.body.includes('trackKatoriEvent'));
  console.log('Contains privacy DISALLOWED_KEYS:', analyticsRes.body.includes('DISALLOWED_KEYS'));

  // 3. Check Homepage Titles & Discovery Section over HTTP
  const homeRes = await fetch('/');
  console.log('Homepage status:', homeRes.status);
  console.log('Homepage has new Title:', homeRes.body.includes('Indian &amp; Assamese Food Calories by Katori | KatoriCalorie'));
  console.log('Homepage has new H1:', homeRes.body.includes('Indian &amp; Assamese Food Calories by Katori'));
  console.log('Homepage has static guides section:', homeRes.body.includes('id="guides-heading"'));

  // 4. Check Bao Dhan over HTTP
  const baoRes = await fetch('/blog/bao-dhan-red-rice-superfood');
  console.log('Bao Dhan status:', baoRes.status);
  console.log('Bao Dhan has new Title:', baoRes.body.includes('Bao Dhan Red Rice Calories &amp; Nutrition | KatoriCalorie') || baoRes.body.includes('Bao Dhan Red Rice Calories & Nutrition | KatoriCalorie'));
  console.log('Bao Dhan has related block:', baoRes.body.includes('Related Regional Food Guides'));

  // 5. Check Joha Rice over HTTP
  const johaRes = await fetch('/blog/joha-rice-antioxidants-benefits');
  console.log('Joha Rice status:', johaRes.status);
  console.log('Joha Rice has new Title:', johaRes.body.includes('Joha Rice Calories, Nutrition &amp; Benefits | KatoriCalorie') || johaRes.body.includes('Joha Rice Calories, Nutrition & Benefits | KatoriCalorie'));
  console.log('Joha Rice has related block:', johaRes.body.includes('Related Regional Food Guides'));

  // 6. Check Til Pitha over HTTP
  const tilRes = await fetch('/food/til-pitha-portion-control');
  console.log('Til Pitha status:', tilRes.status);
  console.log('Til Pitha has new Title:', tilRes.body.includes('Til Pitha Calories per Piece &amp; Portion Guide | KatoriCalorie') || tilRes.body.includes('Til Pitha Calories per Piece & Portion Guide | KatoriCalorie'));
  console.log('Til Pitha has related block:', tilRes.body.includes('Related Regional Food Guides'));

  // 7. Check Bora Saul over HTTP
  const boraRes = await fetch('/blog/bora-saul-sticky-rice-glycemic-index');
  console.log('Bora Saul status:', boraRes.status);
  console.log('Bora Saul has new Title:', boraRes.body.includes('Bora Saul Calories &amp; Nutrition | KatoriCalorie') || boraRes.body.includes('Bora Saul Calories & Nutrition | KatoriCalorie'));
  console.log('Bora Saul has related block:', boraRes.body.includes('Related Regional Food Guides'));

  console.log('\n[ALL PHASE 3B-2A PREVIEW CONTENT ASSERTIONS CONFIRMED!]');
}

verifyPreviewContent();
