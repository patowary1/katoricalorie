const fs = require('fs');
const path = require('path');
const { blogPosts, foodGuides } = require('../js/blog-db.js');

const projectRoot = path.join(__dirname, '..');

function buildBlogHub() {
  const blogIndexPath = path.join(projectRoot, 'blog', 'index.html');
  let content = fs.readFileSync(blogIndexPath, 'utf-8');

  const cardsHtml = blogPosts.map((post, idx) => `
      <!-- Article ${idx + 1} -->
      <div class="food-card" style="min-height: 200px;">
        <div class="card-body">
          <div class="card-top">
            <div class="card-title">
              ${post.title}
              <span class="regional-lang">${post.titleRegional}</span>
            </div>
          </div>
          <p class="card-desc">
            ${post.desc}
          </p>
          <div class="card-bottom">
            <a href="${post.url}" style="color: var(--accent-orange); text-decoration: none; font-weight: 600; font-size: 0.9rem;">Read Article &rarr;</a>
          </div>
        </div>
      </div>`).join('\n');

  const gridRegex = /(<div class="food-grid">)[\s\S]*?(<\/div>\s*<!-- AdSense Mid page placeholder -->)/;
  if (!gridRegex.test(content)) {
    console.error('Could not match food-grid container in blog/index.html');
    return;
  }

  const updatedContent = content.replace(gridRegex, `$1\n${cardsHtml}\n\n    $2`);
  fs.writeFileSync(blogIndexPath, updatedContent, 'utf-8');
  console.log(`Successfully updated blog/index.html with ${blogPosts.length} static article cards.`);
}

function buildFoodHub() {
  const foodIndexPath = path.join(projectRoot, 'food', 'index.html');
  let content = fs.readFileSync(foodIndexPath, 'utf-8');

  const cardsHtml = foodGuides.map((guide, idx) => `
      <!-- Food ${idx + 1} -->
      <div class="food-card" style="min-height: 200px;">
        <div class="card-body">
          <div class="card-top">
            <div class="card-title">
              ${guide.title}
              <span class="regional-lang">${guide.titleRegional}</span>
            </div>
          </div>
          <p class="card-desc">
            ${guide.desc}
          </p>
          <div class="card-bottom">
            <a href="${guide.url}" style="color: var(--accent-orange); text-decoration: none; font-weight: 600; font-size: 0.9rem;">Read Guide &rarr;</a>
          </div>
        </div>
      </div>`).join('\n');

  const gridRegex = /(<div class="food-grid">)[\s\S]*?(<\/div>\s*<!-- AdSense Mid page placeholder -->)/;
  if (!gridRegex.test(content)) {
    console.error('Could not match food-grid container in food/index.html');
    return;
  }

  const updatedContent = content.replace(gridRegex, `$1\n${cardsHtml}\n\n    $2`);
  fs.writeFileSync(foodIndexPath, updatedContent, 'utf-8');
  console.log(`Successfully updated food/index.html with ${foodGuides.length} static food guide cards.`);
}

buildBlogHub();
buildFoodHub();
