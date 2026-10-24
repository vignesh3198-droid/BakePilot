/* ==========================================================================
   VIEW: MULTI-STEP NEW ORDER WIZARD — PASTEL GLASS & CLAY
   Dedicated 5-Step Order Creation Flow with Sticky Summaries, Fulfilment & WhatsApp
   ========================================================================== */

const OrderWizard = {
  currentStep: 1, // 1: Products, 2: Customer, 3: Fulfilment, 4: Review, 5: Confirmed
  activeCategory: 'All',
  searchQuery: '',
  isSubmitting: false,

  // Wizard Form State
  orderState: {
    items: [],
    customer: {
      isExisting: false,
      id: '',
      name: '',
      phone: '',
      whatsapp: '',
      sameAsPhone: true,
      email: '',
      address: '',
      notes: ''
    },
    fulfilment: {
      method: 'self_pickup', // 'self_pickup' | 'porter_delivery' | 'own_delivery'
      date: new Date().toISOString().split('T')[0],
      timeWindow: '11:00 AM - 01:00 PM',
      deliveryFee: 0,
      deliveryAddress: '',
      deliveryInstructions: '',
      recipientContact: '',
      externalRef: '',
      pickupLocation: 'The Crust & Crumb Kitchen Studio'
    },
    payment: {
      discount: 0,
      advancePaid: 0,
      paymentMethod: 'UPI / GPay',
      cakeMessage: '',
      orderNotes: '',
      referenceImage: ''
    },
    createdOrder: null
  },

  initWizard(prefilledItems = []) {
    this.currentStep = 1;
    this.activeCategory = 'All';
    this.searchQuery = '';
    this.isSubmitting = false;

    const defaultFee = window.bakeryStore?.getProfile()?.defaultDeliveryCharge || 60;
    const defaultWorkspace = window.bakeryStore?.getWorkspace();

    this.orderState = {
      items: prefilledItems.length > 0 ? [...prefilledItems] : [],
      customer: {
        isExisting: false,
        id: '',
        name: '',
        phone: '',
        whatsapp: '',
        sameAsPhone: true,
        email: '',
        address: '',
        notes: ''
      },
      fulfilment: {
        method: 'self_pickup',
        date: new Date().toISOString().split('T')[0],
        timeWindow: '11:00 AM - 01:00 PM',
        deliveryFee: 0,
        deliveryAddress: '',
        deliveryInstructions: '',
        recipientContact: '',
        externalRef: '',
        pickupLocation: defaultWorkspace ? defaultWorkspace.name : 'The Crust & Crumb Kitchen Studio'
      },
      payment: {
        discount: 0,
        advancePaid: 0,
        paymentMethod: 'UPI / GPay',
        cakeMessage: '',
        orderNotes: '',
        referenceImage: ''
      },
      createdOrder: null
    };

    this.renderStep();
  },

  renderStep() {
    let contentHtml = '';
    let sheetTitle = 'New Order';

    switch (this.currentStep) {
      case 1:
        sheetTitle = 'New Order — Step 1: Select Products';
        contentHtml = this.renderStep1Products();
        break;
      case 2:
        sheetTitle = 'New Order — Step 2: Customer Details';
        contentHtml = this.renderStep2Customer();
        break;
      case 3:
        sheetTitle = 'New Order — Step 3: Fulfilment & Dispatch';
        contentHtml = this.renderStep3Fulfilment();
        break;
      case 4:
        sheetTitle = 'New Order — Step 4: Review & Payment';
        contentHtml = this.renderStep4Review();
        break;
      case 5:
        sheetTitle = 'Order Confirmed 🎉';
        contentHtml = this.renderStep5Confirmed();
        break;
    }

    const fullHtml = `
      <div class="order-wizard-container" style="display: flex; flex-direction: column; min-height: 100%;">
        ${this.currentStep < 5 ? this.renderProgressBar() : ''}
        ${contentHtml}
      </div>
    `;

    BakeryUI.openSheet(fullHtml, sheetTitle);
    if (window.lucide) window.lucide.createIcons();
  },

  renderProgressBar() {
    const steps = [
      { num: 1, label: 'Products' },
      { num: 2, label: 'Customer' },
      { num: 3, label: 'Fulfilment' },
      { num: 4, label: 'Review' }
    ];

    const progressPercent = ((this.currentStep - 1) / (steps.length - 1)) * 100;

    return `
      <div class="wizard-progress-bar no-print" style="margin-bottom: 14px;">
        <div class="wizard-progress-track">
          <div class="wizard-progress-fill" style="width: ${progressPercent}%;"></div>
        </div>
        ${steps.map(s => {
          let stateClass = '';
          if (s.num === this.currentStep) stateClass = 'active';
          else if (s.num < this.currentStep) stateClass = 'completed';

          return `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 3px; z-index: 2;">
              <div class="wizard-step-node ${stateClass}">
                ${s.num < this.currentStep ? '✓' : s.num}
              </div>
              <span style="font-size: 10px; font-weight: 700; color: ${s.num === this.currentStep ? 'var(--text-main)' : 'var(--text-faint)'};">${s.label}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // STEP 1: PRODUCT SELECTION SCREEN (Mobile First, Non-destructive In-place Filter)
  // --------------------------------------------------------------------------
  renderStep1Products() {
    const categories = ['All', 'Brownies', 'Cakes', 'Cupcakes', 'Pastries', 'Savouries'];

    return `
      <div style="display: flex; flex-direction: column; gap: 12px; padding-bottom: 74px; width: 100%; box-sizing: border-box;">
        
        <!-- Search and Sleek Category Dropdown Row (Fixes typing focus reset & removes old button boxes) -->
        <div style="display: flex; gap: 8px; align-items: center; width: 100%;">
          <div class="search-input-wrapper" style="flex: 1; position: relative;">
            <i data-lucide="search" style="width: 15px; height: 15px;"></i>
            <input 
              type="text" 
              id="wizard-search-input"
              placeholder="Search brownies, cakes..." 
              class="form-input" 
              value="${this.searchQuery}" 
              oninput="OrderWizard.handleSearch(this.value)" 
              autocomplete="off"
              style="padding-right: 28px;"
            />
            ${this.searchQuery ? `
              <button 
                type="button" 
                onclick="OrderWizard.clearSearch()" 
                style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 14px; color: var(--text-faint); cursor: pointer; padding: 2px;"
                aria-label="Clear Search"
              >✕</button>
            ` : ''}
          </div>

          <!-- Sleek Category Dropdown -->
          <div style="min-width: 130px; flex-shrink: 0;">
            <select 
              id="wizard-category-dropdown"
              onchange="OrderWizard.setCategory(this.value)" 
              class="form-select" 
              style="font-size: 12px; font-weight: 700; padding: 9px 10px; border-radius: var(--radius-md); background: var(--bg-card); color: var(--text-main);"
              aria-label="Filter products by category"
            >
              ${categories.map(cat => `
                <option value="${cat}" ${this.activeCategory === cat ? 'selected' : ''}>
                  ${cat === 'All' ? 'All Items' : cat}
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Dynamic Products List Container (Updated in-place to prevent losing keyboard focus) -->
        <div id="wizard-products-list" style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
          ${this.renderProductsListHtml()}
        </div>

        <!-- Sticky Persistent Order Summary Bar Container -->
        <div id="wizard-sticky-bar">
          ${this.renderStickyBarHtml()}
        </div>

      </div>
    `;
  },

  // Generates pure product list HTML for non-destructive DOM updates
  renderProductsListHtml() {
    const store = window.bakeryStore;
    let products = store.getProducts();

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase().trim();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    if (this.activeCategory !== 'All') {
      products = products.filter(p => p.category === this.activeCategory);
    }

    if (products.length === 0) {
      return `
        <div class="bento-card" style="padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 13px;">
          <div style="font-size: 26px; margin-bottom: 6px;">🧁</div>
          <div style="font-weight: 700; color: var(--text-main);">No items found</div>
          <div style="font-size: 11.5px; margin-top: 3px;">Try searching for a different item or switch category dropdown.</div>
        </div>
      `;
    }

    return products.map(prod => {
      const selectedItem = this.orderState.items.find(it => it.productId === prod.id);
      const currentQty = selectedItem ? selectedItem.qty : 0;
      const hasVariants = prod.variants && prod.variants.length > 0;
      const activeVariant = selectedItem 
        ? (prod.variants.find(v => v.id === selectedItem.variantId) || prod.variants[0]) 
        : (hasVariants ? prod.variants[0] : null);
      const displayPrice = activeVariant ? activeVariant.price : prod.price;

      return `
        <div class="bento-card ${currentQty > 0 ? 'in-cart' : ''}" style="padding: 10px 12px; display: flex; gap: 10px; align-items: center; border-left: 3.5px solid ${currentQty > 0 ? 'var(--c-deep)' : 'var(--border-light)'};">
          <!-- Thumbnail -->
          <div style="width: 54px; height: 54px; border-radius: var(--radius-sm); background: var(--c-sand); flex-shrink: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-light);">
            <img src="${prod.image || BAKERY_ASSETS.cakeSvg}" alt="${prod.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='${BAKERY_ASSETS.cakeSvg}'" />
          </div>

          <!-- Info & Variant Dropdown -->
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">
              ${prod.category}
            </div>
            <h4 style="font-size: 13.5px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px;">
              ${prod.name}
            </h4>

            ${hasVariants ? `
              <div style="margin-top: 3px;">
                <select 
                  class="form-select" 
                  style="padding: 3px 6px; font-size: 11px; min-height: 26px; width: auto; max-width: 100%; font-weight: 600;"
                  onchange="OrderWizard.selectProductVariant('${prod.id}', this.value)"
                >
                  ${prod.variants.map(v => `
                    <option value="${v.id}" ${(activeVariant && activeVariant.id === v.id) ? 'selected' : ''}>
                      ${v.name} (${BakeryUI.formatCurrency(v.price)})
                    </option>
                  `).join('')}
                </select>
              </div>
            ` : `
              <div style="font-size: 13px; font-weight: 800; color: var(--text-main); margin-top: 2px;" class="tabular-nums">
                ${BakeryUI.formatCurrency(displayPrice)}
              </div>
            `}

            ${currentQty > 0 && prod.customizationOptions?.allowCakeMessage ? `
              <button 
                type="button" 
                onclick="OrderWizard.openItemCustomizationModal('${prod.id}')" 
                style="background: none; border: none; font-size: 11px; color: var(--c-deep); font-weight: 700; cursor: pointer; padding: 2px 0; margin-top: 2px; display: inline-flex; align-items: center; gap: 3px;"
              >
                <i data-lucide="edit-3" style="width: 11px; height: 11px;"></i>
                <span>${selectedItem.cakeMessage ? 'Piped: "' + selectedItem.cakeMessage + '"' : '+ Add Cake Message'}</span>
              </button>
            ` : ''}
          </div>

          <!-- Quantity Stepper / 3D Add Button -->
          <div style="flex-shrink: 0;">
            ${currentQty === 0 ? `
              <button 
                type="button" 
                onclick="OrderWizard.addProduct('${prod.id}')" 
                class="btn-3d btn-3d-primary btn-3d-sm"
                style="padding: 6px 12px; font-size: 11.5px; font-weight: 800;"
              >
                + Add
              </button>
            ` : `
              <div class="quantity-stepper" style="display: inline-flex; align-items: center; gap: 3px; background: var(--c-sand); padding: 2px 4px; border-radius: var(--radius-full); border: 1px solid var(--border-light);">
                <button type="button" class="stepper-btn" onclick="OrderWizard.updateQty('${prod.id}', -1)" style="width: 28px; height: 28px; border-radius: 50%; border: none; background: var(--bg-card); color: var(--text-main); font-weight: 800; cursor: pointer; box-shadow: var(--shadow-bento);">-</button>
                <span class="stepper-value" style="font-size: 12.5px; font-weight: 800; color: var(--text-main); min-width: 22px; text-align: center;">${currentQty}</span>
                <button type="button" class="stepper-btn" onclick="OrderWizard.updateQty('${prod.id}', 1)" style="width: 28px; height: 28px; border-radius: 50%; border: none; background: var(--c-primary); color: #FFFFFF; font-weight: 800; cursor: pointer; box-shadow: var(--shadow-bento);">+</button>
              </div>
            `}
          </div>
        </div>
      `;
    }).join('');
  },

  // Generates persistent bottom summary bar HTML
  renderStickyBarHtml() {
    const totalQty = this.orderState.items.reduce((sum, it) => sum + it.qty, 0);
    const subtotal = this.orderState.items.reduce((sum, it) => sum + (it.price * it.qty), 0);

    return `
      <div style="position: sticky; bottom: 0; left: 0; right: 0; background: var(--bg-card); border-top: 1.5px solid var(--border-light); padding: 12px 14px; margin: 12px -20px -30px; display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow-float); z-index: 20;">
        <div>
          <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">
            ${totalQty} Item(s) Selected
          </div>
          <div style="font-size: 18px; font-weight: 800; color: var(--text-main);" class="tabular-nums">
            ${BakeryUI.formatCurrency(subtotal)}
          </div>
        </div>

        <button 
          type="button" 
          onclick="OrderWizard.goToStep(2)" 
          class="btn-3d btn-3d-primary" 
          style="padding: 10px 18px; font-size: 13px; font-weight: 800;"
          ${totalQty === 0 ? 'disabled style="opacity: 0.5; pointer-events: none;"' : ''}
        >
          <span>Customer Details →</span>
        </button>
      </div>
    `;
  },

  // Handles search keystrokes without losing focus or resetting the keyboard
  handleSearch(val) {
    this.searchQuery = val;
    const listEl = document.getElementById('wizard-products-list');
    if (listEl) {
      listEl.innerHTML = this.renderProductsListHtml();
      if (window.lucide) window.lucide.createIcons();
    } else {
      this.renderStep();
    }
  },

  clearSearch() {
    this.searchQuery = '';
    const input = document.getElementById('wizard-search-input');
    if (input) {
      input.value = '';
      input.focus();
    }
    const listEl = document.getElementById('wizard-products-list');
    if (listEl) {
      listEl.innerHTML = this.renderProductsListHtml();
      if (window.lucide) window.lucide.createIcons();
    } else {
      this.renderStep();
    }
  },

  setCategory(cat) {
    this.activeCategory = cat;
    const listEl = document.getElementById('wizard-products-list');
    if (listEl) {
      listEl.innerHTML = this.renderProductsListHtml();
      if (window.lucide) window.lucide.createIcons();
    } else {
      this.renderStep();
    }
  },

  addProduct(productId) {
    const prod = window.bakeryStore.getProduct(productId);
    if (!prod) return;

    const hasVariants = prod.variants && prod.variants.length > 0;
    const defaultVariant = hasVariants ? prod.variants[0] : null;

    this.orderState.items.push({
      productId: prod.id,
      name: prod.name,
      variantId: defaultVariant ? defaultVariant.id : '',
      variantName: defaultVariant ? defaultVariant.name : '',
      price: defaultVariant ? defaultVariant.price : prod.price,
      qty: 1,
      cakeMessage: ''
    });

    BakeryUI.toast(`Added ${prod.name}`);
    this.refreshStep1InPlace();
  },

  selectProductVariant(productId, variantId) {
    const prod = window.bakeryStore.getProduct(productId);
    if (!prod) return;
    const variant = prod.variants.find(v => v.id === variantId);
    if (!variant) return;

    const existing = this.orderState.items.find(it => it.productId === productId);
    if (existing) {
      existing.variantId = variant.id;
      existing.variantName = variant.name;
      existing.price = variant.price;
    } else {
      this.orderState.items.push({
        productId: prod.id,
        name: prod.name,
        variantId: variant.id,
        variantName: variant.name,
        price: variant.price,
        qty: 1,
        cakeMessage: ''
      });
    }
    this.refreshStep1InPlace();
  },

  updateQty(productId, delta) {
    const item = this.orderState.items.find(it => it.productId === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      this.orderState.items = this.orderState.items.filter(it => it.productId !== productId);
    }
    this.refreshStep1InPlace();
  },

  // Refreshes products list and summary bar in-place to preserve input focus & scroll
  refreshStep1InPlace() {
    const listEl = document.getElementById('wizard-products-list');
    const stickyEl = document.getElementById('wizard-sticky-bar');

    if (listEl && stickyEl) {
      listEl.innerHTML = this.renderProductsListHtml();
      stickyEl.innerHTML = this.renderStickyBarHtml();
      if (window.lucide) window.lucide.createIcons();
    } else {
      this.renderStep();
    }
  },

  openItemCustomizationModal(productId) {
    const item = this.orderState.items.find(it => it.productId === productId);
    if (!item) return;

    BakeryUI.promptModal({
      title: `Customization: ${item.name}`,
      label: 'Cake Message / Piped Inscription',
      defaultValue: item.cakeMessage || '',
      placeholder: 'e.g. Happy 10th Birthday Aarav!',
      onConfirm: (msg) => {
        item.cakeMessage = msg || '';
        this.renderStep();
      }
    });
  },

  // --------------------------------------------------------------------------
  // STEP 2: CUSTOMER DETAILS SCREEN
  // --------------------------------------------------------------------------
  renderStep2Customer() {
    const customers = window.bakeryStore.getCustomers();
    const cust = this.orderState.customer;

    return `
      <form onsubmit="event.preventDefault(); OrderWizard.submitStep2();" style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Toggle: Select Existing Customer vs Add New Customer -->
        <div style="display: flex; background: var(--c-sand); padding: 4px; border-radius: var(--radius-full); border: 1px solid var(--border-light); gap: 4px;">
          <button 
            type="button" 
            onclick="OrderWizard.setCustomerMode(false)" 
            class="btn-3d ${!cust.isExisting ? 'btn-3d-primary' : 'btn-3d-secondary'}" 
            style="flex: 1; padding: 7px 0; font-size: 11.5px;"
          >
            New Customer
          </button>
          <button 
            type="button" 
            onclick="OrderWizard.setCustomerMode(true)" 
            class="btn-3d ${cust.isExisting ? 'btn-3d-primary' : 'btn-3d-secondary'}" 
            style="flex: 1; padding: 7px 0; font-size: 11.5px;"
          >
            Saved Customer
          </button>
        </div>

        ${cust.isExisting ? `
          <!-- Existing Customer Dropdown -->
          <div class="bento-card" style="padding: 14px;">
            <label class="form-label">Select Saved Client</label>
            <select class="form-select" onchange="OrderWizard.selectExistingCustomer(this.value)">
              <option value="">-- Choose from ${customers.length} saved bakery clients --</option>
              ${customers.map(c => `
                <option value="${c.id}" ${cust.id === c.id ? 'selected' : ''}>
                  ${c.name} • ${c.phone} (${c.tier})
                </option>
              `).join('')}
            </select>
          </div>
        ` : ''}

        <!-- Customer Inputs -->
        <div class="bento-card" style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
          <div>
            <label class="form-label">Customer Full Name *</label>
            <input 
              type="text" 
              required 
              id="wizard-cust-name" 
              class="form-input" 
              placeholder="e.g. Sangeetha Krishnan" 
              value="${cust.name}" 
              oninput="OrderWizard.orderState.customer.name = this.value" 
            />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label class="form-label">Phone Number *</label>
              <input 
                type="tel" 
                required 
                id="wizard-cust-phone" 
                class="form-input" 
                placeholder="+91 98401 00000" 
                value="${cust.phone}" 
                oninput="OrderWizard.handlePhoneInput(this.value)" 
              />
            </div>

            <div>
              <label class="form-label">WhatsApp Number</label>
              <input 
                type="tel" 
                id="wizard-cust-whatsapp" 
                class="form-input" 
                placeholder="+91 98401 00000" 
                value="${cust.whatsapp}" 
                oninput="OrderWizard.orderState.customer.whatsapp = this.value" 
              />
            </div>
          </div>

          <div>
            <label class="form-label">Email Address (Optional)</label>
            <input 
              type="email" 
              id="wizard-cust-email" 
              class="form-input" 
              placeholder="client@gmail.com" 
              value="${cust.email}" 
              oninput="OrderWizard.orderState.customer.email = this.value" 
            />
          </div>

          <div>
            <label class="form-label">Delivery Address / Landmark</label>
            <textarea 
              id="wizard-cust-address" 
              class="form-textarea" 
              rows="2" 
              placeholder="Building, street, landmark, area, pincode" 
              oninput="OrderWizard.orderState.customer.address = this.value; OrderWizard.orderState.fulfilment.deliveryAddress = this.value;"
            >${cust.address}</textarea>
          </div>

          <div>
            <label class="form-label">Client Notes & Dietary Preferences</label>
            <input 
              type="text" 
              id="wizard-cust-notes" 
              class="form-input" 
              placeholder="e.g. Eggless preference, less sweet, allergic to walnuts" 
              value="${cust.notes}" 
              oninput="OrderWizard.orderState.customer.notes = this.value" 
            />
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div style="display: flex; gap: 8px; margin-top: 4px;">
          <button type="button" onclick="OrderWizard.goToStep(1)" class="btn-3d btn-3d-secondary" style="flex: 1; padding: 10px; font-size: 12px;">
            ← Back to Products
          </button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1; padding: 10px; font-size: 12px;">
            Fulfillment Details →
          </button>
        </div>

      </form>
    `;
  },

  setCustomerMode(isExisting) {
    this.orderState.customer.isExisting = isExisting;
    this.renderStep();
  },

  selectExistingCustomer(customerId) {
    const cust = window.bakeryStore.getCustomers().find(c => c.id === customerId);
    if (!cust) return;

    this.orderState.customer = {
      isExisting: true,
      id: cust.id,
      name: cust.name,
      phone: cust.phone || '',
      whatsapp: cust.whatsapp || cust.phone || '',
      sameAsPhone: true,
      email: cust.email || '',
      address: cust.address || '',
      notes: cust.notes || ''
    };
    this.orderState.fulfilment.deliveryAddress = cust.address || '';
    this.renderStep();
  },

  handlePhoneInput(val) {
    this.orderState.customer.phone = val;
    if (this.orderState.customer.sameAsPhone) {
      this.orderState.customer.whatsapp = val;
      const waInput = document.getElementById('wizard-cust-whatsapp');
      if (waInput) waInput.value = val;
    }
  },

  submitStep2() {
    const nameInput = document.getElementById('wizard-cust-name');
    const phoneInput = document.getElementById('wizard-cust-phone');

    if (!nameInput || !nameInput.value.trim()) {
      BakeryUI.toast('Please enter customer name', 'error');
      return;
    }
    if (!phoneInput || !phoneInput.value.trim()) {
      BakeryUI.toast('Please enter contact phone number', 'error');
      return;
    }

    this.orderState.customer.name = nameInput.value.trim();
    this.orderState.customer.phone = phoneInput.value.trim();
    this.orderState.customer.whatsapp = (document.getElementById('wizard-cust-whatsapp')?.value || phoneInput.value).trim();
    this.orderState.customer.email = (document.getElementById('wizard-cust-email')?.value || '').trim();
    this.orderState.customer.address = (document.getElementById('wizard-cust-address')?.value || '').trim();
    this.orderState.customer.notes = (document.getElementById('wizard-cust-notes')?.value || '').trim();

    this.orderState.fulfilment.deliveryAddress = this.orderState.customer.address;
    this.orderState.fulfilment.recipientContact = `${this.orderState.customer.name} (${this.orderState.customer.phone})`;

    this.goToStep(3);
  },

  // --------------------------------------------------------------------------
  // STEP 3: FULFILMENT METHOD SCREEN (Own Delivery, Porter, Self Pickup)
  // --------------------------------------------------------------------------
  renderStep3Fulfilment() {
    const f = this.orderState.fulfilment;
    const defaultWorkspace = window.bakeryStore?.getWorkspace();

    return `
      <form onsubmit="event.preventDefault(); OrderWizard.submitStep3();" style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Fulfilment Method Selector Cards -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label class="form-label">Choose Fulfilment Method *</label>

          <!-- Option A: Self Pickup -->
          <div 
            onclick="OrderWizard.setFulfilmentMethod('self_pickup')" 
            class="clean-card clean-card-interactive" 
            style="padding: 12px 14px; background: ${f.method === 'self_pickup' ? 'var(--bg-card-subtle)' : 'var(--bg-card)'}; display: flex; align-items: center; justify-content: space-between; border: ${f.method === 'self_pickup' ? '2px solid var(--brand-accent)' : '1px solid var(--border-light)'}; border-radius: var(--radius-md); box-shadow: var(--shadow-bento);"
          >
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(46, 125, 91, 0.15); color: #3DB87E; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="store" style="width: 18px; height: 18px;"></i>
              </div>
              <div>
                <h4 style="font-size: 13.5px; font-weight: 700; color: var(--text-main); margin: 0;">Self Pickup at Kitchen</h4>
                <p style="font-size: 11.5px; color: var(--text-muted); margin: 2px 0 0;">Customer collects from bakery gate (No delivery fee)</p>
              </div>
            </div>
            <span style="font-size: 12px; font-weight: 800; color: var(--success);">₹0 (Free)</span>
          </div>

          <!-- Option B: Porter / Third-Party Courier -->
          <div 
            onclick="OrderWizard.setFulfilmentMethod('porter_delivery')" 
            class="clean-card clean-card-interactive" 
            style="padding: 12px 14px; background: ${f.method === 'porter_delivery' ? 'var(--bg-card-subtle)' : 'var(--bg-card)'}; display: flex; align-items: center; justify-content: space-between; border: ${f.method === 'porter_delivery' ? '2px solid var(--brand-accent)' : '1px solid var(--border-light)'}; border-radius: var(--radius-md); box-shadow: var(--shadow-bento);"
          >
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(212, 175, 55, 0.15); color: #D4AF37; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="truck" style="width: 18px; height: 18px;"></i>
              </div>
              <div>
                <h4 style="font-size: 13.5px; font-weight: 700; color: var(--text-main); margin: 0;">Porter / Dunzo Delivery</h4>
                <p style="font-size: 11.5px; color: var(--text-muted); margin: 2px 0 0;">External delivery partner (2-wheeler or mini truck)</p>
              </div>
            </div>
            <span style="font-size: 12px; font-weight: 800; color: var(--text-main);">Editable Fee</span>
          </div>

          <!-- Option C: Own Bakery Delivery -->
          <div 
            onclick="OrderWizard.setFulfilmentMethod('own_delivery')" 
            class="clean-card clean-card-interactive" 
            style="padding: 12px 14px; background: ${f.method === 'own_delivery' ? 'var(--bg-card-subtle)' : 'var(--bg-card)'}; display: flex; align-items: center; justify-content: space-between; border: ${f.method === 'own_delivery' ? '2px solid var(--brand-accent)' : '1px solid var(--border-light)'}; border-radius: var(--radius-md); box-shadow: var(--shadow-bento);"
          >
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(142, 68, 173, 0.15); color: #B388FF; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="bike" style="width: 18px; height: 18px;"></i>
              </div>
              <div>
                <h4 style="font-size: 13.5px; font-weight: 700; color: var(--text-main); margin: 0;">Own Bakery Delivery</h4>
                <p style="font-size: 11.5px; color: var(--text-muted); margin: 2px 0 0;">Direct delivery handled by your kitchen staff</p>
              </div>
            </div>
            <span style="font-size: 12px; font-weight: 800; color: var(--text-main);">Custom Fee</span>
          </div>
        </div>

        <!-- Dynamic Fields Based on Method -->
        <div class="clean-card" style="padding: 16px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-md); box-shadow: var(--shadow-bento); display: flex; flex-direction: column; gap: 12px;">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label class="form-label">${f.method === 'self_pickup' ? 'Pickup Date *' : 'Delivery Date *'}</label>
              <input 
                type="date" 
                required 
                id="wizard-fulfilment-date" 
                class="form-input" 
                value="${f.date}" 
                oninput="OrderWizard.orderState.fulfilment.date = this.value" 
              />
            </div>

            <div>
              <label class="form-label">Time Window *</label>
              <select id="wizard-fulfilment-slot" class="form-select" onchange="OrderWizard.orderState.fulfilment.timeWindow = this.value">
                <option value="11:00 AM - 01:00 PM" ${f.timeWindow.includes('11:00') ? 'selected' : ''}>11:00 AM - 01:00 PM</option>
                <option value="02:00 PM - 04:00 PM" ${f.timeWindow.includes('02:00') ? 'selected' : ''}>02:00 PM - 04:00 PM</option>
                <option value="05:00 PM - 07:00 PM" ${f.timeWindow.includes('05:00') ? 'selected' : ''}>05:00 PM - 07:00 PM</option>
                <option value="Evening Express" ${f.timeWindow.includes('Evening') ? 'selected' : ''}>Evening Express (Post 7 PM)</option>
              </select>
            </div>
          </div>

          ${f.method === 'self_pickup' ? `
            <div>
              <label class="form-label">Pickup Kitchen Location</label>
              <input 
                type="text" 
                class="form-input" 
                readonly 
                value="${defaultWorkspace ? defaultWorkspace.address : '14, Greenways Road, R.A. Puram, Chennai'}" 
              />
              <p style="font-size: 11px; color: var(--text-muted); margin-top: 3px;">
                ${defaultWorkspace ? defaultWorkspace.pickupLocationInstructions : 'Collect from ground floor kitchen counter.'}
              </p>
            </div>
          ` : `
            <div>
              <label class="form-label">Delivery Destination Address *</label>
              <textarea 
                required 
                id="wizard-fulfilment-address" 
                class="form-textarea" 
                rows="2" 
                placeholder="Full delivery address with flat/house number and street"
                oninput="OrderWizard.orderState.fulfilment.deliveryAddress = this.value"
              >${f.deliveryAddress}</textarea>
            </div>

            <div style="background: var(--bg-card-subtle); padding: 12px; border-radius: 10px; border: 1px solid var(--border-light);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label class="form-label" style="margin-bottom: 0;">Delivery Charge (₹)</label>
                <span style="font-size: 11px; color: var(--text-faint);">Editable for this order</span>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                ${[0, 40, 60, 100].map(fee => `
                  <button 
                    type="button" 
                    onclick="OrderWizard.setDeliveryFee(${fee})" 
                    class="btn ${f.deliveryFee === fee ? 'btn-primary' : 'btn-secondary'} btn-sm"
                    style="flex: 1;"
                  >
                    ₹${fee}
                  </button>
                `).join('')}
                <input 
                  type="number" 
                  min="0" 
                  step="5" 
                  value="${f.deliveryFee}" 
                  id="wizard-fulfilment-fee" 
                  class="form-input" 
                  style="width: 80px; text-align: center; font-weight: 800; min-height: 34px; padding: 4px;"
                  oninput="OrderWizard.setDeliveryFee(this.value)" 
                  placeholder="Custom ₹"
                />
              </div>
            </div>

            ${f.method === 'porter_delivery' ? `
              <div style="background: var(--bg-card-subtle); border: 1px solid var(--border-light); padding: 10px 12px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-size: 12px; font-weight: 700; color: var(--brand-accent);">External Porter Booking</div>
                    <div style="font-size: 11px; color: var(--text-muted); margin-top: 1px;">Book ride via Porter App when order is ready.</div>
                  </div>
                  <a href="https://www.porter.in" target="_blank" class="btn-3d btn-3d-secondary btn-3d-sm" style="font-size: 11px; text-decoration: none;">
                    <span>Open Porter ↗</span>
                  </a>
                </div>
                <div style="margin-top: 6px;">
                  <input 
                    type="text" 
                    id="wizard-external-ref" 
                    class="form-input" 
                    style="font-size: 11.5px; min-height: 32px;"
                    placeholder="Optional: Porter booking tracking ref (e.g. CRN-9021)" 
                    value="${f.externalRef}" 
                    oninput="OrderWizard.orderState.fulfilment.externalRef = this.value"
                  />
                </div>
              </div>
            ` : ''}

            <div>
              <label class="form-label">Delivery Instructions for Rider</label>
              <input 
                type="text" 
                id="wizard-fulfilment-instructions" 
                class="form-input" 
                placeholder="e.g. Handle with care, cream cake inside, do not tilt box" 
                value="${f.deliveryInstructions}" 
                oninput="OrderWizard.orderState.fulfilment.deliveryInstructions = this.value" 
              />
            </div>
          `}

        </div>

        <!-- Navigation Buttons -->
        <div style="display: flex; gap: 8px; margin-top: 4px;">
          <button type="button" onclick="OrderWizard.goToStep(2)" class="btn-3d btn-3d-secondary" style="flex: 1; padding: 10px; font-size: 12px;">
            ← Back to Customer
          </button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1; padding: 10px; font-size: 12px;">
            Review & Payment →
          </button>
        </div>

      </form>
    `;
  },

  setFulfilmentMethod(method) {
    this.orderState.fulfilment.method = method;
    if (method === 'self_pickup') {
      this.orderState.fulfilment.deliveryFee = 0;
    } else if (this.orderState.fulfilment.deliveryFee === 0) {
      this.orderState.fulfilment.deliveryFee = window.bakeryStore?.getProfile()?.defaultDeliveryCharge || 60;
    }
    this.renderStep();
  },

  setDeliveryFee(fee) {
    this.orderState.fulfilment.deliveryFee = Math.max(0, parseFloat(fee) || 0);
    const feeInput = document.getElementById('wizard-fulfilment-fee');
    if (feeInput && feeInput.value != this.orderState.fulfilment.deliveryFee) {
      feeInput.value = this.orderState.fulfilment.deliveryFee;
    }
    this.renderStep();
  },

  submitStep3() {
    const f = this.orderState.fulfilment;
    if (f.method !== 'self_pickup') {
      const addr = document.getElementById('wizard-fulfilment-address')?.value || '';
      if (!addr.trim()) {
        BakeryUI.toast('Please enter destination delivery address', 'error');
        return;
      }
      f.deliveryAddress = addr.trim();
    }

    this.goToStep(4);
  },

  // --------------------------------------------------------------------------
  // STEP 4: REVIEW & PAYMENT SUMMARY SCREEN
  // --------------------------------------------------------------------------
  renderStep4Review() {
    const s = this.orderState;
    const subtotal = s.items.reduce((sum, it) => sum + (it.price * it.qty), 0);
    const discount = Number(s.payment.discount) || 0;
    const deliveryFee = s.fulfilment.method === 'self_pickup' ? 0 : (Number(s.fulfilment.deliveryFee) || 0);
    const total = Math.max(0, subtotal - discount) + deliveryFee;
    const advancePaid = Math.min(total, Number(s.payment.advancePaid) || 0);
    const balanceDue = Math.max(0, total - advancePaid);

    return `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Order Items Summary Table -->
        <div class="clean-card" style="padding: 14px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-md); box-shadow: var(--shadow-bento);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11.5px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
              Ordered Items (${s.items.length})
            </span>
            <button onclick="OrderWizard.goToStep(1)" style="background: none; border: none; font-size: 11px; color: var(--brand-accent); font-weight: 700; cursor: pointer;">
              Edit Items
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${s.items.map(it => `
              <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 4px 0; border-bottom: 1px solid var(--border-light); font-size: 12.5px;">
                <div>
                  <div style="font-weight: 700; color: var(--text-main);">${it.qty}× ${it.name}</div>
                  ${it.variantName ? `<div style="font-size: 11px; color: var(--text-muted);">${it.variantName}</div>` : ''}
                  ${it.cakeMessage ? `<div style="font-size: 11px; color: var(--brand-accent); font-style: italic;">"${it.cakeMessage}"</div>` : ''}
                </div>
                <div style="font-weight: 800; color: var(--text-main);">
                  ${BakeryUI.formatCurrency(it.price * it.qty)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Customer & Dispatch Summary Card -->
        <div class="clean-card" style="padding: 14px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-md); box-shadow: var(--shadow-bento); font-size: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <div style="font-size: 10px; font-weight: 700; color: var(--text-faint); text-transform: uppercase;">Customer</div>
            <div style="font-size: 13.5px; font-weight: 700; color: var(--text-main); margin-top: 2px;">${s.customer.name}</div>
            <div style="color: var(--text-muted);">${s.customer.phone}</div>
          </div>

          <div style="text-align: right;">
            <div style="font-size: 10px; font-weight: 700; color: var(--text-faint); text-transform: uppercase;">Fulfillment</div>
            <div style="font-weight: 700; color: var(--text-main); margin-top: 2px;">
              ${s.fulfilment.method === 'self_pickup' ? 'Self Pickup' : s.fulfilment.method === 'porter_delivery' ? 'Porter Courier' : 'Own Delivery'}
            </div>
            <div style="color: var(--text-muted);">${s.fulfilment.date} • ${s.fulfilment.timeWindow}</div>
          </div>
        </div>

        <!-- Payment & Discounts Controls -->
        <div class="clean-card" style="padding: 16px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-md); box-shadow: var(--shadow-bento); display: flex; flex-direction: column; gap: 10px;">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label class="form-label">Discount (₹)</label>
              <input 
                type="number" 
                min="0" 
                step="10" 
                class="form-input" 
                value="${s.payment.discount}" 
                oninput="OrderWizard.orderState.payment.discount = Math.max(0, parseFloat(this.value)||0); OrderWizard.renderStep();" 
              />
            </div>

            <div>
              <label class="form-label">Payment Mode</label>
              <select class="form-select" onchange="OrderWizard.orderState.payment.paymentMethod = this.value">
                <option value="UPI / GPay" ${s.payment.paymentMethod === 'UPI / GPay' ? 'selected' : ''}>UPI (GPay/PhonePe)</option>
                <option value="Cash" ${s.payment.paymentMethod === 'Cash' ? 'selected' : ''}>Cash</option>
                <option value="Card POS" ${s.payment.paymentMethod === 'Card POS' ? 'selected' : ''}>Card POS</option>
                <option value="Bank Transfer" ${s.payment.paymentMethod === 'Bank Transfer' ? 'selected' : ''}>NEFT / IMPS</option>
              </select>
            </div>
          </div>

          <!-- Advance Payment Received & Balance Calculation -->
          <div style="background: var(--bg-card-subtle); padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <label class="form-label" style="margin-bottom: 0;">Advance Paid Received (₹)</label>
              <span style="font-size: 11px; color: var(--text-muted);">Optional advance for pre-orders</span>
            </div>
            <input 
              type="number" 
              min="0" 
              max="${total}" 
              step="50" 
              class="form-input" 
              style="width: 100px; text-align: center; font-weight: 800; font-size: 14px;" 
              value="${s.payment.advancePaid}" 
              oninput="OrderWizard.orderState.payment.advancePaid = Math.max(0, parseFloat(this.value)||0); OrderWizard.renderStep();" 
            />
          </div>

          <!-- Financial Breakdown Table -->
          <div style="padding-top: 8px; border-top: 1px solid var(--border-light); display: flex; flex-direction: column; gap: 4px; font-size: 12.5px;">
            <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
              <span>Items Subtotal:</span><span>${BakeryUI.formatCurrency(subtotal)}</span>
            </div>
            ${discount > 0 ? `
              <div style="display: flex; justify-content: space-between; color: var(--success); font-weight: 600;">
                <span>Special Discount:</span><span>-${BakeryUI.formatCurrency(discount)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; color: ${deliveryFee > 0 ? 'var(--text-main)' : 'var(--text-muted)'};">
              <span>Delivery Charge:</span>
              <span>${deliveryFee > 0 ? `+${BakeryUI.formatCurrency(deliveryFee)}` : '₹0.00 (Self Pickup / Free)'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; color: var(--text-main); border-top: 1.5px solid var(--border-light); padding-top: 4px; margin-top: 2px;">
              <span>Grand Total:</span><span>${BakeryUI.formatCurrency(total)}</span>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--success); font-weight: 700; margin-top: 2px;">
              <span>Advance Paid:</span><span>${BakeryUI.formatCurrency(advancePaid)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 800; color: ${balanceDue > 0 ? 'var(--error)' : 'var(--success)'};">
              <span>Balance Due:</span><span>${BakeryUI.formatCurrency(balanceDue)}</span>
            </div>
          </div>

        </div>

        <!-- Submit Actions (Duplicate Click Protected) -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; gap: 8px;">
            <button 
              type="button" 
              onclick="OrderWizard.confirmOrder(false)" 
              class="btn-3d btn-3d-secondary" 
              style="flex: 1; padding: 11px; font-size: 12.5px;"
              ${this.isSubmitting ? 'disabled' : ''}
            >
              Confirm Order
            </button>
            <button 
              type="button" 
              onclick="OrderWizard.confirmOrder(true)" 
              class="btn-3d btn-3d-primary" 
              style="flex: 1.3; padding: 11px; font-size: 13px;"
              ${this.isSubmitting ? 'disabled' : ''}
            >
              Confirm & Bill 🧾
            </button>
          </div>

          <button 
            type="button" 
            onclick="OrderWizard.confirmOrder(false, true)" 
            class="btn-3d btn-3d-secondary btn-3d-sm"
            style="color: var(--text-muted); padding: 7px;"
          >
            Save as Draft
          </button>
        </div>

      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // ORDER SUBMISSION & BUSINESS LOGIC (Zero Duplicates, Full Persistence)
  // --------------------------------------------------------------------------
  confirmOrder(openBillImmediately = true, isDraft = false) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const s = this.orderState;
    const subtotal = s.items.reduce((sum, it) => sum + (it.price * it.qty), 0);
    const discount = Number(s.payment.discount) || 0;
    const deliveryFee = s.fulfilment.method === 'self_pickup' ? 0 : (Number(s.fulfilment.deliveryFee) || 0);
    const total = Math.max(0, subtotal - discount) + deliveryFee;
    const advancePaid = Math.min(total, Number(s.payment.advancePaid) || 0);
    const balanceDue = Math.max(0, total - advancePaid);

    let paymentStatus = 'unpaid';
    if (advancePaid >= total && total > 0) paymentStatus = 'paid';
    else if (advancePaid > 0) paymentStatus = 'partially-paid';

    const orderPayload = {
      customerName: s.customer.name,
      customerPhone: s.customer.phone,
      customerWhatsapp: s.customer.whatsapp || s.customer.phone,
      date: s.fulfilment.date,
      deliverySlot: s.fulfilment.timeWindow,
      fulfilmentMethod: s.fulfilment.method,
      deliveryType: s.fulfilment.method === 'self_pickup' ? 'Self Pickup' : (s.fulfilment.method === 'porter_delivery' ? 'Porter / Third-Party Delivery' : 'Own Delivery'),
      deliveryAddress: s.fulfilment.deliveryAddress,
      deliveryInstructions: s.fulfilment.deliveryInstructions,
      recipientContact: s.fulfilment.recipientContact,
      externalReference: s.fulfilment.externalRef,
      paymentMethod: s.payment.paymentMethod,
      paymentStatus: isDraft ? 'unpaid' : paymentStatus,
      status: isDraft ? 'pending' : 'pending',
      items: s.items.map(it => ({
        productId: it.productId,
        name: it.variantName ? `${it.name} (${it.variantName})` : it.name,
        qty: it.qty,
        price: it.price,
        cakeMessage: it.cakeMessage || ''
      })),
      subtotal,
      discount,
      deliveryCharge: deliveryFee,
      total,
      advancePaid,
      balanceDue,
      cakeMessage: s.items.map(it => it.cakeMessage).filter(Boolean).join(' • '),
      notes: s.customer.notes || ''
    };

    const created = window.bakeryStore.createOrder(orderPayload);
    this.orderState.createdOrder = created;
    this.isSubmitting = false;

    // Record cash in cashbook if advance was paid in Cash
    if (advancePaid > 0 && s.payment.paymentMethod === 'Cash') {
      window.bakeryStore.addCashbookEntry({
        description: `Advance Paid for ${created.id} (${s.customer.name})`,
        type: 'in',
        amount: advancePaid,
        category: 'Sales'
      });
    }

    BakeryUI.toast(`Order ${created.id} created successfully! 🎉`);

    if (openBillImmediately) {
      BakeryUI.closeSheet();
      window.InvoiceView.openForOrder(created.id);
    } else {
      this.currentStep = 5;
      this.renderStep();
    }
  },

  // --------------------------------------------------------------------------
  // STEP 5: ORDER CONFIRMATION & WHATSAPP SHARE SCREEN
  // --------------------------------------------------------------------------
  renderStep5Confirmed() {
    const o = this.orderState.createdOrder;
    if (!o) return '<div style="padding: 20px;">Order created.</div>';

    return `
      <div style="display: flex; flex-direction: column; gap: 16px; text-align: center; padding: 10px 4px;">
        
        <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--pastel-mint-subtle); color: var(--pastel-mint-deep); margin: 0 auto; display: flex; align-items: center; justify-content: center;">
          <i data-lucide="check" style="width: 32px; height: 32px; stroke-width: 2.5;"></i>
        </div>

        <div>
          <span style="font-size: 11px; font-weight: 800; color: var(--pastel-rose-deep); background: var(--pastel-rose-subtle); padding: 3px 10px; border-radius: 20px;">
            ${o.id}
          </span>
          <h3 style="font-size: 19px; font-weight: 800; color: var(--text-main); margin-top: 6px;">Order Confirmed!</h3>
          <p style="font-size: 12.5px; color: var(--text-muted); margin-top: 2px;">
            Scheduled for ${o.date} (${o.deliverySlot}) via ${o.deliveryType}.
          </p>
        </div>

        <!-- Quick Summary Box -->
        <div class="clean-card" style="padding: 14px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-md); box-shadow: var(--shadow-bento); font-size: 12.5px; text-align: left; display: flex; flex-direction: column; gap: 4px;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Customer:</span>
            <span style="font-weight: 700; color: var(--text-main);">${o.customerName}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Grand Total:</span>
            <span style="font-weight: 800; color: var(--text-main);">${BakeryUI.formatCurrency(o.total)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Advance Received:</span>
            <span style="font-weight: 700; color: var(--success);">${BakeryUI.formatCurrency(o.advancePaid || 0)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-light); padding-top: 4px; margin-top: 2px;">
            <span style="font-weight: 700; color: var(--text-main);">Balance Due:</span>
            <span style="font-weight: 800; color: ${(o.balanceDue || 0) > 0 ? 'var(--error)' : 'var(--success)'};">${BakeryUI.formatCurrency(o.balanceDue || 0)}</span>
          </div>
        </div>

        <!-- Actions -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button onclick="InvoiceView.openForOrder('${o.id}')" class="btn-3d btn-3d-secondary" style="width: 100%; padding: 10px; font-weight: 700;">
            <i data-lucide="receipt" style="width: 15px; height: 15px;"></i>
            <span>View & Print Official Invoice</span>
          </button>

          <button onclick="InvoiceView.openForOrder('${o.id}'); setTimeout(() => InvoiceView.shareWhatsAppImage(), 250);" class="btn-3d btn-3d-primary" style="width: 100%; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); border-color: #128C7E; color: #FFFFFF; font-weight: 800; padding: 11px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i data-lucide="message-circle" style="width: 16px; height: 16px;"></i>
            <span>Share Bill Image on WhatsApp</span>
          </button>

          <button onclick="BakeryUI.closeSheet(); window.bakeryApp.navigate('orders');" class="btn-3d btn-3d-secondary" style="width: 100%; padding: 9px; font-size: 12px;">
            Back to Orders Pipeline
          </button>
        </div>

      </div>
    `;
  },

  goToStep(stepNumber) {
    this.currentStep = stepNumber;
    this.renderStep();
  }
};

window.OrderWizard = OrderWizard;
