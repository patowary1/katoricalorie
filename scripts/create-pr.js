const { execSync } = require('child_process');
const https = require('https');

const credRaw = execSync('git credential fill', { input: 'protocol=https\nhost=github.com\n\n' }).toString();
let token = '';
credRaw.split('\n').forEach(line => {
  if (line.startsWith('password=')) {
    token = line.slice('password='.length).trim();
  }
});

if (!token) {
  console.error('No token found in credential helper');
  process.exit(1);
}

const payload = JSON.stringify({
  title: 'Phase 3B-2A: Search intent, internal discovery and engagement tracking',
  head: 'growth/phase-3b2a-search-engagement',
  base: 'main',
  body: `## Phase 3B-2A Implementation Summary

### 1. English Homepage Intent (SEO Experiment 1)
- **Title:** \`Indian & Assamese Food Calories by Katori | KatoriCalorie\`
- **H1:** \`Indian & Assamese Food Calories by Katori\`
- **Description & Subtitle:** \`Search calories for Indian and Assamese foods by katori, plate or piece. Build your thali, compare portions and estimate your daily calorie needs.\`

### 2. Regional Priority Pages (SEO Experiment 2)
- **Bao Dhan:** \`Bao Dhan Red Rice Calories & Nutrition | KatoriCalorie\` (H1: \`Bao Dhan Red Rice: Calories & Nutrition\`)
- **Joha Rice:** \`Joha Rice Calories, Nutrition & Benefits | KatoriCalorie\` (H1: \`Joha Rice: Calories, Nutrition & Benefits\`)
- **Til Pitha:** \`Til Pitha Calories per Piece & Portion Guide | KatoriCalorie\` (H1: \`Til Pitha Calories & Portion Guide\`)
- **Bora Saul:** \`Bora Saul Calories & Nutrition | KatoriCalorie\` (H1: \`Bora Saul: Calories & Nutrition\`)

### 3. Food-to-Content Mapping (Internal Discovery)
- Created \`data/food-content-map.json\` mapping 10 core foods to canonical guides.
- Rendered crawlable, keyboard-accessible \`<a href="..." class="food-detail-link">\` on food cards with sufficient touch separation.

### 4. Static Internal Discovery & Related Sections
- Added compact \`Popular Calorie & Nutrition Guides\` section to English homepage.
- Added contextual related links across Bao Dhan, Joha Rice, Til Pitha, and Bora Saul articles.

### 5. Privacy-Conscious Umami Product Telemetry
- Created \`js/analytics.js\` wrapper \`trackKatoriEvent(name, data)\`.
- Zero PII, zero health metrics, zero raw query text. Fails silently if analytics is blocked.
- Events tracked: \`food_search_used\`, \`food_added\`, \`thali_started\`, \`portion_changed\`, \`tdee_calculated\`, \`detail_opened\`, \`language_switched\`, \`meal_bookmarked\`.

### 6. Verification
- Deterministic Search & Engagement Suite: **48 PASSED | 0 FAILED**
- Deterministic Nutrition Suite: **27 PASSED | 2 PENDING REVIEW | 0 FAILED**`
});

const req = https.request({
  hostname: 'api.github.com',
  path: '/repos/patowary1/katoricalorie/pulls',
  method: 'POST',
  headers: {
    'User-Agent': 'KatoriCalorie-Agent',
    'Authorization': 'token ' + token,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('GitHub API Status:', res.statusCode);
    const data = JSON.parse(body);
    if (res.statusCode === 201) {
      console.log('PR Created Successfully!');
      console.log('PR Number:', data.number);
      console.log('PR URL:', data.html_url);
    } else {
      console.log('API Response:', body);
    }
  });
});

req.on('error', e => console.error(e));
req.write(payload);
req.end();
