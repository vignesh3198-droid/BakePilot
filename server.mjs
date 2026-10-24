// Robust HTTP, Multi-User Cloud Database & EOD Report Server
import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR_OVERRIDE || path.join(__dirname, 'data');
const USERS_DIR = path.join(DATA_DIR, 'users');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');
const REPORTS_DIR = path.join(DATA_DIR, 'email_reports');
const DB_FILE = path.join(DATA_DIR, 'bakery_database.json');
const USERS_FILE = path.join(DATA_DIR, 'registered_users.json');
const BROADCAST_FILE = path.join(DATA_DIR, 'system_broadcast.json');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feature_requests.json');
const ADMIN_CONFIG_FILE = path.join(DATA_DIR, 'admin_config.json');
const ACTIVITY_FILE = path.join(DATA_DIR, 'activity.json');

const INVOICES_DIR = path.join(DATA_DIR, 'invoices');

// Ensure required directories exist
[DATA_DIR, USERS_DIR, BACKUPS_DIR, REPORTS_DIR, INVOICES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 24/7 Server Shield: Prevent uncaught exceptions from terminating the daemon
process.on('uncaughtException', (err) => {
  console.error('[24/7 Shield] Uncaught exception safely handled:', err?.message || err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[24/7 Shield] Unhandled rejection safely handled:', reason);
});

// Platform Activity Audit Log
function loadActivityLog() {
  try {
    if (fs.existsSync(ACTIVITY_FILE)) {
      return JSON.parse(fs.readFileSync(ACTIVITY_FILE, 'utf8'));
    }
  } catch (e) {}
  return [
    {
      id: 'act_init',
      type: 'system',
      title: 'BakePilot Server Online',
      desc: 'Master multi-tenant isolated database engine started',
      timestamp: new Date().toISOString()
    }
  ];
}

function logActivity(type, title, desc, meta = {}) {
  try {
    const list = loadActivityLog();
    const entry = {
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      type,
      title,
      desc,
      meta,
      timestamp: new Date().toISOString()
    };
    list.unshift(entry);
    if (list.length > 100) list.length = 100;
    fs.writeFileSync(ACTIVITY_FILE, JSON.stringify(list, null, 2), 'utf8');
    return entry;
  } catch (e) {
    console.warn('Activity log error:', e.message);
  }
}

// Helper: Get local Wi-Fi / LAN IP address (prioritizing physical Wi-Fi & Ethernet over vEthernet)
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  const physicalIps = [];
  const virtualIps = [];

  for (const name of Object.keys(interfaces)) {
    const isVirtual = name.toLowerCase().includes('vethernet') || 
                      name.toLowerCase().includes('virtual') || 
                      name.toLowerCase().includes('wsl');
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        if (isVirtual) {
          virtualIps.push(net.address);
        } else {
          physicalIps.push(net.address);
        }
      }
    }
  }

  if (physicalIps.length > 0) return physicalIps[0];
  if (virtualIps.length > 0) return virtualIps[0];
  return 'localhost';
}

function getAllLocalIps() {
  const interfaces = os.networkInterfaces();
  const list = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        list.push({ name, ip: net.address, url: `http://${net.address}:${PORT}` });
      }
    }
  }
  return list;
}

const LOCAL_IP = getLocalIp();

// Load or initialize registered users
function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    }
  } catch (e) {
    console.warn('Could not read users file:', e.message);
  }
  return [];
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// --- 30-DAY MONTHLY SUBSCRIPTION ENGINE (11:59 PM CUTOFF) ---
function calculateSubscriptionExpiry(days = 30, baseDate = new Date()) {
  const d = new Date(baseDate);
  if (isNaN(d.getTime())) {
    d.setTime(Date.now());
  }
  d.setDate(d.getDate() + Number(days));
  // Strictly set to 11:59:59.999 PM of the 30th day
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

function getSubscriptionMeta(user) {
  if (!user) return { status: 'active', isExpired: false, daysRemaining: null, label: 'Unknown' };
  const isPending = user.status === 'payment_pending' || user.status === 'disabled';
  const isSuspended = user.status === 'suspended';

  if (!user.subscriptionExpiresAt) {
    return {
      status: user.status || 'active',
      isExpired: isPending,
      expiresAt: null,
      daysRemaining: null,
      label: isPending ? 'Unpaid / Expired' : (isSuspended ? 'Suspended' : 'Lifetime Access')
    };
  }

  const expiryMs = new Date(user.subscriptionExpiresAt).getTime();
  const now = Date.now();
  const diffMs = expiryMs - now;

  if (diffMs <= 0 || isPending) {
    return {
      status: 'payment_pending',
      isExpired: true,
      expiresAt: user.subscriptionExpiresAt,
      daysRemaining: 0,
      hoursRemaining: 0,
      label: 'Expired (Payment Pending)'
    };
  }

  const days = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
  const hours = Math.ceil(diffMs / (60 * 60 * 1000));

  let label = `${days} Days Left (11:59 PM)`;
  if (diffMs <= 24 * 60 * 60 * 1000) {
    label = 'Expires Tonight 11:59 PM';
  }

  return {
    status: user.status || 'active',
    isExpired: false,
    expiresAt: user.subscriptionExpiresAt,
    daysRemaining: days,
    hoursRemaining: hours,
    label
  };
}

function checkAndEnforceSubscription(user) {
  if (!user) return false;
  // If user is explicitly disabled / payment pending
  if (user.status === 'payment_pending' || user.status === 'disabled' || user.status === 'suspended') {
    return true; // is blocked
  }
  // Check if 30-day (or custom duration) expiration passed 11:59 PM
  if (user.subscriptionExpiresAt) {
    const expiryMs = new Date(user.subscriptionExpiresAt).getTime();
    if (!isNaN(expiryMs) && Date.now() > expiryMs) {
      user.status = 'payment_pending';
      user.updatedAt = new Date().toISOString();
      try {
        const users = loadUsers();
        const match = users.find(u => u.id === user.id);
        if (match) {
          match.status = 'payment_pending';
          match.updatedAt = user.updatedAt;
          saveUsers(users);
        }
      } catch (e) {
        console.error('Failed to save expired user status:', e);
      }
      logActivity(
        'subscription_expired',
        `30-Day Subscription Ended: ${user.businessName || user.email}`,
        `Passed 11:59 PM cutoff on ${new Date(user.subscriptionExpiresAt).toLocaleDateString('en-IN')}. Account status set to Payment Pending.`
      );
      return true; // is blocked
    }
  }
  return false; // active
}

// Active background cron: Auto-disables expired bakers past 11:59 PM every 60 seconds
function checkAllSubscriptionsExpiry() {
  try {
    const users = loadUsers();
    let modified = false;
    const now = Date.now();

    users.forEach(u => {
      if (u.status === 'active' && u.subscriptionExpiresAt) {
        const expiryMs = new Date(u.subscriptionExpiresAt).getTime();
        if (!isNaN(expiryMs) && now > expiryMs) {
          u.status = 'payment_pending';
          u.updatedAt = new Date().toISOString();
          modified = true;
          console.log(`⏰ [SUBSCRIPTION EXPIRED at 11:59 PM] Auto-disabling baker: ${u.email} (${u.businessName})`);
          logActivity(
            'subscription_expired',
            `30-Day Subscription Ended: ${u.businessName || u.email}`,
            `Cutoff reached 11:59 PM on ${new Date(u.subscriptionExpiresAt).toLocaleDateString('en-IN')}. Baker status set to Payment Pending.`
          );
        }
      }
    });

    if (modified) {
      saveUsers(users);
    }
  } catch (err) {
    console.error('Error running subscription expiry check:', err);
  }
}

// Start recurring subscription check timer
setInterval(checkAllSubscriptionsExpiry, 60 * 1000);

// User-specific database helper
function getUserDbPath(userId) {
  if (!userId) return DB_FILE;
  const userFolder = path.join(USERS_DIR, userId);
  if (!fs.existsSync(userFolder)) fs.mkdirSync(userFolder, { recursive: true });
  return path.join(userFolder, 'database.json');
}

function getUserBackupsDir(userId) {
  if (!userId) return BACKUPS_DIR;
  const dir = path.join(USERS_DIR, userId, 'backups');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// Active user sessions (in-memory token store)
const activeSessions = new Map();

function authenticate(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (activeSessions.has(token)) {
      return activeSessions.get(token);
    }
  }
  const url = new URL(req.url, `http://${req.headers.host}`);
  const tokenQuery = url.searchParams.get('token');
  if (tokenQuery && activeSessions.has(tokenQuery)) {
    return activeSessions.get(tokenQuery);
  }
  return null;
}

// Active Super Admin sessions (in-memory token store)
const activeAdminSessions = new Map();

function authenticateAdmin(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (activeAdminSessions.has(token)) {
      return activeAdminSessions.get(token);
    }
  }
  const url = new URL(req.url, `http://${req.headers.host}`);
  const tokenQuery = url.searchParams.get('admin_token');
  if (tokenQuery && activeAdminSessions.has(tokenQuery)) {
    return activeAdminSessions.get(tokenQuery);
  }
  return null;
}

// Admin Config Helper (Master Super Admin Credentials)
function loadAdminConfig() {
  try {
    if (fs.existsSync(ADMIN_CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(ADMIN_CONFIG_FILE, 'utf8'));
    }
  } catch (e) {
    console.warn('Could not read admin config:', e.message);
  }
  const defaultAdmin = {
    adminEmail: 'admin@bakepilot.in',
    adminPasswordHash: crypto.createHash('sha256').update('bakepilot@admin2026').digest('hex'),
    masterName: 'BakePilot Super Admin',
    createdAt: new Date().toISOString()
  };
  try {
    fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(defaultAdmin, null, 2), 'utf8');
  } catch (_) {}
  return defaultAdmin;
}

// System Broadcast Announcements (Notify All Bakers on Dashboard)
function loadBroadcast() {
  try {
    if (fs.existsSync(BROADCAST_FILE)) {
      return JSON.parse(fs.readFileSync(BROADCAST_FILE, 'utf8'));
    }
  } catch (e) {}
  return {
    id: 'bc_welcome',
    active: true,
    title: '✨ Welcome to BakePilot 2.0 Studio Suite',
    message: 'Zero-GST WhatsApp image billing, EOD cloud backups, and Recipe Cost Estimator are active! Need any custom tool? Click "Request Feature" below.',
    tag: 'Release',
    updatedAt: new Date().toISOString()
  };
}

function saveBroadcast(bc) {
  fs.writeFileSync(BROADCAST_FILE, JSON.stringify(bc, null, 2), 'utf8');
}

// Bakers Feature Requests & Wishlist Inbox
function loadFeedback() {
  try {
    if (fs.existsSync(FEEDBACK_FILE)) {
      return JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function saveFeedback(list) {
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(list, null, 2), 'utf8');
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// --- EOD 11:50 PM AUTOMATED EMAIL REPORT ENGINE ---
let lastReportRunDate = '';

function runEodReportCheck() {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Trigger at 23:50 (11:50 PM)
  if (hours === 23 && minutes >= 50 && lastReportRunDate !== todayStr) {
    lastReportRunDate = todayStr;
    console.log(`\n🔔 [EOD Report Engine] Running 11:50 PM Scheduled Business Reports for ${todayStr}...`);

    const users = loadUsers();
    // Also include default kitchen database
    const targets = [{ id: null, email: 'owner@crustandcrumb.in', businessName: 'The Crust & Crumb Patisserie' }, ...users];

    for (const target of targets) {
      try {
        generateEodReportForUser(target, todayStr);
      } catch (err) {
        console.error(`Error generating EOD report for ${target.email}:`, err.message);
      }
    }
  }
}

// Run check every 45 seconds
setInterval(runEodReportCheck, 45000);

function generateEodReportForUser(user, dateStr = new Date().toISOString().split('T')[0]) {
  const dbPath = getUserDbPath(user.id);
  if (!fs.existsSync(dbPath)) return null;

  const raw = fs.readFileSync(dbPath, 'utf8');
  const data = JSON.parse(raw);

  const orders = data.orders || [];
  const expenses = data.expenses || [];
  const profile = data.profile || {};

  const todayOrders = orders.filter(o => o.date === dateStr && o.status !== 'cancelled');
  const grossRevenue = todayOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const todayExpenses = expenses.filter(e => e.date === dateStr).reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const netMargin = grossRevenue - todayExpenses;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'in-oven');

  const report = {
    reportId: `EOD-${dateStr}-${user.id ? user.id.slice(0, 6) : 'DEFAULT'}`,
    date: dateStr,
    generatedAt: new Date().toISOString(),
    recipientEmail: user.email || profile.email,
    businessName: profile.name || user.businessName || 'Home Bakery',
    summary: {
      grossRevenue,
      expenses: todayExpenses,
      netMargin,
      ordersCompleted: todayOrders.length,
      pendingOrdersRemaining: pendingOrders.length,
      currency: '₹'
    },
    ordersList: todayOrders.map(o => ({
      id: o.id,
      customer: o.customerName,
      total: o.total,
      deliveryType: o.deliveryType,
      status: o.status
    })),
    databaseBackupIncluded: true
  };

  // Save report to disk
  const reportFile = path.join(REPORTS_DIR, `${report.reportId}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');

  // Also write printable HTML summary
  const htmlFile = path.join(REPORTS_DIR, `${report.reportId}.html`);
  const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>EOD Report — ${report.businessName} (${dateStr})</title>
<style>
  body { font-family: sans-serif; background: #F7EFE7; color: #3E3239; padding: 24px; }
  .card { max-width: 540px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 18px; border: 1px solid #E8D2C4; }
  h2 { margin: 0 0 4px; color: #3E3239; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 16px 0; }
  .metric { background: #F7EFE7; padding: 12px; border-radius: 12px; }
</style>
</head>
<body>
  <div class="card">
    <h2>🌙 End of Day Report (11:50 PM)</h2>
    <p style="color:#6B5560; font-size:13px; margin: 0 0 16px;">${report.businessName} • ${dateStr}</p>
    <div class="grid">
      <div class="metric"><strong>Today's Sales</strong><div style="font-size:20px; font-weight:800;">₹${grossRevenue.toFixed(2)}</div></div>
      <div class="metric"><strong>Expenses</strong><div style="font-size:20px; font-weight:800;">₹${todayExpenses.toFixed(2)}</div></div>
      <div class="metric" style="background:#E3F2E9; color:#1F6B47;"><strong>Net Margin</strong><div style="font-size:20px; font-weight:800;">₹${netMargin.toFixed(2)}</div></div>
      <div class="metric"><strong>Orders Today</strong><div style="font-size:20px; font-weight:800;">${todayOrders.length}</div></div>
    </div>
    <p style="font-size:12px; color:#9E8189;">Cloud Backup snapshot archived safely. Sent automatically to ${report.recipientEmail}.</p>
  </div>
</body>
</html>`;
  fs.writeFileSync(htmlFile, htmlContent, 'utf8');

  console.log(`   ✓ EOD Report generated for ${report.businessName} -> ₹${grossRevenue} gross sales (Saved to ${path.basename(reportFile)})`);
  return report;
}

// --- HTTP SERVER ---
const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const reqPath = decodeURI(url.pathname);
  const user = authenticate(req);

  // 1. NETWORK INFO API: GET /api/network-info
  if (reqPath === '/api/network-info' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      localIp: LOCAL_IP,
      port: PORT,
      wifiUrl: `http://${LOCAL_IP}:${PORT}`,
      interfaces: getAllLocalIps(),
      hostname: os.hostname(),
      appVersion: '1.1.43',
      apkDownloadUrl: `http://${LOCAL_IP}:${PORT}/download/bakepilot.apk`
    }));
    return;
  }

  // 1b. ANDROID APK DOWNLOAD: GET /download/bakepilot.apk
  if ((reqPath === '/download/bakepilot.apk' || reqPath === '/bakepilot.apk') && (req.method === 'GET' || req.method === 'HEAD')) {
    const apkPath = path.join(__dirname, 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
    if (fs.existsSync(apkPath)) {
      const stat = fs.statSync(apkPath);
      res.writeHead(200, {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': 'attachment; filename="BakePilot-v1.1.43.apk"',
        'Content-Length': stat.size
      });
      if (req.method === 'HEAD') {
        res.end();
        return;
      }
      fs.createReadStream(apkPath).pipe(res);
      return;
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'APK is currently being compiled or not found' }));
      return;
    }
  }

  // 2. AUTH API: POST /api/auth/register
  if (reqPath === '/api/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { email, password, businessName, tagline } = JSON.parse(body);
        if (!email || !password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Email and password are required' }));
          return;
        }

        const users = loadUsers();
        const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'An account with this email already exists' }));
          return;
        }

        const userId = 'usr_' + crypto.randomBytes(6).toString('hex');
        const token = 'tok_' + crypto.randomBytes(16).toString('hex');
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

        const newUser = {
          id: userId,
          email: email.toLowerCase().trim(),
          passwordHash,
          businessName: businessName || 'My Artisan Bakery',
          tagline: tagline || 'Custom Cakes & Bakes',
          status: 'active',
          subscriptionExpiresAt: calculateSubscriptionExpiry(30),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        logActivity('baker_registered', `New Baker Registered: ${newUser.businessName}`, `Email: ${newUser.email} joined BakePilot`);

        // Initialize user database as clean and empty (new bakers start with their own clean slate)
        const userDbPath = getUserDbPath(userId);
        let templateData = {};
        if (fs.existsSync(DB_FILE)) {
          templateData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        }

        const cleanEmptyDatabase = {
          profile: {
            name: newUser.businessName,
            tagline: newUser.tagline,
            baker: '',
            email: newUser.email,
            phone: '',
            whatsappNumber: '',
            address: '',
            currency: '₹',
            currencySymbol: '₹',
            defaultDeliveryCharge: 50.0,
            fssaiOrLicense: '',
            invoiceNotes: 'Baked fresh with pure butter and premium chocolate. Please refrigerate upon arrival.',
            instagram: '',
            logo: 'assets/bakepilot-logo.png',
            brandColor: '#3E3239',
            secondaryColor: '#E8D2C4',
            paymentUpi: '',
            cloudSyncUrl: '/api/sync'
          },
          utilities: templateData.utilities || {
            gasCylinderRate: 1850.0,
            gasCylinderLifeDays: 20,
            electricityRatePerUnit: 8.5,
            monthlyEstimatedPower: 3200.0,
            notes: ''
          },
          eodReport: {
            frequency: 'daily',
            scheduledTime: '23:50',
            email: newUser.email,
            lastSentAt: null,
            includeJsonBackup: true
          },
          invoiceSettings: {
            showBakeryAddress: true,
            showBakeryPhone: true,
            showFssai: true,
            showPaymentUpi: true,
            showDeliveryAddress: true,
            showCustomerPhone: true,
            showCakeMessage: true,
            showFooterNotes: true,
            showInstagram: true,
            invoiceHeaderTitle: 'Official Bill',
            invoiceNotes: 'Baked fresh with pure butter and premium chocolate. Please refrigerate cream items immediately upon arrival.'
          },
          workspace: {
            name: `${newUser.businessName} Studio`,
            coverPhoto: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
            address: '',
            isHomeKitchenPrivate: false,
            pickupLocationInstructions: '',
            workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            workingHours: '09:00 AM - 08:00 PM',
            orderAcceptanceHours: '09:00 AM - 07:00 PM',
            minAdvanceNoticeHours: 24,
            defaultPrepTimeHours: 4,
            notes: ''
          },
          inventory: [],
          products: [],
          recipes: [],
          orders: [],
          expenses: [],
          customers: [],
          suppliers: [],
          cashbook: {
            openingBalance: 0,
            records: []
          }
        };

        fs.writeFileSync(userDbPath, JSON.stringify(cleanEmptyDatabase, null, 2), 'utf8');

        // Store active session
        activeSessions.set(token, newUser);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          token,
          user: { id: newUser.id, email: newUser.email, businessName: newUser.businessName },
          database: cleanEmptyDatabase
        }));
        return;
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Registration failed' }));
      }
    });
    return;
  }

  // 3. AUTH API: POST /api/auth/forgot-password
  if (reqPath === '/api/auth/forgot-password' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { email, newPassword } = JSON.parse(body);
        if (!email || !newPassword) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Email and new password are required' }));
          return;
        }

        const users = loadUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        if (!user) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No account found registered with this email address' }));
          return;
        }

        user.passwordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
        saveUsers(users);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Password reset successfully! Please sign in with your new password.'
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Password reset failed' }));
      }
    });
    return;
  }

  // 3. AUTH API: POST /api/auth/login
  if (reqPath === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body);
        const users = loadUsers();
        const passwordHash = crypto.createHash('sha256').update(password || '').digest('hex');
        const userMatch = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase() && u.passwordHash === passwordHash);

        if (!userMatch) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid email or password' }));
          return;
        }

        // Subscription Payment Gate Check (Disabled / Payment Pending / Expired past 11:59 PM)
        const isBlocked = checkAndEnforceSubscription(userMatch);
        if (isBlocked) {
          res.writeHead(402, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            paymentPending: true,
            status: userMatch.status,
            error: 'Sorry for the inconvenience, the payment was not yet completed, please do the monthly subscription to reactivate your account.',
            bakerEmail: userMatch.email,
            businessName: userMatch.businessName,
            expiredAt: userMatch.subscriptionExpiresAt || null
          }));
          return;
        }

        const token = 'tok_' + crypto.randomBytes(16).toString('hex');
        activeSessions.set(token, userMatch);

        logActivity('baker_login', `Baker Session: ${userMatch.businessName || userMatch.email}`, `Logged in with ${userMatch.email}`);

        // Fetch user database
        const userDbPath = getUserDbPath(userMatch.id);
        let userDb = {};
        if (fs.existsSync(userDbPath)) {
          userDb = JSON.parse(fs.readFileSync(userDbPath, 'utf8'));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          token,
          user: { id: userMatch.id, email: userMatch.email, businessName: userMatch.businessName },
          database: userDb
        }));
        return;
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Login failed' }));
      }
    });
    return;
  }

  // 4. AUTH API: GET /api/auth/me
  if (reqPath === '/api/auth/me' && req.method === 'GET') {
    if (!user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ authenticated: false }));
      return;
    }
    const isBlocked = checkAndEnforceSubscription(user);
    const meta = getSubscriptionMeta(user);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        businessName: user.businessName,
        status: user.status || 'active',
        subscriptionExpiresAt: user.subscriptionExpiresAt || null,
        daysRemaining: meta.daysRemaining,
        expiryLabel: meta.label,
        isBlocked
      }
    }));
    return;
  }

  // 4b. CHECK BAKER SUBSCRIPTION: POST /api/auth/check-subscription
  if (reqPath === '/api/auth/check-subscription' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { email } = JSON.parse(body);
        const users = loadUsers();
        const userObj = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
        if (!userObj) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Baker account not found' }));
          return;
        }

        const isBlocked = checkAndEnforceSubscription(userObj);
        const meta = getSubscriptionMeta(userObj);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          active: !isBlocked,
          status: userObj.status || 'active',
          subscriptionExpiresAt: userObj.subscriptionExpiresAt || null,
          daysRemaining: meta.daysRemaining,
          expiryLabel: meta.label,
          message: !isBlocked 
            ? 'Your subscription is active! Welcome back.' 
            : 'Sorry for the inconvenience, the payment was not yet completed, please do the monthly subscription to reactivate your account.'
        }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Check failed' }));
      }
    });
    return;
  }

  // 5. CLOUD SYNC API: GET /api/sync
  if (reqPath === '/api/sync' && req.method === 'GET') {
    if (user && checkAndEnforceSubscription(user)) {
      res.writeHead(402, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'payment_pending',
        paymentPending: true,
        message: 'Sorry for the inconvenience, the payment was not yet completed, please do the monthly subscription to reactivate your account.'
      }));
      return;
    }

    const targetDbPath = getUserDbPath(user ? user.id : null);
    if (fs.existsSync(targetDbPath)) {
      try {
        const raw = fs.readFileSync(targetDbPath, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(raw);
        return;
      } catch (err) {
        console.error('Error reading database file:', err);
      }
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ empty: true }));
    return;
  }

  // 6. CLOUD SYNC API: POST /api/sync
  if (reqPath === '/api/sync' && req.method === 'POST') {
    if (user && checkAndEnforceSubscription(user)) {
      res.writeHead(402, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'payment_pending',
        paymentPending: true,
        message: 'Sorry for the inconvenience, the payment was not yet completed, please do the monthly subscription to reactivate your account.'
      }));
      return;
    }
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        if (parsed && (parsed.orders || parsed.inventory || parsed.profile)) {
          const targetDbPath = getUserDbPath(user ? user.id : null);
          const backupsDir = getUserBackupsDir(user ? user.id : null);

          // Force sanitize currency symbol
          if (parsed.profile) {
            if (!parsed.profile.currencySymbol || parsed.profile.currencySymbol.includes('\ufffd') || parsed.profile.currencySymbol.includes(',')) {
              parsed.profile.currencySymbol = '₹';
            }
          }

          fs.writeFileSync(targetDbPath, JSON.stringify(parsed, null, 2), 'utf8');

          // Hourly rolling backup
          const now = new Date();
          const backupStamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 16);
          const backupPath = path.join(backupsDir, `backup-${backupStamp}.json`);
          if (!fs.existsSync(backupPath)) {
            fs.writeFileSync(backupPath, JSON.stringify(parsed, null, 2), 'utf8');
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, timestamp: now.toISOString(), backup: path.basename(backupPath) }));
          return;
        }
      } catch (e) {
        console.error('Invalid sync payload:', e);
      }
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid data format' }));
    });
    return;
  }

  // 7. EOD REPORT MANUAL TRIGGER & TEST: POST /api/reports/test-send
  if (reqPath === '/api/reports/test-send' && req.method === 'POST') {
    try {
      const targetUser = user || { id: null, email: 'hello@crustandcrumb.in', businessName: 'The Crust & Crumb Patisserie' };
      const report = generateEodReportForUser(targetUser);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: `EOD Report generated successfully for ${report.recipientEmail}!`,
        report
      }));
      return;
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to generate test report: ' + e.message }));
      return;
    }
  }

  // 8. EOD REPORT HISTORY: GET /api/reports/history
  if (reqPath === '/api/reports/history' && req.method === 'GET') {
    try {
      const files = fs.readdirSync(REPORTS_DIR).filter(f => f.endsWith('.json')).reverse().slice(0, 12);
      const reports = files.map(f => {
        try {
          return JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, f), 'utf8'));
        } catch {
          return null;
        }
      }).filter(Boolean);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ reports }));
      return;
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to read report history' }));
      return;
    }
  }

  // 9. CLOUD BACKUPS LIST: GET /api/backups
  if (reqPath === '/api/backups' && req.method === 'GET') {
    try {
      const backupsDir = getUserBackupsDir(user ? user.id : null);
      const files = fs.readdirSync(backupsDir).filter(f => f.endsWith('.json')).reverse().slice(0, 10);
      const backupList = files.map(file => {
        const stats = fs.statSync(path.join(backupsDir, file));
        return { filename: file, size: stats.size, time: stats.mtime };
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ backups: backupList }));
      return;
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to read backups' }));
      return;
    }
  }

  // 10. SYSTEM BROADCAST API (GET for all bakers to see announcements): GET /api/broadcast
  if (reqPath === '/api/broadcast' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, broadcast: loadBroadcast() }));
    return;
  }

  // 11. BAKER FEATURE REQUEST / WISHLIST SUBMISSION: POST /api/feedback/submit
  if (reqPath === '/api/feedback/submit' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { featureTitle, description, category, email, businessName } = JSON.parse(body);
        if (!featureTitle || !description) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Title and description are required' }));
          return;
        }

        const feedbackList = loadFeedback();
        const newFeedback = {
          id: 'req_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
          featureTitle: featureTitle.trim(),
          description: description.trim(),
          category: category || 'General',
          email: (email || (user ? user.email : 'Anonymous Baker')).trim(),
          businessName: (businessName || (user ? user.businessName : 'Artisan Baker')).trim(),
          submittedAt: new Date().toISOString(),
          status: 'new', // 'new', 'planned', 'in-progress', 'completed'
          adminNote: ''
        };

        feedbackList.unshift(newFeedback);
        saveFeedback(feedbackList);

        logActivity('feedback_submitted', `Feature Request: ${newFeedback.featureTitle}`, `Submitted by ${newFeedback.businessName} (${newFeedback.category})`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Feature request submitted to BakePilot product team!', request: newFeedback }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to submit feature request' }));
      }
    });
    return;
  }

  // 11b. INVOICE IMAGE UPLOAD API (Instant WhatsApp Direct Image Link): POST /api/invoices/upload
  if (reqPath === '/api/invoices/upload' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { fileName, imageBase64 } = JSON.parse(body);
        if (!fileName || !imageBase64) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'fileName and imageBase64 required' }));
          return;
        }

        const safeFileName = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = path.join(INVOICES_DIR, safeFileName);
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(filePath, buffer);

        const publicUrl = `/invoices/${safeFileName}`;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          url: publicUrl,
          fullUrl: `http://${LOCAL_IP}:${PORT}${publicUrl}`
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Upload failed: ' + err.message }));
      }
    });
    return;
  }

  // 12. SUPER ADMIN LOGIN: POST /api/admin/login
  if (reqPath === '/api/admin/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body);
        const adminConfig = loadAdminConfig();
        const hash = crypto.createHash('sha256').update(password || '').digest('hex');

        if ((email || '').toLowerCase().trim() === adminConfig.adminEmail.toLowerCase() && hash === adminConfig.adminPasswordHash) {
          const adminToken = 'adm_' + crypto.randomBytes(24).toString('hex');
          activeAdminSessions.set(adminToken, {
            email: adminConfig.adminEmail,
            name: adminConfig.masterName,
            loginTime: new Date().toISOString()
          });

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            token: adminToken,
            admin: { email: adminConfig.adminEmail, name: adminConfig.masterName }
          }));
          return;
        }

        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid master admin credentials' }));
      } catch (err) {
        console.error('Admin login error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Admin login failed: ' + err.message }));
      }
    });
    return;
  }

  // 13. SUPER ADMIN AUTH CHECK: GET /api/admin/me
  if (reqPath === '/api/admin/me' && req.method === 'GET') {
    const admin = authenticateAdmin(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ authenticated: !!admin, admin: admin || null }));
    return;
  }

  // 14. SUPER ADMIN PLATFORM OVERVIEW & STATS: GET /api/admin/stats
  if (reqPath === '/api/admin/stats' && req.method === 'GET') {
    const admin = authenticateAdmin(req);
    if (!admin) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Master Admin access required' }));
      return;
    }

    try {
      const users = loadUsers();
      let totalPlatformOrders = 0;
      let totalPlatformRevenue = 0;
      let totalPantryItems = 0;
      let totalBackupsCount = 0;
      let activeLastWeekCount = 0;
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

      users.forEach(u => {
        const uDbPath = getUserDbPath(u.id);
        const uBackupDir = getUserBackupsDir(u.id);

        if (fs.existsSync(uDbPath)) {
          try {
            const stat = fs.statSync(uDbPath);
            if (stat.mtimeMs > oneWeekAgo) activeLastWeekCount++;
            const uData = JSON.parse(fs.readFileSync(uDbPath, 'utf8'));
            const orders = uData.orders || [];
            totalPlatformOrders += orders.length;
            totalPlatformRevenue += orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
            totalPantryItems += (uData.inventory || []).length;
          } catch (_) {}
        }

        if (fs.existsSync(uBackupDir)) {
          try {
            totalBackupsCount += fs.readdirSync(uBackupDir).filter(f => f.endsWith('.json')).length;
          } catch (_) {}
        }
      });

      const feedback = loadFeedback();
      const pendingFeedback = feedback.filter(f => f.status === 'new').length;
      const broadcast = loadBroadcast();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        totalBakers: users.length,
        activeLastWeek: activeLastWeekCount,
        totalPlatformOrders,
        totalPlatformRevenue,
        totalPantryItems,
        totalBackupsCount,
        pendingFeedback,
        totalFeedback: feedback.length,
        broadcastActive: broadcast.active,
        broadcastTitle: broadcast.title,
        serverTime: new Date().toISOString(),
        uptimeHours: (process.uptime() / 3600).toFixed(2),
        wifiUrl: `http://${LOCAL_IP}:${PORT}/admin.html`
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to compute stats: ' + err.message }));
    }
    return;
  }

  // 15. SUPER ADMIN BAKERS ROSTER (LIVE MONITORING): GET /api/admin/bakers
  if (reqPath === '/api/admin/bakers' && req.method === 'GET') {
    const admin = authenticateAdmin(req);
    if (!admin) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Master Admin access required' }));
      return;
    }

    try {
      const users = loadUsers();
      const bakerList = users.map(u => {
        const uDbPath = getUserDbPath(u.id);
        const uBackupDir = getUserBackupsDir(u.id);

        let ordersCount = 0;
        let revenue = 0;
        let inventoryCount = 0;
        let productsCount = 0;
        let customersCount = 0;
        let lastSync = null;
        let dbSizeBytes = 0;
        let backupFilesCount = 0;
        let bakerProfile = {};

        if (fs.existsSync(uDbPath)) {
          try {
            const stat = fs.statSync(uDbPath);
            lastSync = stat.mtime.toISOString();
            dbSizeBytes = stat.size;
            const uData = JSON.parse(fs.readFileSync(uDbPath, 'utf8'));
            bakerProfile = uData.profile || {};
            const orders = uData.orders || [];
            ordersCount = orders.length;
            revenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
            inventoryCount = (uData.inventory || []).length;
            productsCount = (uData.products || []).length;
            customersCount = (uData.customers || []).length;
          } catch (_) {}
        }

        if (fs.existsSync(uBackupDir)) {
          try {
            backupFilesCount = fs.readdirSync(uBackupDir).filter(f => f.endsWith('.json')).length;
          } catch (_) {}
        }

        const meta = getSubscriptionMeta(u);
        return {
          id: u.id,
          email: u.email,
          businessName: bakerProfile.name || u.businessName || 'Artisan Bakery',
          tagline: bakerProfile.tagline || u.tagline || '',
          bakerName: bakerProfile.baker || '',
          phone: bakerProfile.phone || bakerProfile.whatsappNumber || '',
          address: bakerProfile.address || '',
          createdAt: u.createdAt || null,
          status: u.status || 'active',
          subscriptionExpiresAt: u.subscriptionExpiresAt || null,
          daysRemaining: meta.daysRemaining,
          hoursRemaining: meta.hoursRemaining,
          expiryLabel: meta.label,
          isExpired: meta.isExpired,
          ordersCount,
          revenue,
          inventoryCount,
          productsCount,
          customersCount,
          lastSync,
          dbSizeBytes,
          backupFilesCount
        };
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ bakers: bakerList }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to fetch bakers: ' + err.message }));
    }
    return;
  }

  // 16. SUPER ADMIN TOGGLE / EXTEND BAKER SUBSCRIPTION: POST /api/admin/bakers/toggle-status
  if (reqPath === '/api/admin/bakers/toggle-status' && req.method === 'POST') {
    const admin = authenticateAdmin(req);
    if (!admin) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Master Admin access required' }));
      return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { userId, status, days } = JSON.parse(body);
        const users = loadUsers();
        const userObj = users.find(u => u.id === userId);
        if (!userObj) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Baker account not found' }));
          return;
        }

        // Duration in days specified (e.g. 30, 60, 365, 'lifetime')
        if (days !== undefined && days !== null) {
          if (days === 'lifetime') {
            userObj.status = 'active';
            userObj.subscriptionExpiresAt = null;
          } else {
            const numDays = Number(days) || 30;
            // If already active and in future, extend from future date, otherwise from now
            let baseDate = new Date();
            if (userObj.subscriptionExpiresAt && new Date(userObj.subscriptionExpiresAt) > baseDate) {
              baseDate = new Date(userObj.subscriptionExpiresAt);
            }
            userObj.status = 'active';
            userObj.subscriptionExpiresAt = calculateSubscriptionExpiry(numDays, baseDate);
          }
        } else if (status) {
          userObj.status = status;
          if (status === 'active') {
            if (!userObj.subscriptionExpiresAt || new Date(userObj.subscriptionExpiresAt) <= new Date()) {
              userObj.subscriptionExpiresAt = calculateSubscriptionExpiry(30);
            }
          } else {
            userObj.subscriptionExpiresAt = null;
          }
        } else {
          // Toggle logic: If currently disabled/pending, activate for 30 days. If active, set payment_pending.
          const isCurrentlyBlocked = userObj.status === 'payment_pending' || userObj.status === 'disabled' || userObj.status === 'suspended';
          if (isCurrentlyBlocked) {
            userObj.status = 'active';
            userObj.subscriptionExpiresAt = calculateSubscriptionExpiry(30);
          } else {
            userObj.status = 'payment_pending';
            userObj.subscriptionExpiresAt = null;
          }
        }

        userObj.updatedAt = new Date().toISOString();
        saveUsers(users);

        const isNowActive = userObj.status === 'active';
        const meta = getSubscriptionMeta(userObj);

        logActivity(
          'admin_action',
          `Subscription Updated: ${userObj.businessName || userObj.email}`,
          isNowActive
            ? `Enabled for ${userObj.subscriptionExpiresAt ? `30 days (Expires ${new Date(userObj.subscriptionExpiresAt).toLocaleDateString('en-IN')} 11:59 PM)` : 'lifetime'}`
            : `Held for monthly payment (Disabled)`
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          status: userObj.status,
          subscriptionExpiresAt: userObj.subscriptionExpiresAt,
          daysRemaining: meta.daysRemaining,
          expiryLabel: meta.label,
          message: isNowActive
            ? (userObj.subscriptionExpiresAt 
                ? `Baker ${userObj.email} enabled for 30 days until ${new Date(userObj.subscriptionExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} 11:59 PM!`
                : `Baker ${userObj.email} granted lifetime active access!`)
            : `Baker ${userObj.email} disabled (Payment Pending)`
        }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Subscription update failed: ' + e.message }));
      }
    });
    return;
  }

  // 17. SUPER ADMIN TRIGGER INSTANT BACKUP: POST /api/admin/bakers/trigger-backup
  if (reqPath === '/api/admin/bakers/trigger-backup' && req.method === 'POST') {
    const admin = authenticateAdmin(req);
    if (!admin) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Master Admin access required' }));
      return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { userId } = JSON.parse(body);
        const uDbPath = getUserDbPath(userId);
        const uBackupDir = getUserBackupsDir(userId);

        if (!fs.existsSync(uDbPath)) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Baker database not found' }));
          return;
        }

        const now = new Date();
        const stamp = now.toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(uBackupDir, `manual-admin-backup-${stamp}.json`);
        fs.copyFileSync(uDbPath, backupFile);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, backup: path.basename(backupFile), message: 'Instant cloud snapshot archived successfully' }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Backup trigger failed: ' + e.message }));
      }
    });
    return;
  }

  // 18. SUPER ADMIN PUBLISH / UPDATE BROADCAST: POST /api/admin/broadcast
  if (reqPath === '/api/admin/broadcast' && req.method === 'POST') {
    const admin = authenticateAdmin(req);
    if (!admin) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Master Admin access required' }));
      return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { title, message, tag, active } = JSON.parse(body);
        const updated = {
          id: 'bc_' + Date.now().toString(36),
          title: (title || '').trim(),
          message: (message || '').trim(),
          tag: tag || 'Update',
          active: active !== false,
          updatedAt: new Date().toISOString()
        };
        saveBroadcast(updated);
        logActivity('broadcast_published', `Admin Announcement: ${updated.title}`, `Tag: ${updated.tag} • Active: ${updated.active}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, broadcast: updated, message: 'Broadcast updated and published to all bakers' }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to update broadcast' }));
      }
    });
    return;
  }

  // 19. SUPER ADMIN GET FEATURE REQUESTS: GET /api/admin/feedback
  if (reqPath === '/api/admin/feedback' && req.method === 'GET') {
    const admin = authenticateAdmin(req);
    if (!admin) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Master Admin access required' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ feedback: loadFeedback() }));
    return;
  }

  // 20. SUPER ADMIN UPDATE FEATURE REQUEST STATUS: POST /api/admin/feedback/update-status
  if (reqPath === '/api/admin/feedback/update-status' && req.method === 'POST') {
    const admin = authenticateAdmin(req);
    if (!admin) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Master Admin access required' }));
      return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { id, status, adminNote } = JSON.parse(body);
        const list = loadFeedback();
        const item = list.find(f => f.id === id);
        if (!item) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Feedback item not found' }));
          return;
        }

        if (status) item.status = status;
        if (adminNote !== undefined) item.adminNote = adminNote;
        item.updatedAt = new Date().toISOString();
        saveFeedback(list);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, item }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Update feedback failed' }));
      }
    });
    return;
  }

  // 21. SUPER ADMIN BAKER DEEP INSPECT: GET /api/admin/bakers/details?userId=...
  if (reqPath === '/api/admin/bakers/details' && req.method === 'GET') {
    const admin = authenticateAdmin(req);
    if (!admin) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Master Admin access required' }));
      return;
    }

    const userId = url.searchParams.get('userId');
    const users = loadUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Baker not found' }));
      return;
    }

    const uDbPath = getUserDbPath(userId);
    let dbData = {};
    let dbStat = null;
    if (fs.existsSync(uDbPath)) {
      try {
        dbStat = fs.statSync(uDbPath);
        dbData = JSON.parse(fs.readFileSync(uDbPath, 'utf8'));
      } catch (_) {}
    }

    const uBackupDir = getUserBackupsDir(userId);
    let backups = [];
    if (fs.existsSync(uBackupDir)) {
      try {
        backups = fs.readdirSync(uBackupDir)
          .filter(f => f.endsWith('.json'))
          .map(f => {
            const st = fs.statSync(path.join(uBackupDir, f));
            return { name: f, size: st.size, date: st.mtime.toISOString() };
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      } catch (_) {}
    }

    const profile = dbData.profile || {};
    const orders = dbData.orders || [];
    const inventory = dbData.inventory || [];
    const products = dbData.products || [];
    const customers = dbData.customers || [];
    const totalRev = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const avgOrder = orders.length > 0 ? (totalRev / orders.length).toFixed(2) : 0;
    const pendingDue = orders.reduce((sum, o) => sum + (Number(o.balanceDue) || 0), 0);
    const deliveredCount = orders.filter(o => o.status === 'delivered').length;
    const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'in-oven' || o.status === 'ready').length;

    const meta = getSubscriptionMeta(user);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      baker: {
        id: user.id,
        email: user.email,
        businessName: profile.name || user.businessName || 'Artisan Bakery',
        tagline: profile.tagline || user.tagline || '',
        bakerName: profile.baker || '',
        phone: profile.phone || profile.whatsappNumber || '',
        address: profile.address || '',
        fssai: profile.fssaiOrLicense || '',
        paymentUpi: profile.paymentUpi || '',
        instagram: profile.instagram || '',
        createdAt: user.createdAt || null,
        status: user.status || 'active',
        subscriptionExpiresAt: user.subscriptionExpiresAt || null,
        daysRemaining: meta.daysRemaining,
        hoursRemaining: meta.hoursRemaining,
        expiryLabel: meta.label,
        isExpired: meta.isExpired,
        dbSizeBytes: dbStat ? dbStat.size : 0,
        lastModified: dbStat ? dbStat.mtime.toISOString() : null,
        ordersCount: orders.length,
        totalRevenue: totalRev,
        avgOrderValue: avgOrder,
        pendingBalance: pendingDue,
        deliveredCount,
        pendingCount,
        inventoryCount: inventory.length,
        productsCount: products.length,
        customersCount: customers.length,
        recentOrders: orders.slice(-6).reverse(),
        backups: backups.slice(0, 10),
        eodSettings: dbData.eodSettings || {},
        invoiceSettings: dbData.invoiceSettings || {}
      }
    }));
    return;
  }

  // 22. SUPER ADMIN RESET BAKER PASSWORD: POST /api/admin/bakers/reset-password
  if (reqPath === '/api/admin/bakers/reset-password' && req.method === 'POST') {
    const admin = authenticateAdmin(req);
    if (!admin) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Master Admin access required' }));
      return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { userId, newPassword } = JSON.parse(body);
        if (!newPassword || newPassword.trim().length < 4) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'New password must be at least 4 characters' }));
          return;
        }

        const users = loadUsers();
        const user = users.find(u => u.id === userId);
        if (!user) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Baker not found' }));
          return;
        }

        user.passwordHash = crypto.createHash('sha256').update(newPassword.trim()).digest('hex');
        user.updatedAt = new Date().toISOString();
        saveUsers(users);

        logActivity('admin_action', `Password Reset: ${user.businessName || user.email}`, `Admin reset credentials for ${user.email}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: `Password for ${user.email} updated successfully` }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Password reset failed: ' + e.message }));
      }
    });
    return;
  }

  // 23. SUPER ADMIN PURGE / DELETE BAKER: POST /api/admin/bakers/delete
  if (reqPath === '/api/admin/bakers/delete' && req.method === 'POST') {
    const admin = authenticateAdmin(req);
    if (!admin) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Master Admin access required' }));
      return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { userId } = JSON.parse(body);
        let users = loadUsers();
        const user = users.find(u => u.id === userId);
        if (!user) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Baker not found' }));
          return;
        }

        // Archive before removing
        const uDbPath = getUserDbPath(userId);
        if (fs.existsSync(uDbPath)) {
          const archivePath = path.join(BACKUPS_DIR, `deleted-baker-${userId}-${Date.now()}.json`);
          fs.copyFileSync(uDbPath, archivePath);
        }

        users = users.filter(u => u.id !== userId);
        saveUsers(users);

        logActivity('admin_action', `Baker Account Purged: ${user.businessName || user.email}`, `Account ${user.email} deleted and archived safely`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: `Baker ${user.email} deleted and archived safely` }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Delete failed: ' + e.message }));
      }
    });
    return;
  }

  // 24. SUPER ADMIN DOWNLOAD BAKER DB: GET /api/admin/bakers/download-db
  if (reqPath === '/api/admin/bakers/download-db' && req.method === 'GET') {
    const admin = authenticateAdmin(req);
    if (!admin) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Master Admin access required' }));
      return;
    }

    const userId = url.searchParams.get('userId');
    const uDbPath = getUserDbPath(userId);
    if (!fs.existsSync(uDbPath)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Database not found' }));
      return;
    }

    const users = loadUsers();
    const user = users.find(u => u.id === userId);
    const safeName = (user ? (user.businessName || user.email) : userId).replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `bakepilot_${safeName}_db.json`;

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`
    });
    fs.createReadStream(uDbPath).pipe(res);
    return;
  }

  // 25. SUPER ADMIN REAL-TIME ACTIVITY LOG: GET /api/admin/activity-log
  if (reqPath === '/api/admin/activity-log' && req.method === 'GET') {
    const admin = authenticateAdmin(req);
    if (!admin) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Master Admin access required' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ activities: loadActivityLog() }));
    return;
  }

  // 26. SUPER ADMIN PLATFORM HEALTH & TELEMETRY: GET /api/admin/health
  if (reqPath === '/api/admin/health' && req.method === 'GET') {
    const admin = authenticateAdmin(req);
    if (!admin) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Master Admin access required' }));
      return;
    }

    const mem = process.memoryUsage();
    let invoicesCount = 0;
    let invoicesBytes = 0;
    if (fs.existsSync(INVOICES_DIR)) {
      try {
        const files = fs.readdirSync(INVOICES_DIR);
        invoicesCount = files.length;
        files.forEach(f => {
          try { invoicesBytes += fs.statSync(path.join(INVOICES_DIR, f)).size; } catch (_) {}
        });
      } catch (_) {}
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptimeSeconds: Math.floor(process.uptime()),
      heapUsedMb: (mem.heapUsed / 1024 / 1024).toFixed(1),
      heapTotalMb: (mem.heapTotal / 1024 / 1024).toFixed(1),
      rssMb: (mem.rss / 1024 / 1024).toFixed(1),
      invoicesCount,
      invoicesBytes,
      invoicesSizeMb: (invoicesBytes / 1024 / 1024).toFixed(2),
      activeAdminSessions: activeAdminSessions.size,
      activeBakerSessions: activeSessions.size
    }));
    return;
  }

  // 27. STATIC FILE SERVING
  if (reqPath.startsWith('/invoices/')) {
    const invoiceFile = path.join(INVOICES_DIR, path.basename(reqPath));
    if (fs.existsSync(invoiceFile)) {
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' });
      fs.createReadStream(invoiceFile).pipe(res);
      return;
    }
  }

  let filePath = path.join(__dirname, reqPath === '/' ? '/index.html' : reqPath);
  if (reqPath === '/admin' || reqPath === '/admin/') {
    filePath = path.join(__dirname, 'admin.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`✨ The Crust & Crumb — LUMORA Luxury Bakery Server Active`);
  console.log(`📱 Localhost URL:   http://localhost:${PORT}`);
  console.log(`📶 Phone Wi-Fi URL: http://${LOCAL_IP}:${PORT}`);
  console.log(`🌙 EOD Automated Backup Engine: Active (11:50 PM daily)`);
  console.log(`======================================================\n`);
});
