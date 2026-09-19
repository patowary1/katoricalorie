/**
 * verify-calculator-claim-integrity.js
 * 
 * Phase 3E-B3 Deterministic Verification:
 * 1. Independently extracts activity multipliers from index.html, hi/index.html, and as/index.html,
 *    asserting full multiplier parity ([1.2, 1.375, 1.55, 1.725]) across all three locales.
 * 2. Proves exact Mifflin-St Jeor arithmetic for 1.0" and 1.2" discrepancy scenarios across
 *    all extracted activity multipliers.
 * 3. Scans public HTML and JS files to assert that no banned overclaims, competitor names,
 *    unverified generalizations, or false authority attributions exist.
 * 4. Asserts that approved, calibrated explanations, headings, and formulas are present.
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

console.log('\n=== 1. MULTIPLIER PARITY EXTRACTION ACROSS LOCALES ===\n');

// Standard constants
const CM_PER_INCH = 2.54;
const MIFFLIN_HEIGHT_COEFF = 6.25; // kcal / cm / day
const EXPECTED_MULTIPLIERS = [1.2, 1.375, 1.55, 1.725];

function extractMultipliers(relPath) {
  const fullPath = path.join(ROOT_DIR, relPath);
  assert(fs.existsSync(fullPath), `File exists for multiplier extraction: ${relPath}`);
  const html = fs.readFileSync(fullPath, 'utf8');
  const selectMatch = html.match(/<select[^>]*id=["']activity(?:-select)?["'][^>]*>([\s\S]*?)<\/select>/i);
  assert(Boolean(selectMatch), `[${relPath}] Found activity <select> element`);
  const optionMatches = [...selectMatch[1].matchAll(/<option[^>]*value=["']([0-9.]+)["'][^>]*>/gi)];
  return optionMatches.map(m => parseFloat(m[1]));
}

const enMultipliers = extractMultipliers('index.html');
const hiMultipliers = extractMultipliers('hi/index.html');
const asMultipliers = extractMultipliers('as/index.html');

console.log('index.html multipliers:   ', enMultipliers);
console.log('hi/index.html multipliers:', hiMultipliers);
console.log('as/index.html multipliers:', asMultipliers);

assert(JSON.stringify(enMultipliers) === JSON.stringify(EXPECTED_MULTIPLIERS), 'index.html contains expected set [1.2, 1.375, 1.55, 1.725]');
assert(JSON.stringify(hiMultipliers) === JSON.stringify(EXPECTED_MULTIPLIERS), 'hi/index.html contains expected set [1.2, 1.375, 1.55, 1.725]');
assert(JSON.stringify(asMultipliers) === JSON.stringify(EXPECTED_MULTIPLIERS), 'as/index.html contains expected set [1.2, 1.375, 1.55, 1.725]');
assert(JSON.stringify(enMultipliers) === JSON.stringify(hiMultipliers) && JSON.stringify(hiMultipliers) === JSON.stringify(asMultipliers), 'Full multiplier parity confirmed across EN, HI, and AS');

console.log('\n=== 2. MATHEMATICAL BASELINE ARITHMETIC VERIFICATION ===\n');

// Scenario A: 5.6 ft vs 5 ft 6 in
const heightA_decimal_ft = 5.6;
const heightA_decimal_inches = heightA_decimal_ft * 12; // 67.2 inches
const heightA_compound_inches = 5 * 12 + 6; // 66.0 inches
const deltaA_inches = heightA_decimal_inches - heightA_compound_inches; // 1.2 inches
const deltaA_cm = deltaA_inches * CM_PER_INCH; // 3.048 cm
const bmrDeltaA = deltaA_cm * MIFFLIN_HEIGHT_COEFF; // 19.05 kcal/day

assert(Math.abs(deltaA_inches - 1.2) < 1e-9, `Scenario A delta is exactly 1.2 inches (got ${deltaA_inches})`);
assert(Math.abs(deltaA_cm - 3.048) < 1e-9, `Scenario A delta is exactly 3.048 cm (got ${deltaA_cm})`);
assert(Math.abs(bmrDeltaA - 19.05) < 1e-9, `Scenario A Mifflin BMR delta is exactly 19.05 kcal/day (got ${bmrDeltaA})`);

enMultipliers.forEach(mult => {
  const tdeeDelta = bmrDeltaA * mult;
  console.log(`Scenario A (1.2") TDEE delta @ ${mult}x = ${tdeeDelta.toFixed(4)} kcal/day`);
});
assert(Math.abs(bmrDeltaA * 1.2 - 22.86) < 1e-9, 'Scenario A TDEE @ 1.2x is 22.86 kcal/day');
assert(Math.abs(bmrDeltaA * 1.375 - 26.19375) < 1e-9, 'Scenario A TDEE @ 1.375x is ~26.19 kcal/day');
assert(Math.abs(bmrDeltaA * 1.55 - 29.5275) < 1e-9, 'Scenario A TDEE @ 1.55x is ~29.53 kcal/day');
assert(Math.abs(bmrDeltaA * 1.725 - 32.86125) < 1e-9, 'Scenario A TDEE @ 1.725x is ~32.86 kcal/day');

// Scenario B: 5.5 ft vs 5 ft 5 in
const heightB_decimal_ft = 5.5;
const heightB_decimal_inches = heightB_decimal_ft * 12; // 66.0 inches
const heightB_compound_inches = 5 * 12 + 5; // 65.0 inches
const deltaB_inches = heightB_decimal_inches - heightB_compound_inches; // 1.0 inch
const deltaB_cm = deltaB_inches * CM_PER_INCH; // 2.54 cm
const bmrDeltaB = deltaB_cm * MIFFLIN_HEIGHT_COEFF; // 15.875 kcal/day

assert(Math.abs(deltaB_inches - 1.0) < 1e-9, `Scenario B delta is exactly 1.0 inch (got ${deltaB_inches})`);
assert(Math.abs(deltaB_cm - 2.54) < 1e-9, `Scenario B delta is exactly 2.54 cm (got ${deltaB_cm})`);
assert(Math.abs(bmrDeltaB - 15.875) < 1e-9, `Scenario B Mifflin BMR delta is exactly 15.875 kcal/day (got ${bmrDeltaB})`);

enMultipliers.forEach(mult => {
  const tdeeDelta = bmrDeltaB * mult;
  console.log(`Scenario B (1.0") TDEE delta @ ${mult}x = ${tdeeDelta.toFixed(4)} kcal/day`);
});
assert(Math.abs(bmrDeltaB * 1.2 - 19.05) < 1e-9, 'Scenario B TDEE @ 1.2x is 19.05 kcal/day');
assert(Math.abs(bmrDeltaB * 1.375 - 21.828125) < 1e-9, 'Scenario B TDEE @ 1.375x is ~21.83 kcal/day');
assert(Math.abs(bmrDeltaB * 1.55 - 24.60625) < 1e-9, 'Scenario B TDEE @ 1.55x is ~24.61 kcal/day');
assert(Math.abs(bmrDeltaB * 1.725 - 27.384375) < 1e-9, 'Scenario B TDEE @ 1.725x is ~27.38 kcal/day');

console.log('\n=== 3. STATIC SCAN FOR BANNED CLAIMS & OVERBROAD PATTERNS ===\n');

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
  { name: 'English unsupported 25 to 50 calories claim', regex: /25\s+to\s+50\s+calories\s+every\s+day/i },
  { name: 'Eliminate all rounding overclaim', regex: /eliminate\s+all\s+rounding/i },
  { name: 'Millions of people generalization', regex: /millions\s+of\s+people/i },
  { name: '35 calories daily error claim', regex: /35\s+calories\s+(every\s+day|less)/i },
  { name: '12,775 calories compound claim', regex: /12,?775\s*calories/i },
  { name: '3.6 pounds of fat claim', regex: /3\.6\s*pounds/i },
  { name: 'Plateau frustration diet fatigue', regex: /plateau\s+frustration/i },
  { name: 'Most accurate metabolic baseline overclaim', regex: /most\s+accurate\s+metabolic\s+baseline/i },
  { name: 'Unverified attribution: Metabolic Sciences Group', regex: /Metabolic\s+Sciences\s+Group/i },
  { name: 'English homepage "Many online calculators" generalization', regex: /Many\s+online\s+calculators\s+use\s+decimal\s+sliders/i },
  { name: 'Hindi homepage "कई ऑनलाइन कैलकुलेटरों" generalization', regex: /कई\s+ऑनलाइन\s+कैलकुलेटरों\s+में\s+दशमलव\s+स्लाइडर/ },
  { name: 'English why-accuracy "popular health widgets" generalization', regex: /popular\s+health\s+widgets/i },
  { name: 'Blog "basic code scripts read" false programming claim', regex: /basic\s+code\s+scripts\s+read/i },
  { name: 'Blog "read variables in base-10"', regex: /read\s+variables\s+in\s+base-10/i },
  { name: 'Assamese "বেছিভাগ কেলকুলেটৰতে" generalization', regex: /বেছিভাগ\s+কেলকুলেটৰতে/ },
  { name: 'Assamese "বেছিভাগ সাধাৰণ কেলকুলেটৰে" generalization', regex: /বেছিভাগ\s+সাধাৰণ\s+কেলকুলেটৰে/ },
  { name: 'Blog title "Why Most Calorie Calculators are Wrong"', regex: /Why\s+Most\s+Calorie\s+Calculators\s+are\s+Wrong/i },
  { name: 'Blog card "popular online BMR and TDEE calculators"', regex: /popular\s+online\s+BMR\s+and\s+TDEE\s+calculators/i },
  { name: 'Blog article institutional FSSAI / ICMR-NIN authority claim', regex: /(FSSAI\s+compliance\s+levels|ICMR-NIN\s+Hyderabad\s+energy\s+metrics)/i },
  { name: 'Blog article "Some health forms and web tools" prevalence claim', regex: /Some\s+health\s+forms\s+and\s+web\s+tools/i },
  { name: 'Literal Markdown bold syntax in HTML (**text**)', regex: /\*\*[^*]+\*\*/ }
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

console.log('\n=== 4. REQUIRED CALIBRATED ASSERTIONS ===\n');

const REQUIRED_STRINGS = [
  // Assamese Approved Replacements
  {
    file: 'as/why-accuracy.html',
    desc: 'Assamese generic competitor label',
    str: 'দশমিক ফুট ব্যৱহাৰ কৰা অন্যান্য কেলকুলেটৰসমূহ'
  },
  {
    file: 'as/why-accuracy.html',
    desc: 'Assamese subheader conditional framing',
    str: 'দশমিক ফুট আৰু ফুট-ইঞ্চিৰ ৰূপান্তৰত অস্পষ্টতা থাকিলে মেটাবলিক হিচাপৰ আনুমানিক ফলাফল কেনেকৈ সলনি হ’ব পাৰে জানক।'
  },
  {
    file: 'as/why-accuracy.html',
    desc: 'Assamese H2 heading ambiguity framing',
    str: 'দশমিক ফুট আৰু ফুট-ইঞ্চিৰ অস্পষ্টতা কিয় গুৰুত্বপূৰ্ণ?'
  },
  {
    file: 'as/why-accuracy.html',
    desc: 'Assamese intro paragraph conditional framing',
    str: 'যদি দশমিক ফুটৰ মানক ফুট-ইঞ্চিৰ মান বুলি ভুলকৈ ধৰা হয়, তেন্তে BMR আৰু TDEE-ৰ আনুমানিক ফলাফল সলনি হ’ব পাৰে।'
  },
  {
    file: 'as/why-accuracy.html',
    desc: 'Assamese table flaw row conditional framing',
    str: 'ফুট বুজাবলৈ দশমিক মান ব্যৱহাৰ কৰা হ’লে (যেনে: ৫.৫), সেই মানক যদি ভুলকৈ ৫ ফুট ৫ ইঞ্চি বুলি ধৰা হয়'
  },
  {
    file: 'as/why-accuracy.html',
    desc: 'Assamese table katori fix avoiding ambiguity',
    str: 'সৰল মেট্ৰিক ছেণ্টিমিটাৰ (cm) ব্যৱহাৰ কৰে, যাৰ ফলত ফুট-ইঞ্চি ৰূপান্তৰৰ অস্পষ্টতা এৰাব পৰা যায়।'
  },
  {
    file: 'as/why-accuracy.html',
    desc: 'Assamese table fix estimate framing',
    str: 'কিন্তু BMR আৰু TDEE-ৰ ফলাফল আনুমানিক মান।'
  },
  {
    file: 'as/why-accuracy.html',
    desc: 'Assamese math explanation conditional framing',
    str: 'কিন্তু যদি কোনো ইণ্টাৰফেচ, ছফ্টৱেৰ বা ব্যৱহাৰকাৰীয়ে দশমিকৰ পিছৰ অংশটোক ভুলকৈ পোনপটীয়াকৈ ইঞ্চি বুলি ধৰে'
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
    desc: 'Assamese sidebar estimate framing',
    str: 'KatoriCalorie-এ উচ্চতাৰ মান ছেণ্টিমিটাৰত লৈ Mifflin-St Jeor সমীকৰণত পোনপটীয়াকৈ ব্যৱহাৰ কৰে'
  },

  // English why-accuracy.html
  {
    file: 'why-accuracy.html',
    desc: 'English why-accuracy subheader ambiguity framing',
    str: 'Why metric centimeters matter in calorie tracking, and how height conversion ambiguity can shift metabolic estimates.'
  },
  {
    file: 'why-accuracy.html',
    desc: 'English why-accuracy H2 heading',
    str: 'Why Decimal Height Sliders Cause Ambiguity'
  },
  {
    file: 'why-accuracy.html',
    desc: 'English why-accuracy intro paragraph conditional framing',
    str: 'Calculating BMR and TDEE requires consistent input units. If a decimal-feet value is interpreted as feet-and-inches notation, the resulting discrepancy shifts estimated metabolic expenditure.'
  },
  {
    file: 'why-accuracy.html',
    desc: 'English why-accuracy table flaw conditional',
    str: 'If a decimal slider in feet (e.g., 5.5) is interpreted as 5 feet 5 inches instead of 5 feet 6 inches.'
  },
  {
    file: 'why-accuracy.html',
    desc: 'English why-accuracy table katori fix',
    str: 'Mifflin-St Jeor metabolic formulas are run directly on centimeter inputs.'
  },
  {
    file: 'why-accuracy.html',
    desc: 'English why-accuracy math card title',
    str: 'How Decimal Height Ambiguity Occurs'
  },
  {
    file: 'why-accuracy.html',
    desc: 'English why-accuracy math card conditional',
    str: 'However, ambiguity occurs if an interface, implementation, or user treats the decimal fraction directly as inches notation:'
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

  // Hindi why-accuracy.html
  {
    file: 'hi/why-accuracy.html',
    desc: 'Hindi why-accuracy subheader',
    str: 'ऊंचाई रूपांतरण में अस्पष्टता होने पर मेटाबॉलिक अनुमान कैसे बदल सकते हैं।'
  },
  {
    file: 'hi/why-accuracy.html',
    desc: 'Hindi why-accuracy H2 heading',
    str: 'दशमलव ऊंचाई स्लाइडर में अस्पष्टता क्यों होती है'
  },
  {
    file: 'hi/why-accuracy.html',
    desc: 'Hindi why-accuracy table flaw',
    str: 'यदि फीट में दशमलव मान (जैसे: 5.5) का उपयोग किया जाता है और उसे 5 फीट 6 इंच के बजाय 5 फीट 5 इंच मान लिया जाए।'
  },
  {
    file: 'hi/why-accuracy.html',
    desc: 'Hindi why-accuracy table fix',
    str: 'Mifflin-St Jeor मेटाबॉलिक सूत्रों को सीधे सेंटीमीटर इनपुट पर लागू किया जाता है।'
  },
  {
    file: 'hi/why-accuracy.html',
    desc: 'Hindi why-accuracy math explanation heading',
    str: 'दशमलव ऊंचाई की अस्पष्टता कैसे उत्पन्न होती है'
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

  // Homepage Badges
  {
    file: 'index.html',
    desc: 'English homepage conditional trust badge',
    str: 'If a decimal height slider is misread—for example, treating 5.5 feet as 5 feet 5 inches instead of 5 feet 6 inches'
  },
  {
    file: 'hi/index.html',
    desc: 'Hindi homepage conditional trust badge',
    str: 'यदि दशमलव ऊंचाई को गलत समझा जाता है—उदाहरण के लिए 5.5 फीट को 5 फीट 6 इंच के बजाय 5 फीट 5 इंच मान लिया जाए'
  },

  // Blog Article
  {
    file: 'blog/calculator-accuracy-decimal-feet-bug.html',
    desc: 'Blog H1 factual heading',
    str: 'Decimal Height Input: Understanding Feet-and-Inches Conversion Ambiguity'
  },
  {
    file: 'blog/calculator-accuracy-decimal-feet-bug.html',
    desc: 'Blog byline clean of fake review group',
    str: 'By the KatoriCalorie Editorial Board | Published June 2026'
  },
  {
    file: 'blog/calculator-accuracy-decimal-feet-bug.html',
    desc: 'Blog Section 1 safe conditional display',
    str: 'A decimal-feet input may display or accept a value such as <strong>5.5 feet</strong>.'
  },
  {
    file: 'blog/calculator-accuracy-decimal-feet-bug.html',
    desc: 'Blog Section 3 explicitly tied to 1-inch example',
    str: "In the 1-inch (2.54 cm) example above, the calculated TDEE difference is approximately 19–27 kcal/day across KatoriCalorie's current activity multipliers."
  },
  {
    file: 'blog/calculator-accuracy-decimal-feet-bug.html',
    desc: 'Blog Section 5 factual centimeter input explanation',
    str: 'Accepting height directly in centimeters avoids an additional feet-and-inches conversion step and keeps the calculator input consistent.'
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
  },
  {
    file: 'blog/calculator-accuracy-decimal-feet-bug.html',
    desc: 'Blog FAQ Q3 misread 5.5 question',
    str: 'What happens if 5.5 decimal feet is misread as 5 feet 5 inches?'
  },
  {
    file: 'blog/calculator-accuracy-decimal-feet-bug.html',
    desc: 'Blog FAQ Q4 centimeter input question',
    str: 'Why does KatoriCalorie use centimeters (cm) for height input?'
  }
];

REQUIRED_STRINGS.forEach(req => {
  const fullPath = path.join(ROOT_DIR, req.file);
  const content = fs.readFileSync(fullPath, 'utf8');
  assert(content.includes(req.str), `[${req.file}] Contains required string: "${req.desc}"`);
});

console.log(`\nVerification completed with ${failures} failure(s).\n`);
process.exit(failures > 0 ? 1 : 0);
