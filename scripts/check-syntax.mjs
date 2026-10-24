import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function checkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git') checkDir(full);
    } else if (f.endsWith('.js') || f.endsWith('.mjs')) {
      try {
        execSync(`node --check "${full}"`);
        console.log('✓ Syntax OK:', full);
      } catch (err) {
        console.error('❌ Syntax error in:', full, err.message);
        process.exit(1);
      }
    }
  }
}

checkDir('.');
console.log('ALL JS & MJS FILES PASSED SYNTAX CHECK!');
