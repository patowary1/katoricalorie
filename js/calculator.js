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

// Load State from storage if available
function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
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

// Calculate Thali Metrics
function calculateThali() {
  let caloriesConsumed = 0;
  let caloriesBurned = 0;
  let itemsCount = 0;

  for (const [itemId, qty] of Object.entries(state.thali)) {
    if (qty <= 0) continue;
    const item = foodDatabase.find(f => f.id === itemId);
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
    // Add show class to trigger fade-in scale animation
    resultCard.classList.add('show');
  }
  if (resultBmrVal) resultBmrVal.textContent = state.bmr + ' kcal';
  if (resultTdeeVal) resultTdeeVal.textContent = state.tdee + ' kcal';

  if (resultTdeeFill && resultTdeePercent) {
    const baseline = 2000; // General target adult active baseline comparison
    const pctVal = Math.round((state.tdee / baseline) * 100);
    resultTdeePercent.textContent = pctVal + '%';

    const circumference = 251.2; // Circumference of progress ring circle r=40
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
  if (progressFill && progressLabel) {
    const netCalories = thaliMetrics.net;
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

  // Render Drawer Items List
  if (itemsListEl) {
    itemsListEl.innerHTML = '';
    let renderedCount = 0;
    
    for (const [itemId, qty] of Object.entries(state.thali)) {
      if (qty <= 0) continue;
      const item = foodDatabase.find(f => f.id === itemId);
      if (!item) continue;
      
      renderedCount++;
      const isBurn = item.category === 'burn';
      const itemCal = Math.abs(item.calories) * qty;
      const calDisplay = isBurn ? `-${itemCal}` : `${itemCal}`;
      const burnClass = isBurn ? 'burn' : '';
      
      const itemHTML = `
        <li class="thali-item-row" data-id="${item.id}">
          <div class="thali-item-name-info">
            <span class="thali-item-name">${item.name}</span>
            <span class="thali-item-qty-desc">${qty} × ${item.unit}</span>
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
        <li style="text-align: center; color: var(--text-secondary); padding: var(--space-4); width: 100%;">
          Your plate is empty. Add some food items above!
        </li>
      `;
    }
    
    if (itemsCountTextEl) {
      itemsCountTextEl.textContent = `${thaliMetrics.count} item${thaliMetrics.count !== 1 ? 's' : ''} selected`;
    }
  }

  // Show/Hide Floating Thali bar depending on items (using .visible class instead of inline styles)
  if (footerDrawer) {
    if (thaliMetrics.count > 0) {
      footerDrawer.classList.add('visible');
    } else {
      footerDrawer.classList.remove('visible');
      footerDrawer.classList.remove('expanded');
    }
  }

  // Update Radial Progress Wheel (Dynamic Conic Meter)
  const progressCircle = document.getElementById('radial-meter-fill');
  const meterValReadout = document.getElementById('radial-meter-val');
  const meterLblReadout = document.getElementById('radial-meter-lbl');

  if (progressCircle && meterValReadout) {
    progressCircle.style.transition = 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease';
    
    meterValReadout.textContent = Math.abs(thaliMetrics.net);
    
    if (thaliMetrics.net < 0) {
      // Net deficit
      meterLblReadout.textContent = "Deficit";
      progressCircle.classList.add('positive');
    } else {
      meterLblReadout.textContent = "Logged Net";
      progressCircle.classList.remove('positive');
    }

        // Dasharray circumference: 2 * PI * r = 2 * 3.14159 * 90 = 565.48
    const circumference = 565.48;
    const targetLimit = state.customTarget || (state.tdee > 0 ? state.tdee : 2000);
    
    // Percentage consumed relative to TDEE
    let percentage = Math.min(Math.max(thaliMetrics.net / targetLimit, 0), 1);
    if (thaliMetrics.net < 0) {
      percentage = Math.min(Math.abs(thaliMetrics.net) / 1000, 1);
    }
    
    const offset = circumference - (percentage * circumference);
    progressCircle.style.strokeDashoffset = offset;
  }

  // Update individual food card quantity readouts
  document.querySelectorAll('.food-card').forEach(card => {
    const itemId = card.dataset.id;
    const qty = state.thali[itemId] || 0;
    const qtyEl = card.querySelector('.control-qty');
    
    if (qty > 0) {
      card.classList.add('active');
      if (qtyEl) qtyEl.textContent = qty;
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
      state.thali = {};
      updateUI();
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
      
      // Visual feedback on click
      btnApplyTarget.innerHTML = '<i class="ph ph-check-circle"></i> Target Applied!';
      btnApplyTarget.style.background = 'var(--success)';
      btnApplyTarget.style.boxShadow = '0 0 12px rgba(34, 197, 94, 0.3)';
      setTimeout(() => {
        btnApplyTarget.innerHTML = 'Use as Daily Target';
        btnApplyTarget.style.background = '';
        btnApplyTarget.style.boxShadow = '';
      }, 2000);
    });
  }
}

// Card add/subtract adjustments
function adjustItemQty(itemId, change) {
  const currentQty = state.thali[itemId] || 0;
  const newQty = Math.max(0, currentQty + change);
  if (newQty === 0) {
    delete state.thali[itemId];
  } else {
    state.thali[itemId] = newQty;
  }
  updateUI();
}

// Delete item from Thali directly
function deleteThaliItem(itemId) {
  if (state.thali[itemId]) {
    delete state.thali[itemId];
    updateUI();
  }
}
window.deleteThaliItem = deleteThaliItem;

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
      <div class="adsense-placeholder" style="grid-column: 1 / -1; min-height: 120px; display: flex; flex-direction: column; gap: 0.5rem; text-transform: none;">
        <div>No traditional foods found matching your search.</div>
        <div style="font-size: 0.75rem; color: var(--text-secondary);">Try searching for 'tenga', 'rice', 'dal', or 'exercise'.</div>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const isBurn = item.category === 'burn';
    const isQty = state.thali[item.id] || 0;
    const isActive = isQty > 0 ? 'active' : '';
    const isBurnClass = isBurn ? 'burn' : '';
    
    // Get category-specific gradient and icon placeholder
    const placeholder = getCardPlaceholder(item.category, item.id);

    const cardHTML = `
      <div class="food-card ${isActive} ${isBurnClass}" data-id="${item.id}">
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
              Portion: <span style="font-weight: 600; color: var(--text-primary);">${item.unit}</span>
            </div>
            <div class="macro-readout" style="color: var(--text-secondary); font-size: var(--font-xs);">
              ${item.protein ? `<span style="margin-right: 4px;">P: ${item.protein}g</span>` : ''}
              ${item.carbs ? `<span style="margin-right: 4px;">C: ${item.carbs}g</span>` : ''}
              ${item.fat ? `<span>F: ${item.fat}g</span>` : ''}
            </div>
          </div>

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
                ${isBurn ? 'Add to Burn' : 'Add to Plate'}
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
  
  // Render food grid
  renderFoodGrid('all', '');
  
  // Update BMR calculations and thali values
  updateUI();
});
