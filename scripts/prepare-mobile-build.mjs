// Script to prepare standalone mobile app distribution package for BakePilot v1.1.43
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const wwwDir = path.join(rootDir, 'www');

if (!fs.existsSync(wwwDir)) {
  fs.mkdirSync(wwwDir, { recursive: true });
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(item => {
      copyRecursive(path.join(src, item), path.join(dest, item));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy static assets to www
['index.html', 'manifest.json', 'sw.js', 'assets', 'css', 'js'].forEach(item => {
  copyRecursive(path.join(rootDir, item), path.join(wwwDir, item));
});

console.log('✓ www directory bundled successfully for BakePilot v1.1.43 mobile packaging');
