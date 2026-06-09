const foodDatabase = [
  // --- ASSAMESE TRADITIONAL ---
  {
    id: "masor-tenga",
    name: "Masor Tenga",
    nameRegional: "মাছৰ টেঙা",
    calories: 140,
    unit: "1 serving (200ml)",
    desc: "A light and sour traditional Assamese fish curry prepared with cross-cut drying of garcinia pedunculata (thekera tenga), tomatoes, outenga, or fresh lemon. Features fresh local pond, lake, or river fish cooked in minimal mustard oil, offering healthy proteins and omega-3s with very few calories.",
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
  {
    id: "haah-kumura",
    name: "Poora Haah Kumura",
    nameRegional: "হাঁহৰ মাংস",
    calories: 340,
    unit: "1 plate (200g)",
    desc: "A rustic, slow-cooked traditional Assamese duck curry prepared with fresh winter ash gourd (Chal,boka Kumura), fresh ginger, garlic, and whole spices. Hearty, rich in iron, and deeply comforting.",
    category: "assamese"
  },
  {
    id: "gahori-bhaji",
    name: "Local Gahori Bhaji",
    nameRegional: "গাহৰি মাংস ভাজি",
    calories: 290,
    unit: "1 plate (150g)",
    desc: "Local pork cuts dry-fried with green chilies, ginger paste, and regional herbs. It delivers high-quality protein and rich flavors with a traditional crispy finish.",
    category: "assamese"
  },
  {
    id: "masor-poora",
    name: "Masor Poora",
    nameRegional: "পুৰা মাছ",
    calories: 110,
    unit: "1 piece",
    desc: "Fresh local pond or lake mudfish (Goroi fish) marinated with fresh green chilies, raw mustard oil, and coriander, wrapped in a banana leaf and slow-grilled over hot embers for an authentic smoky flavor.",
    category: "assamese"
  },
  {
    id: "til-pitha",
    name: "Til Pitha",
    nameRegional: "তিল পিঠা",
    calories: 85,
    unit: "1 piece",
    desc: "A delicate, cylindrical roasted rice cake wrapper stuffed with a sweet, roasted black sesame seed and jaggery filling. A classic Bihu festival treat.",
    category: "assamese"
  },
  {
    id: "ghila-pitha",
    name: "Ghila Pitha",
    nameRegional: "ঘিলা পিঠা",
    calories: 150,
    unit: "1 piece",
    desc: "A fried sweet rice cake flavored with liquid jaggery, crisp on the outside and soft inside. High in carbohydrates and ideal for moderate energy snacking.",
    category: "assamese"
  },
  {
    id: "komal-saul",
    name: "Komal Saul",
    nameRegional: "কোমল চাউল",
    calories: 130,
    unit: "1 cup (soaked, 100g)",
    desc: "A unique, native variety of precooked soft rice that needs only simple soaking in cold water. Served with cream (doi) and jaggery for a traditional breakfast.",
    category: "assamese"
  },

  // --- NORTHEAST SPECIALTIES ---
  {
    id: "pork-bamboo-shoot",
    name: "Pork with Bamboo Shoot",
    nameRegional: "বাঁহৰ গাজৰে সৈতে গাহৰি মাংস",
    calories: 320,
    unit: "1 plate (200g)",
    desc: "A beloved Naga dish of tender pork slow-cooked in its own natural juices with fermented bamboo shoots and fiery king chilies. Oil-free, smoky, and intensely savory.",
    category: "northeast"
  },
  {
    id: "baah-gaj-tenga",
    name: "Baah Gaj Tenga",
    nameRegional: "বাঁহ গাজ টেঙা",
    calories: 80,
    unit: "1 serving (150ml)",
    desc: "A refreshing, tangy vegetarian broth prepared with fermented bamboo shoots, tomatoes, and regional wild herbs. It is light, sour, and helps cleanse the digestive tract.",
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
  {
    id: "eromba",
    name: "Eromba",
    nameRegional: "Manipuri Eromba",
    calories: 60,
    unit: "1 serving (100g)",
    desc: "A traditional Manipuri dish prepared by boiling vegetables, potatoes, and mushrooms, mashed together with fermented fish paste and fiery chilies. An aromatic, oil-free delicacy.",
    category: "northeast"
  },

  // --- PAN-INDIA STAPLES & STATE SPECIALS ---
  {
    id: "roti",
    name: "Plain Roti / Chapatis",
    calories: 75,
    unit: "1 piece",
    desc: "Whole wheat flatbread rolled thin and puffed over an open flame. A staple source of complex carbohydrates and dietary fiber for steady metabolic energy.",
    category: "staples"
  },
  {
    id: "steamed-rice",
    name: "Steamed Basmati Rice",
    calories: 130,
    unit: "1 cup (150g cooked)",
    desc: "Light and fluffy long-grain white rice, steam-cooked. Easy to digest and a perfect base for regional fish curries and lentil soups.",
    category: "staples"
  },
  {
    id: "dal-tadka",
    name: "Dal Tadka",
    calories: 120,
    unit: "1 cup (150ml)",
    desc: "Yellow pigeon pea lentils boiled with turmeric, then tempered with a touch of ghee, cumin seeds, garlic, and dried red chilies. Great source of plant protein.",
    category: "staples"
  },
  {
    id: "chicken-biryani",
    name: "Chicken Biryani",
    calories: 420,
    unit: "1 plate (300g)",
    desc: "Fragrant long-grain basmati rice layered with spiced marinated chicken, cooked on slow dum heat. Rich in aromatic herbs like mint and saffron.",
    category: "staples"
  },
  {
    id: "butter-chicken",
    name: "Butter Chicken",
    calories: 360,
    unit: "1 bowl (200g)",
    desc: "Tender tandoori-grilled chicken pieces simmered in a mildly spiced, velvety tomato gravy enriched with butter and cream. Satisfying and protein-dense.",
    category: "staples"
  },
  {
    id: "dosa-sambar",
    name: "Masala Dosa with Sambar",
    calories: 350,
    unit: "1 plate",
    desc: "A crispy fermented rice crepe folded over a spiced potato filling, paired with vegetable-lentil soup. A popular South Indian breakfast that balances energy and proteins.",
    category: "staples"
  },
  {
    id: "idli",
    name: "Idli",
    calories: 60,
    unit: "1 piece",
    desc: "Fluffy, steamed savory cakes made from a fermented batter of black lentils and rice. Light, highly digestible, and rich in prebiotic gut benefits.",
    category: "staples"
  },
  {
    id: "fish-fry",
    name: "Fish Fry (Indian Style)",
    calories: 190,
    unit: "1 piece",
    desc: "River or marine fish steaks marinated in ginger, garlic, lime juice, and spices, pan-fried in mustard or seed oils until golden and crispy.",
    category: "staples"
  },
  {
    id: "veg-pulao",
    name: "Veg Pulao",
    calories: 210,
    unit: "1 plate (200g)",
    desc: "A light, aromatic rice dish prepared by cooking basmati rice with mixed vegetables, cardamom, cloves, and a touch of clarified butter.",
    category: "staples"
  },
  {
    id: "dhokla",
    name: "Dhokla",
    calories: 120,
    unit: "1 plate (2 pieces)",
    desc: "A soft, spongy steamed snack prepared from fermented gram flour batter, tempered with mustard seeds, curry leaves, and green chilies.",
    category: "staples"
  },
  {
    id: "litti-chokha",
    name: "Litti Chokha",
    calories: 280,
    unit: "1 plate (2 Littis + Chokha)",
    desc: "Roasted whole wheat dough balls stuffed with spiced roasted gram flour (sattu), served alongside a traditional smoky mash of eggplant, potatoes, and tomatoes.",
    category: "staples"
  },

  // --- SNACKS & STREET FOOD ---
  {
    id: "samosa",
    name: "Samosa",
    calories: 260,
    unit: "1 piece",
    desc: "A golden-fried, triangular pastry shell filled with spiced mashed potatoes, green peas, and fresh cilantro. Crisp and calorie-dense.",
    category: "snacks"
  },
  {
    id: "pani-puri",
    name: "Pani Puri / Puchka",
    calories: 150,
    unit: "1 plate (5 pieces)",
    desc: "Hollow, crispy semolina shells filled with spiced potato-chickpea mash, dipped in chilled tangy mint and sweet tamarind water. A sweet, sour, and spicy treat.",
    category: "snacks"
  },
  {
    id: "pav-bhaji",
    name: "Pav Bhaji",
    calories: 400,
    unit: "1 plate",
    desc: "A popular Mumbai street food featuring a spicy vegetable mash cooked with spices and butter, served with soft toasted buns.",
    category: "snacks"
  },
  {
    id: "chole-bhature",
    name: "Chole Bhature",
    calories: 450,
    unit: "1 plate",
    desc: "Spicy, tangy chickpea curry served alongside a puffed, deep-fried leavened bread. Rich in spices, flavor, and calories.",
    category: "snacks"
  },
  {
    id: "chicken-momos",
    name: "Chicken Momos (Steamed)",
    calories: 220,
    unit: "1 plate (6 pieces)",
    desc: "Thin flour wrappers stuffed with spiced minced chicken, steamed to perfection and served with a zesty, hot chili dipping sauce.",
    category: "snacks"
  },
  {
    id: "jalebi",
    name: "Jalebi",
    calories: 150,
    unit: "1 piece",
    desc: "Crispy spiral-shaped batter rings deep-fried and soaked in a warm cardamom-infused sugar syrup. A classic celebratory sweet treat.",
    category: "snacks"
  },

  // --- TRADITIONAL BEVERAGES ---
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
    id: "black-tea",
    name: "Black Tea / Lal Saah",
    nameRegional: "ৰঙা চাহ",
    calories: 10,
    unit: "1 cup (150ml)",
    desc: "A robust cup of pure brewed Assam black tea leaves. Clean, aromatic, and comforting without any added milk or sugar.",
    category: "beverages"
  },
  {
    id: "sweet-lassi",
    name: "Sweet Lassi",
    calories: 200,
    unit: "1 glass (250ml)",
    desc: "A thick, creamy Punjabi yogurt beverage blended with sugar and a hint of cardamom or rose water, served chilled for instant refreshment.",
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
