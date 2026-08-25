const fs = require('fs');

let calc = fs.readFileSync('js/calculator.js', 'utf-8');

// 1. Hook into calculateBMR for tdee_calculated (debounced)
const bmrSearch = `  state.bmr = Math.round(bmrVal);
  state.tdee = Math.round(bmrVal * state.activity);
  return state.bmr;`;

const bmrReplace = `  state.bmr = Math.round(bmrVal);
  state.tdee = Math.round(bmrVal * state.activity);
  
  if (typeof trackKatoriEvent === 'function') {
    trackKatoriEvent('tdee_calculated');
  }
  
  return state.bmr;`;

calc = calc.replace(bmrSearch, bmrReplace);

// 2. Hook into adjustItemQty for thali_started, food_added, portion_changed
const adjustSearch = `function adjustItemQty(itemId, change) {
  const item = findFood(itemId);
  if (!item) return;
  const isBurn = item.category === 'burn';
  const currentQty = state.thali[itemId] || 0;`;

const adjustReplace = `function adjustItemQty(itemId, change) {
  const item = findFood(itemId);
  if (!item) return;
  const isBurn = item.category === 'burn';
  const currentQty = state.thali[itemId] || 0;
  const initialThaliCount = Object.keys(state.thali).filter(id => state.thali[id] > 0).length;`;

calc = calc.replace(adjustSearch, adjustReplace);

// Hook food_added / thali_started
const addedSearch = `        state.thali[itemId] = 1.0; // Default portion
        showToast(\`Added \${item.name} to Plate\`, 'success');`;

const addedReplace = `        state.thali[itemId] = 1.0; // Default portion
        showToast(\`Added \${item.name} to Plate\`, 'success');
        
        if (typeof trackKatoriEvent === 'function') {
          if (initialThaliCount === 0) {
            trackKatoriEvent('thali_started');
          }
          trackKatoriEvent('food_added', {
            food_id: itemId,
            category: item.category,
            portion_label: item.unit
          });
        }`;

calc = calc.replace(addedSearch, addedReplace);

// Hook portion_changed on increment
const incSearch = `        if (currentQty === 0.7) {
          state.thali[itemId] = 1.0;
          showToast(\`Portion increased to Medium for \${item.name}\`, 'success');
        } else if (currentQty === 1.0) {
          state.thali[itemId] = 1.4;
          showToast(\`Portion increased to Large for \${item.name}\`, 'success');
                } else {
          showToast(\`Maximum portion reached for \${item.name}\`, 'info');
        }`;

const incReplace = `        if (currentQty === 0.7) {
          state.thali[itemId] = 1.0;
          showToast(\`Portion increased to Medium for \${item.name}\`, 'success');
          if (typeof trackKatoriEvent === 'function') {
            trackKatoriEvent('portion_changed', { food_id: itemId, portion_label: 'Medium (1.0)' });
          }
        } else if (currentQty === 1.0) {
          state.thali[itemId] = 1.4;
          showToast(\`Portion increased to Large for \${item.name}\`, 'success');
          if (typeof trackKatoriEvent === 'function') {
            trackKatoriEvent('portion_changed', { food_id: itemId, portion_label: 'Large (1.4)' });
          }
        } else {
          showToast(\`Maximum portion reached for \${item.name}\`, 'info');
        }`;

calc = calc.replace(incSearch, incReplace);

// Hook portion_changed on decrement
const decSearch = `      if (currentQty === 1.4) {
        state.thali[itemId] = 1.0;
        showToast(\`Portion decreased to Medium for \${item.name}\`, 'info');
      } else if (currentQty === 1.0) {
        state.thali[itemId] = 0.7;
        showToast(\`Portion decreased to Small for \${item.name}\`, 'info');
      } else {`;

const decReplace = `      if (currentQty === 1.4) {
        state.thali[itemId] = 1.0;
        showToast(\`Portion decreased to Medium for \${item.name}\`, 'info');
        if (typeof trackKatoriEvent === 'function') {
          trackKatoriEvent('portion_changed', { food_id: itemId, portion_label: 'Medium (1.0)' });
        }
      } else if (currentQty === 1.0) {
        state.thali[itemId] = 0.7;
        showToast(\`Portion decreased to Small for \${item.name}\`, 'info');
        if (typeof trackKatoriEvent === 'function') {
          trackKatoriEvent('portion_changed', { food_id: itemId, portion_label: 'Small (0.7)' });
        }
      } else {`;

calc = calc.replace(decSearch, decReplace);

// 3. Search debounced telemetry without search text
const searchListenerOld = `   // Search input listeners with clear button toggle
  const searchInput = document.getElementById('food-search');
  const btnClearSearch = document.getElementById('btn-clear-search');
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (btnClearSearch) {
        btnClearSearch.style.display = val.length > 0 ? 'flex' : 'none';
      }
      const activeTab = document.querySelector('.tab-btn.active');
      const category = activeTab ? activeTab.dataset.category : 'all';
      renderFoodGrid(category, val);
    });
  }`;

const searchListenerNew = `   // Search input listeners with clear button toggle
  const searchInput = document.getElementById('food-search');
  const btnClearSearch = document.getElementById('btn-clear-search');
  let searchAnalyticsTimer = null;
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (btnClearSearch) {
        btnClearSearch.style.display = val.length > 0 ? 'flex' : 'none';
      }
      const activeTab = document.querySelector('.tab-btn.active');
      const category = activeTab ? activeTab.dataset.category : 'all';
      renderFoodGrid(category, val);

      // Debounced privacy-safe telemetry without raw search query text
      clearTimeout(searchAnalyticsTimer);
      if (val.trim().length >= 2) {
        searchAnalyticsTimer = setTimeout(() => {
          const resultCards = document.querySelectorAll('#food-grid .food-card');
          const currentLang = document.documentElement.lang || 'en';
          if (typeof trackKatoriEvent === 'function') {
            trackKatoriEvent('food_search_used', {
              language: currentLang,
              result_count: resultCards.length
            });
          }
        }, 600);
      }
    });
  }`;

calc = calc.replace(searchListenerOld, searchListenerNew);

// 4. Detail Link click listener and language switch listener
const extraListeners = `
  // Analytics: Food card detail link clicks
  document.addEventListener('click', (e) => {
    const detailLink = e.target.closest('.food-detail-link');
    if (detailLink) {
      const foodId = detailLink.dataset.foodId || '';
      const targetPath = detailLink.getAttribute('href') || '';
      if (typeof trackKatoriEvent === 'function') {
        trackKatoriEvent('detail_opened', {
          food_id: foodId,
          target_path: targetPath,
          source: 'food_card'
        });
      }
    }
  });

  // Analytics: Language switch selector clicks
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
  });
`;

calc = calc.replace('// Hamburger Mobile Menu Toggle Action', extraListeners + '\n  // Hamburger Mobile Menu Toggle Action');

fs.writeFileSync('js/calculator.js', calc, 'utf-8');
console.log('Successfully updated js/calculator.js with Umami privacy-safe events');
