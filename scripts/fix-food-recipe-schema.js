const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

const foodRecipes = [
  {
    file: 'food/masor-tenga-recipe-nutrition.html',
    id: 'https://www.katoricalorie.in/food/masor-tenga-recipe-nutrition#recipe',
    name: 'Traditional Assamese Masor Tenga (Sour Fish Curry)',
    image: 'https://www.katoricalorie.in/assets/masor-tenga.jpg',
    description: 'A light, tangy traditional Assamese river fish broth cooked with tomatoes and lemon, made oil-free.',
    yield: '1 katori (200 ml)',
    prepTime: 'PT10M',
    cookTime: 'PT20M',
    totalTime: 'PT30M',
    datePublished: '2026-06-13',
    keywords: 'masor tenga calories, assamese fish curry, low calorie indian curry, assamese food nutrition',
    category: 'Entree',
    cuisine: 'Assamese',
    ingredients: [
      '200g Rohu or Borali river fish',
      '2 medium ripe tomatoes (chopped)',
      '1 tbsp fresh lemon juice or Ou Tenga (elephant apple)',
      '1/2 tsp mustard seeds',
      '1/2 tsp turmeric powder',
      '1 pinch salt to taste',
      '2 fresh green chillies'
    ],
    instructions: [
      'Clean fish slices and rub lightly with turmeric and salt.',
      'Pan-sear fish lightly on a non-stick skillet for 2 minutes per side.',
      'Sauté mustard seeds and chopped tomatoes in 2 tbsp water until soft.',
      'Add 1.5 cups of warm water, green chillies, and bring broth to a gentle simmer.',
      'Add seared fish and cook for 10 minutes until tender.',
      'Turn off heat, stir in fresh lemon juice, and serve warm with rice.'
    ],
    nutrition: {
      calories: '140 calories',
      fatContent: '6.8g',
      proteinContent: '14.5g',
      carbohydrateContent: '4.0g',
      fiberContent: '1.2g'
    }
  },
  {
    file: 'food/omita-khar-nutrition.html',
    id: 'https://www.katoricalorie.in/food/omita-khar-nutrition#recipe',
    name: 'Traditional Assamese Omita Khar (Green Papaya)',
    image: 'https://www.katoricalorie.in/assets/omita-khar.jpg',
    description: 'A classic starter in Assamese meals, green papaya cooked in natural alkaline banana-peel filtrate.',
    yield: '1 katori (150 g)',
    prepTime: 'PT10M',
    cookTime: 'PT15M',
    totalTime: 'PT25M',
    datePublished: '2026-06-13',
    keywords: 'omita khar calories, raw papaya khar, assamese alkaline starter, papaya nutrition',
    category: 'Starter',
    cuisine: 'Assamese',
    ingredients: [
      '250g raw green papaya (peeled and cubed)',
      '2 tbsp natural Kola Khar (banana peel ash liquid filtrate)',
      '1/2 tsp mustard oil',
      '2 crushed garlic cloves',
      '2 green chillies',
      'Salt to taste'
    ],
    instructions: [
      'Peel green papaya and chop into small uniform cubes.',
      'Heat 1/2 tsp mustard oil in a pan and lightly sauté garlic and green chillies.',
      'Add chopped papaya cubes and sauté for 3 minutes.',
      'Pour in Kola Khar liquid and 1/2 cup water.',
      'Cover and simmer for 12 minutes until papaya is tender and translucent.',
      'Serve warm as the traditional first course with rice.'
    ],
    nutrition: {
      calories: '55 calories',
      fatContent: '0.2g',
      proteinContent: '1.2g',
      carbohydrateContent: '9.8g',
      fiberContent: '2.4g'
    }
  },
  {
    file: 'food/aloo-pitika-calories.html',
    id: 'https://www.katoricalorie.in/food/aloo-pitika-calories#recipe',
    name: 'Traditional Assamese Aloo Pitika (Mashed Potato)',
    image: 'https://www.katoricalorie.in/assets/aloo-pitika.jpg',
    description: 'Comforting Assamese mashed potatoes seasoned with raw mustard oil, green chillies, and fresh coriander.',
    yield: '1 serving (100 g)',
    prepTime: 'PT5M',
    cookTime: 'PT15M',
    totalTime: 'PT20M',
    datePublished: '2026-06-13',
    keywords: 'aloo pitika calories, assamese mashed potato, aloo pitika nutrition, low fat side dish',
    category: 'Side Dish',
    cuisine: 'Assamese',
    ingredients: [
      '2 medium potatoes (boiled and peeled)',
      '1/2 tsp raw cold-pressed mustard oil',
      '1 chopped green chilli',
      '1 tbsp finely chopped red onion',
      '1 tbsp fresh coriander leaves',
      'Salt to taste'
    ],
    instructions: [
      'Boil potatoes until soft, peel skins while warm.',
      'Mash potatoes thoroughly using a fork or hand.',
      'Add raw mustard oil, chopped onions, green chillies, and salt.',
      'Mix evenly until creamy and garnish with fresh coriander.',
      'Serve alongside rice and dal.'
    ],
    nutrition: {
      calories: '90 calories',
      fatContent: '2.1g',
      proteinContent: '2.0g',
      carbohydrateContent: '18.5g',
      fiberContent: '1.8g'
    }
  },
  {
    file: 'food/dosa-sambar-calories.html',
    id: 'https://www.katoricalorie.in/food/dosa-sambar-calories#recipe',
    name: 'South Indian Crispy Dosa & Vegetable Sambar',
    image: 'https://www.katoricalorie.in/assets/dosa-sambar.jpg',
    description: 'Classic South Indian fermented rice-lentil crepe served with aromatic vegetable sambar.',
    yield: '1 plate (1 Dosa + 1 Katori Sambar)',
    prepTime: 'PT15M',
    cookTime: 'PT20M',
    totalTime: 'PT35M',
    datePublished: '2026-06-13',
    keywords: 'dosa sambar calories, south indian breakfast nutrition, fermented dosa carbs, sambar protein',
    category: 'Breakfast',
    cuisine: 'South Indian',
    ingredients: [
      '1 cup fermented rice and urad dal batter',
      '1/2 cup mixed vegetables (drumstick, carrot, pumpkin)',
      '1/4 cup boiled toor dal',
      '1 tbsp sambar powder',
      '1/2 tsp mustard seeds & curry leaves',
      'Salt to taste'
    ],
    instructions: [
      'Pour batter onto a hot non-stick tawa and spread thinly in circular motion.',
      'Cook until edges turn golden brown and crispy.',
      'Boil toor dal with mixed vegetables, tamarind water, and sambar powder.',
      'Temper sambar with mustard seeds and curry leaves.',
      'Serve hot crispy dosa alongside 1 katori of vegetable sambar.'
    ],
    nutrition: {
      calories: '240 calories',
      fatContent: '3.8g',
      proteinContent: '6.5g',
      carbohydrateContent: '44.0g',
      fiberContent: '4.2g'
    }
  },
  {
    file: 'food/naga-pork-bamboo-shoot.html',
    id: 'https://www.katoricalorie.in/food/naga-pork-bamboo-shoot#recipe',
    name: 'Naga Pork Curry with Fermented Bamboo Shoot',
    image: 'https://www.katoricalorie.in/assets/naga-pork.jpg',
    description: 'A rich, aromatic Naga dish prepared with tender pork, fermented bamboo shoots, and Raja Mircha.',
    yield: '1 serving (150 g)',
    prepTime: 'PT15M',
    cookTime: 'PT35M',
    totalTime: 'PT50M',
    datePublished: '2026-06-13',
    keywords: 'naga pork calories, bamboo shoot pork nutrition, naga cuisine protein, king chilli curry',
    category: 'Main Course',
    cuisine: 'Naga',
    ingredients: [
      '250g lean pork cuts',
      '2 tbsp fermented bamboo shoot (shredded)',
      '1 King Chilli (Raja Mircha / Bhut Jolokia)',
      '4 crushed garlic cloves',
      '1 inch ginger paste',
      'Salt to taste'
    ],
    instructions: [
      'Wash pork cuts and dry thoroughly.',
      'Place pork in a heavy pot over medium heat to render natural fats.',
      'Add crushed garlic, ginger paste, and fermented bamboo shoot.',
      'Add crushed King Chilli and 1 cup warm water.',
      'Cover and simmer slowly for 35 minutes until pork tenderizes and broth thickens.',
      'Serve warm with steam-cooked rice.'
    ],
    nutrition: {
      calories: '320 calories',
      fatContent: '18.5g',
      proteinContent: '28.0g',
      carbohydrateContent: '4.2g',
      fiberContent: '1.8g'
    }
  },
  {
    file: 'food/til-pitha-portion-control.html',
    id: 'https://www.katoricalorie.in/food/til-pitha-portion-control#recipe',
    name: 'Assamese Til Pitha (Sesame Jaggery Rice Roll)',
    image: 'https://www.katoricalorie.in/assets/til-pitha.jpg',
    description: 'Traditional Assamese Bihu delicacy made with glutinous rice flour rolled around roasted black sesame and jaggery filling.',
    yield: '1 piece (~30 g)',
    prepTime: 'PT15M',
    cookTime: 'PT10M',
    totalTime: 'PT25M',
    datePublished: '2026-06-13',
    keywords: 'til pitha calories, assamese pitha nutrition, bihu sweet calories, black sesame jaggery pitha',
    category: 'Dessert / Snack',
    cuisine: 'Assamese',
    ingredients: [
      '1 cup soaked and ground Bora Saul (glutinous rice flour)',
      '1/2 cup roasted black sesame seeds (ground)',
      '1/3 cup grated organic jaggery',
      '1 pinch cardamom powder'
    ],
    instructions: [
      'Mix roasted ground black sesame seeds with grated jaggery for the filling.',
      'Heat a flat iron tawa on low flame.',
      'Spread 2 tbsp moist Bora Saul flour in an oval shape on the warm tawa.',
      'Place 1 tbsp sesame-jaggery mixture in the center.',
      'Roll gently from both sides to form a firm cylindrical shape.',
      'Cook for 1-2 minutes until crust sets and serve warm.'
    ],
    nutrition: {
      calories: '110 calories',
      fatContent: '4.2g',
      proteinContent: '2.9g',
      carbohydrateContent: '15.0g',
      fiberContent: '1.1g'
    }
  }
];

for (const item of foodRecipes) {
  const filePath = path.join(projectRoot, item.file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf-8');

  const recipeSchema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "@id": item.id,
    "name": item.name,
    "image": item.image,
    "description": item.description,
    "recipeYield": item.yield,
    "prepTime": item.prepTime,
    "cookTime": item.cookTime,
    "totalTime": item.totalTime,
    "datePublished": item.datePublished,
    "keywords": item.keywords,
    "recipeCategory": item.category,
    "recipeCuisine": item.cuisine,
    "author": {
      "@type": "Person",
      "name": "Ridip Patowary"
    },
    "recipeIngredient": item.ingredients,
    "recipeInstructions": item.instructions.map(stepText => ({
      "@type": "HowToStep",
      "text": stepText
    })),
    "nutrition": {
      "@type": "NutritionInformation",
      "calories": item.nutrition.calories,
      "fatContent": item.nutrition.fatContent,
      "proteinContent": item.nutrition.proteinContent,
      "carbohydrateContent": item.nutrition.carbohydrateContent,
      "fiberContent": item.nutrition.fiberContent
    }
  };

  const schemaScript = `<script type="application/ld+json">\n${JSON.stringify(recipeSchema, null, 2)}\n</script>`;

  if (content.includes('<script type="application/ld+json">')) {
    content = content.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, schemaScript);
  } else {
    content = content.replace('</head>', `${schemaScript}\n</head>`);
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated Recipe JSON-LD schema on ${item.file}`);
}
