
// Helper to localize unit strings for display
function formatLocalizedUnit(unit, lang) {
  if (lang === 'as') {
    const unitMapAS = {
  "1 serving (200ml)": "১ পৰিৱেশন (এবাৰত ২০০ মি.লি.)",
  "1 serving (150g)": "১ পৰিৱেশন (এবাৰত ১৫০ গ্ৰাম)",
  "1 serving (100g)": "১ পৰিৱেশন (এবাৰত ১০০ গ্ৰাম)",
  "1 serving (150ml)": "১ পৰিৱেশন (এবাৰত ১৫০ মি.লি.)",
  "1 serving (120g)": "১ পৰিৱেশন (এবাৰত ১২০ গ্ৰাম)",
  "1 plate (200g)": "১ থালি (২০০ গ্ৰাম)",
  "1 plate (150g)": "১ থালি (১৫০ গ্ৰাম)",
  "1 piece": "১ টা",
  "1 piece (~30g)": "১ টা (~৩০ গ্ৰাম)",
  "1 cup (soaked, 100g)": "১ কাপ (তিয়াই ৰখা, ১০০ গ্ৰাম)",
  "1 katori cooked (150g)": "১ বাটি সিজোৱা (১৫০ গ্ৰাম)",
  "1 serving (180g)": "১ পৰিৱেশন (এবাৰত ১৮০ গ্ৰাম)",
  "1 bowl (250g)": "১ বাটি (২৫০ গ্ৰাম)",
  "1 bowl (200ml)": "১ বাটি (২০০ মি.লি.)",
  "1 bowl (180g)": "১ বাটি (১৮০ গ্ৰাম)",
  "1 cup (150g cooked)": "১ কাপ (১৫০ গ্ৰাম সিজোৱা)",
  "1 cup (150ml)": "১ কাপ (১৫০ মি.লি.)",
  "1 plate (300g)": "১ থালি (৩০০ গ্ৰাম)",
  "1 bowl (200g)": "১ বাটি (২০০ গ্ৰাম)",
  "1 plate (1 Dosa + Sambar)": "১ থালি (১ ডোচা + চাম্বাৰ)",
  "1 plate (2 pieces)": "১ থালি (২ টা)",
  "1 plate (2 Littis + Chokha)": "১ থালি (২ লিট্টি + চখা)",
  "1 piece with gravy (150g)": "১ টুকুৰা ঝোলৰ সৈতে (১৫০ গ্ৰাম)",
  "1 plate (3 Luchis + Curry)": "১ থালি (৩ লুচি + তৰকাৰী)",
  "30 mins": "৩০ মিনিট",
  "1 plate (5 pieces)": "১ থালি (৫টা পানী পুৰি)",
  "1 plate": "১ থালি",
  "1 plate (6 pieces)": "১ থালি (৬ টা)",
  "1 glass (250ml)": "১ গিলাচ (২৫০ মি.লি.)"
};
    return unitMapAS[unit] || unit;
  }
  return unit;
}

// Current Page Language Detection Helper
function getAppLang() {
  return document.documentElement.lang || 'en';
}
// Dynamic Language Code Normalizer (en / as / hi)
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

// State management
let state = {
  weight: 65,      // kg
  height: 165,     // cm
  age: 28,         // years
  gender: 'male',  // male or female
  activity: 1.2,   // activity multiplier
  bmr: 0,
  tdee: 0,
  customTarget: 0, // Custom target lock
  thali: {}        // itemID -> quantity
};

// LocalStorage Persistence Keys
const STORAGE_KEY = 'katori_calorie_state';

// // Helper to resolve food item considering legacy aliases
const findFood = (id) => (typeof getFoodById === 'function' ? getFoodById(id) : (typeof foodDatabase !== 'undefined' ? foodDatabase.find(f => f.id === id) : undefined));

// Load State from storage if available
function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
      // Normalize legacy thali alias IDs if present
      if (state.thali && typeof foodAliases !== 'undefined') {
        for (const [key, val] of Object.entries(state.thali)) {
          if (foodAliases[key]) {
            const canonicalKey = foodAliases[key];
            state.thali[canonicalKey] = (state.thali[canonicalKey] || 0) + val;
            delete state.thali[key];
          }
        }
      }
    } catch (e) {
      console.error("Error parsing stored KatoriCalorie state:", e);
    }
  }
}

// Save State to local storage
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Calculate BMR using Mifflin-St Jeor Equation
function calculateBMR() {
  let bmrVal = 0;
  if (state.gender === 'male') {
    bmrVal = (10 * state.weight) + (6.25 * state.height) - (5 * state.age) + 5;
  } else {
    bmrVal = (10 * state.weight) + (6.25 * state.height) - (5 * state.age) - 161;
  }
  state.bmr = Math.round(bmrVal);
  state.tdee = Math.round(bmrVal * state.activity);
  return state.bmr;
}

// Calculate Dynamic Thali Calorie Totals
function calculateThali() {
  let caloriesConsumed = 0;
  let caloriesBurned = 0;
  let itemsCount = 0;

  for (const [itemId, qty] of Object.entries(state.thali)) {
    if (qty <= 0) continue;
    const item = findFood(itemId);
    if (!item) continue;

    itemsCount += qty;
    if (item.calories > 0) {
      caloriesConsumed += item.calories * qty;
    } else {
      // Calorie burn (represented as negative in database)
      caloriesBurned += Math.abs(item.calories) * qty;
    }
  }

  const netCalories = caloriesConsumed - caloriesBurned;

  return {
    consumed: caloriesConsumed,
    burned: caloriesBurned,
    net: netCalories,
    count: itemsCount
  };
}

// Update Range Slider Track Fills Dynamically
function updateSliderTrackFills() {
  const sliders = ['weight', 'height', 'age'];
  sliders.forEach(id => {
    const slider = document.getElementById(id + '-input');
    const fill = document.getElementById(id + '-track-fill');
    if (slider && fill) {
      const min = parseFloat(slider.min) || 0;
      const max = parseFloat(slider.max) || 100;
      const val = parseFloat(slider.value) || 0;
      const pct = ((val - min) / (max - min)) * 100;
      fill.style.width = pct + '%';
    }
  });
}

// Update Gender Segmented Slider capsule placement
function updateGenderSegmentedSlider() {
  const slider = document.getElementById('gender-slider');
  if (!slider) return;
  if (state.gender === 'male') {
    slider.style.transform = 'translateX(0)';
  } else {
    // Moves slider capsule right to cover Women option
    slider.style.transform = 'translateX(100%)';
  }
}

// Dynamic Toast Notifications System
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'ph-info';
  if (type === 'success') icon = 'ph-check-circle';
  else if (type === 'danger') icon = 'ph-warning-circle';
  
  toast.innerHTML = `
    <i class="ph ${icon}" style="font-size: 1.25rem;"></i>
    <span style="font-size: 0.95rem; font-weight: 500;">${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Auto dismiss after 3 seconds
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Onboarding Tour Steps Definition
const tourSteps = [
  {
    targetId: 'bmr-engine-heading',
    title: '1. Calculate target budget',
    body: 'Use the Mifflin-St Jeor engine to select biological gender, input weight/height/age, and apply as your daily calorie target.'
  },
  {
    targetId: 'food-heading',
    title: '2. Add food portions',
    body: 'Browse traditional staples and activities. Tap \'+\' to add foods to your active thali plate, or register calorie burn exercises.'
  },
  {
    targetId: 'calorie-balance-heading',
    title: '3. Check calorie balance',
    body: 'Watch your real-time Net Calorie balance against your daily allowances. Expand the footer sheet to review details.'
  }
];

let currentTourStep = 0;
let tourOverlay = null;
let tourTooltip = null;

function startOnboardingTour() {
  // Clear any existing tour elements
  stopOnboardingTour();
  
  currentTourStep = 0;
  
  // Create dimming overlay
  tourOverlay = document.createElement('div');
  tourOverlay.className = 'tour-overlay';
  document.body.appendChild(tourOverlay);
  
  // Create tooltip container
  tourTooltip = document.createElement('div');
  tourTooltip.className = 'tour-tooltip';
  document.body.appendChild(tourTooltip);
  
  showTourStep(0);
}

function stopOnboardingTour() {
  // Remove highlight class from any highlighted element
  document.querySelectorAll('.tour-highlight').forEach(el => {
    el.classList.remove('tour-highlight');
  });
  
  if (tourOverlay) {
    tourOverlay.remove();
    tourOverlay = null;
  }
  if (tourTooltip) {
    tourTooltip.remove();
    tourTooltip = null;
  }
  
  localStorage.setItem('katori_tour_completed', 'true');
}

function showTourStep(stepIndex) {
  // Clean up previous step highlights
  document.querySelectorAll('.tour-highlight').forEach(el => {
    el.classList.remove('tour-highlight');
  });
  
  if (stepIndex < 0 || stepIndex >= tourSteps.length) {
    stopOnboardingTour();
    return;
  }
  
  currentTourStep = stepIndex;
  const step = tourSteps[stepIndex];
  const target = document.getElementById(step.targetId);
  
  if (!target) {
    // Target not found, skip to next step
    showTourStep(stepIndex + 1);
    return;
  }
  
  // Highlight target
  target.classList.add('tour-highlight');
  
  // Populate tooltip content
  const isLastStep = stepIndex === tourSteps.length - 1;
  tourTooltip.innerHTML = `
    <div class="tour-tooltip-title">
      <i class="ph ph-compass" style="font-size: 1.25rem;"></i>
      <span>${step.title}</span>
    </div>
    <div class="tour-tooltip-body">${step.body}</div>
    <div class="tour-tooltip-footer">
      <button class="tour-btn-skip" onclick="stopOnboardingTour()">Skip</button>
      <div class="tour-badge">${stepIndex + 1} of ${tourSteps.length}</div>
      <button class="tour-btn" onclick="nextTourStep()">${isLastStep ? 'Finish' : 'Next'}</button>
    </div>
  `;
  
  // Position tooltip relative to target element
  positionTooltip(target, tourTooltip);
  
  // Scroll target into view
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function nextTourStep() {
  showTourStep(currentTourStep + 1);
}

function positionTooltip(target, tooltip) {
  const rect = target.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollLeft = window.scrollX || document.documentElement.scrollX;
  
  // Default placement: below the target
  let top = rect.bottom + scrollTop + 12;
  let left = rect.left + scrollLeft;
  
  // Ensure the tooltip is within screen boundaries
  const viewportWidth = window.innerWidth;
  const tooltipWidth = 320; // max-width
  
  if (left + tooltipWidth > viewportWidth) {
    left = viewportWidth - tooltipWidth - 16;
  }
  if (left < 16) {
    left = 16;
  }
  
  // If placing below goes offscreen, place it above target
  if (rect.bottom + 200 > window.innerHeight) {
    const estimatedHeight = 160;
    top = rect.top + scrollTop - estimatedHeight - 12;
    if (top < scrollTop) {
      top = rect.bottom + scrollTop + 12; // Fallback back to below
    }
  }
  
  tooltip.style.top = top + 'px';
  tooltip.style.left = left + 'px';
}

// Make functions globally accessible for click events
window.stopOnboardingTour = stopOnboardingTour;
window.nextTourStep = nextTourStep;
window.startOnboardingTour = startOnboardingTour;

// DOM Rendering Sync
function updateUI() {
  // Update Sliders and UI Readouts
  const weightInput = document.getElementById('weight-input');
  const heightInput = document.getElementById('height-input');
  const ageInput = document.getElementById('age-input');

  if (weightInput) {
    weightInput.value = state.weight;
    document.getElementById('weight-val').textContent = state.weight;
  }
  if (heightInput) {
    heightInput.value = state.height;
    document.getElementById('height-val').textContent = state.height;
  }
  if (ageInput) {
    ageInput.value = state.age;
    document.getElementById('age-val').textContent = state.age;
  }

  // Update gender buttons active state
  document.querySelectorAll('.gender-btn').forEach(btn => {
    if (btn.dataset.gender === state.gender) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Render Track Fills & Segmented Controls
  updateSliderTrackFills();
  updateGenderSegmentedSlider();

  // Update activity dropdown
  const activitySelect = document.getElementById('activity-select');
  if (activitySelect) {
    activitySelect.value = state.activity;
  }

  // Calculate values
  calculateBMR();
  const thaliMetrics = calculateThali();

  // Update BMR & TDEE Readouts
  const bmrValEl = document.getElementById('bmr-val-readout');
  const tdeeValEl = document.getElementById('tdee-val-readout');
  if (bmrValEl) bmrValEl.textContent = state.bmr + ' kcal';
  if (tdeeValEl) tdeeValEl.textContent = state.tdee + ' kcal';

  // Sync BMR/TDEE Interactive Result Card (fade in and ring fill)
  const resultCard = document.getElementById('calculator-result-card');
  const resultBmrVal = document.getElementById('result-bmr-val');
  const resultTdeeVal = document.getElementById('result-tdee-val');
  const resultTdeeFill = document.getElementById('result-tdee-fill');
  const resultTdeePercent = document.getElementById('result-tdee-percent');

  if (resultCard) {
    resultCard.classList.add('show');
  }
  if (resultBmrVal) resultBmrVal.textContent = state.bmr + ' kcal';
  if (resultTdeeVal) resultTdeeVal.textContent = state.tdee + ' kcal';

  if (resultTdeeFill && resultTdeePercent) {
    const baseline = 2000;
    const pctVal = Math.round((state.tdee / baseline) * 100);
    resultTdeePercent.textContent = pctVal + '%';

    const circumference = 251.2;
    const offset = circumference - (Math.min(pctVal, 150) / 100 * circumference);
    resultTdeeFill.style.strokeDashoffset = offset;
  }

  // Update Thali bottom bar info
  const thaliCountBadge = document.getElementById('thali-badge-count');
  const thaliNetReadout = document.getElementById('thali-net-readout');
  const footerDrawer = document.getElementById('thali-drawer');
  const progressFill = document.getElementById('thali-progress-fill');
  const progressLabel = document.getElementById('thali-progress-label');
  const itemsListEl = document.getElementById('thali-items-list');
  const itemsCountTextEl = document.getElementById('thali-items-count-text');

  if (thaliCountBadge) thaliCountBadge.textContent = thaliMetrics.count;
  if (thaliNetReadout) thaliNetReadout.textContent = thaliMetrics.net + ' kcal';

  // Update Progress Bar
  const targetLimit = state.customTarget || (state.tdee > 0 ? state.tdee : 2000);
  const netCalories = thaliMetrics.net;

  // Trigger Budget Warning once when exceeding
  if (netCalories > targetLimit) {
    if (!state.budgetExceededWarningShown) {
      showToast('Daily calorie budget exceeded!', 'danger');
      state.budgetExceededWarningShown = true;
    }
  } else {
    state.budgetExceededWarningShown = false;
  }

  if (progressFill && progressLabel) {
    const pct = targetLimit > 0 ? Math.min(Math.max((netCalories / targetLimit) * 100, 0), 100) : 0;
    progressFill.style.width = pct + '%';
    
    if (netCalories > targetLimit) {
      progressFill.style.background = 'var(--danger)';
      progressFill.style.boxShadow = '0 0 8px var(--danger)';
    } else {
      progressFill.style.background = '';
      progressFill.style.boxShadow = '';
    }
    
    progressLabel.textContent = `${netCalories} / ${targetLimit} kcal`;
  }

  // Update mobile thali tab badge count
  const mobileThaliBadge = document.getElementById('mobile-thali-badge');
  if (mobileThaliBadge) {
    const activeFoodItems = Object.entries(state.thali).filter(([id, qty]) => {
      if (qty <= 0) return false;
      const item = findFood(id);
      return item && item.category !== 'burn';
    });
    mobileThaliBadge.textContent = activeFoodItems.length;
  }

  // Render Visual Thali Plate in Sidebar
  updateVisualThali(netCalories, targetLimit);

  // Render Drawer Items List
  if (itemsListEl) {
    itemsListEl.innerHTML = '';
    let renderedCount = 0;
    
    for (const [itemId, qty] of Object.entries(state.thali)) {
      if (qty <= 0) continue;
      const item = findFood(itemId);
      if (!item) continue;
      
      renderedCount++;
      const isBurn = item.category === 'burn';
      const itemCal = Math.abs(item.calories) * qty;
      const calDisplay = isBurn ? `-${itemCal}` : `${itemCal}`;
      const burnClass = isBurn ? 'burn' : '';

      let qtyText = `${qty} × ${item.unit}`;
      if (!isBurn) {
        if (qty === 0.7) qtyText = `Small portion (${qty} × ${item.unit})`;
        else if (qty === 1.0) qtyText = `Medium portion (${item.unit})`;
        else if (qty === 1.4) qtyText = `Large portion (${qty} × ${item.unit})`;
      }
      
      const itemHTML = `
        <li class="thali-item-row" data-id="${item.id}">
          <div class="thali-item-name-info">
            <span class="thali-item-name">${item.name}</span>
            <span class="thali-item-qty-desc">${qtyText}</span>
          </div>
          <span class="thali-item-calories ${burnClass}">${calDisplay} kcal</span>
          <button class="btn-delete-item" onclick="deleteThaliItem('${item.id}')" aria-label="Delete ${item.name}">
            <i class="ph ph-trash"></i>
          </button>
        </li>
      `;
      itemsListEl.insertAdjacentHTML('beforeend', itemHTML);
    }
    
    if (renderedCount === 0) {
      itemsListEl.innerHTML = `
        <li style="width: 100%; border-bottom: none;">
          <div class="empty-plate-state">
            <i class="ph ph-cooking-pot" style="font-size: 2.5rem; color: var(--accent-primary); opacity: 0.5;"></i>
            <span style="font-size: 1rem; font-weight: 600; color: var(--text-primary);">Your Digital Plate is Empty</span>
            <span style="font-size: 0.85rem; max-width: 280px; text-align: center; line-height: 1.4;">Tap the "+" button on any food item above to start building your thali!</span>
          </div>
        </li>
      `;
    }
    
    if (itemsCountTextEl) {
      itemsCountTextEl.textContent = `${thaliMetrics.count} item${thaliMetrics.count !== 1 ? 's' : ''} selected`;
    }
  }

  // Show/Hide Floating Thali bar depending on items
  if (footerDrawer) {
    if (thaliMetrics.count > 0) {
      footerDrawer.classList.add('visible');
    } else {
      footerDrawer.classList.remove('visible');
      footerDrawer.classList.remove('expanded');
    }
  }

  // Update individual food card quantity readouts
  document.querySelectorAll('.food-card').forEach(card => {
    const itemId = card.dataset.id;
    const qty = state.thali[itemId] || 0;
    const qtyEl = card.querySelector('.control-qty');
    const item = findFood(itemId);
    const isBurn = item && item.category === 'burn';
    
    if (qty > 0) {
      card.classList.add('active');
      if (qtyEl) {
        if (isBurn) {
          qtyEl.textContent = `${qty} portion${qty > 1 ? 's' : ''}`;
        } else {
          if (getAppLang() === 'as') {
            qtyEl.textContent = qty === 0.7 ? 'সৰু' : qty === 1.0 ? 'মজলীয়া' : 'ডাঙৰ';
          } else if (getAppLang() === 'hi') {
            qtyEl.textContent = qty === 0.7 ? 'छोटा' : qty === 1.0 ? 'मध्यम' : 'बड़ा';
          } else {
            qtyEl.textContent = qty === 0.7 ? 'Small' : qty === 1.0 ? 'Medium' : 'Large';
          }
        }
      }
    } else {
      card.classList.remove('active');
      if (qtyEl) qtyEl.textContent = '0';
    }
  });

  // Save the latest state
  saveState();
}

// Setup Event Listeners
function setupCalculatorListeners() {
  // Sliders
  const weightInput = document.getElementById('weight-input');
  const heightInput = document.getElementById('height-input');
  const ageInput = document.getElementById('age-input');

  const addDragHandlers = (input) => {
    if (!input) return;
    const formGroup = input.closest('.form-group');
    
    const startDrag = () => {
      if (formGroup) formGroup.classList.add('dragging');
    };
    const endDrag = () => {
      if (formGroup) formGroup.classList.remove('dragging');
    };

    input.addEventListener('mousedown', startDrag);
    input.addEventListener('mouseup', endDrag);
    input.addEventListener('touchstart', startDrag, { passive: true });
    input.addEventListener('touchend', endDrag, { passive: true });
  };

  if (weightInput) {
    addDragHandlers(weightInput);
    weightInput.addEventListener('input', (e) => {
      state.weight = parseInt(e.target.value) || 65;
      updateUI();
    });
  }
  if (heightInput) {
    addDragHandlers(heightInput);
    heightInput.addEventListener('input', (e) => {
      state.height = parseInt(e.target.value) || 165;
      updateUI();
    });
  }
  if (ageInput) {
    addDragHandlers(ageInput);
    ageInput.addEventListener('input', (e) => {
      state.age = parseInt(e.target.value) || 28;
      updateUI();
    });
  }

  // Gender Buttons
  document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.gender = btn.dataset.gender;
      updateUI();
    });
  });

  // Activity Dropdown
  const activitySelect = document.getElementById('activity-select');
  if (activitySelect) {
    activitySelect.addEventListener('change', (e) => {
      state.activity = parseFloat(e.target.value) || 1.2;
      updateUI();
    });
  }

     // Reset Thali Button
  const btnReset = document.getElementById('btn-reset-thali');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      const itemCount = Object.values(state.thali).reduce((a, b) => a + b, 0);
      if (itemCount > 0) {
        state.thali = {};
        showToast('Cleared all items from plate', 'info');
        updateUI();
      }
    });
  }

  // Mobile Bottom Sheet Touch & Click Listeners
  const footerDrawer = document.getElementById('thali-drawer');
  const dragHandle = document.getElementById('thali-drag-handle');
  const barClick = document.getElementById('thali-bar-click');

  const toggleDrawer = (e) => {
    if (e.target.closest('#btn-reset-thali') || e.target.closest('.btn-delete-item') || e.target.closest('.control-btn')) {
      return;
    }
    if (footerDrawer) {
      footerDrawer.classList.toggle('expanded');
    }
  };

  if (dragHandle) dragHandle.addEventListener('click', toggleDrawer);
  if (barClick) barClick.addEventListener('click', toggleDrawer);

  let touchStartY = 0;
  let touchEndY = 0;

  const handleTouchStart = (e) => {
    touchStartY = e.changedTouches[0].screenY;
  };

  const handleTouchEnd = (e) => {
    touchEndY = e.changedTouches[0].screenY;
    const deltaY = touchEndY - touchStartY;
    
    // Swipe Up: Expand
    if (deltaY < -40) {
      if (footerDrawer && !footerDrawer.classList.contains('expanded')) {
        footerDrawer.classList.add('expanded');
      }
    }
    // Swipe Down: Collapse
    else if (deltaY > 40) {
      if (footerDrawer && footerDrawer.classList.contains('expanded')) {
        footerDrawer.classList.remove('expanded');
      }
    }
  };

  if (dragHandle) {
    dragHandle.addEventListener('touchstart', handleTouchStart, { passive: true });
    dragHandle.addEventListener('touchend', handleTouchEnd, { passive: true });
  }
    if (barClick) {
    barClick.addEventListener('touchstart', handleTouchStart, { passive: true });
    barClick.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

   // Apply Daily Target Button
  const btnApplyTarget = document.getElementById('btn-apply-target');
  if (btnApplyTarget) {
    btnApplyTarget.addEventListener('click', () => {
      state.customTarget = state.tdee;
      saveState();
      updateUI();
      
      // Analytics: intentional target application (action-only, zero sensitive metrics)
      if (typeof trackKatoriEvent === 'function') {
        trackKatoriEvent('daily_target_applied');
      }
      
      showToast(getAppLang() === 'as' ? `দৈনিক কেলৰি লক্ষ্য ${state.tdee} kcal নিৰ্ধাৰণ কৰা হ’ল!` : (getAppLang() === 'hi' ? `दैनिक कैलोरी लक्ष्य ${state.tdee} kcal निर्धारित किया गया!` : `Daily budget target locked at ${state.tdee} kcal!`), 'success');
      
           // Visual feedback on click
      btnApplyTarget.innerHTML = getAppLang() === 'as' ? '<i class="ph ph-check-circle"></i> লক্ষ্য পূৰণ হ’ল!' : (getAppLang() === 'hi' ? '<i class="ph ph-check-circle"></i> लक्ष्य लागू हुआ!' : '<i class="ph ph-check-circle"></i> Target Applied!');
      btnApplyTarget.style.background = 'var(--success)';
      btnApplyTarget.style.boxShadow = '0 0 12px rgba(34, 197, 94, 0.3)';
      setTimeout(() => {
        btnApplyTarget.innerHTML = getAppLang() === 'as' ? 'দৈনিক লক্ষ্য হিচাপে ব্যৱহাৰ কৰক' : (getAppLang() === 'hi' ? 'दैनिक लक्ष्य के रूप में उपयोग करें' : 'Use as Daily Target');
        btnApplyTarget.style.background = '';
        btnApplyTarget.style.boxShadow = '';
      }, 2000);
    });
  }

  // Tour Trigger Button
  const btnStartTour = document.getElementById('btn-start-tour');
  if (btnStartTour) {
    btnStartTour.addEventListener('click', () => {
      startOnboardingTour();
    });
  }
}

// Card add/subtract adjustments
function adjustItemQty(itemId, change) {
  const item = findFood(itemId);
  if (!item) return;
  const isBurn = item.category === 'burn';
  const currentQty = state.thali[itemId] || 0;
  const initialThaliCount = Object.keys(state.thali).filter(id => state.thali[id] > 0).length;

  if (isBurn) {
    const newQty = Math.max(0, currentQty + change);
    if (newQty === 0) {
      delete state.thali[itemId];
      showToast(`Removed ${item.name} from Burn`, 'info');
    } else {
      state.thali[itemId] = newQty;
      if (currentQty === 0) {
        showToast(`Added ${item.name} to Burn`, 'success');
      }
    }
  } else {
    // Food item
    if (change > 0) {
      if (currentQty === 0) {
        // Check 6-item limit for food items
        const foodItemsCount = Object.keys(state.thali).filter(id => {
          const f = foodDatabase.find(x => x.id === id);
          return f && f.category !== 'burn' && state.thali[id] > 0;
        }).length;
        
        if (foodItemsCount >= 6) {
          showToast("Your Thali is full! Remove a food to add another.", "danger");
          return;
        }
        state.thali[itemId] = 1.0; // Default portion
        showToast(`Added ${item.name} to Plate`, 'success');
        
        if (typeof trackKatoriEvent === 'function') {
          if (initialThaliCount === 0) {
            trackKatoriEvent('thali_started');
          }
          trackKatoriEvent('food_added', {
            food_id: itemId,
            category: item.category,
            portion_label: item.unit
          });
        }
      } else {
        // Increment portion multiplier: 0.7 -> 1.0 -> 1.4
        if (currentQty === 0.7) {
          state.thali[itemId] = 1.0;
          showToast(`Portion increased to Medium for ${item.name}`, 'success');
          if (typeof trackKatoriEvent === 'function') {
            trackKatoriEvent('portion_changed', { food_id: itemId, portion_label: 'Medium (1.0)' });
          }
        } else if (currentQty === 1.0) {
          state.thali[itemId] = 1.4;
          showToast(`Portion increased to Large for ${item.name}`, 'success');
          if (typeof trackKatoriEvent === 'function') {
            trackKatoriEvent('portion_changed', { food_id: itemId, portion_label: 'Large (1.4)' });
          }
        } else {
          showToast(`Maximum portion reached for ${item.name}`, 'info');
        }
      }

      // Smooth scroll target fix when adding/incrementing food item
      setTimeout(() => {
        const isMobile = window.innerWidth < 640;
        if (isMobile) {
          const thaliTabBtn = document.querySelector('.mobile-tab-btn[data-tab="thali"]');
          if (thaliTabBtn) {
            thaliTabBtn.click();
          }
        }
        const thaliPlate = document.getElementById('thali-plate');
        if (thaliPlate) {
          thaliPlate.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);

    } else {
      // Decrease portion multiplier: 1.4 -> 1.0 -> 0.7 -> remove
      if (currentQty === 1.4) {
        state.thali[itemId] = 1.0;
        showToast(`Portion decreased to Medium for ${item.name}`, 'info');
        if (typeof trackKatoriEvent === 'function') {
          trackKatoriEvent('portion_changed', { food_id: itemId, portion_label: 'Medium (1.0)' });
        }
      } else if (currentQty === 1.0) {
        state.thali[itemId] = 0.7;
        showToast(`Portion decreased to Small for ${item.name}`, 'info');
        if (typeof trackKatoriEvent === 'function') {
          trackKatoriEvent('portion_changed', { food_id: itemId, portion_label: 'Small (0.7)' });
        }
      } else {
        // 0.7 or less -> remove completely
        delete state.thali[itemId];
        showToast(`Removed ${item.name} from Plate`, 'info');
      }
    }
  }
  updateUI();
}

// Delete item from Thali directly
function deleteThaliItem(itemId) {
  const item = findFood(itemId);
  if (state.thali[itemId]) {
    delete state.thali[itemId];
    if (item) {
      const isBurn = item.category === 'burn';
      showToast(`Removed ${item.name} from ${isBurn ? 'Burn' : 'Plate'}`, 'info');
    }
    updateUI();
  }
}
window.deleteThaliItem = deleteThaliItem;

// Active Katori reference for the portion popup
let activeKatoriId = null;

// Render Visual Thali Plate in Sidebar
function updateVisualThali(netCalories, targetLimit) {
  const plate = document.getElementById('thali-plate');
  if (!plate) return;

  // Clear existing katori elements
  plate.querySelectorAll('.thali-katori').forEach(el => el.remove());

  // Filter food items (excluding burn/activity items)
  const activeItems = Object.entries(state.thali).filter(([id, qty]) => {
    if (qty <= 0) return false;
    const item = findFood(id);
    return item && item.category !== 'burn';
  });
  
  const total = activeItems.length;

  activeItems.forEach(([id, qty], index) => {
    const item = findFood(id);
    if (!item) return;

    // Arrange in a circle inside the Thali Plate
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
    const radius = isMobile ? 80 : (isTablet ? 105 : 130);

    const x = Math.round(radius * Math.cos(angle));
    const y = Math.round(radius * Math.sin(angle));

    const placeholder = getCardPlaceholder(item.category, item.id);

    const katori = document.createElement('div');
    katori.className = `thali-katori ${placeholder.gradientClass}`;
    katori.style.left = `calc(50% + ${x}px)`;
    katori.style.top = `calc(50% + ${y}px)`;
    katori.style.transform = 'translate(-50%, -50%)';
    katori.setAttribute('data-id', item.id);

    katori.innerHTML = `
      <i class="ph ${placeholder.iconClass}"></i>
      <span class="katori-portion-badge">${qty}x</span>
      <div class="katori-label">${item.name.length > 12 ? item.name.substring(0, 10) + '..' : item.name}</div>
    `;

    katori.addEventListener('click', (e) => {
      e.stopPropagation();
      openPortionPopup(item, katori);
    });

    plate.appendChild(katori);
  });

  // Update Thali border colors & text status
  plate.className = 'thali-plate';
  const badge = document.getElementById('thali-status-badge');
  const builderTotalEl = document.getElementById('thali-builder-total');
  
  if (builderTotalEl) {
    let foodCals = 0;
    activeItems.forEach(([id, qty]) => {
      const item = findFood(id);
      if (item) {
        foodCals += item.calories * qty;
      }
    });
    builderTotalEl.textContent = `${Math.round(foodCals)} kcal`;
  }
  
  if (total === 0) {
    if (badge) {
      badge.textContent = getAppLang() === 'as' ? 'থালি খালি' : (getAppLang() === 'hi' ? 'खाली थाली' : 'Empty Thali');
      badge.className = 'thali-status-badge status-balanced';
    }
  } else {
    const pct = (netCalories / targetLimit);
    if (pct < 0.7) {
      plate.classList.add('glow-green');
      if (badge) {
        badge.textContent = getAppLang() === 'as' ? 'সুষম' : (getAppLang() === 'hi' ? 'संतुलित' : 'Balanced');
        badge.className = 'thali-status-badge status-balanced';
      }
    } else if (pct <= 1.0) {
      plate.classList.add('glow-yellow');
      if (badge) {
        badge.textContent = getAppLang() === 'as' ? 'প্ৰায় পূৰ্ণ' : (getAppLang() === 'hi' ? 'लगभग भरी' : 'Almost Full');
        badge.className = 'thali-status-badge status-warning';
      }
    } else {
      plate.classList.add('glow-red');
      if (badge) {
        badge.textContent = getAppLang() === 'as' ? 'থালি অতিৰিক্ত ভৰিছে!' : (getAppLang() === 'hi' ? 'थाली अधिक भरी है!' : 'Thali Overloaded!');
        badge.className = 'thali-status-badge status-danger';
      }
    }
  }
}

// Open Portion Popup next to clicked Katori
function openPortionPopup(item, katoriEl) {
  const popup = document.getElementById('portion-popup');
  const readout = document.getElementById('popup-cal-readout');
  if (!popup || !readout) return;

  activeKatoriId = item.id;
  const currentMultiplier = state.thali[item.id] || 1.0;

  // Highlight the active portion button
  popup.querySelectorAll('.portion-opt-btn').forEach(btn => {
    const mult = parseFloat(btn.dataset.multiplier);
    if (Math.abs(mult - currentMultiplier) < 0.05) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  readout.textContent = `${Math.round(item.calories * currentMultiplier)} kcal`;

  // Display the popup
  popup.style.display = 'block';
  
  // Align portion popup centered above or below the katori
  const wrapper = document.querySelector('.thali-plate-wrapper');
  const wrapperRect = wrapper.getBoundingClientRect();
  const katoriRect = katoriEl.getBoundingClientRect();
  
  const left = katoriRect.left - wrapperRect.left + (katoriRect.width / 2);
  const top = katoriRect.top - wrapperRect.top;
  
  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
}

// Setup listeners for the portion select popup buttons
function setupPortionPopupListeners() {
  const popup = document.getElementById('portion-popup');
  const closeBtn = document.getElementById('btn-close-popup');
  if (!popup) return;

  popup.querySelectorAll('.portion-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mult = parseFloat(btn.dataset.multiplier);
      if (activeKatoriId) {
        state.thali[activeKatoriId] = mult;
        
        popup.querySelectorAll('.portion-opt-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const item = foodDatabase.find(f => f.id === activeKatoriId);
        if (item) {
          const readout = document.getElementById('popup-cal-readout');
          if (readout) {
            readout.textContent = `${Math.round(item.calories * mult)} kcal`;
          }
          showToast(`Portion size updated to ${btn.querySelector('.portion-name').textContent} for ${item.name}`, 'success');
        }
        
        updateUI();
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      popup.style.display = 'none';
      activeKatoriId = null;
    });
  }

  // Close popup when clicking outside of the popup and thali plate
  document.addEventListener('click', (e) => {
    if (popup.style.display === 'block') {
      if (!popup.contains(e.target) && !e.target.closest('.thali-katori')) {
        popup.style.display = 'none';
        activeKatoriId = null;
      }
    }
  });
}

// Setup Mobile Tab bar Switcher
function setupMobileTabListeners() {
  const tabBtns = document.querySelectorAll('.mobile-tab-btn');
  const foodSection = document.getElementById('food-section');
  const sidebarSection = document.getElementById('sidebar-section');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const tab = btn.dataset.tab;
      if (tab === 'foods') {
        if (foodSection) foodSection.classList.remove('hidden');
        if (sidebarSection) sidebarSection.classList.remove('active');
      } else if (tab === 'thali') {
        if (foodSection) foodSection.classList.add('hidden');
        if (sidebarSection) sidebarSection.classList.add('active');
      }
    });
  });
}

// Zero-dependency Canvas Exporter (#0D0D0D background)
function screenshotThali() {
  const activeItems = Object.entries(state.thali).filter(([id, qty]) => qty > 0);
  if (activeItems.length === 0) {
    showToast("Thali is empty! Add foods first.", "info");
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0D0D0D';
  ctx.fillRect(0, 0, 600, 600);

  // Thali plate circle
  const grad = ctx.createRadialGradient(300, 300, 50, 300, 300, 220);
  grad.addColorStop(0, '#1e1e1e');
  grad.addColorStop(1, '#0d0d0d');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(300, 300, 220, 0, 2 * Math.PI);
  ctx.fill();

  // Glow Border representation
  const thaliMetrics = calculateThali();
  const targetLimit = state.customTarget || (state.tdee > 0 ? state.tdee : 2000);
  const pct = thaliMetrics.net / targetLimit;
  ctx.lineWidth = 6;
  ctx.strokeStyle = pct < 0.7 ? '#22c55e' : (pct <= 1.0 ? '#f59e0b' : '#ef4444');
  ctx.stroke();

  // Filter food items (excluding burn/activity items)
  const foodItems = activeItems.filter(([id, qty]) => {
    const item = findFood(id);
    return item && item.category !== 'burn';
  });

  // Katoris (Colored circles with portion multiplier labels)
  foodItems.forEach(([id, qty], index) => {
    const item = findFood(id);
    if (!item) return;

    const angle = (index / foodItems.length) * 2 * Math.PI - Math.PI / 2;
    const radius = 135;
    const x = 300 + radius * Math.cos(angle);
    const y = 300 + radius * Math.sin(angle);

    // Circle background color based on category color mapping
    const categoryColors = {
      'assamese': '#FF6B35',
      'northeast': '#3B82F6',
      'staples': '#10B981',
      'snacks': '#F59E0B',
      'beverages': '#8B5CF6'
    };
    ctx.fillStyle = categoryColors[item.category] || '#FF6B35';

    ctx.beginPath();
    ctx.arc(x, y, 26, 0, 2 * Math.PI);
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    // Centered Multiplier label inside the circle
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${qty}x`, x, y);

    // Food Title text below the circle
    ctx.fillStyle = '#A3A3A3';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(item.name.substring(0, 12), x, y + 40);
  });

  // Header Title & Calorie stats
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('KatoriCalorie Thali Setup', 300, 50);
  
  ctx.fillStyle = '#FF6B35';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(`${thaliMetrics.net} / ${targetLimit} kcal`, 300, 555);

  // Exercises (Burn list) text
  const burnItems = activeItems.filter(([id, qty]) => {
    const item = findFood(id);
    return item && item.category === 'burn';
  });

  if (burnItems.length > 0) {
    ctx.fillStyle = '#22C55E';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    const burnText = "Exercise Burn: " + burnItems.map(([id, qty]) => {
      const item = findFood(id);
      return `${item.name} (-${Math.abs(item.calories) * qty} kcal)`;
    }).join(', ');
    ctx.fillText(burnText, 300, 515);
  }

  // Trigger download
  const link = document.createElement('a');
  link.download = `katori-thali-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  
  showToast("Thali image saved successfully!", "success");
}

// LocalStorage Bookmarking for Saved Meals
function saveBookmarkedMeal() {
  const activeItems = Object.entries(state.thali).filter(([id, qty]) => qty > 0);
  if (activeItems.length === 0) {
    showToast("Thali is empty! Add foods first.", "info");
    return;
  }
  
  const thaliMetrics = calculateThali();
  const bookmarks = JSON.parse(localStorage.getItem('katori_calorie_bookmarks') || '[]');
  const mealName = `Thali Meal - ${thaliMetrics.net} kcal (${new Date().toLocaleDateString(undefined, {month: 'short', day: 'numeric'})})`;
  
  bookmarks.push({
    id: Date.now().toString(),
    name: mealName,
    thali: { ...state.thali },
    netCalories: thaliMetrics.net,
    timestamp: new Date().toISOString()
  });
  
  localStorage.setItem('katori_calorie_bookmarks', JSON.stringify(bookmarks));
  showToast("Meal bookmarked successfully!", "success");
}

// Setup Thali Builder Panel UI hooks
function setupThaliBuilderListeners() {
  setupPortionPopupListeners();
  setupMobileTabListeners();

  const screenshotBtn = document.getElementById('btn-screenshot-thali');
  if (screenshotBtn) {
    screenshotBtn.addEventListener('click', screenshotThali);
  }

  const saveMealBtn = document.getElementById('btn-save-meal');
  if (saveMealBtn) {
    saveMealBtn.addEventListener('click', saveBookmarkedMeal);
  }
}

// Get category-specific gradient and Phosphor Icon class
function getCardPlaceholder(category, id) {
  const normId = id.toLowerCase();
  switch (category) {
    case 'assamese':
      let assameseIcon = 'ph-bowl';
      if (normId.includes('tenga')) assameseIcon = 'ph-fish';
      else if (normId.includes('pitha')) assameseIcon = 'ph-cookie';
      else if (normId.includes('pitika')) assameseIcon = 'ph-plant';
      else if (normId.includes('haah')) assameseIcon = 'ph-bowl';
      else if (normId.includes('gahori')) assameseIcon = 'ph-bowl';
      else if (normId.includes('dal')) assameseIcon = 'ph-bowl';
      else if (normId.includes('sak')) assameseIcon = 'ph-leaf';
      return { iconClass: assameseIcon, gradientClass: 'gradient-assamese' };
      
    case 'northeast':
      let neIcon = 'ph-bowl';
      if (normId.includes('pork')) neIcon = 'ph-bowl';
      else if (normId.includes('chicken')) neIcon = 'ph-bowl';
      else if (normId.includes('eromba')) neIcon = 'ph-bowl';
      return { iconClass: neIcon, gradientClass: 'gradient-northeast' };
      
    case 'staples':
      let stapleIcon = 'ph-grains';
      if (normId.includes('roti') || normId.includes('chapati') || normId.includes('nan')) stapleIcon = 'ph-grains';
      else if (normId.includes('biryani')) stapleIcon = 'ph-bowl';
      else if (normId.includes('chicken')) stapleIcon = 'ph-bowl';
      else if (normId.includes('dosa') || normId.includes('idli')) stapleIcon = 'ph-cookie';
      return { iconClass: stapleIcon, gradientClass: 'gradient-staples' };
      
    case 'snacks':
      return { iconClass: 'ph-cookie', gradientClass: 'gradient-snacks' };
      
    case 'beverages':
      return { iconClass: 'ph-coffee', gradientClass: 'gradient-beverages' };
      
    case 'burn':
      let burnIcon = 'ph-lightning';
      if (normId.includes('walk')) burnIcon = 'ph-footprints';
      else if (normId.includes('run')) burnIcon = 'ph-activity';
      else if (normId.includes('cycle')) burnIcon = 'ph-bicycle';
      else if (normId.includes('yoga')) burnIcon = 'ph-activity';
      return { iconClass: burnIcon, gradientClass: 'gradient-burn' };
      
    default:
      return { iconClass: 'ph-fork-knife', gradientClass: 'gradient-default' };
  }
}

// Render Food Cards dynamically based on active filter and query
function renderFoodGrid(categoryFilter = 'all', searchQuery = '') {
  const container = document.getElementById('food-grid-container');
  if (!container) return;

  container.innerHTML = '';

  // Filter items
  const filtered = foodDatabase.filter(item => {
    const matchesCategory = (categoryFilter === 'all') || (item.category === categoryFilter);
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.nameRegional && item.nameRegional.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

   if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-search-state">
        <i class="ph ph-magnifying-glass-x" style="font-size: 3rem; color: var(--accent-primary); opacity: 0.6;"></i>
        ${getAppLang() === 'as' ? `
        <h3 style="font-size: var(--text-lg); font-weight: 600; color: var(--text-primary); margin: 0;">কোনো খাদ্য পোৱা নগ’ল</h3>
        <p style="font-size: var(--text-sm); color: var(--text-secondary); max-width: 400px; margin: 0 auto; line-height: 1.5; text-align: center;">আপোনাৰ সন্ধানৰ সৈতে মিল থকা কোনো খাদ্য পোৱা নগ’ল। "ভাত", "মাছৰ টেঙা" আদি বিচাৰি চাওক।</p>
      ` : `
        <h3 style="font-size: var(--text-lg); font-weight: 600; color: var(--text-primary); margin: 0;">No Traditional Foods Found</h3>
        <p style="font-size: var(--text-sm); color: var(--text-secondary); max-width: 400px; margin: 0 auto; line-height: 1.5; text-align: center;">We couldn't find anything matching your search. Try searching for regional items like "tenga", staples like "rice", or exercises like "walk".</p>
      `}
      </div>
    `;
    return;
  }
   filtered.forEach((item, index) => {
    const isBurn = item.category === 'burn';
    const isQty = state.thali[item.id] || 0;
    const isActive = isQty > 0 ? 'active' : '';
    const isBurnClass = isBurn ? 'burn' : '';
    
    // Get category-specific gradient and icon placeholder
    const placeholder = getCardPlaceholder(item.category, item.id);

    // Staggered animation delay for the first 12 cards
    const delayStyle = index < 12 ? `style="animation-delay: ${index * 40}ms;"` : '';

    const cardHTML = `
      <div class="food-card ${isActive} ${isBurnClass}" data-id="${item.id}" ${delayStyle}>
        <!-- Top Image / Placeholder Area (16:9) -->
        <div class="card-image-area ${placeholder.gradientClass}">
          <div class="calorie-badge ${isBurnClass}">
            ${Math.abs(item.calories)} kcal
          </div>
          <div class="card-image-placeholder">
            <i class="placeholder-icon ph ${placeholder.iconClass}"></i>
          </div>
          <!-- Future image tag will sit here:
               <img src="/assets/food/${item.id}.jpg" alt="${item.name}" loading="lazy">
               Its presence will automatically cover the CSS gradient. -->
        </div>

        <div class="card-body">
          <div class="card-top">
            <div class="card-title">
              ${item.name}
              ${item.nameRegional ? `<span class="regional-lang">${item.nameRegional}</span>` : ''}
            </div>
            <div class="indicator-dot">
              <i class="ph ph-check"></i>
            </div>
          </div>
          
          <p class="card-desc">${item.desc}</p>
          
          <div class="card-meta" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm); font-size: var(--font-sm);">
            <div class="serving-lbl">
              ${getAppLang() === 'as' ? 'খোৱাৰ পৰিমাণ' : (getAppLang() === 'hi' ? 'भाग' : 'Portion')}: <span style="font-weight: 600; color: var(--text-primary);">${item.unit}</span>
            </div>
            <div class="macro-readout" style="color: var(--text-secondary); font-size: var(--font-xs);">
              ${item.protein ? `<span style="margin-right: 4px;">P: ${item.protein}g</span>` : ''}
              ${item.carbs ? `<span style="margin-right: 4px;">C: ${item.carbs}g</span>` : ''}
              ${item.fat ? `<span>F: ${item.fat}g</span>` : ''}
            </div>
          </div>

          ${(typeof foodContentMap !== 'undefined' && foodContentMap[item.id]) ? `
            <div class="card-detail-action" style="margin-bottom: var(--space-xs); text-align: right;">
              <a href="${foodContentMap[item.id].primaryUrl}" class="food-detail-link" data-food-id="${item.id}" style="font-size: var(--font-xs); color: var(--accent-orange); text-decoration: none; display: inline-flex; align-items: center; gap: 3px; font-weight: 500;">
                <span>${getAppLang() === 'as' ? 'পুষ্টি সহায়িকা চাওক' : foodContentMap[item.id].label}</span>
                <i class="ph ph-arrow-right" style="font-size: 11px;"></i>
              </a>
            </div>
          ` : ''}

          <div class="card-bottom">
            ${isQty > 0 ? `
              <div class="card-controls ${isBurnClass}">
                <button class="control-btn ${isBurnClass ? 'btn-burn' : ''}" onclick="event.stopPropagation(); adjustItemQty('${item.id}', -1)" aria-label="Decrease quantity">
                  <i class="ph ph-minus"></i>
                </button>
                <span class="control-qty" aria-live="polite">${isQty} portion${isQty > 1 ? 's' : ''}</span>
                <button class="control-btn ${isBurnClass ? 'btn-burn' : ''}" onclick="event.stopPropagation(); adjustItemQty('${item.id}', 1)" aria-label="Increase quantity">
                  <i class="ph ph-plus"></i>
                </button>
              </div>
            ` : `
              <button class="btn-add-plate ${isBurnClass}" onclick="event.stopPropagation(); adjustItemQty('${item.id}', 1)">
                <i class="ph ${isBurn ? 'ph-lightning' : 'ph-plus'}"></i>
                ${getAppLang() === 'as' ? (isBurn ? '+ শাৰীৰিক ক্ৰিয়াত যোগ কৰক' : '+ থালিত যোগ কৰক') : (getAppLang() === 'hi' ? (isBurn ? '+ कैलोरी बर्न में जोड़ें' : '+ थाली में जोड़ें') : (isBurn ? 'Add to Burn' : 'Add to Plate'))}
              </button>
            `}
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', cardHTML);
  });
}
// Setup Navigation and Filters (Desktop + Mobile)
function setupTabListeners() {
  // Desktop Tab Buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const category = btn.dataset.category || 'all';
      const searchVal = document.getElementById('food-search')?.value || '';
      
      // Sync Mobile Select Dropdown if it exists
      const mobileSelect = document.getElementById('mobile-category-select');
      if (mobileSelect) {
        mobileSelect.value = category;
      }
      
      renderFoodGrid(category, searchVal);
    });
  });

  // Mobile Dropdown Category Selector
  const mobileCategorySelect = document.getElementById('mobile-category-select');
  if (mobileCategorySelect) {
    mobileCategorySelect.addEventListener('change', (e) => {
      const category = e.target.value;
      const searchVal = document.getElementById('food-search')?.value || '';
      
      // Sync Desktop Active Tab Button
      document.querySelectorAll('.tab-btn').forEach(b => {
        if (b.dataset.category === category) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      
      renderFoodGrid(category, searchVal);
    });
  }

   // Search input listeners with clear button toggle
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
          const currentLang = getCurrentLangCode();
          if (typeof trackKatoriEvent === 'function') {
            trackKatoriEvent('food_search_used', {
              language: currentLang,
              result_count: resultCards.length
            });
          }
        }, 600);
      }
    });
  }

  if (btnClearSearch && searchInput) {
    btnClearSearch.addEventListener('click', () => {
      searchInput.value = '';
      btnClearSearch.style.display = 'none';
      const activeTab = document.querySelector('.tab-btn.active');
      const category = activeTab ? activeTab.dataset.category : 'all';
      renderFoodGrid(category, '');
    });
  }
  
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

  // Analytics: Language switch selector clicks (normalized to en / as / hi)
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
  });

  // Hamburger Mobile Menu Toggle Action
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });

    // Dismiss menu upon selecting any navigation item
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      });
    });
  }
}

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  setupCalculatorListeners();
  setupTabListeners();
  setupThaliBuilderListeners();
  
  // Render food grid with a simulated delay to showcase shimmering skeletons
  setTimeout(() => {
    renderFoodGrid('all', '');
    updateUI();
    
    // Auto-start onboarding tour for first-time visitors
    if (!localStorage.getItem('katori_tour_completed')) {
      startOnboardingTour();
    }
  }, 300);
  
  // Update BMR calculations and thali values immediately for initial shell readouts
  updateUI();
});
