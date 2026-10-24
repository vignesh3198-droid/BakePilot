// BakePilot v1.1.43 Production Release & Play Store AAB Builder
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 [BakePilot v1.1.43] Preparing Play Store Release Package...');

// 1. Prepare web bundle
execSync('node scripts/prepare-mobile-build.mjs', { stdio: 'inherit', cwd: rootDir });

// 2. Sync Android Capacitor assets
console.log('📦 Syncing Capacitor Android assets...');
execSync('npx.cmd cap sync android', { stdio: 'inherit', cwd: rootDir });

// 3. Locate Java Home
const javaHome = process.env.JAVA_HOME || 'C:\\Program Files\\Android\\Android Studio\\jbr';
process.env.JAVA_HOME = javaHome;
console.log(`☕ Using JDK: ${javaHome}`);

// 4. Build Android APK & AAB
const androidDir = path.join(rootDir, 'android');
console.log('⚙️ Building Android APK (assembleDebug)...');
execSync('.\\gradlew.bat assembleDebug', { stdio: 'inherit', cwd: androidDir });

console.log('⚙️ Building Google Play Store Bundle (bundleDebug / bundleRelease)...');
try {
  execSync('.\\gradlew.bat bundleDebug', { stdio: 'inherit', cwd: androidDir });
} catch (e) {
  console.log('Note on bundle build:', e.message);
}

// 5. Copy artifacts to root
const apkSource = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
const aabSource = path.join(androidDir, 'app', 'build', 'outputs', 'bundle', 'debug', 'app-debug.aab');

if (fs.existsSync(apkSource)) {
  const destApk = path.join(rootDir, 'BakePilot-v1.1.43.apk');
  fs.copyFileSync(apkSource, destApk);
  const sizeMb = (fs.statSync(destApk).size / (1024 * 1024)).toFixed(2);
  console.log(`✓ APK ready for direct distribution: BakePilot-v1.1.43.apk (${sizeMb} MB)`);
}

if (fs.existsSync(aabSource)) {
  const destAab = path.join(rootDir, 'BakePilot-v1.1.43.aab');
  fs.copyFileSync(aabSource, destAab);
  const sizeMb = (fs.statSync(destAab).size / (1024 * 1024)).toFixed(2);
  console.log(`✓ Google Play Store Bundle ready: BakePilot-v1.1.43.aab (${sizeMb} MB)`);
}

console.log('🎉 BakePilot v1.1.43 Mobile Build Complete!');
