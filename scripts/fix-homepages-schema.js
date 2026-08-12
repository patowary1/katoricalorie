const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

const files = ['index.html', 'as/index.html', 'hi/index.html'];

for (const relPath of files) {
  const filePath = path.join(projectRoot, relPath);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace script JSON-LD block
  content = content.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.katoricalorie.in/#website",
        "url": "https://www.katoricalorie.in/",
        "name": "KatoriCalorie",
        "description": "India's specialized Regional & National Food Calorie Calculator using the Mifflin-St Jeor equation and interactive Thali tracker."
      },
      {
        "@type": "WebApplication",
        "@id": "https://www.katoricalorie.in/#webapplication",
        "url": "https://www.katoricalorie.in/",
        "name": "KatoriCalorie Web Application",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "All",
        "description": "Calculate BMR using the Mifflin-St Jeor equation and build your custom digital Katori Thali dynamically.",
        "browserRequirements": "Requires JavaScript. Requires HTML5."
      },
      {
        "@type": "Organization",
        "@id": "https://www.katoricalorie.in/#organization",
        "name": "KatoriCalorie",
        "url": "https://www.katoricalorie.in/",
        "logo": "https://www.katoricalorie.in/assets/og-banner.jpg"
      }
    ]
  }
  </script>`
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated JSON-LD schema on ${relPath}`);
}
