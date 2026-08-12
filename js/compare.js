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
      toastCopied: "📋 Comparison link copied to clipboard!",
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
      equal: 'এই শ্ৰেণীত দুয়োটা সমান',
      foodA: 'খাদ্য ক',
      foodB: 'খাদ্য খ',
      calWinner: (winner, diff) => `🏆 ${winner} পাতল (কেলৰি ${diff} kcal কম)`,
      proWinner: (winner, diff) => `🏆 ${winner} প্ৰ’টিনযুক্ত (${diff}g অধিক)`,
      carbWinner: (winner, diff) => `🏆 ${winner} কাৰ্ব’হাইড্ৰেট কম (${diff}g কম)`,
      fatWinner: (winner, diff) => `🏆 ${winner} চৰ্বিৰ মাত্ৰা কম (${diff}g কম)`,
      fibWinner: (winner, diff) => `🏆 ${winner} অধিক আঁহযুক্ত (${diff}g অধিক)`,
      toastAdded: "🍽️ দুয়োবিধ খাদ্য আপোনাৰ সক্ৰিয় থালিত যোগ কৰা হৈছে!",
      toastCopied: "📋 তুলনামূলক লিংক ক্লিপবৰ্ডত কপি কৰা হৈছে!",
      servingInfo: "পৰিৱেশনৰ জোখ"
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
      if (food1.category === 'assamese' && (food2.category === 'snacks' || food2.id === 'butter-chicken')) {
        verdictHTML = `
          <p style="margin-bottom: 0.8rem;">
            <strong>সিদ্ধান্ত:</strong> <strong>${food1.nameRegional || food1.name}</strong> এবিধ অতি পুষ্টিকৰ আৰু ওজন নিয়ন্ত্ৰণৰ বাবে উপযোগী খাদ্য। 
            ই মাত্ৰ <strong>${food1.calories} কেলৰি</strong> আৰু <strong>${food1.fat}g চৰ্বি</strong>ৰ সৈতে প্ৰ’টিন যোগান ধৰে, 
            যাৰ বাবে ই <strong>${food2.nameRegional || food2.name}</strong> (${food2.calories} kcal, ${food2.fat}g চৰ্বি)ৰ দৰে গধুৰ খাদ্যৰ এক উৎকৃষ্ট বিকল্প।
          </p>
          <p>
            <em>আহাৰৰ পৰামৰ্শ:</em> ভজা খাদ্যৰ সলনি পৰম্পৰাগত ঝোল আৰু ভাপত সিজোৱা খাদ্য বাছি ল’লে শৰীৰত অতিৰিক্ত তেল কম হোৱাৰ লগতে আহাৰো সুস্বাদু আৰু পুষ্টিকৰ হৈ থাকে।
          </p>
        `;
      } else if (food1.id === 'black-tea' && food2.id === 'milk-tea-sugar') {
        verdictHTML = `
          <p style="margin-bottom: 0.8rem;">
            <strong>সিদ্ধান্ত:</strong> মিঠা গাখীৰ চাহৰ পৰা <strong>ৰঙা চাহত (Lal Saah)</strong> স্থানান্তৰ কৰিলে প্ৰতি কাপত <strong>৮০ কেলৰি</strong> ৰাহি হয়! 
            গাখীৰ চাহত চেনী আৰু চৰ্বি থকাৰ বিপৰীতে ৰঙা চাহ কেলৰি-মুক্ত আৰু স্বাস্থ্যকৰ এণ্টিঅক্সিডেণ্টেৰে ভৰপূৰ।
          </p>
          <p>
            <em>আহাৰৰ পৰামৰ্শ:</em> যদি আপুনি দিনটোত ২-৩ কাপ চাহ খায়, তেন্তে কেৱল এক কাপ চাহ ৰঙা চাহত পৰিণত কৰিলে আপোনাৰ সাপ্তাহিক কেলৰি গ্ৰহণ ৫০০ kcal তকৈও অধিক হ্ৰাস পাব।
          </p>
        `;
      } else if (food1.id === 'roti' && food2.id === 'steamed-rice') {
        verdictHTML = `
          <p style="margin-bottom: 0.8rem;">
            <strong>সিদ্ধান্ত:</strong> দুয়োবিধ খাদ্যই শক্তিৰ উৎকৃষ্ট উৎস, কিন্তু সিহঁতে ভিন্নভাৱে কাম কৰে। 
            <strong>ৰুটী</strong>ত অধিক আঁহ (${food1.fiber}g বনাম ${food2.fiber}g) আৰু অলপ বেছি প্ৰ’টিন থাকে, যি পেট ভৰাই ৰখাত সহায় কৰে। 
            আনহাতে, <strong>সিজোৱা ভাত</strong> হজম কৰিবলৈ অতি সহজ আৰু পৰম্পৰাগত লঘু আঞ্জাৰ সৈতে উপযুক্ত।
          </p>
          <p>
            <em>আহাৰৰ পৰামৰ্শ:</em> যদি আপুনি ওজন নিয়ন্ত্ৰণ আৰু মধুমেহ স্বাস্থ্যৰ প্ৰতি মনোযোগ দিছে, তেন্তে অধিক আঁহ থকাৰ বাবে ৰুটী অলপ ভাল। যদি আপুনি ভাত পচন্দ কৰে, তেন্তে ইয়াক ঢেকীয়া শাক বা অমিতা খাৰৰ দৰে আঁহযুক্ত খাদ্যৰ সৈতে খোৱাৰ চেষ্টা কৰক।
          </p>
        `;
      } else {
        verdictHTML = `
          <p style="margin-bottom: 0.8rem;">
            <strong>সিদ্ধান্ত:</strong> যদি আপোনাৰ প্ৰধান লক্ষ্য ওজন নিয়ন্ত্ৰণ, তেন্তে <strong>${lightFood.nameRegional || lightFood.name}</strong> বিজয়ী, যি <strong>${heavyFood.nameRegional || heavyFood.name}</strong>ৰ তুলনাত প্ৰতি পৰিৱেশনত <strong>${diffCal} কেলৰি</strong> ৰাহি কৰে।
          </p>
          <p>
            যদি আপুনি মাংসপেশী গঠন বা পেট ভৰাই ৰখাত গুৰুত্ব দিছে, তেন্তে <strong>${proteinFood.nameRegional || proteinFood.name}</strong> উপকাৰী কাৰণ ই এই তুলনাত সৰ্বাধিক প্ৰ’টিন (<strong>${proteinFood.protein}g</strong>) যোগান ধৰে।
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
    document.getElementById('food1-subtitle').textContent = `${t.servingInfo}: ${food1.unit}`;

    document.getElementById('food2-title').textContent = food2.nameRegional ? `${food2.name} (${food2.nameRegional})` : food2.name;
    document.getElementById('food2-subtitle').textContent = `${t.servingInfo}: ${food2.unit}`;

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
