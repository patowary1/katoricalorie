const blogPosts = [
  {
    id: "khar-calories-alkaline-benefits",
    title: "Khar Calories & Alkaline Benefits",
    titleRegional: "অমিতা খাৰ আৰু ইয়াৰ উপকাৰিতা",
    desc: "An in-depth look at the alkaline chemistry of Assamese Khar, its digestive benefits, and how this zero-oil traditional starter preps your metabolism.",
    url: "/blog/khar-calories-alkaline-benefits"
  },
  {
    id: "pitha-carbohydrates-portion-control",
    title: "Pitha Carbohydrates & Portion Control",
    titleRegional: "পিঠা আৰু কাৰ্বহাইড্ৰেট নিৰণয়",
    desc: "Analyzing the calorie and carbohydrate density of Bihu pithas. Learn how to enjoy Til Pitha and Ghila Pitha without spiking your insulin.",
    url: "/blog/pitha-carbohydrates-portion-control"
  },
  {
    id: "roti-vs-rice-indian-weight-loss",
    title: "Roti vs Rice in Indian Weight Loss",
    titleRegional: "ৰুটী বনাম ভাত",
    desc: "A scientific comparison of dietary fiber, glycemic index, and portion control metrics between wheat rotis and steamed basmati rice.",
    url: "/blog/roti-vs-rice-indian-weight-loss"
  },
  {
    id: "masor-tenga-nutrition-heart-healthy-acids",
    title: "Masor Tenga Nutrition & Heart-Healthy Acids",
    titleRegional: "মাছৰ টেঙাৰ পুষ্টি গুণ",
    desc: "Exploring the omega-3 fatty acids, antioxidants, and low-calorie properties of the iconic Assamese sour fish broth.",
    url: "/blog/masor-tenga-nutrition-heart-healthy-acids"
  },
  {
    id: "fermented-foods-northeast-india",
    title: "The Science of Fermented Foods in Northeast India",
    titleRegional: "উত্তৰ-পূবৰ ফাৰমেণ্টেড খাদ্য",
    desc: "Diving into gut health benefits, probiotics, and metabolic advantages of Axone, Gundruk, and local fermented bamboo shoots.",
    url: "/blog/fermented-foods-northeast-india"
  },
  {
    id: "traditional-assamese-herbs-metabolic-health",
    title: "Traditional Assamese Herbs for Metabolic Health",
    titleRegional: "বনৌষধি আৰু মেটাবলিজম",
    desc: "How local wild greens like Manimuni, Bhedailota, and Dhekia help regulate inflammation and support liver wellness.",
    url: "/blog/traditional-assamese-herbs-metabolic-health"
  },
  {
    id: "calculator-accuracy-decimal-feet-bug",
    title: "The Decimal Height Bug in BMR Calculators",
    titleRegional: "কেলকুলেটৰৰ শুদ্ধতা আৰু মেটাবলিক গণনা",
    desc: "Discover how a simple decimal height conversion bug on popular online BMR and TDEE calculators can miscalculate your daily active calorie target by 50+ kcal.",
    url: "/blog/calculator-accuracy-decimal-feet-bug"
  },
  {
    id: "brown-basmati-rice-weight-loss",
    title: "Brown Basmati Rice for Weight Loss",
    titleRegional: "ব্ৰাউন বাচমতী চাউল",
    desc: "A scientific analysis of Brown Basmati Rice for weight loss, glycemic indices, dietary fiber profiles, and how to balance it in your daily calorie deficit.",
    url: "/blog/brown-basmati-rice-weight-loss"
  },
  {
    id: "bora-saul-sticky-rice-glycemic-index",
    title: "Bora Saul Glycemic Index & Starch Chemistry",
    titleRegional: "বৰা চাউল আৰু তেজৰ শৰ্কৰা",
    desc: "Exploring the rapid insulin responses of Assamese sticky rice. Learn why high amylopectin content spikes glucose and how to manage portions safely.",
    url: "/blog/bora-saul-sticky-rice-glycemic-index"
  },
  {
    id: "joha-rice-antioxidants-benefits",
    title: "Joha Rice Antioxidants & Metabolic Benefits",
    titleRegional: "জোহা চাউলৰ ঔষধি গুণ",
    desc: "The science behind Assam's premium aromatic rice. Discover its polyphenolic profiles, antioxidant activity, and potential anti-diabetic compounds.",
    url: "/blog/joha-rice-antioxidants-benefits"
  },
  {
    id: "bao-dhan-red-rice-superfood",
    title: "Bao Dhan: Red Rice Anthocyanins & Nutrition",
    titleRegional: "বাও ধানৰ পুষ্টিগুণ",
    desc: "Analyzing Assam's deep-water red rice. Rich in iron, zinc, and anthocyanin antioxidants, learn why this flood-tolerant grain is a global superfood.",
    url: "/blog/bao-dhan-red-rice-superfood"
  }
];

const foodGuides = [
  {
    id: "masor-tenga-recipe-nutrition",
    title: "Masor Tenga Recipe & Nutrition",
    titleRegional: "মাছৰ টেঙা প্ৰস্তুত প্ৰণালী",
    desc: "How to cook a traditional Assamese sour fish curry with zero oil, leveraging fresh river fish, tangy tomatoes, and direct lemon infusions.",
    url: "/food/masor-tenga-recipe-nutrition"
  },
  {
    id: "omita-khar-nutrition",
    title: "Omita Khar Nutrition & Minerals",
    titleRegional: "অমিতা খাৰ আৰু খনিজ পদাৰ্থ",
    desc: "Step-by-step guide to cooking papaya Khar. Exploring its digestive alkaline properties, potassium count, and low calorie density.",
    url: "/food/omita-khar-nutrition"
  },
  {
    id: "til-pitha-portion-control",
    title: "Til Pitha Portion Control",
    titleRegional: "তিল পিঠাৰ পৰিমাণ নিৰ্ধাৰণ",
    desc: "Learn the macro profile of sesame rice rolls. Understand glycemic load controls when enjoying traditional Assamese sweets.",
    url: "/food/til-pitha-portion-control"
  },
  {
    id: "naga-pork-bamboo-shoot",
    title: "Naga Pork with Bamboo Shoot",
    titleRegional: "বাঁহৰ গাজৰে সৈতে গাহৰি মাংস",
    desc: "Detailed recipe analysis of this oil-free, high-protein pork curry cooked with fermented bamboo shoots and woodfire aromas.",
    url: "/food/naga-pork-bamboo-shoot"
  },
  {
    id: "aloo-pitika-calories",
    title: "Aloo Pitika Calorie Profile",
    titleRegional: "আলু পিটিকাৰ কেলৰি নিৰূপন",
    desc: "Portion guidelines for mashed potato dressed with fresh coriander, onions, and raw mustard oil. Tips for lowering glycemic impact.",
    url: "/food/aloo-pitika-calories"
  },
  {
    id: "dosa-sambar-calories",
    title: "Dosa Sambar Caloric Breakdown",
    titleRegional: "দোচা আৰু চম্বৰ",
    desc: "Understanding the fats, proteins, and carbohydrates in South Indian griddle crepes. A portion control guide for restaurant vs home prep.",
    url: "/food/dosa-sambar-calories"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { blogPosts, foodGuides };
}
