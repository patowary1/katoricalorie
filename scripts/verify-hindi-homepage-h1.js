const fs = require('fs');
const { execSync } = require('child_process');

let pass = 0;
let fail = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    pass++;
  } else {
    console.error(`[FAIL] ${message}`);
    fail++;
  }
}

console.log('====================================================');
console.log(' KATORICALORIE PHASE 3E-B4 HINDI HOMEPAGE H1 VERIFIER');
console.log('====================================================\n');

// 1. Single H1 on English Homepage
const indexHtml = fs.readFileSync('index.html', 'utf-8');
const indexH1Matches = indexHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
assert(indexH1Matches.length === 1, `1. index.html contains exactly one homepage H1 (Found: ${indexH1Matches.length})`);

// 2. Single H1 on Assamese Homepage
const asHtml = fs.readFileSync('as/index.html', 'utf-8');
const asH1Matches = asHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
assert(asH1Matches.length === 1, `2. as/index.html contains exactly one homepage H1 (Found: ${asH1Matches.length})`);

// 3. Single H1 on Hindi Homepage
const hiHtml = fs.readFileSync('hi/index.html', 'utf-8');
const hiH1Matches = hiHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
assert(hiH1Matches.length === 1, `3. hi/index.html contains exactly one homepage H1 (Found: ${hiH1Matches.length})`);

// 4. Hindi H1 text exactly matches
const expectedHindiH1 = 'कटोरी के हिसाब से भारतीय और असमिया खाने की कैलोरी';
const actualHindiH1 = hiH1Matches.length > 0 ? hiH1Matches[0].replace(/<[^>]+>/g, '').trim() : '';
assert(actualHindiH1 === expectedHindiH1, `4. Hindi H1 text exactly matches: "${expectedHindiH1}" (Actual: "${actualHindiH1}")`);

// 5. Hindi intro text exists
const expectedHindiIntro = 'भारतीय और असमिया खाने को कटोरी, प्लेट या पीस के हिसाब से खोजें। अपनी थाली बनाएं, हिस्सों की तुलना करें और अपनी दैनिक कैलोरी जरूरत का अनुमान लगाएं।';
assert(hiHtml.includes(expectedHindiIntro), '5. Hindi intro text exists and matches expected copy');

// 6. Hindi H1 is not inside an element using display:none, visibility:hidden, or hidden attribute
let isHidden = false;
if (hiH1Matches.length > 0) {
  const h1Index = hiHtml.indexOf(hiH1Matches[0]);
  // Look backward to enclosing tags / section
  const sectionStart = hiHtml.lastIndexOf('<section', h1Index);
  const sectionEnd = hiHtml.indexOf('</section>', h1Index);
  const surrounding = hiHtml.substring(sectionStart, sectionEnd + 10);
  if (
    /display\s*:\s*none/i.test(surrounding) ||
    /visibility\s*:\s*hidden/i.test(surrounding) ||
    /\bhidden\b/i.test(surrounding)
  ) {
    isHidden = true;
  }
}
assert(!isHidden && hiH1Matches.length === 1, '6. Hindi H1 is not inside an element using display:none, visibility:hidden, or hidden attribute');

// 7. Hindi metadata/title remains byte-for-byte unchanged from baseline
const baselineHiHtml = execSync('git show 6f5daece0a43d027514d75ba04bb82e090113fd0:hi/index.html', { encoding: 'utf-8' });
const getHead = (html) => {
  const start = html.indexOf('<head>');
  const end = html.indexOf('</head>') + 7;
  return html.substring(start, end);
};
const currentHiHead = getHead(hiHtml);
const baselineHiHead = getHead(baselineHiHtml);
assert(currentHiHead === baselineHiHead, '7. Hindi metadata/title (<head> block) remains byte-for-byte unchanged from baseline 6f5daec');

// 8. English and Assamese H1/intro content remains unchanged from baseline
const baselineIndexHtml = execSync('git show 6f5daece0a43d027514d75ba04bb82e090113fd0:index.html', { encoding: 'utf-8' });
const baselineAsHtml = execSync('git show 6f5daece0a43d027514d75ba04bb82e090113fd0:as/index.html', { encoding: 'utf-8' });

const getHeroSection = (html) => {
  const m = html.match(/<section[^>]*class="[^"]*hero-section[^"]*"[^>]*>[\s\S]*?<\/section>/i);
  return m ? m[0].trim() : '';
};

assert(getHeroSection(indexHtml) === getHeroSection(baselineIndexHtml), '8a. English homepage H1 and intro content remains unchanged from baseline');
assert(getHeroSection(asHtml) === getHeroSection(baselineAsHtml), '8b. Assamese homepage H1 and intro content remains unchanged from baseline');

console.log('\n====================================================');
console.log(` RESULTS: ${pass} PASSED | ${fail} FAILED`);
console.log('====================================================');

if (fail > 0) {
  process.exit(1);
}
