const fs = require('fs');
const http = require('http');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.join(__dirname, '..');

// Helper to serve local static files with Vercel-like routing rules for local testing
function createLocalServer(port = 3000) {
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(projectRoot, 'vercel.json'), 'utf-8'));

  const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];

    // Check 301 redirects
    for (const r of vercelConfig.redirects || []) {
      if (urlPath === r.source) {
        res.writeHead(301, { 'Location': r.destination });
        res.end();
        return;
      }
    }

    // Check trailingSlash
    if (urlPath !== '/' && urlPath.endsWith('/')) {
      res.writeHead(301, { 'Location': urlPath.slice(0, -1) });
      res.end();
      return;
    }

    // Check rewrites
    for (const rw of vercelConfig.rewrites || []) {
      if (urlPath === rw.source) {
        urlPath = rw.destination;
        break;
      }
    }

    let filePath = path.join(projectRoot, urlPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    }

    if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
      let contentType = 'text/html';
      if (filePath.endsWith('.xml')) contentType = 'application/xml; charset=utf-8';
      if (filePath.endsWith('.txt')) contentType = 'text/plain; charset=utf-8';
      if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';
      if (filePath.endsWith('.js')) contentType = 'application/javascript';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(fs.readFileSync(filePath));
    } else {
      const page404Path = path.join(projectRoot, '404.html');
      if (fs.existsSync(page404Path)) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync(page404Path));
      } else {
        res.writeHead(404);
        res.end('404 Not Found');
      }
    }
  });

  return new Promise(resolve => {
    server.listen(port, () => resolve(server));
  });
}

async function runLocalVerification() {
  console.log('Starting local static test server on http://localhost:3000...');
  const server = await createLocalServer(3000);

  console.log('Running verify-live HTTP test suite...\n');

  try {
    const output = execSync('bash scripts/verify-live.sh http://localhost:3000', { cwd: projectRoot, encoding: 'utf-8' });
    console.log(output);
  } catch (err) {
    if (err.stdout) console.log(err.stdout);
    if (err.stderr) console.error(err.stderr);
    console.error('verify-live.sh exited with code', err.status);
  } finally {
    server.close();
  }
}

runLocalVerification();
