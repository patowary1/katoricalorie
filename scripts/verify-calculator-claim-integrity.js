/**
 * verify-calculator-claim-integrity.js
 * 
 * Phase 3E-B3 Deterministic Verification:
 * 1. Proves exact Mifflin-St Jeor arithmetic for 1.0" and 1.2" discrepancy scenarios.
 * 2. Scans public HTML and JS files to assert that no banned overclaims or competitor names exist.
 * 3. Asserts that approved, calibrated explanations and formulas are present.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

let failures = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    failures++;
  } else {
    console.log(`PASS: ${message}`);
  }
}

console.log('\n=== 1. MATHEMATICAL BASELINE ARITHMETIC VERIFICATION ===\n');

// Standard constants
const CM_PER_INCH = 2.54;
const MIFFLIN_HEIGHT_COEFF = 6.25; // kcal / cm / day
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  veryActive: 1.725
};

// Scenario A: 5.6 ft vs 5 ft 6 in
const heightA_decimal_ft = 5.6;
const heightA_decimal_inches = heightA_decimal_ft * 12; // 67.2 inches
const heightA_compound_inches = 5 * 12 + 6; // 66.0 inches
const deltaA_inches = heightA_decimal_inches - heightA_compound_inches; // 1.2 inches
const deltaA_cm = deltaA_inches * CM_PER_INCH; // 3.048 cm
const bmrDeltaA = deltaA_cm * MIFFLIN_HEIGHT_COEFF; // 19.05 kcal/day
const tdeeDeltaA_min = bmrDeltaA * ACTIVITY_MULTIPLIERS.sedentary; // 22.86 kcal/day
const tdeeDeltaA_max = bmrDeltaA * ACTIVITY_MULTIPLIERS.veryActive; // 32.86125 kcal/day

assert(Math.abs(deltaA_inches - 1.2) < 1e-9, `Scenario A delta is exactly 1.2 inches (got ${deltaA_inches})`);
assert(Math.abs(deltaA_cm - 3.048) < 1e-9, `Scenario A delta is exactly 3.048 cm (got ${deltaA_cm})`);
assert(Math.abs(bmrDeltaA - 19.05) < 1e-9, `Scenario A Mifflin BMR delta is exactly 19.05 kcal/day (got ${bmrDeltaA})`);
assert(Math.abs(tdeeDeltaA_min - 22.86) < 1e-9, `Scenario A TDEE min (1.2x) is exactly 22.86 kcal/day (got ${tdeeDeltaA_min})`);
assert(Math.abs(tdeeDeltaA_max - 32.86125) < 1e-9, `Scenario A TDEE max (1.725x) is 32.86 kcal/day (got ${tdeeDeltaA_max.toFixed(2)})`);

// Scenario B: 5.5 ft vs 5 ft 5 in
const heightB_decimal_ft = 5.5;
const heightB_decimal_inches = heightB_decimal_ft * 12; // 66.0 inches
const heightB_compound_inches = 5 * 12 + 5; // 65.0 inches
const deltaB_inches = heightB_decimal_inches - heightB_compound_inches; // 1.0 inch
const deltaB_cm = deltaB_inches * CM_PER_INCH; // 2.54 cm
const bmrDeltaB = deltaB_cm * MIFFLIN_HEIGHT_COEFF; // 15.875 kcal/day
const tdeeDeltaB_min = bmrDeltaB * ACTIVITY_MULTIPLIERS.sedentary; // 19.05 kcal/day
const tdeeDeltaB_moderate = bmrDeltaB * ACTIVITY_MULTIPLIERS.moderate; // 24.60625 kcal/day
const tdeeDeltaB_max = bmrDeltaB * ACTIVITY_MULTIPLIERS.veryActive; // 27.384375 kcal/day

assert(Math.abs(deltaB_inches - 1.0) < 1e-9, `Scenario B delta is exactly 1.0 inch (got ${deltaB_inches})`);
assert(Math.abs(deltaB_cm - 2.54) < 1e-9, `Scenario B delta is exactly 2.54 cm (got ${deltaB_cm})`);
assert(Math.abs(bmrDeltaB - 15.875) < 1e-9, `Scenario B Mifflin BMR delta is exactly 15.875 kcal/day (got ${bmrDeltaB})`);
assert(Math.abs(tdeeDeltaB_min - 19.05) < 1e-9, `Scenario B TDEE min (1.2x) is exactly 19.05 kcal/day (got ${tdeeDeltaB_min})`);
assert(Math.abs(tdeeDeltaB_moderate - 24.60625) < 1e-9, `Scenario B TDEE moderate (1.55x) is ~24.61 kcal/day (got ${tdeeDeltaB_moderate.toFixed(2)})`);
assert(Math.abs(tdeeDeltaB_max - 27.384375) < 1e-9, `Scenario B TDEE max (1.725x) is ~27.38 kcal/day (got ${tdeeDeltaB_max.toFixed(2)})`);

console.log('\n=== 2. STATIC SCAN FOR BANNED CLAIMS & OVERBROAD PATTERNS ===\n');

const FILES_TO_SCAN = [
  'index.html',
  'hi/index.html',
  'as/index.html',
  'why-accuracy.html',
  'hi/why-accuracy.html',
  'as/why-accuracy.html',
  'blog/calculator-accuracy-decimal-feet-bug.html',
  'blog/index.html',
  'js/blog-db.js'
];

const BANNED_PATTERNS = [
  { name: 'Competitor: Bajaj Finserv', regex: /Bajaj\s*Finserv/i },
  { name: '4-inch error overclaim', regex: /4-inch/i },
  { name: '100-150 kcal overclaim', regex: /100[–-]150\s*calories/i },
  { name: '100% accurate / precision claim', regex: /100%\s*(accurate|precise|precision|सटीक)/i },
  { name: 'Base-12 framing', regex: /(base-12|ভিত্তি-১২|बेस-12)/i },
  { name: 'Separate input feet/inches claim', regex: /separate\s+input\s+metric\s+system/i },
  { name: 'Exact target guarantee overclaim', regex: /(guaranteeing\s+exact\s+targets|সঠিক কেলৰীৰ লক্ষ্য নিশ্চিত|सटीक लक्ष्यों की गारंटी)/i },
  { name: 'Assamese unsupported 100+ claim', regex: /১০০\+\s*কেলৰী/ },
  { name: 'Assamese unsupported 25-50 claim', regex: /২৫\s*ৰ\s*পৰা\s*৫০\s*কেলৰী/ },
  { name: 'English unsupported 25 to 50 calories claim', regex: /25\s+to\s+50\s+calories\s+every\s+day/i }
];

FILES_TO_SCAN.forEach(relPath => {
  const fullPath = path.join(ROOT_DIR, relPath);
  assert(fs.existsSync(fullPath), `File exists: ${relPath}`);
  const content = fs.readFileSync(fullPath, 'utf8');

  BANNED_PATTERNS.forEach(pat => {
    const match = content.match(pat.regex);
    assert(!match, `[${relPath}] Free of banned pattern: "${pat.name}"`);
  });
});

console.log('\n=== 3. REQUIRED CALIBRATED ASSERTIONS ===\n');

const REQUIRED_STRINGS = [
  {
    file: 'as/why-accuracy.html',
    desc: 'Assamese generic competitor label',
    str: 'দশমিক ফুট ব্যৱহাৰ কৰা অন্যান্য কেলকুলেটৰসমূহ'
  },
  {
    file: 'as/why-accuracy.html',
    desc: 'Assamese calibrated BMR/TDEE variance',
    str: 'উচ্চতাৰ ভুল ৰূপান্তৰৰ বাবে BMR আৰু দৈনিক TDEE-ৰ আনুমানিক ফলাফল সলনি হ’ব পাৰে।'
  },
  {
    file: 'as/why-accuracy.html',
    desc: 'Assamese format explanation',
    str: 'দশমিক ফুট আৰু ফুট-ইঞ্চিত লিখা উচ্চতা দুটা বেলেগ ফৰ্মেট।'
  },
  {
    file: 'as/why-accuracy.html',
    desc: 'Assamese calibrated 19-27 kcal range',
    str: 'Mifflin-St Jeor সমীকৰণ অনুসৰি, উচ্চতাত ১ ইঞ্চিৰ পাৰ্থক্যই BMR-ৰ আনুমানিক ফলাফল প্ৰায় ১৬ কেলৰী/দিন সলনি কৰে। KatoriCalorie-ত ব্যৱহৃত সক্ৰিয়তা গুণকসমূহৰ ক্ষেত্ৰত ইয়াৰ ফলত TDEE প্ৰায় ১৯–২৭ কেলৰী/দিন সলনি হ’ব পাৰে।'
  },
  {
    file: 'as/why-accuracy.html',
    desc: 'Assamese estimate framing',
    str: 'KatoriCalorie-এ উচ্চতাৰ মান ছেণ্টিমিটাৰত লৈ Mifflin-St Jeor সমীকৰণত পোনপটীয়াকৈ ব্যৱহাৰ কৰে'
  },
  {
    file: 'index.html',
    desc: 'English homepage 1-inch discrepancy clarification',
    str: '1-inch discrepancy that shifts daily estimates by ~19–27 kcal across typical activity levels'
  },
  {
    file: 'hi/index.html',
    desc: 'Hindi homepage 1-inch discrepancy clarification',
    str: '1 इंच की यह विसंगति सामान्य गतिविधि स्तरों पर दैनिक अनुमान में ~19–27 कैलोरी का अंतर लाती है'
  },
  {
    file: 'why-accuracy.html',
    desc: 'English why-accuracy generic header',
    str: 'Calculators with Decimal Feet Sliders'
  },
  {
    file: 'why-accuracy.html',
    desc: 'English why-accuracy exact 1-inch variance',
    str: '1-inch (2.54 cm) difference alters estimated BMR by approximately 16 kcal/day (15.875 kcal/day)'
  },
  {
    file: 'hi/why-accuracy.html',
    desc: 'Hindi why-accuracy generic header',
    str: 'दशमलव फीट स्लाइडर वाले अन्य कैलकुलेटर'
  },
  {
    file: 'hi/why-accuracy.html',
    desc: 'Hindi why-accuracy exact BMR figure',
    str: '15.875 kcal/दिन'
  },
  {
    file: 'blog/calculator-accuracy-decimal-feet-bug.html',
    desc: 'Blog FAQ 1.2-inch discrepancy',
    str: '1.2-inch (3.048 cm) discrepancy alters Mifflin-St Jeor BMR by 19.05 kcal/day'
  },
  {
    file: 'blog/calculator-accuracy-decimal-feet-bug.html',
    desc: 'Blog FAQ direct centimeters',
    str: 'Our platform takes height directly in centimeters (cm) and applies the Mifflin-St Jeor equation'
  }
];

REQUIRED_STRINGS.forEach(req => {
  const fullPath = path.join(ROOT_DIR, req.file);
  const content = fs.readFileSync(fullPath, 'utf8');
  assert(content.includes(req.str), `[${req.file}] Contains required string: "${req.desc}"`);
});

console.log(`\nVerification completed with ${failures} failure(s).\n`);
process.exit(failures > 0 ? 1 : 0);
