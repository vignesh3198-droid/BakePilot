import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const storePath = path.join(rootDir, 'js', 'store.js');
const dbPath = path.join(rootDir, 'data', 'bakery_database.json');

const storeContent = fs.readFileSync(storePath, 'utf8');
const startMarker = 'const BAKERY_ASSETS = {';
const endMarker = 'class BakeryStore {';
const startIndex = storeContent.indexOf(startMarker);
const endIndex = storeContent.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const code = storeContent.slice(startIndex, endIndex).trim().replace(/;$/, '');
  const evalFn = new Function(code + '\nreturn initialBakeryData;');
  const data = evalFn();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Seeded data/bakery_database.json successfully! Items:', data.inventory.length, 'Orders:', data.orders.length, 'Currency:', data.profile.currencySymbol);
} else {
  console.error('Could not find markers in js/store.js');
  process.exit(1);
}
