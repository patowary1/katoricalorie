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

  
// Helper to localize unit strings for display
function formatLocalizedUnit(unit, lang) {
  if (lang === 'as') {
    const unitMapAS = {
  "1 serving (200ml)": "১ পৰিৱেশন (২০০ মি.লি.)",
  "1 serving (150g)": "১ পৰিৱেশন (১৫০ গ্ৰাম)",
  "1 serving (100g)": "১ পৰিৱেশন (১০০ গ্ৰাম)",
  "1 serving (150ml)": "১ পৰিৱেশন (১৫০ মি.লি.)",
  "1 serving (120g)": "১ পৰিৱেশন (১২০ গ্ৰাম)",
  "1 plate (200g)": "১ থালি (২০০ গ্ৰাম)",
  "1 plate (150g)": "১ থালি (১৫০ গ্ৰাম)",
  "1 piece": "১ টা",
  "1 piece (~30g)": "১ টা (~৩০ গ্ৰাম)",
  "1 cup (soaked, 100g)": "১ কাপ (তিতাই থোৱা, ১০০ গ্ৰাম)",
  "1 katori cooked (150g)": "১ বাটি সিজোৱা (১৫০ গ্ৰাম)",
  "1 serving (180g)": "১ পৰিৱেশন (১৮০ গ্ৰাম)",
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
  "1 plate (5 pieces)": "১ থালি (৫ টা)",
  "1 plate": "১ থালি",
  "1 plate (6 pieces)": "১ থালি (৬ টা)",
  "1 glass (250ml)": "১ গিলাচ (২৫০ মি.লি.)"
};
    return unitMapAS[unit] || unit;
  }
  return unit;
}

  // Multi-lingual Translation Support
  const lang = document.documentElement.lang || 'en';

  const translations = {
    en: {
      equal: 'Both are equal in this category',
      foodA: 'Food A',
      foodB: 'Food B',
      calWinner: (winner, diff) => `🏆 ${winner} is lighter (fewer calories by ${diff} kcal)`,
      proWinner: (winner, diff) => `🏆 ${winner} is richer in protein (more by ${diff}g)`,
      carbWinner: (winner, diff) => `🏆 ${winner} is lower in carbs (fewer by ${diff}g)`,
      fatWinner: (winner, diff) => `🏆 ${winner} is lower in fat (less by ${diff}g)`,
      fibWinner: (winner, diff) => `🏆 ${winner} offers more dietary fiber (more by ${diff}g)`,
      toastAdded: "🍽️ Both items added to your active Plate!",
      toastCopied: "তুলনাৰ লিংক কপি কৰা হৈছে।",
      servingInfo: "Portion Size"
    },
    hi: {
      equal: 'इस श्रेणी में दोनों बराबर हैं',
      foodA: 'भोजन क',
      foodB: 'भोजन ख',
      calWinner: (winner, diff) => `🏆 ${winner} हल्का है (कैलोरी ${diff} kcal कम है)`,
      proWinner: (winner, diff) => `🏆 ${winner} में प्रोटीन अधिक है (${diff}g अधिक)`,
      carbWinner: (winner, diff) => `🏆 ${winner} में कार्ब्स कम हैं (${diff}g कम)`,
      fatWinner: (winner, diff) => `🏆 ${winner} में वसा कम है (${diff}g कम)`,
      fibWinner: (winner, diff) => `🏆 ${winner} में फाइबर अधिक है (${diff}g अधिक)`,
      toastAdded: "🍽️ दोनों खाद्य पदार्थ आपकी सक्रिय थाली में जोड़े गए!",
      toastCopied: "📋 तुलनात्मक लिंक क्लिपबोर्ड में कॉपी किया गया!",
      servingInfo: "भाग का आकार"
    },
    as: {
      equal: 'এই ক্ষেত্ৰত দুয়োটাই সমান',
      foodA: 'খাদ্য ১',
      foodB: 'খাদ্য ২',
      calWinner: (winner, diff) => `🏆 ${winner}-ত ${diff} kcal কম`,
      proWinner: (winner, diff) => `🏆 ${winner}-ত ${diff}g বেছি প্ৰ’টিন`,
      carbWinner: (winner, diff) => `🏆 ${winner}-ত ${diff}g কম কাৰ্ব’হাইড্ৰেট`,
      fatWinner: (winner, diff) => `🏆 ${winner}-ত ${diff}g কম চৰ্বি`,
      fibWinner: (winner, diff) => `🏆 ${winner}-ত ${diff}g বেছি আঁহ`,
      toastAdded: "🍽️ দুয়োটা খাদ্য থালিত যোগ কৰা হৈছে।",
      toastCopied: "তুলনাৰ লিংক কপি কৰা হৈছে。",
      servingInfo: "খোৱাৰ পৰিমাণ"
    }
  };

  const t = translations[lang] || translations.en;

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
      winnerEl.textContent = t.equal;
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

    const winnerName = isLeftWinner ? t.foodA : t.foodB;

    if (type === 'calories') {
      winnerEl.textContent = t.calWinner(winnerName, diff);
    } else if (type === 'protein') {
      winnerEl.textContent = t.proWinner(winnerName, diff);
    } else if (type === 'carbs') {
      winnerEl.textContent = t.carbWinner(winnerName, diff);
    } else if (type === 'fat') {
      winnerEl.textContent = t.fatWinner(winnerName, diff);
    } else if (type === 'fiber') {
      winnerEl.textContent = t.fibWinner(winnerName, diff);
    }
  }

  // Generate a friendly, human-sounding advice block based on compared stats
  function generateVerdict(food1, food2) {
    const textEl = document.getElementById('comparison-insight-text');
    if (!textEl) return;

    let verdictHTML = '';
    const lightFood = food1.calories < food2.calories ? food1 : food2;
    const heavyFood = food1.calories >= food2.calories ? food1 : food2;
    const proteinFood = food1.protein > food2.protein ? food1 : food2;
    const diffCal = Math.abs(food1.calories - food2.calories);

    if (lang === 'hi') {
      if (food1.category === 'assamese' && (food2.category === 'snacks' || food2.id === 'butter-chicken')) {
        verdictHTML = `
          <p style="margin-bottom: 0.8rem;">
            <strong>निर्णय:</strong> <strong>${food1.nameRegional || food1.name}</strong> एक अत्यधिक पौष्टिक और वजन नियंत्रण के लिए अनुकूल विकल्प है। 
            यह केवल <strong>${food1.calories} कैलोरी</strong> और <strong>${food1.fat}g वसा</strong> के साथ प्रोटीन का एक स्वच्छ स्रोत प्रदान करता है, 
            जिससे यह <strong>${food2.nameRegional || food2.name}</strong> (${food2.calories} kcal, ${food2.fat}g वसा) जैसे भारी खाद्य पदार्थों के लिए एक उत्कृष्ट विकल्प बन जाता है।
          </p>
          <p>
            <em>Dietary Tip:</em> तले हुए विकल्पों के बजाय क्षेत्रीय शोरबा और भाप में पके हुए व्यंजनों को चुनना छिपे हुए तेलों को कम करने में मदद करता है और आपके भोजन को संतोषजनक और प्रामाणिक बनाए रखता है।
          </p>
        `;
      } else if (food1.id === 'black-tea' && food2.id === 'milk-tea-sugar') {
        verdictHTML = `
          <p style="margin-bottom: 0.8rem;">
            <strong>निर्णय:</strong> मीठी दूध की चाय से <strong>लाल चाय (Lal Saah)</strong> पर जाने से आपकी प्रति कप <strong>80 कैलोरी</strong> बचती है! 
            जहां दूध की चाय में तरल चीनी और डेयरी वसा जुड़ती है, वहीं काली चाय वस्तुतः कैलोरी-मुक्त होती है और स्वस्थ एंटीऑक्सीडेंट से भरपूर होती है।
          </p>
          <p>
            <em>Dietary Tip:</em> यदि आप दिन में 2-3 कप चाय पीते हैं, तो सिर्फ एक कप को लाल चाय में बदलने से आपका साप्ताहिक कैलोरी सेवन 500 kcal से अधिक कम हो सकता है।
          </p>
        `;
      } else if (food1.id === 'roti' && food2.id === 'steamed-rice') {
        verdictHTML = `
          <p style="margin-bottom: 0.8rem;">
            <strong>निर्णय:</strong> दोनों ही ऊर्जा के बेहतरीन स्रोत हैं, लेकिन वे अलग तरह से काम करते हैं। 
            <strong>रोटी</strong> में अधिक फाइबर (${food1.fiber}g बनाम ${food2.fiber}g) और थोड़ा अधिक प्रोटीन होता है, जो आपको लंबे समय तक तृप्त रखने में मदद करता है। 
            दूसरी ओर, <strong>उबला हुआ चावल</strong> पचाने में बेहद आसान है और हल्के क्षेत्रीय व्यंजनों के लिए आधार के रूप में पूरी तरह से काम करता है।
          </p>
          <p>
            <em>Dietary Tip:</em> यदि आपका ध्यान भाग नियंत्रण और मधुमेह स्वास्थ्य पर है, तो उच्च फाइबर सामग्री के कारण रोटी थोड़ी बेहतर है। यदि आप चावल पसंद करते हैं, तो इसे ढेकिया शाक या ओमिता खार जैसे फाइबर युक्त व्यंजनों के साथ मिलाने का प्रयास करें।
          </p>
        `;
      } else {
        verdictHTML = `
          <p style="margin-bottom: 0.8rem;">
            <strong>निर्णय:</strong> यदि आपका मुख्य लक्ष्य वजन प्रबंधन है, तो <strong>${lightFood.nameRegional || lightFood.name}</strong> विजेता है, जो <strong>${heavyFood.nameRegional || heavyFood.name}</strong> की तुलना में प्रति भाग <strong>${diffCal} कैलोरी</strong> बचाता है।
          </p>
          <p>
            यदि आप मांसपेशियों की रिकवरी या तृप्ति पर ध्यान केंद्रित कर रहे हैं, तो <strong>${proteinFood.nameRegional || proteinFood.name}</strong> फायदेमंद है क्योंकि यह इस तुलना में सबसे अधिक प्रोटीन (<strong>${proteinFood.protein}g</strong>) प्रदान करता है।
          </p>
        `;
      }
    } else if (lang === 'as') {
      if (food1.id === 'black-tea' && food2.id === 'milk-tea-sugar') {
        verdictHTML = `
          <p>
            চেনি আৰু গাখীৰ নথকা লাল চাহত মিঠা গাখীৰ চাহতকৈ কেলৰি কম থাকে।
          </p>
        `;
      } else if (food1.id === 'roti' && food2.id === 'steamed-rice') {
        verdictHTML = `
          <p>
            দুয়োটাৰ কেলৰি আৰু পুষ্টিগুণ বেলেগ। ওপৰৰ তথ্য চাই আপোনাৰ খোৱাৰ পৰিমাণ অনুসৰি বাছক।
          </p>
        `;
      } else {
        verdictHTML = `
          <p>
            কেলৰি আৰু পুষ্টিগুণৰ পাৰ্থক্য ওপৰৰ তুলনাত চাওক আৰু আপোনাৰ খোৱাৰ পৰিমাণ অনুসৰি বাছক।
          </p>
        `;
      }
    } else {
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
      } else if (food1.id === 'black-tea' && food2.id === 'milk-tea-sugar') {
        verdictHTML = `
          <p style="margin-bottom: 0.8rem;">
            <strong>Verdict:</strong> Switching from sweet milk tea to <strong>Lal Saah (Black Tea)</strong> saves you <strong>80 calories</strong> per cup! 
            While milk tea adds liquid sugar and dairy fats, black tea is virtually calorie-free and loaded with healthy antioxidants.
          </p>
          <p>
            <em>Dietary Tip:</em> If you drink 2-3 cups of tea a day, changing just one cup to Lal Saah can cut down your weekly calorie intake by over 500 kcal.
          </p>
        `;
      } else if (food1.id === 'roti' && food2.id === 'steamed-rice') {
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
      } else {
        verdictHTML = `
          <p style="margin-bottom: 0.8rem;">
            <strong>Verdict:</strong> If your main goal is weight management, <strong>${lightFood.name}</strong> is the winner, saving you <strong>${diffCal} calories</strong> per portion compared to <strong>${heavyFood.name}</strong>.
          </p>
          <p>
            If you are focusing on muscle recovery or satiety, <strong>${proteinFood.name}</strong> is beneficial as it provides the highest amount of protein (<strong>${proteinFood.protein}g</strong>) in this comparison.
          </p>
        `;
      }
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
    document.getElementById('food1-subtitle').textContent = `${t.servingInfo}: ${formatLocalizedUnit(food1.unit, lang)}`;

    document.getElementById('food2-title').textContent = food2.nameRegional ? `${food2.name} (${food2.nameRegional})` : food2.name;
    document.getElementById('food2-subtitle').textContent = `${t.servingInfo}: ${formatLocalizedUnit(food2.unit, lang)}`;

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

    const food1 = (typeof getFoodById === 'function' ? getFoodById(param1) : foodDatabase.find(f => f.id === param1));
    const food2 = (typeof getFoodById === 'function' ? getFoodById(param2) : foodDatabase.find(f => f.id === param2));

    if (food1) select1.value = food1.id;
    if (food2) select2.value = food2.id;
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
      showToast(t.toastAdded);
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
        showToast(t.toastCopied);
      }).catch(err => {
        console.error("Could not copy URL to clipboard:", err);
        alert(`Copy this link to share: ${shareUrl}`);
      });
    });
  }
});
