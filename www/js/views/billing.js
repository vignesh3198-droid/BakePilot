/* ==========================================================================
   VIEW: BILLING POS — LUMORA LUXURY DESIGN
   Compact Bento Boxes (Image Left, Name, Price Below) • 3D Buttons • Delivery
   ========================================================================== */

const BillingView = {
  cart: [],
  activeCategory: 'All',
  selectedCustomer: 'Walk-in Counter Guest',
  customerPhone: '',
  discountPercent: 0,
  deliveryCharge: 0,
  paymentMethod: 'UPI / GPay',

  render() {
    const store = window.bakeryStore;
    const products = store.getProducts();
    const categories = ['All', 'Brownies', 'Cakes', 'Cupcakes', 'Pastries', 'Savouries'];

    let filteredProducts = products;
    if (this.activeCategory !== 'All') {
      filteredProducts = products.filter(p => p.category === this.activeCategory);
    }

    const itemCount = this.cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discountAmount = Math.round(subtotal * (this.discountPercent / 100) * 100) / 100;
    const total = Math.max(0, subtotal - discountAmount) + Number(this.deliveryCharge || 0);

    return `
      <div class="billing-screen" style="display: flex; flex-direction: column; gap: 12px; padding-bottom: 74px;">
        
        <!-- Standard Header -->
        ${BakeryUI.renderHeader({
          title: 'Counter Billing',
          subtitle: 'Quick POS billing for walk-in takeaway and phone orders',
          actionHtml: `
            ${this.cart.length > 0 ? `
              <button onclick="BillingView.clearCart()" class="btn-destructive btn-3d-sm" style="padding: 4px 10px; font-size: 11px;">
                <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i>
                <span>Clear</span>
              </button>
            ` : ''}
          `
        })}

        <!-- Active Customer Ribbon -->
        <div class="bento-card" style="padding: 10px 14px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: 12px; background: var(--c-almond); color: var(--c-primary); display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-bento);">
              <i data-lucide="user" style="width: 17px; height: 17px;"></i>
            </div>
            <div>
              <div style="font-size: 13.5px; font-weight: 700; color: var(--text-main); font-family: var(--font-heading);">${this.selectedCustomer}</div>
              <div style="font-size: 11px; color: var(--text-muted);">${this.customerPhone || 'Counter Takeaway'}</div>
            </div>
          </div>

          <button onclick="BillingView.changeCustomerModal()" class="btn-3d btn-3d-secondary btn-3d-sm">
            Change Client
          </button>
        </div>

        <!-- Category Dropdown Filter (Clean & Compact) -->
        <div style="display: flex; gap: 8px; align-items: center;">
          <div style="flex: 1;">
            <select onchange="BillingView.setCategory(this.value)" class="form-select" style="font-weight: 700; border-radius: var(--radius-full); padding: 8px 14px; font-size: 12.5px;">
              ${categories.map(cat => `
                <option value="${cat}" ${this.activeCategory === cat ? 'selected' : ''}>
                  Category: ${cat}
                </option>
              `).join('')}
            </select>
          </div>
          <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); white-space: nowrap;">
            ${filteredProducts.length} items
          </span>
        </div>

        <!-- Product Bento Box Cards (Image on Left, Name, Price Below - All Inside Bento) -->
        ${filteredProducts.length === 0 ? `
          <div class="bento-card" style="padding: 24px 16px; text-align: center;">
            <div style="font-size: 32px; margin-bottom: 6px;">🧁</div>
            <h4 style="font-size: 15px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading);">No Products in Menu</h4>
            <p style="font-size: 12px; color: var(--text-muted); margin: 3px 0 14px;">
              ${products.length === 0 ? 'Your menu is currently clean and empty. Add your delicious brownies & cakes or load demo items.' : `No items found under category "${this.activeCategory}".`}
            </p>
            <div style="display: flex; gap: 8px; justify-content: center;">
              <button onclick="window.bakeryApp.navigate('catalogue')" class="btn-3d btn-3d-primary btn-3d-sm">
                + Add First Product
              </button>
              ${products.length === 0 ? `
                <button onclick="window.bakeryStore.loadDemoSampleData(); window.bakeryApp.refreshCurrentView();" class="btn-3d btn-3d-secondary btn-3d-sm">
                  Load Demo Menu
                </button>
              ` : ''}
            </div>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${filteredProducts.map(p => {
              const inCart = this.cart.find(c => c.productId === p.id);
              const hasVariants = p.variants && p.variants.length > 0;
              const defaultPrice = hasVariants ? p.variants[0].price : p.price;

              return `
                <div class="bento-product-card ${inCart ? 'in-cart' : ''}">
                  
                  <!-- Image on Left -->
                  <div class="bento-thumb">
                    <img src="${p.image || BAKERY_ASSETS.cakeSvg}" alt="${p.name}" />
                  </div>

                  <!-- Info on Right: Name, Category, Price Below -->
                  <div class="bento-info">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                      <div style="min-width: 0; padding-right: 6px;">
                        <div class="bento-title">${p.name}</div>
                        <div class="bento-subtitle">${p.category} ${hasVariants ? `• ${p.variants.length} sizes` : ''}</div>
                      </div>

                      ${inCart ? `
                        <span class="status-badge badge-delivered" style="font-size: 10px; padding: 2px 7px;">
                          ${inCart.qty} in cart
                        </span>
                      ` : ''}
                    </div>

                    <!-- Price Below with 3D Add Button -->
                    <div class="bento-bottom-row">
                      <div class="bento-price tabular-nums">
                        ${BakeryUI.formatCurrency(defaultPrice)}
                      </div>

                      <button 
                        type="button"
                        onclick="BillingView.addToCart('${p.id}')" 
                        class="btn-3d btn-3d-primary btn-3d-sm"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                </div>
              `;
            }).join('')}
          </div>
        `}

        <!-- Current Bill Details (Bento Styled Cart) -->
        ${this.cart.length > 0 ? `
          <div class="bento-card" style="padding: 14px 16px; margin-top: 4px; border-top: 3.5px solid var(--c-primary);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 12px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
                Current Bill Items (${itemCount})
              </span>
              <span style="font-size: 12px; font-weight: 800; color: var(--text-main);" class="tabular-nums">
                Subtotal: ${BakeryUI.formatCurrency(subtotal)}
              </span>
            </div>

            <!-- Bento Cart Rows (Image Left, Name, Stepper & Price) -->
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${this.cart.map(item => `
                <div class="bento-card" style="padding: 8px 10px; display: flex; align-items: center; justify-content: space-between; background: var(--c-sand); border-radius: 14px;">
                  <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; overflow: hidden; background: #fff; flex-shrink: 0; border: 1px solid var(--border-light);">
                      <img src="${item.image || BAKERY_ASSETS.cakeSvg}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;" />
                    </div>
                    <div style="min-width: 0;">
                      <div style="font-size: 13px; font-weight: 700; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${item.name}
                      </div>
                      <div style="font-size: 11px; color: var(--text-muted);" class="tabular-nums">
                        ${BakeryUI.formatCurrency(item.price)} each
                      </div>
                    </div>
                  </div>

                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="quantity-stepper">
                      <button class="stepper-btn" onclick="BillingView.updateQty('${item.productId}', -1)">-</button>
                      <span class="stepper-value tabular-nums">${item.qty}</span>
                      <button class="stepper-btn" onclick="BillingView.updateQty('${item.productId}', 1)">+</button>
                    </div>

                    <div style="font-size: 13.5px; font-weight: 800; color: var(--text-main); width: 68px; text-align: right;" class="tabular-nums">
                      ${BakeryUI.formatCurrency(item.price * item.qty)}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Delivery & Discount Settings (GST-Free) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border-light);">
              <div>
                <label class="form-label">Delivery Charge (₹)</label>
                <div style="display: flex; gap: 4px;">
                  <button type="button" onclick="BillingView.setDelivery(0)" class="btn-3d ${this.deliveryCharge === 0 ? 'btn-3d-primary' : 'btn-3d-secondary'} btn-3d-sm" style="flex: 1; padding: 5px 2px;">
                    ₹0 (Pickup)
                  </button>
                  <button type="button" onclick="BillingView.setDelivery(60)" class="btn-3d ${this.deliveryCharge === 60 ? 'btn-3d-primary' : 'btn-3d-secondary'} btn-3d-sm" style="flex: 1; padding: 5px 2px;">
                    ₹60
                  </button>
                  <button type="button" onclick="BillingView.setDelivery(100)" class="btn-3d ${this.deliveryCharge === 100 ? 'btn-3d-primary' : 'btn-3d-secondary'} btn-3d-sm" style="flex: 1; padding: 5px 2px;">
                    ₹100
                  </button>
                </div>
              </div>

              <div>
                <label class="form-label">Discount (%)</label>
                <div style="display: flex; gap: 4px;">
                  <button type="button" onclick="BillingView.setDiscount(0)" class="btn-3d ${this.discountPercent === 0 ? 'btn-3d-primary' : 'btn-3d-secondary'} btn-3d-sm" style="flex: 1; padding: 5px 2px;">
                    0%
                  </button>
                  <button type="button" onclick="BillingView.setDiscount(5)" class="btn-3d ${this.discountPercent === 5 ? 'btn-3d-primary' : 'btn-3d-secondary'} btn-3d-sm" style="flex: 1; padding: 5px 2px;">
                    5%
                  </button>
                  <button type="button" onclick="BillingView.setDiscount(10)" class="btn-3d ${this.discountPercent === 10 ? 'btn-3d-primary' : 'btn-3d-secondary'} btn-3d-sm" style="flex: 1; padding: 5px 2px;">
                    10%
                  </button>
                </div>
              </div>
            </div>

            <!-- Bill Breakdown Summary -->
            <div style="margin-top: 12px; padding: 10px 12px; background: var(--c-sand); border-radius: 14px; font-size: 12.5px; display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
                <span>Items Subtotal:</span>
                <span style="font-weight: 700; color: var(--text-main);" class="tabular-nums">${BakeryUI.formatCurrency(subtotal)}</span>
              </div>
              ${this.discountPercent > 0 ? `
                <div style="display: flex; justify-content: space-between; color: var(--success); font-weight: 700;">
                  <span>Special Discount (${this.discountPercent}%):</span>
                  <span class="tabular-nums">-${BakeryUI.formatCurrency(discountAmount)}</span>
                </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
                <span>Delivery Charge:</span>
                <span class="tabular-nums">${this.deliveryCharge > 0 ? `+${BakeryUI.formatCurrency(this.deliveryCharge)}` : '₹0.00 (Self Pickup / Free)'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; color: var(--text-main); border-top: 1.5px solid var(--border-light); padding-top: 6px; margin-top: 4px;">
                <span>Total Payable:</span>
                <span class="tabular-nums" style="font-size: 18px;">${BakeryUI.formatCurrency(total)}</span>
              </div>
            </div>

            <!-- Payment Mode Selector -->
            <div style="margin-top: 12px;">
              <label class="form-label">Payment Mode</label>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
                ${['UPI / GPay', 'Cash', 'Card / Link'].map(m => `
                  <button 
                    type="button" 
                    onclick="BillingView.setPaymentMethod('${m}')" 
                    class="btn-3d ${this.paymentMethod === m ? 'btn-3d-primary' : 'btn-3d-secondary'} btn-3d-sm"
                    style="padding: 7px 4px; font-size: 11px;"
                  >
                    ${m}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Complete Bill Action Button -->
            <button 
              type="button" 
              onclick="BillingView.processOrder()" 
              class="btn-3d btn-3d-primary"
              style="width: 100%; padding: 13px; font-size: 15px; margin-top: 14px;"
            >
              <i data-lucide="check-circle" style="width: 18px; height: 18px;"></i>
              <span>Generate Bill (${BakeryUI.formatCurrency(total)})</span>
            </button>
          </div>
        ` : ''}

      </div>
    `;
  },

  setCategory(cat) {
    this.activeCategory = cat;
    window.bakeryApp.refreshCurrentView();
  },

  addToCart(productId) {
    const store = window.bakeryStore;
    const p = store.getProduct(productId);
    if (!p) return;

    if (p.variants && p.variants.length > 1) {
      this.openVariantPickerModal(p);
      return;
    }

    const defaultVariant = p.variants ? p.variants[0] : null;
    const price = defaultVariant ? defaultVariant.price : p.price;
    const variantName = defaultVariant ? defaultVariant.name : '';

    const existing = this.cart.find(c => c.productId === productId && c.variantName === variantName);
    if (existing) {
      existing.qty += 1;
    } else {
      this.cart.push({
        productId: p.id,
        name: p.name,
        price,
        qty: 1,
        variantName,
        image: p.image
      });
    }

    BakeryUI.toast(`Added ${p.name} to bill`);
    window.bakeryApp.refreshCurrentView();
  },

  openVariantPickerModal(product) {
    const html = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <p style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 2px;">Choose size / pack for ${product.name}:</p>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${product.variants.map(v => `
            <button 
              type="button" 
              onclick="BillingView.selectVariantAndAdd('${product.id}', '${v.name}', ${v.price})" 
              class="bento-card bento-card-interactive" 
              style="width: 100%; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; text-align: left; background: var(--bg-card); cursor: pointer;"
            >
              <div>
                <div style="font-size: 14px; font-weight: 700; color: var(--text-main); font-family: var(--font-heading);">${v.name}</div>
                <div style="font-size: 11.5px; color: var(--text-muted);">Ready to bill</div>
              </div>
              <div style="font-size: 15px; font-weight: 800; color: var(--text-main);" class="tabular-nums">
                ${BakeryUI.formatCurrency(v.price)}
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    BakeryUI.openSheet(html, product.name);
  },

  selectVariantAndAdd(productId, variantName, price) {
    const p = window.bakeryStore.getProduct(productId);
    BakeryUI.closeSheet();

    const existing = this.cart.find(c => c.productId === productId && c.variantName === variantName);
    if (existing) {
      existing.qty += 1;
    } else {
      this.cart.push({
        productId: p.id,
        name: p.name,
        price,
        qty: 1,
        variantName,
        image: p.image
      });
    }

    BakeryUI.toast(`Added ${p.name} (${variantName})`);
    window.bakeryApp.refreshCurrentView();
  },

  updateQty(productId, delta) {
    const item = this.cart.find(c => c.productId === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      this.cart = this.cart.filter(c => c.productId !== productId);
    }
    window.bakeryApp.refreshCurrentView();
  },

  setDelivery(amt) {
    this.deliveryCharge = amt;
    window.bakeryApp.refreshCurrentView();
  },

  setDiscount(pct) {
    this.discountPercent = pct;
    window.bakeryApp.refreshCurrentView();
  },

  setPaymentMethod(method) {
    this.paymentMethod = method;
    window.bakeryApp.refreshCurrentView();
  },

  clearCart() {
    this.cart = [];
    window.bakeryApp.refreshCurrentView();
  },

  changeCustomerModal() {
    const customers = window.bakeryStore.getCustomers();
    const html = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label class="form-label">Client Name</label>
          <input type="text" id="bill-cust-name" value="${this.selectedCustomer === 'Walk-in Counter Guest' ? '' : this.selectedCustomer}" placeholder="Walk-in Guest or Name" class="form-input" />
        </div>
        <div>
          <label class="form-label">WhatsApp / Phone Number</label>
          <input type="tel" id="bill-cust-phone" value="${this.customerPhone}" placeholder="+91 98400 00000" class="form-input" />
        </div>

        <div style="margin-top: 6px;">
          <div style="font-size: 11.5px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">Quick Pick Existing Client</div>
          <div style="max-height: 140px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px;">
            ${customers.slice(0, 5).map(c => `
              <div onclick="document.getElementById('bill-cust-name').value='${c.name}'; document.getElementById('bill-cust-phone').value='${c.phone}';" class="bento-card bento-card-interactive" style="padding: 7px 10px; font-size: 12px; cursor: pointer;">
                <strong>${c.name}</strong> • ${c.phone}
              </div>
            `).join('')}
          </div>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button type="button" onclick="BakeryUI.closeSheet()" class="btn-3d btn-3d-secondary" style="flex: 1;">Cancel</button>
          <button type="button" onclick="BillingView.saveCustomerDetails()" class="btn-3d btn-3d-primary" style="flex: 1;">Apply</button>
        </div>
      </div>
    `;
    BakeryUI.openSheet(html, 'Bill Client Details');
  },

  saveCustomerDetails() {
    const name = document.getElementById('bill-cust-name')?.value?.trim();
    const phone = document.getElementById('bill-cust-phone')?.value?.trim();

    this.selectedCustomer = name || 'Walk-in Counter Guest';
    this.customerPhone = phone || '';
    BakeryUI.closeSheet();
    BakeryUI.toast('Client updated');
    window.bakeryApp.refreshCurrentView();
  },

  processOrder() {
    if (this.cart.length === 0) return;

    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discountAmount = Math.round(subtotal * (this.discountPercent / 100) * 100) / 100;
    const total = Math.max(0, subtotal - discountAmount) + Number(this.deliveryCharge || 0);

    const orderData = {
      customerName: this.selectedCustomer,
      customerPhone: this.customerPhone || 'Counter Sale',
      items: this.cart.map(i => ({ ...i })),
      subtotal,
      discount: discountAmount,
      deliveryCharge: Number(this.deliveryCharge || 0),
      total,
      advancePaid: total,
      balanceDue: 0,
      paymentMethod: this.paymentMethod,
      paymentStatus: 'paid',
      deliveryType: this.deliveryCharge > 0 ? 'Home Delivery' : 'Store Pickup',
      deliverySlot: 'Immediate Takeaway',
      status: 'ready'
    };

    const saved = window.bakeryStore.createOrder(orderData);
    this.cart = [];
    this.deliveryCharge = 0;
    this.discountPercent = 0;

    BakeryUI.toast(`Bill #${saved.id} generated! ✓`);
    window.InvoiceView.openForOrder(saved.id);
  }
};

window.BillingView = BillingView;
