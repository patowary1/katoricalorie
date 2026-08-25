const fs = require('fs');

// 1. Update index.html
let index = fs.readFileSync('index.html', 'utf-8');

// Title & Meta
index = index.replace(
  '<title>KatoriCalorie | Premium Regional & National Food Nutrition Platform</title>',
  '<title>Indian &amp; Assamese Food Calories by Katori | KatoriCalorie</title>'
);

index = index.replace(
  '<meta name="description" content="India\'s leading food nutrition tracker specializing in regional Northeast, Assamese, and national staples. Compute your BMR using the Mifflin-St Jeor equation and track your daily plate calories dynamically.">',
  '<meta name="description" content="Search calories for Indian and Assamese foods by katori, plate or piece. Build your thali, compare portions and estimate your daily calorie needs.">'
);

index = index.replace(
  '<meta property="og:title" content="KatoriCalorie | Premium Regional & National Food Nutrition Platform">',
  '<meta property="og:title" content="Indian &amp; Assamese Food Calories by Katori | KatoriCalorie">'
);

index = index.replace(
  '<meta property="og:description" content="Compute your BMR with the Mifflin-St Jeor formula and dynamically track calories for traditional Indian and Northeast staples like Masor Tenga, Omita Khar, and Til Pitha.">',
  '<meta property="og:description" content="Search calories for Indian and Assamese foods by katori, plate or piece. Build your thali, compare portions and estimate your daily calorie needs.">'
);

index = index.replace(
  '<meta name="twitter:title" content="KatoriCalorie | Premium Regional & National Food Nutrition Platform">',
  '<meta name="twitter:title" content="Indian &amp; Assamese Food Calories by Katori | KatoriCalorie">'
);

index = index.replace(
  '<meta name="twitter:description" content="Compute your BMR with the Mifflin-St Jeor formula and dynamically track calories for traditional Indian and Northeast staples like Masor Tenga, Omita Khar, and Til Pitha.">',
  '<meta name="twitter:description" content="Search calories for Indian and Assamese foods by katori, plate or piece. Build your thali, compare portions and estimate your daily calorie needs.">'
);

// Add Hero Section right above <section class="explainer-dashboard
if (!index.includes('id="main-heading"')) {
  const heroHtml = `    <!-- Main Intent Hero Section -->
    <section class="hero-section" aria-labelledby="main-heading" style="text-align: center; margin: 1.5rem 0 1rem 0; padding: 0 1rem;">
      <h1 id="main-heading" style="font-family: var(--font-heading); font-size: 1.75rem; color: var(--text-primary); margin-bottom: 0.5rem; font-weight: 700; line-height: 1.25;">Indian &amp; Assamese Food Calories by Katori</h1>
      <p style="color: var(--text-secondary); font-size: 0.95rem; max-width: 680px; margin: 0 auto; line-height: 1.5;">Search Indian and Assamese foods by katori, plate or piece. Build your thali, compare portions and estimate your daily calorie needs.</p>
    </section>\n\n`;

  index = index.replace(
    '<!-- Visual Quick Start & Explainer Dashboard -->',
    heroHtml + '    <!-- Visual Quick Start & Explainer Dashboard -->'
  );
}

// Add Static Internal Discovery section right before </main>
if (!index.includes('id="guides-heading"')) {
  const discoveryHtml = `    <!-- Popular Calorie & Nutrition Guides (Static Internal Discovery) -->
    <section class="popular-guides-section glass-panel" aria-labelledby="guides-heading" style="margin-top: var(--space-xl); padding: var(--space-lg); border-radius: var(--radius-lg); border: 1px solid var(--border-color); background: var(--bg-card);">
      <h2 id="guides-heading" style="font-family: var(--font-heading); font-size: 1.35rem; color: var(--accent-orange); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
        <i class="ph ph-book-open"></i> Popular Calorie &amp; Nutrition Guides
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.25rem; line-height: 1.5;">
        Explore evidence-based nutrition profiles, authentic portion standards, and cooking science for popular regional Indian foods:
      </p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem;">
        <a href="/blog/bao-dhan-red-rice-superfood" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: border-color 0.2s, background 0.2s;">
          <i class="ph ph-arrow-circle-right" style="color: var(--accent-orange); font-size: 1.1rem; flex-shrink: 0;"></i>
          <span>Bao Dhan red rice calories &amp; nutrition</span>
        </a>
        <a href="/blog/joha-rice-antioxidants-benefits" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: border-color 0.2s, background 0.2s;">
          <i class="ph ph-arrow-circle-right" style="color: var(--accent-orange); font-size: 1.1rem; flex-shrink: 0;"></i>
          <span>Joha rice calories &amp; nutrition</span>
        </a>
        <a href="/food/til-pitha-portion-control" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: border-color 0.2s, background 0.2s;">
          <i class="ph ph-arrow-circle-right" style="color: var(--accent-orange); font-size: 1.1rem; flex-shrink: 0;"></i>
          <span>Til Pitha calorie &amp; portion guide</span>
        </a>
        <a href="/blog/bora-saul-sticky-rice-glycemic-index" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: border-color 0.2s, background 0.2s;">
          <i class="ph ph-arrow-circle-right" style="color: var(--accent-orange); font-size: 1.1rem; flex-shrink: 0;"></i>
          <span>Bora Saul calories &amp; nutrition</span>
        </a>
        <a href="/food/masor-tenga-recipe-nutrition" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: border-color 0.2s, background 0.2s;">
          <i class="ph ph-arrow-circle-right" style="color: var(--accent-orange); font-size: 1.1rem; flex-shrink: 0;"></i>
          <span>Masor Tenga recipe &amp; nutrition</span>
        </a>
      </div>
    </section>\n\n`;

  index = index.replace('</main>', discoveryHtml + '  </main>');
}
fs.writeFileSync('index.html', index, 'utf-8');
console.log('Updated index.html');


// 2. Update Bao Dhan (blog/bao-dhan-red-rice-superfood.html)
let bao = fs.readFileSync('blog/bao-dhan-red-rice-superfood.html', 'utf-8');
bao = bao.replace(
  '<title>Bao Dhan: Red Rice Anthocyanins & Nutrition | KatoriCalorie Blog</title>',
  '<title>Bao Dhan Red Rice Calories & Nutrition | KatoriCalorie</title>'
);
bao = bao.replace(
  '<meta name="description" content="Learn about Assamese Bao Dhan (Red Rice). Discover its iron and zinc content, anthocyanin antioxidants, and low glycemic index benefits.">',
  '<meta name="description" content="See calories, macros and nutrition for a cooked 150g katori of Assam\'s Bao Dhan red rice, with practical portion information and regional context.">'
);
bao = bao.replace(
  '"headline": "Bao Dhan: Red Rice Anthocyanins & Nutrition",',
  '"headline": "Bao Dhan Red Rice: Calories & Nutrition",'
);
bao = bao.replace(
  '"description": "Learn about Assamese Bao Dhan (Red Rice). Discover its iron and zinc content, anthocyanin antioxidants, and low glycemic index benefits.",',
  '"description": "See calories, macros and nutrition for a cooked 150g katori of Assam\'s Bao Dhan red rice, with practical portion information and regional context.",'
);
bao = bao.replace(
  '<h1 class="compliance-title">Bao Dhan: Red Rice Anthocyanins & Nutrition</h1>',
  '<h1 class="compliance-title">Bao Dhan Red Rice: Calories & Nutrition</h1>'
);
fs.writeFileSync('blog/bao-dhan-red-rice-superfood.html', bao, 'utf-8');
console.log('Updated blog/bao-dhan-red-rice-superfood.html');


// 3. Update Joha Rice (blog/joha-rice-antioxidants-benefits.html)
let joha = fs.readFileSync('blog/joha-rice-antioxidants-benefits.html', 'utf-8');
joha = joha.replace(
  '<title>Joha Rice Antioxidants & Metabolic Benefits | KatoriCalorie Blog</title>',
  '<title>Joha Rice Calories, Nutrition & Benefits | KatoriCalorie</title>'
);
joha = joha.replace(
  '<meta name="description" content="Read about the nutritional profile of Assamese Joha Rice. Learn about its unique aroma compound, antioxidants, and metabolic research interest.">',
  '<meta name="description" content="See calories and macros for a cooked 150g katori of Assamese Joha rice, plus its aroma, nutrition and carefully sourced research context.">'
);
joha = joha.replace(
  '"headline": "Joha Rice Antioxidants & Metabolic Benefits",',
  '"headline": "Joha Rice: Calories, Nutrition & Benefits",'
);
joha = joha.replace(
  '"description": "Read about the nutritional profile of Assamese Joha Rice. Learn about its unique aroma compound, antioxidants, and metabolic research interest.",',
  '"description": "See calories and macros for a cooked 150g katori of Assamese Joha rice, plus its aroma, nutrition and carefully sourced research context.",'
);
joha = joha.replace(
  '<h1 class="compliance-title">Joha Rice: Antioxidants & Metabolic Benefits</h1>',
  '<h1 class="compliance-title">Joha Rice: Calories, Nutrition & Benefits</h1>'
);
fs.writeFileSync('blog/joha-rice-antioxidants-benefits.html', joha, 'utf-8');
console.log('Updated blog/joha-rice-antioxidants-benefits.html');


// 4. Update Til Pitha (food/til-pitha-portion-control.html)
let til = fs.readFileSync('food/til-pitha-portion-control.html', 'utf-8');
til = til.replace(
  '<title>Til Pitha Portion Control Guide | KatoriCalorie Database</title>',
  '<title>Til Pitha Calories per Piece & Portion Guide | KatoriCalorie</title>'
);
til = til.replace(
  '<meta name="description" content="Understand the caloric density and glycemic load of Assamese Til Pitha. Learn portion control tips to fit traditional rice cakes into a fat loss routine.">',
  '<meta name="description" content="A typical 30g Til Pitha is estimated at about 110 kcal. See the 100g reference values, macros and practical portion guidance.">'
);
til = til.replace(
  '<h1 class="compliance-title">Til Pitha Portion Control</h1>',
  '<h1 class="compliance-title">Til Pitha Calories & Portion Guide</h1>'
);
fs.writeFileSync('food/til-pitha-portion-control.html', til, 'utf-8');
console.log('Updated food/til-pitha-portion-control.html');


// 5. Update Bora Saul (blog/bora-saul-sticky-rice-glycemic-index.html)
let bora = fs.readFileSync('blog/bora-saul-sticky-rice-glycemic-index.html', 'utf-8');
bora = bora.replace(
  '<title>Bora Saul (Sticky Rice) Glycemic Index | KatoriCalorie Blog</title>',
  '<title>Bora Saul Calories & Nutrition | KatoriCalorie</title>'
);
bora = bora.replace(
  '<meta name="description" content="Learn about the Glycemic Index of Assamese Bora Saul (sticky rice), why it spikes blood sugar quickly, and how to eat it safely.">',
  '<meta name="description" content="See calories and macros for a cooked 150g katori of Assamese Bora Saul, with practical portion guidance and information about its sticky-rice starch profile.">'
);
bora = bora.replace(
  '"headline": "Bora Saul Sticky Rice Glycemic Index",',
  '"headline": "Bora Saul: Calories & Nutrition",'
);
bora = bora.replace(
  '"description": "Learn about the Glycemic Index of Assamese Bora Saul (sticky rice), why it spikes blood sugar quickly, and how to eat it safely.",',
  '"description": "See calories and macros for a cooked 150g katori of Assamese Bora Saul, with practical portion guidance and information about its sticky-rice starch profile.",'
);
bora = bora.replace(
  '<h1 class="compliance-title">Bora Saul (Sticky Rice) Glycemic Index</h1>',
  '<h1 class="compliance-title">Bora Saul: Calories & Nutrition</h1>'
);
fs.writeFileSync('blog/bora-saul-sticky-rice-glycemic-index.html', bora, 'utf-8');
console.log('Updated blog/bora-saul-sticky-rice-glycemic-index.html');
