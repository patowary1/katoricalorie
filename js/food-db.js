const foodDatabase = [
  // --- ASSAMESE TRADITIONAL ---
  {
    id: "masor-tenga",
    name: "Masor Tenga",
    nameRegional: "মাছৰ টেঙা",
    calories: 140,
    unit: "1 serving (200ml)",
    desc: "A light and sour fish curry prepared with fresh tomatoes, lemon, or elephant apple. It features clean river fish cooked in minimal mustard oil, offering healthy proteins and omega-3s with very few calories.",
    category: "assamese"
  },
  {
    id: "omita-khar",
    name: "Omita Khar",
    nameRegional: "অমিতা খাৰ",
    calories: 65,
    unit: "1 serving (150g)",
    desc: "A signature Assamese dish made from green papaya cooked with 'kolkhar'—an alkaline extract filtered from the ashes of sun-dried banana peels. It is traditionally eaten at the start of a meal to soothe the digestive system.",
    category: "assamese"
  },
  {
    id: "aloo-pitika",
    name: "Aloo Pitika",
    nameRegional: "আলু পিটিকা",
    calories: 90,
    unit: "1 serving (100g)",
    desc: "Comforting mashed potatoes mixed with raw onions, green chilies, and a drizzle of raw mustard oil. Simple, warming, and packed with carbohydrate energy.",
    category: "assamese"
  },
  {
    id: "mati-dal",
    name: "Mati Dal",
    nameRegional: "মাটিমাহৰ দাইল",
    calories: 125,
    unit: "1 serving (150ml)",
    desc: "Slow-cooked split black lentils simmered with ginger, garlic, and wild coriander. Creamy and hearty without any heavy cream or butter.",
    category: "assamese"
  },
  {
    id: "dhekia-sak",
    name: "Dhekia Sak Bhaji",
    nameRegional: "ঢেকীয়া শাক ভাজি",
    calories: 75,
    unit: "1 serving (120g)",
    desc: "Tender fiddlehead ferns wild-foraged from regional riverbanks, stir-fried with tiny potato strips and garlic. High in iron, dietary fiber, and essential minerals.",
    category: "assamese"
  },

  // --- NORTHEAST SPECIALTIES ---
  {
    id: "pork-bamboo-shoot",
    name: "Pork with Bamboo Shoot",
    nameRegional: "বাঁহৰ গাজৰ সৈতে গাহৰি মাংস",
    calories: 320,
    unit: "1 plate (200g)",
    desc: "A beloved Naga dish of tender pork slow-cooked in its own natural juices with fermented bamboo shoots and fiery king chilies. Oil-free, smokey, and intensely savory.",
    category: "northeast"
  },
  {
    id: "baah-gaj-tenga",
    name: "Baah Gaj Tenga",
    nameRegional: "বাঁহৰ গাজ টেঙা",
    calories: 80,
    unit: "1 serving (150ml)",
    desc: "A refreshing, tangy vegetarian broth prepared with fermented bamboo shoots, tomatoes, and regional wild herbs. It is light, sour, and helps cleanse the palate.",
    category: "northeast"
  },
  {
    id: "smoked-chicken-herbs",
    name: "Smoked Chicken with Herbs",
    nameRegional: "স্মোকড চিকেন",
    calories: 180,
    unit: "1 serving (180g)",
    desc: "Chicken pieces smoked over firewood, then simmered with local forest greens, ginger, and garlic. Lean protein with a deep, rustic woodfire aroma.",
    category: "northeast"
  },

  // --- PAN-INDIA STAPLES ---
  {
    id: "roti",
    name: "Plain Roti (Chapatis)",
    calories: 75,
    unit: "1 piece",
    desc: "Whole wheat flatbread rolled thin and puffed over an open flame. A staple source of complex carbohydrates and dietary fiber for steady metabolic energy.",
    category: "pan-india"
  },
  {
    id: "steamed-rice",
    name: "Steamed Basmati Rice",
    calories: 130,
    unit: "1 cup (150g cooked)",
    desc: "Light and fluffy long-grain white rice, steam-cooked. Easy to digest and a perfect base for regional fish curries and lentil soups.",
    category: "pan-india"
  },
  {
    id: "dal-tadka",
    name: "Dal Tadka",
    calories: 120,
    unit: "1 cup (150ml)",
    desc: "Yellow pigeon pea lentils boiled with turmeric, then tempered with a touch of ghee, cumin seeds, garlic, and dried red chilies. Great source of plant protein.",
    category: "pan-india"
  },
  {
    id: "dosa-sambar",
    name: "Masala Dosa with Sambar",
    calories: 350,
    unit: "1 plate",
    desc: "A crispy fermented rice crepe folded over a spiced potato filling, paired with vegetable-lentil soup. A popular South Indian breakfast that balances energy and proteins.",
    category: "pan-india"
  },

  // --- SNACKS & STREET FOOD ---
  {
    id: "samosa",
    name: "Samosa",
    calories: 250,
    unit: "1 piece",
    desc: "A golden-fried, triangular pastry shell filled with spiced mashed potatoes, green peas, and fresh cilantro. Crisp and calorie-dense.",
    category: "snacks"
  },
  {
    id: "pani-puri",
    name: "Pani Puri / Golgappa",
    calories: 180,
    unit: "1 plate (6 pieces)",
    desc: "Hollow, crispy semolina shells filled with spiced potato-chickpea mash, dipped in chilled tangy mint and sweet tamarind water. A sweet, sour, and spicy treat.",
    category: "snacks"
  },
  {
    id: "chole-bhature",
    name: "Chole Bhature",
    calories: 450,
    unit: "1 plate (1 bhatura + chole)",
    desc: "Spicy, tangy chickpea curry served alongside a puffed, deep-fried leavened bread. Rich in spices, flavor, and calories.",
    category: "snacks"
  },
  {
    id: "vada-pav",
    name: "Vada Pav",
    calories: 300,
    unit: "1 piece",
    desc: "A popular Mumbai street food featuring a spicy, batter-fried potato dumpling sandwiched in a soft bread roll with zesty garlic and green chutneys.",
    category: "snacks"
  },

  // --- BEVERAGES ---
  {
    id: "milk-tea-sugar",
    name: "Milk Tea (with Sugar)",
    nameRegional: "গাখীৰ চাহ",
    calories: 90,
    unit: "1 cup (150ml)",
    desc: "Assam black tea brewed with fresh milk and sweetened with cane sugar. Rich, comforting, and a daily ritual for millions.",
    category: "beverages"
  },
  {
    id: "red-tea",
    name: "Red Tea / Black Tea (Sweet)",
    nameRegional: "ৰঙা চাহ",
    calories: 45,
    unit: "1 cup (150ml)",
    desc: "A clean, dark tea infusion sweetened with a spoonful of sugar. Provides a clean caffeine lift without dairy fats.",
    category: "beverages"
  },
  {
    id: "green-tea",
    name: "Green Tea (Unsweetened)",
    nameRegional: "গ্ৰীণ টী",
    calories: 5,
    unit: "1 cup (150ml)",
    desc: "Pure hot water infused with premium green tea leaves. Zero sugar, zero fat, and loaded with natural metabolism-boosting antioxidants.",
    category: "beverages"
  },

  // --- EXERCISES (Calorie Burners) ---
  {
    id: "brisk-walking",
    name: "Brisk Walking",
    nameRegional: "খোজ কঢ়া",
    calories: -120,
    unit: "30 mins",
    desc: "A moderate-intensity walk that gets your heart pumping. Helps regulate blood glucose levels and enhances daily active calorie burn safely.",
    category: "burn"
  },
  {
    id: "cardio-running",
    name: "Cardio Running",
    nameRegional: "দৌৰা",
    calories: -300,
    unit: "30 mins",
    desc: "High-intensity aerobic running. Excellent for boosting cardiovascular health, metabolic efficiency, and burning off target calories.",
    category: "burn"
  },
  {
    id: "gym-resistance",
    name: "Gym & Resistance Drill",
    nameRegional: "জিম",
    calories: -180,
    unit: "30 mins",
    desc: "Strength training or circuit bodyweight drills. Stimulates muscle growth and elevates baseline metabolism (BMR) even when resting.",
    category: "burn"
  },
  {
    id: "cycling-exercise",
    name: "Cycling Exercise",
    nameRegional: "চাইকেল চলোৱা",
    calories: -210,
    unit: "30 mins",
    desc: "Steady-state cycling. A great lower-body muscular exercise that burns calories with minimal strain on your joints.",
    category: "burn"
  },
  {
    id: "active-house-duties",
    name: "Active House Duties",
    nameRegional: "ঘৰুৱা কাম",
    calories: -90,
    unit: "30 mins",
    desc: "General household physical tasks like sweeping, mopping, or gardening. Contributes to your daily non-exercise physical activity (NEAT).",
    category: "burn"
  }
];
