const fs = require('fs');

// 1. Bao Dhan (blog/bao-dhan-red-rice-superfood.html)
let bao = fs.readFileSync('blog/bao-dhan-red-rice-superfood.html', 'utf-8');
const baoRelated = `
        <!-- Related Regional Nutrition Guides -->
        <div class="related-guides-block" style="margin-top: 2.5rem; padding: 1.25rem; background: rgba(255, 107, 53, 0.05); border-left: 3px solid var(--accent-orange); border-radius: 6px;">
          <h3 style="font-size: 1.05rem; color: var(--accent-orange); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
            <i class="ph ph-link"></i> Related Regional Food Guides
          </h3>
          <ul style="margin: 0; padding-left: 1.2rem; color: var(--text-secondary); line-height: 1.6; font-size: 0.9rem;">
            <li style="margin-bottom: 0.4rem;">
              <a href="/blog/joha-rice-antioxidants-benefits" style="color: var(--accent-orange); text-decoration: none; font-weight: 500;">Joha Rice: Aroma, Calories &amp; Nutrition</a> — Explore Assam's fragrant heritage grain and its metabolic research context.
            </li>
            <li>
              <a href="/blog/brown-basmati-rice-weight-loss" style="color: var(--accent-orange); text-decoration: none; font-weight: 500;">Brown Basmati vs White Rice: Weight Loss &amp; Fiber</a> — Compare whole-grain fiber and satiety differences with national staples.
            </li>
          </ul>
        </div>
`;
if (!bao.includes('Related Regional Food Guides')) {
  bao = bao.replace('</div>\n    </main>', baoRelated + '      </div>\n    </main>');
  fs.writeFileSync('blog/bao-dhan-red-rice-superfood.html', bao, 'utf-8');
  console.log('Added related links to blog/bao-dhan-red-rice-superfood.html');
}

// 2. Joha Rice (blog/joha-rice-antioxidants-benefits.html)
let joha = fs.readFileSync('blog/joha-rice-antioxidants-benefits.html', 'utf-8');
const johaRelated = `
        <!-- Related Regional Nutrition Guides -->
        <div class="related-guides-block" style="margin-top: 2.5rem; padding: 1.25rem; background: rgba(255, 107, 53, 0.05); border-left: 3px solid var(--accent-orange); border-radius: 6px;">
          <h3 style="font-size: 1.05rem; color: var(--accent-orange); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
            <i class="ph ph-link"></i> Related Regional Food Guides
          </h3>
          <ul style="margin: 0; padding-left: 1.2rem; color: var(--text-secondary); line-height: 1.6; font-size: 0.9rem;">
            <li style="margin-bottom: 0.4rem;">
              <a href="/blog/bao-dhan-red-rice-superfood" style="color: var(--accent-orange); text-decoration: none; font-weight: 500;">Bao Dhan: Red Rice Calories &amp; Nutrition</a> — Learn about deep-water whole red rice and its mineral profile.
            </li>
            <li>
              <a href="/blog/bora-saul-sticky-rice-glycemic-index" style="color: var(--accent-orange); text-decoration: none; font-weight: 500;">Bora Saul: Sticky Rice Starch Profile &amp; Nutrition</a> — Understand the high amylopectin structure of traditional glutinous rice.
            </li>
          </ul>
        </div>
`;
if (!joha.includes('Related Regional Food Guides')) {
  joha = joha.replace('</div>\n    </main>', johaRelated + '      </div>\n    </main>');
  fs.writeFileSync('blog/joha-rice-antioxidants-benefits.html', joha, 'utf-8');
  console.log('Added related links to blog/joha-rice-antioxidants-benefits.html');
}

// 3. Bora Saul (blog/bora-saul-sticky-rice-glycemic-index.html)
let bora = fs.readFileSync('blog/bora-saul-sticky-rice-glycemic-index.html', 'utf-8');
const boraRelated = `
        <!-- Related Regional Nutrition Guides -->
        <div class="related-guides-block" style="margin-top: 2.5rem; padding: 1.25rem; background: rgba(255, 107, 53, 0.05); border-left: 3px solid var(--accent-orange); border-radius: 6px;">
          <h3 style="font-size: 1.05rem; color: var(--accent-orange); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
            <i class="ph ph-link"></i> Related Regional Food Guides
          </h3>
          <ul style="margin: 0; padding-left: 1.2rem; color: var(--text-secondary); line-height: 1.6; font-size: 0.9rem;">
            <li style="margin-bottom: 0.4rem;">
              <a href="/food/til-pitha-portion-control" style="color: var(--accent-orange); text-decoration: none; font-weight: 500;">Til Pitha: Calories &amp; Portion Guide</a> — Discover how Bora Saul flour is crafted into festive sesame-jaggery rolls.
            </li>
            <li>
              <a href="/blog/joha-rice-antioxidants-benefits" style="color: var(--accent-orange); text-decoration: none; font-weight: 500;">Joha Rice: Calories, Nutrition &amp; Benefits</a> — Compare non-sticky aromatic rice nutrition with glutinous staples.
            </li>
          </ul>
        </div>
`;
if (!bora.includes('Related Regional Food Guides')) {
  bora = bora.replace('</div>\n    </main>', boraRelated + '      </div>\n    </main>');
  fs.writeFileSync('blog/bora-saul-sticky-rice-glycemic-index.html', bora, 'utf-8');
  console.log('Added related links to blog/bora-saul-sticky-rice-glycemic-index.html');
}

// 4. Til Pitha (food/til-pitha-portion-control.html)
let til = fs.readFileSync('food/til-pitha-portion-control.html', 'utf-8');
til = til.replace(
  'At 85 calories per small pitha, eating three or four in one sitting can quickly add up to 340 calories',
  'At approximately 110 calories per standard ~30g piece, eating three or four in one sitting can quickly add up to 330–440 calories'
);

const tilRelated = `
        <!-- Related Regional Nutrition Guides -->
        <div class="related-guides-block" style="margin-top: 2.5rem; padding: 1.25rem; background: rgba(255, 107, 53, 0.05); border-left: 3px solid var(--accent-orange); border-radius: 6px;">
          <h3 style="font-size: 1.05rem; color: var(--accent-orange); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
            <i class="ph ph-link"></i> Related Regional Food Guides
          </h3>
          <ul style="margin: 0; padding-left: 1.2rem; color: var(--text-secondary); line-height: 1.6; font-size: 0.9rem;">
            <li style="margin-bottom: 0.4rem;">
              <a href="/blog/bora-saul-sticky-rice-glycemic-index" style="color: var(--accent-orange); text-decoration: none; font-weight: 500;">Bora Saul: Sticky Rice Starch Profile &amp; Nutrition</a> — Understand the native glutinous rice used to prepare authentic pitha.
            </li>
            <li>
              <a href="/blog/pitha-carbohydrates-portion-control" style="color: var(--accent-orange); text-decoration: none; font-weight: 500;">Bihu Pitha Carbohydrates &amp; Portion Control</a> — Comprehensive portion guide across Tel Pitha, Ghila Pitha, and Sunga Pitha.
            </li>
          </ul>
        </div>
`;
if (!til.includes('Related Regional Food Guides')) {
  til = til.replace('</div>\n    </main>', tilRelated + '      </div>\n    </main>');
  fs.writeFileSync('food/til-pitha-portion-control.html', til, 'utf-8');
  console.log('Added related links to food/til-pitha-portion-control.html');
}
