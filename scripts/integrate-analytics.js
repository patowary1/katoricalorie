const fs = require('fs');

// 1. Add <script src="/js/analytics.js"></script> to html files
['index.html', 'as/index.html', 'hi/index.html', 'compare.html'].forEach(f => {
  if (fs.existsSync(f)) {
    let html = fs.readFileSync(f, 'utf-8');
    if (!html.includes('/js/analytics.js')) {
      html = html.replace('<script src="/js/calculator.js"></script>', '<script src="/js/analytics.js"></script>\n  <script src="/js/calculator.js"></script>');
      html = html.replace('<script src="/js/compare.js"></script>', '<script src="/js/analytics.js"></script>\n  <script src="/js/compare.js"></script>');
      fs.writeFileSync(f, html, 'utf-8');
      console.log('Added analytics.js script tag to ' + f);
    }
  }
});
