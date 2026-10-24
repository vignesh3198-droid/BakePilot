import http from 'http';
import fs from 'fs';
import path from 'path';

function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Bakery Manager Full Verification...\n');

  // 1. Test Static Index Page
  console.log('1. Checking GET / (index.html)...');
  const indexRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  });
  if (indexRes.statusCode !== 200) throw new Error(`Failed to load index.html: ${indexRes.statusCode}`);
  if (!indexRes.body.includes('Manrope') || !indexRes.body.includes('Inter')) {
    throw new Error('index.html is missing Manrope or Inter font links!');
  }
  if (!indexRes.body.includes('order-wizard.js') || !indexRes.body.includes('workspace.js')) {
    throw new Error('index.html is missing order-wizard.js or workspace.js scripts!');
  }
  console.log('   ✓ Index HTML serves correctly with Manrope/Inter fonts & all scripts.');

  // 2. Test GET /api/sync
  console.log('2. Checking GET /api/sync...');
  const syncGetRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/sync',
    method: 'GET'
  });
  if (syncGetRes.statusCode !== 200) throw new Error(`Failed GET /api/sync: ${syncGetRes.statusCode}`);
  const dbData = JSON.parse(syncGetRes.body);
  if (!dbData.profile || !dbData.inventory || !dbData.products) {
    throw new Error('Database payload structure incomplete');
  }
  if (dbData.profile.currencySymbol !== '₹') {
    throw new Error(`Expected currency symbol ₹, got: ${dbData.profile.currencySymbol}`);
  }
  if (!dbData.workspace || !dbData.workspace.workingHours) {
    throw new Error('Workspace configuration missing from database!');
  }
  console.log(`   ✓ Database contains ${dbData.inventory.length} ingredients and ${dbData.products.length} products with currency ₹.`);

  // 3. Test POST /api/sync (Cloud Persistence & Backup creation)
  console.log('3. Checking POST /api/sync (Cloud Persistence)...');
  const testPayload = JSON.stringify({
    ...dbData,
    _lastTestTimestamp: Date.now()
  });

  const syncPostRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/sync',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(testPayload)
    }
  }, testPayload);

  if (syncPostRes.statusCode !== 200) throw new Error(`Failed POST /api/sync: ${syncPostRes.statusCode}`);
  const postResult = JSON.parse(syncPostRes.body);
  if (!postResult.success) throw new Error('POST /api/sync returned success: false');
  console.log(`   ✓ POST /api/sync succeeded at ${postResult.syncedAt}.`);

  // 4. Test GET /api/backups
  console.log('4. Checking GET /api/backups (Rolling Snapshots)...');
  const backupsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/backups',
    method: 'GET'
  });
  if (backupsRes.statusCode !== 200) throw new Error(`Failed GET /api/backups: ${backupsRes.statusCode}`);
  const backupsData = JSON.parse(backupsRes.body);
  if (!Array.isArray(backupsData.backups)) throw new Error('Backups response is not an array');
  console.log(`   ✓ Server maintains ${backupsData.backups.length} rolling snapshots.`);

  // 5. Test Product Variants & Indian Ingredients
  console.log('5. Verifying Indian Market Ingredients & Variants in DB...');
  const brownies = dbData.products.find(p => p.name.includes('Brownie'));
  if (!brownies || !brownies.variants || brownies.variants.length < 2) {
    throw new Error('Brownie variants missing from database!');
  }
  console.log(`   ✓ Brownie has variants: ${brownies.variants.map(v => v.name + ' (₹' + v.price + ')').join(', ')}`);

  const compounds = dbData.inventory.filter(i => i.name.toLowerCase().includes('compound'));
  if (compounds.length < 3) {
    throw new Error('Expected at least 3 compounds (Dark, White, Milk)!');
  }
  console.log(`   ✓ Compounds verified: ${compounds.map(c => c.name).join(', ')}`);

  console.log('\n🎉 ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
}

runTests().catch(err => {
  console.error('❌ Integration test failed:', err);
  process.exit(1);
});
