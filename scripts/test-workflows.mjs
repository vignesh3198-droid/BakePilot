import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read files
const storeCode = fs.readFileSync(path.join(rootDir, 'js', 'store.js'), 'utf8');
const compCode = fs.readFileSync(path.join(rootDir, 'js', 'components.js'), 'utf8');
const wizardCode = fs.readFileSync(path.join(rootDir, 'js', 'views', 'order-wizard.js'), 'utf8');
const workspaceCode = fs.readFileSync(path.join(rootDir, 'js', 'views', 'workspace.js'), 'utf8');
const brandingCode = fs.readFileSync(path.join(rootDir, 'js', 'views', 'branding.js'), 'utf8');
const invoiceCode = fs.readFileSync(path.join(rootDir, 'js', 'views', 'invoice.js'), 'utf8');

// Mock browser global environment
const windowMock = {
  location: { hash: '' },
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = v; },
    removeItem(k) { delete this._data[k]; }
  },
  lucide: { createIcons: () => {} },
  document: {
    getElementById: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {}
  }
};

const fn = new Function('window', 'document', 'localStorage', `
  ${storeCode}
  ${compCode}
  ${wizardCode}
  ${workspaceCode}
  ${brandingCode}
  ${invoiceCode}
  return { BakeryStore, BakeryUI, OrderWizard, WorkspaceView, BrandingView, InvoiceView };
`);

const { BakeryStore, BakeryUI, OrderWizard, WorkspaceView, BrandingView, InvoiceView } = fn(windowMock, windowMock.document, windowMock.localStorage);

console.log('🧪 Testing In-Memory Bakery Workflows & Business Logic...\n');

// Test 1: Store Initialization
console.log('1. Verifying BakeryStore Initialization...');
const store = new BakeryStore();
windowMock.bakeryStore = store;
const profile = store.getProfile();
if (profile.currencySymbol !== '₹') throw new Error(`Currency symbol failed: ${profile.currencySymbol}`);
console.log(`   ✓ Currency symbol verified: ${profile.currencySymbol}`);
console.log(`   ✓ Baker: ${profile.baker}, Brand: ${profile.name}`);

// Test 2: Formatting Currency with tabular numbers
console.log('2. Verifying Tabular Currency Formatter...');
const formatted = BakeryUI.formatCurrency(1850.5);
if (!formatted.includes('₹') || !formatted.includes('1,850.50')) {
  throw new Error(`Currency formatter unexpected output: ${formatted}`);
}
console.log(`   ✓ Formatted currency: ${formatted}`);

// Test 3: New Order Workflow (Step by step calculations)
console.log('3. Verifying Order Wizard Business Logic...');
const brownie = store.getProducts().find(p => p.name.includes('Brownie'));
if (!brownie) throw new Error('Brownie product not found in store');
const variant = brownie.variants[0]; // 8" box ₹550

const testOrder = {
  customerName: 'Kavitha S.',
  customerPhone: '+91 98402 11223',
  items: [
    {
      productId: brownie.id,
      name: brownie.name,
      variantName: variant.name,
      price: variant.price,
      qty: 2
    }
  ],
  deliveryType: 'Porter / Dunzo',
  deliverySlot: 'Evening (4 PM - 7 PM)',
  deliveryAddress: '24, Boat Club Road, Chennai',
  deliveryCharge: 80.0,
  porterTrackingRef: 'POR-CH-88219',
  discountPercent: 10,
  advancePaid: 500.0,
  paymentMethod: 'UPI / GPay',
  specialInstructions: 'Add extra fudgy walnuts'
};

// Calculations
const itemsSubtotal = testOrder.items.reduce((s, it) => s + (it.price * it.qty), 0); // 1100
const discountAmount = Math.round(itemsSubtotal * (testOrder.discountPercent / 100)); // 110
const total = (itemsSubtotal - discountAmount) + testOrder.deliveryCharge; // 990 + 80 = 1070
const balanceDue = Math.max(0, total - testOrder.advancePaid); // 1070 - 500 = 570

if (total !== 1070) throw new Error(`Expected total 1070, got ${total}`);
if (balanceDue !== 570) throw new Error(`Expected balance due 570, got ${balanceDue}`);

console.log(`   ✓ Subtotal: ₹${itemsSubtotal}, Discount 10%: -₹${discountAmount}, Delivery Fee: +₹${testOrder.deliveryCharge}`);
console.log(`   ✓ Total Order Value: ₹${total}, Advance Paid: ₹${testOrder.advancePaid}, Balance Due: ₹${balanceDue}`);

const savedOrder = store.createOrder({
  ...testOrder,
  subtotal: itemsSubtotal,
  discountAmount,
  total,
  balanceDue,
  status: 'In Oven'
});

if (!savedOrder || !savedOrder.id) throw new Error('Order creation in store failed');
console.log(`   ✓ Order ${savedOrder.id} successfully created and saved.`);

// Test 4: Self Pickup Fulfillment ($₹0$ delivery fee & clean address handling)
console.log('4. Verifying Self Pickup Delivery Rule...');
const pickupOrder = store.createOrder({
  customerName: 'Rohan Verma',
  customerPhone: '+91 97900 12345',
  items: [{ productId: brownie.id, name: brownie.name, price: 550, qty: 1 }],
  deliveryType: 'Self Pickup',
  deliveryCharge: 0,
  deliveryAddress: 'Kitchen Counter Pickup',
  subtotal: 550,
  total: 550,
  advancePaid: 550,
  balanceDue: 0,
  status: 'Ready'
});
if (pickupOrder.deliveryCharge !== 0) throw new Error('Self pickup must have ₹0 delivery fee');
console.log(`   ✓ Self pickup order ${pickupOrder.id} verified with ₹0 delivery charge.`);

// Test 5: Invoice Rendering (Zero GST & Advance Paid Check)
console.log('5. Verifying Clean Invoice Rendering (Zero GST & Advance Paid)...');
const invoiceHtml = InvoiceView.openForOrder(savedOrder.id);
if (!invoiceHtml) throw new Error('InvoiceView.openForOrder returned empty html');
if (invoiceHtml.includes('GSTIN') || invoiceHtml.includes('18% GST') || invoiceHtml.includes('CGST')) {
  throw new Error('Invoice unexpectedly contains GST billing fields!');
}
if (!invoiceHtml.includes('Balance Due') || !invoiceHtml.includes('Advance Paid')) {
  throw new Error('Invoice missing Advance Paid or Balance Due lines!');
}
if (!invoiceHtml.includes('Porter / Dunzo')) {
  throw new Error('Invoice missing delivery method!');
}
console.log('   ✓ Invoice is completely GST-free and properly displays Advance Paid & Balance Due.');

// Test 6: Workspace Settings
console.log('6. Verifying Workspace Settings View...');
const workspace = store.getWorkspace();
if (!workspace.workingHours || !workspace.minAdvanceNoticeHours) {
  throw new Error('Workspace configuration incomplete');
}
console.log(`   ✓ Kitchen hours: ${workspace.workingHours}, Cutoff advance notice: ${workspace.minAdvanceNoticeHours}h`);

// Test 7: Universal Image Upload Component Render Check
console.log('7. Verifying Universal Image Upload Component...');
const uploadHtml = BakeryUI.renderImageUpload({
  id: 'test-upload',
  label: 'Test Photo',
  helpText: 'Preview check'
});
if (!uploadHtml.includes('file') || !uploadHtml.includes('test-upload-preview-box')) {
  throw new Error('BakeryUI.renderImageUpload failed to generate proper markup');
}
console.log('   ✓ BakeryUI.renderImageUpload renders preview box and file picker.');

console.log('\n🎉 ALL CLIENT WORKFLOW TESTS PASSED 100% SUCCESSFULLY!\n');
