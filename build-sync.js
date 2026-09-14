import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// 1. Ensure root index.html is the source entrypoint
if (fs.existsSync('index.html.source')) {
  fs.copyFileSync('index.html.source', 'index.html');
}

// 2. Run Vite build
console.log('Running vite build...');
execSync('npx vite build', { stdio: 'inherit' });

// 3. Deploy dist to root & assets
console.log('Syncing dist to root for Apache/cPanel...');
if (fs.existsSync('dist/index.html')) {
  const distHtml = fs.readFileSync('dist/index.html', 'utf8');
  fs.writeFileSync('index.html', distHtml);
}

if (fs.existsSync('dist/assets')) {
  if (!fs.existsSync('assets')) {
    fs.mkdirSync('assets', { recursive: true });
  }
  const files = fs.readdirSync('dist/assets');
  for (const f of files) {
    fs.copyFileSync(path.join('dist/assets', f), path.join('assets', f));
  }
}
if (fs.existsSync('dist/sw.js')) {
  fs.copyFileSync('dist/sw.js', 'sw.js');
}

console.log('Build and deployment sync complete!');
