import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const logo = path.join(rootDir, 'assets', 'bakepilot-logo.png');
const resDir = path.join(rootDir, 'android', 'app', 'src', 'main', 'res');

// 1. Delete the default Capacitor vector icon in drawable-v24
const v24Xml = path.join(resDir, 'drawable-v24', 'ic_launcher_foreground.xml');
if (fs.existsSync(v24Xml)) {
  fs.unlinkSync(v24Xml);
  console.log('✓ Deleted default Capacitor vector icon:', v24Xml);
}

// 2. Set background color to #1C171A
const bgXml = path.join(resDir, 'values', 'ic_launcher_background.xml');
const bgContent = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#1C171A</color>
</resources>
`;
fs.writeFileSync(bgXml, bgContent, 'utf8');
console.log('✓ Updated ic_launcher_background to #1C171A');

// 3. Copy BakePilot logo to all mipmap densities
const mipmaps = ['mipmap-mdpi', 'mipmap-hdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi'];
mipmaps.forEach(m => {
  const dir = path.join(resDir, m);
  if (fs.existsSync(dir)) {
    fs.copyFileSync(logo, path.join(dir, 'ic_launcher.png'));
    fs.copyFileSync(logo, path.join(dir, 'ic_launcher_round.png'));
    fs.copyFileSync(logo, path.join(dir, 'ic_launcher_foreground.png'));
  }
});

console.log('✓ All launcher icons and adaptive foregrounds updated to BakePilot logo!');
