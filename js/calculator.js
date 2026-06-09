// State management
let state = {
  weight: 65,      // kg
  height: 165,     // cm
  age: 28,         // years
  gender: 'male',  // male or female
  activity: 1.2,   // activity multiplier
  bmr: 0,
  tdee: 0,
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

  // Update Thali bottom bar info
  const thaliCountBadge = document.getElementById('thali-badge-count');
  const thaliNetReadout = document.getElementById('thali-net-readout');
  const footerDrawer = document.getElementById('thali-drawer');

  if (thaliCountBadge) thaliCountBadge.textContent = thaliMetrics.count;
  if (thaliNetReadout) thaliNetReadout.textContent = thaliMetrics.net + ' kcal';

  // Show/Hide Floating Thali bar depending on items
  if (footerDrawer) {
    if (thaliMetrics.count > 0) {
      footerDrawer.style.transform = 'translateY(0)';
    } else {
      footerDrawer.style.transform = 'translateY(100%)';
    }
  }

  // Update Radial Progress Wheel (Dynamic Conic Meter)
  const progressCircle = document.getElementById('radial-meter-fill');
  const meterValReadout = document.getElementById('radial-meter-val');
  const meterLblReadout = document.getElementById('radial-meter-lbl');

  if (progressCircle && meterValReadout) {
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
    const targetLimit = state.tdee > 0 ? state.tdee : 2000;
    
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

  if (weightInput) {
    weightInput.addEventListener('input', (e) => {
      state.weight = parseInt(e.target.value) || 65;
      updateUI();
    });
  }
  if (heightInput) {
    heightInput.addEventListener('input', (e) => {
      state.height = parseInt(e.target.value) || 165;
      updateUI();
    });
  }
  if (ageInput) {
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

    const cardHTML = `
      <div class="food-card ${isActive} ${isBurnClass}" data-id="${item.id}">
        <div class="card-top">
          <div class="card-title">
            ${item.name}
            ${item.nameRegional ? `<span class="regional-lang">${item.nameRegional}</span>` : ''}
          </div>
          <div class="indicator-dot">${isBurn ? '⚡' : '✓'}</div>
        </div>
        <p class="card-desc">${item.desc}</p>
        <div class="card-bottom">
          <div class="serving-lbl">
            Serving Size
            <span>${item.unit}</span>
          </div>
          <div class="serving-lbl" style="text-align: right; margin-right: 1rem;">
            Calorie Metric
            <span>${Math.abs(item.calories)} kcal</span>
          </div>
          <div class="card-controls ${isBurnClass}">
            <button class="control-btn ${isBurnClass ? 'btn-burn' : ''}" onclick="adjustItemQty('${item.id}', -1)">-</button>
            <span class="control-qty">${isQty}</span>
            <button class="control-btn ${isBurnClass ? 'btn-burn' : ''}" onclick="adjustItemQty('${item.id}', 1)">+</button>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', cardHTML);
  });
}

// Setup Tab Navigation Event Listeners
function setupTabListeners() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const category = btn.dataset.category || 'all';
      const searchVal = document.getElementById('food-search')?.value || '';
      renderFoodGrid(category, searchVal);
    });
  });

  // Search input listeners
  const searchInput = document.getElementById('food-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeTab = document.querySelector('.tab-btn.active');
      const category = activeTab ? activeTab.dataset.category : 'all';
      renderFoodGrid(category, e.target.value);
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
