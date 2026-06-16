// Compare Foods page logic
document.addEventListener('DOMContentLoaded', () => {
  const select1 = document.getElementById('food1-select');
  const select2 = document.getElementById('food2-select');
  const toast = document.getElementById('copy-toast');

  // Filter out exercises to compare only food items
  const foods = foodDatabase.filter(item => item.category !== 'burn' && item.calories > 0);

  // Populate comparison dropdowns
  function populateDropdowns() {
    if (!select1 || !select2) return;

    select1.innerHTML = '';
    select2.innerHTML = '';

    foods.forEach(food => {
      const nameText = food.nameRegional ? `${food.name} (${food.nameRegional})` : food.name;
      
      const opt1 = document.createElement('option');
      opt1.value = food.id;
      opt1.textContent = nameText;
      select1.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = food.id;
      opt2.textContent = nameText;
      select2.appendChild(opt2);
    });

    // Default choices
    if (foods.length > 1) {
      select1.value = foods[0].id; // First food item
      select2.value = foods[1].id; // Second food item
    }
  }

  // Toast Notification helper
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Calculate winner highlight and difference
  function updateMetricRow(val1, val2, target1, target2, fill1, fill2, winnerEl, unit, type) {
    const maxVal = Math.max(val1, val2, 0.1); // Avoid division by zero
    const pct1 = (val1 / maxVal) * 100;
    const pct2 = (val2 / maxVal) * 100;

    fill1.style.width = pct1 + '%';
    fill2.style.width = pct2 + '%';

    winnerEl.textContent = '';

    if (val1 === val2) {
      winnerEl.textContent = 'Both are equal in this category';
      winnerEl.style.color = 'var(--text-secondary)';
      return;
    }

    let isLeftWinner = false;
    let diff = Math.abs(val1 - val2).toFixed(1);
    
    if (diff.endsWith('.0')) {
      diff = Math.round(diff);
    }

    if (type === 'calories' || type === 'fat' || type === 'carbs') {
      isLeftWinner = val1 < val2; // Lower is better for calories/fat/carbs
    } else {
      isLeftWinner = val1 > val2; // Higher is better for protein/fiber
    }

    winnerEl.style.color = 'var(--accent-green)';

    if (type === 'calories') {
      winnerEl.textContent = `🏆 ${isLeftWinner ? 'Food A' : 'Food B'} is lighter (fewer calories by ${diff} kcal)`;
    } else if (type === 'protein') {
      winnerEl.textContent = `🏆 ${isLeftWinner ? 'Food A' : 'Food B'} is richer in protein (more by ${diff}g)`;
    } else if (type === 'carbs') {
      winnerEl.textContent = `🏆 ${isLeftWinner ? 'Food A' : 'Food B'} is lower in carbs (fewer by ${diff}g)`;
    } else if (type === 'fat') {
      winnerEl.textContent = `🏆 ${isLeftWinner ? 'Food A' : 'Food B'} is lower in fat (less by ${diff}g)`;
    } else if (type === 'fiber') {
      winnerEl.textContent = `🏆 ${isLeftWinner ? 'Food A' : 'Food B'} offers more dietary fiber (more by ${diff}g)`;
    }
  }

  // Generate a friendly, human-sounding advice block based on compared stats
  function generateVerdict(food1, food2) {
    const textEl = document.getElementById('comparison-insight-text');
    if (!textEl) return;

    let verdictHTML = '';

    // Case 1: Regional food vs heavy staple/snack (e.g. Masor Tenga vs Samosa)
    if (food1.category === 'assamese' && (food2.category === 'snacks' || food2.id === 'butter-chicken')) {
      verdictHTML = `
        <p style="margin-bottom: 0.8rem;">
          <strong>Verdict:</strong> <strong>${food1.name}</strong> is a highly nutritious, weight-loss-friendly choice. 
          It provides a clean protein source with only <strong>${food1.calories} calories</strong> and <strong>${food1.fat}g of fat</strong>, 
          making it an excellent replacement for heavy foods like <strong>${food2.name}</strong> (${food2.calories} kcal, ${food2.fat}g fat).
        </p>
        <p>
          <em>Dietary Tip:</em> Choosing regional broths and steamed specialties over fried options helps cut down hidden oils while keeping your meals satisfying and authentic.
        </p>
      `;
    }
    // Case 2: Comparing a snack/beverage with a low-calorie alternative (e.g. Black Tea vs Milk Tea)
    else if (food1.id === 'black-tea' && food2.id === 'milk-tea-sugar') {
      verdictHTML = `
        <p style="margin-bottom: 0.8rem;">
          <strong>Verdict:</strong> Switching from sweet milk tea to <strong>Lal Saah (Black Tea)</strong> saves you <strong>80 calories</strong> per cup! 
          While milk tea adds liquid sugar and dairy fats, black tea is virtually calorie-free and loaded with healthy antioxidants.
        </p>
        <p>
          <em>Dietary Tip:</em> If you drink 2-3 cups of tea a day, changing just one cup to Lal Saah can cut down your weekly calorie intake by over 500 kcal.
        </p>
      `;
    }
    // Case 3: Standard grain comparison (e.g. Roti vs Rice)
    else if (food1.id === 'roti' && food2.id === 'steamed-rice') {
      verdictHTML = `
        <p style="margin-bottom: 0.8rem;">
          <strong>Verdict:</strong> Both are great sources of energy, but they work differently. 
          <strong>Roti</strong> contains more dietary fiber (${food1.fiber}g vs ${food2.fiber}g) and slightly more protein, which helps keep you full for longer. 
          On the other hand, <strong>Steamed Rice</strong> is extremely easy to digest and works perfectly as a base for light regional curries.
        </p>
        <p>
          <em>Dietary Tip:</em> If you are focusing on portion control and diabetic health, Roti is slightly better due to its higher fiber content. If you prefer Rice, try matching it with fiber-rich sides like Dhekia Sak or Omita Khar.
        </p>
      `;
    }
    // Generic fallback comparing based on calories/protein
    else {
      const lightFood = food1.calories < food2.calories ? food1 : food2;
      const heavyFood = food1.calories >= food2.calories ? food1 : food2;
      const proteinFood = food1.protein > food2.protein ? food1 : food2;

      verdictHTML = `
        <p style="margin-bottom: 0.8rem;">
          <strong>Verdict:</strong> If your main goal is weight management, <strong>${lightFood.name}</strong> is the winner, saving you <strong>${Math.abs(food1.calories - food2.calories)} calories</strong> per portion compared to <strong>${heavyFood.name}</strong>.
        </p>
        <p>
          If you are focusing on muscle recovery or satiety, <strong>${proteinFood.name}</strong> is beneficial as it provides the highest amount of protein (<strong>${proteinFood.protein}g</strong>) in this comparison.
        </p>
      `;
    }

    textEl.innerHTML = verdictHTML;
  }

  // Primary Comparison Logic
  function compareFoods() {
    const id1 = select1.value;
    const id2 = select2.value;

    const food1 = foodDatabase.find(f => f.id === id1);
    const food2 = foodDatabase.find(f => f.id === id2);

    if (!food1 || !food2) return;

    // Update Headers
    document.getElementById('food1-title').textContent = food1.nameRegional ? `${food1.name} (${food1.nameRegional})` : food1.name;
    document.getElementById('food1-subtitle').textContent = `Portion Size: ${food1.unit}`;

    document.getElementById('food2-title').textContent = food2.nameRegional ? `${food2.name} (${food2.nameRegional})` : food2.name;
    document.getElementById('food2-subtitle').textContent = `Portion Size: ${food2.unit}`;

    // Update Values
    document.getElementById('comp-cal1').textContent = food1.calories + ' kcal';
    document.getElementById('comp-cal2').textContent = food2.calories + ' kcal';

    document.getElementById('comp-pro1').textContent = food1.protein + 'g';
    document.getElementById('comp-pro2').textContent = food2.protein + 'g';

    document.getElementById('comp-carb1').textContent = food1.carbs + 'g';
    document.getElementById('comp-carb2').textContent = food2.carbs + 'g';

    document.getElementById('comp-fat1').textContent = food1.fat + 'g';
    document.getElementById('comp-fat2').textContent = food2.fat + 'g';

    document.getElementById('comp-fib1').textContent = food1.fiber + 'g';
    document.getElementById('comp-fib2').textContent = food2.fiber + 'g';

    // Update comparative bars and highlight winners
    updateMetricRow(food1.calories, food2.calories, null, null, document.getElementById('fill-cal1'), document.getElementById('fill-cal2'), document.getElementById('winner-cal'), 'kcal', 'calories');
    updateMetricRow(food1.protein, food2.protein, null, null, document.getElementById('fill-pro1'), document.getElementById('fill-pro2'), document.getElementById('winner-pro'), 'g', 'protein');
    updateMetricRow(food1.carbs, food2.carbs, null, null, document.getElementById('fill-carb1'), document.getElementById('fill-carb2'), document.getElementById('winner-carb'), 'g', 'carbs');
    updateMetricRow(food1.fat, food2.fat, null, null, document.getElementById('fill-fat1'), document.getElementById('fill-fat2'), document.getElementById('winner-fat'), 'g', 'fat');
    updateMetricRow(food1.fiber, food2.fiber, null, null, document.getElementById('fill-fib1'), document.getElementById('fill-fib2'), document.getElementById('winner-fib'), 'g', 'fiber');

    // Generate recommendations text
    generateVerdict(food1, food2);

    // Update URL query parameters silently
    const newurl = `${window.location.origin}${window.location.pathname}?food1=${id1}&food2=${id2}`;
    window.history.replaceState({ path: newurl }, '', newurl);
  }

  // Parse query parameters on page load
  function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const param1 = urlParams.get('food1');
    const param2 = urlParams.get('food2');

    let exists1 = foodDatabase.some(f => f.id === param1);
    let exists2 = foodDatabase.some(f => f.id === param2);

    if (exists1) select1.value = param1;
    if (exists2) select2.value = param2;
  }

  // Event Listeners
  if (select1 && select2) {
    populateDropdowns();
    checkUrlParams();
    compareFoods();

    select1.addEventListener('change', compareFoods);
    select2.addEventListener('change', compareFoods);
  }

  // Add both items to active plate (LocalStorage)
  const addBothBtn = document.getElementById('btn-add-both');
  if (addBothBtn) {
    addBothBtn.addEventListener('click', () => {
      const id1 = select1.value;
      const id2 = select2.value;

      let savedState = {};
      try {
        const saved = localStorage.getItem('katori_calorie_state');
        if (saved) savedState = JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing plate state:", e);
      }

      if (!savedState.thali) savedState.thali = {};

      savedState.thali[id1] = (savedState.thali[id1] || 0) + 1;
      savedState.thali[id2] = (savedState.thali[id2] || 0) + 1;

      localStorage.setItem('katori_calorie_state', JSON.stringify(savedState));
      showToast("🍽️ Both items added to your active Plate!");
    });
  }

  // Share comparison button
  const shareBtn = document.getElementById('btn-share-comparison');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const id1 = select1.value;
      const id2 = select2.value;
      const shareUrl = `${window.location.origin}${window.location.pathname}?food1=${id1}&food2=${id2}`;

      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast("📋 Comparison link copied to clipboard!");
      }).catch(err => {
        console.error("Could not copy URL to clipboard:", err);
        alert(`Copy this link to share: ${shareUrl}`);
      });
    });
  }
});
