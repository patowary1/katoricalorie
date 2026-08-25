const fs = require('fs');

let calc = fs.readFileSync('js/calculator.js', 'utf-8');

// 1. Add getCurrentLangCode helper
if (!calc.includes('function getCurrentLangCode()')) {
  const langHelper = `// Dynamic Language Code Normalizer (en / as / hi)
function getCurrentLangCode() {
  if (typeof window !== 'undefined' && window.location) {
    const path = window.location.pathname;
    if (path.startsWith('/as')) return 'as';
    if (path.startsWith('/hi')) return 'hi';
  }
  if (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang) {
    const lang = document.documentElement.lang.toLowerCase();
    if (lang.startsWith('as')) return 'as';
    if (lang.startsWith('hi')) return 'hi';
  }
  return 'en';
}
`;
  calc = langHelper + '\n' + calc;
}

// 2. Remove trackKatoriEvent('tdee_calculated') from calculateBMR
calc = calc.replace(
  `  state.bmr = Math.round(bmrVal);
  state.tdee = Math.round(bmrVal * state.activity);
  
  if (typeof trackKatoriEvent === 'function') {
    trackKatoriEvent('tdee_calculated');
  }
  
  return state.bmr;`,
  `  state.bmr = Math.round(bmrVal);
  state.tdee = Math.round(bmrVal * state.activity);
  return state.bmr;`
);

// 3. Attach trackKatoriEvent('tdee_calculated') to btnApplyTarget click
calc = calc.replace(
  `      state.customTarget = state.tdee;
      saveState();
      updateUI();`,
  `      state.customTarget = state.tdee;
      saveState();
      updateUI();
      
      // Analytics: intentional TDEE calculation & target application (action-only, zero sensitive metrics)
      if (typeof trackKatoriEvent === 'function') {
        trackKatoriEvent('tdee_calculated');
      }`
);

// 4. Update food_search_used to use getCurrentLangCode()
calc = calc.replace(
  `          const currentLang = document.documentElement.lang || 'en';
          if (typeof trackKatoriEvent === 'function') {
            trackKatoriEvent('food_search_used', {
              language: currentLang,
              result_count: resultCards.length
            });
          }`,
  `          const currentLang = getCurrentLangCode();
          if (typeof trackKatoriEvent === 'function') {
            trackKatoriEvent('food_search_used', {
              language: currentLang,
              result_count: resultCards.length
            });
          }`
);

// 5. Update language_switched to normalize from/to to 'en' | 'as' | 'hi'
calc = calc.replace(
  `  // Analytics: Language switch selector clicks
  document.querySelectorAll('.lang-selector-item a').forEach(langLink => {
    langLink.addEventListener('click', () => {
      const currentLang = document.documentElement.lang || 'en';
      const targetLang = langLink.getAttribute('aria-label') || langLink.textContent.trim();
      if (typeof trackKatoriEvent === 'function') {
        trackKatoriEvent('language_switched', {
          from: currentLang,
          to: targetLang
        });
      }
    });
  });`,
  `  // Analytics: Language switch selector clicks (normalized to en / as / hi)
  document.querySelectorAll('.lang-selector-item a').forEach(langLink => {
    langLink.addEventListener('click', () => {
      const fromLang = getCurrentLangCode();
      const href = langLink.getAttribute('href') || '/';
      let toLang = 'en';
      if (href === '/as' || href.startsWith('/as')) toLang = 'as';
      else if (href === '/hi' || href.startsWith('/hi')) toLang = 'hi';
      if (fromLang !== toLang && typeof trackKatoriEvent === 'function') {
        trackKatoriEvent('language_switched', {
          from: fromLang,
          to: toLang
        });
      }
    });
  });`
);

fs.writeFileSync('js/calculator.js', calc, 'utf-8');
console.log('Successfully updated js/calculator.js with TDEE semantics and language normalization');
