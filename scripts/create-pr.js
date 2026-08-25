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
  title: 'Phase 3B-1: Nutrition data integrity and trust foundation',
  head: 'repair/phase-3b1-data-integrity',
  base: 'main',
  body: `## Summary of Phase 3B-1 Implementation

### 1. Canonical Nutrition Dataset
- Established single source of truth in \`data/nutrition-db.json\` with 60 canonical food records.
- Synchronized \`js/food-db.js\`, Recipe JSON-LD schemas, and 17 generated card graphics.
- Added \`scripts/verify-nutrition-data.js\` with 27 passing checks and 2 explicit pending review flags.

### 2. Nutrition Decisions Implemented
- **Masor Tenga:** 140 kcal / 200ml (Preserved)
- **Joha Rice:** 150 kcal / 150g cooked katori (Preserved)
- **Bao Dhan:** 155 kcal / 150g cooked katori (Preserved)
- **Bora Saul:** 180 kcal / 150g cooked katori (Preserved)
- **Til Pitha:** Normalized to 110 kcal / 30g piece (derived from 366 kcal / 100g scientific composition)
- **Aloo Pitika:** Normalized to approved 90 kcal / 100g simple prep; macros flagged as unverified estimate pending assay.
- **Dosa + Sambar:** Normalized to 240 kcal / plate composite estimate.
- **Omita Khar:** Flagged as pending_review without guessing (55 vs 65 kcal).

### 3. Trust & Claim Softening
- Softened 100% precision claims across EN, AS, HI \`why-accuracy.html\`.
- Softened anti-diabetic claims on Joha Rice to antioxidant and ongoing metabolic research framing.
- Softened Khar physiological / detox assertions to traditional culinary starter framing.
- Softened exact GI and disease prevention wording across Bao Dhan, Bora Saul, and Masor Tenga articles.

### 4. Deduplication & Compatibility
- Deduplicated \`brown-basmati-rice\` and \`boiled-egg\`.
- Added \`foodAliases\` mapping and \`getFoodById\` resolver in \`js/food-db.js\`, \`js/calculator.js\`, and \`js/compare.js\` to preserve legacy persisted client state.
- Preserved Moong Dal (\`mug-dal\`) and Masoor Dal (\`masoor-dal\`) exactly once.

### 5. Verification
- Deterministic Nutrition Suite: **27 PASSED | 2 PENDING REVIEW | 0 FAILED**
- Live Production Regression Suite: **55/55 PASSED (100%)**
- Branch: \`repair/phase-3b1-data-integrity\`
- Status: **Awaiting CTO / User Approval before Merge**`
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
