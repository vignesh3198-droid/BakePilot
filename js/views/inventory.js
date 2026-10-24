/* ==========================================================================
   VIEW: PANTRY INVENTORY & ITEM PRICING — LUMORA DESIGN & INDIAN MARKET
   Live Editable Prices for Compounds, Butter, Packaging Boxes & Essences
   Clean Dropdown Category Selector & Tactile 3D Controls
   ========================================================================== */

const InventoryView = {
  activeCategory: 'All',
  searchQuery: '',
  showLowStockOnly: false,

  render() {
    const store = window.bakeryStore;
    let inventory = store.getInventory();
    
    const categories = [
      'All', 
      'Compounds & Chocolates', 
      'Dairy & Fats', 
      'Flours & Sugars', 
      'Essences & Flavours', 
      'Boxes & Packaging', 
      'Cafe & Savoury', 
      'Party & Decor',
      'Leavening & Essentials',
      'Nuts & Inclusions'
    ];

    const lowStockCount = inventory.filter(i => i.currentStock <= i.minThreshold).length;

    // Filter by Low Stock safety threshold if toggled
    if (this.showLowStockOnly) {
      inventory = inventory.filter(i => i.currentStock <= i.minThreshold);
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      inventory = inventory.filter(i => 
        i.name.toLowerCase().includes(q) || 
        i.category.toLowerCase().includes(q) ||
        (i.supplier && i.supplier.toLowerCase().includes(q))
      );
    }

    if (this.activeCategory !== 'All') {
      inventory = inventory.filter(i => i.category === this.activeCategory);
    }

    return `
      <div class="inventory-screen" style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="font-size: 20px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); letter-spacing: -0.02em;">Pantry & Item Pricing</h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 1px;">Manage ingredient unit costs, boxes & stock quantities</p>
          </div>
          <button onclick="InventoryView.openAddIngredientModal()" class="btn-3d btn-3d-primary" style="font-size: 12px; padding: 8px 14px;">
            <i data-lucide="plus" style="width: 15px; height: 15px;"></i>
            <span>Add Item</span>
          </button>
        </div>

        <!-- Low Stock Notice Banner -->
        ${lowStockCount > 0 ? `
          <div class="bento-card" style="padding: 10px 14px; background: rgba(184, 75, 88, 0.08); border: 1.5px solid rgba(184, 75, 88, 0.25); display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <i data-lucide="alert-circle" style="width: 16px; height: 16px; color: var(--error);"></i>
              <span style="font-size: 12.5px; font-weight: 700; color: var(--error);">
                ${lowStockCount} items below safety threshold
              </span>
            </div>
            <button onclick="InventoryView.filterLowStock()" class="btn-3d ${this.showLowStockOnly ? 'btn-3d-primary' : 'btn-3d-secondary'}" style="padding: 4px 10px; font-size: 11px;">
              ${this.showLowStockOnly ? 'Show All Items' : 'Filter Low Stock'}
            </button>
          </div>
        ` : ''}

        ${this.showLowStockOnly ? `
          <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(184, 75, 88, 0.12); padding: 7px 12px; border-radius: var(--radius-sm); font-size: 11.5px; font-weight: 700; color: var(--error);">
            <span>Showing all ${inventory.length} low-stock items</span>
            <button onclick="InventoryView.filterLowStock()" style="background: none; border: none; font-size: 11.5px; color: var(--error); text-decoration: underline; cursor: pointer;">
              Reset to All (${store.getInventory().length})
            </button>
          </div>
        ` : ''}

        <!-- Clean Filter Row: Search & Category Dropdown -->
        <div style="display: flex; gap: 8px; align-items: center;">
          <div class="search-input-wrapper" style="flex: 1;">
            <i data-lucide="search" style="width: 15px; height: 15px;"></i>
            <input 
              type="text" 
              placeholder="Search compounds, butter, 8 inch box..." 
              class="form-input" 
              value="${this.searchQuery}"
              oninput="InventoryView.handleSearch(this.value)"
            />
            ${this.searchQuery ? `
              <button onclick="InventoryView.clearSearch()" style="position: absolute; right: 10px; background: none; border: none; font-size: 13px; color: var(--text-faint); cursor: pointer;">✕</button>
            ` : ''}
          </div>

          <!-- Clean Category Dropdown Selector -->
          <div style="min-width: 140px; flex-shrink: 0;">
            <select 
              onchange="InventoryView.setCategory(this.value)" 
              class="form-select" 
              style="font-size: 12px; font-weight: 700; padding: 10px 12px; border-radius: var(--radius-md); background: var(--bg-card); color: var(--text-main);"
              aria-label="Filter by pantry category"
            >
              ${categories.map(cat => `
                <option value="${cat}" ${this.activeCategory === cat ? 'selected' : ''}>
                  ${cat === 'All' ? 'All Categories' : cat}
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Inventory List -->
        ${inventory.length === 0 ? BakeryUI.getEmptyIllustration('inventory') : `
          <div style="display: flex; flex-direction: column; gap: 9px;">
            ${inventory.map(item => {
              const isLow = item.currentStock <= item.minThreshold;
              const isOut = item.currentStock === 0;

              return `
                <div class="bento-card" style="padding: 13px 15px; border-left: 3.5px solid ${isOut ? 'var(--error)' : isLow ? 'var(--warning)' : 'var(--border-light)'};">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                    <div style="display: flex; gap: 10px; align-items: center; min-width: 0;">
                      ${item.image ? `
                        <div style="width: 42px; height: 42px; border-radius: var(--radius-md); overflow: hidden; flex-shrink: 0; border: 1px solid var(--border-light);">
                          <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                      ` : `
                        <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: var(--c-sand); color: var(--c-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid var(--border-light);">
                          <i data-lucide="package" style="width: 18px; height: 18px;"></i>
                        </div>
                      `}
                      <div style="min-width: 0;">
                        <div style="display: flex; align-items: center; gap: 5px; flex-wrap: wrap;">
                          <span style="font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; background: var(--c-sand); padding: 2px 6px; border-radius: 4px;">
                            ${item.category}
                          </span>
                          <span style="font-size: 10px; color: var(--text-faint);">${item.supplier || 'Pantry'}</span>
                        </div>
                        <h4 style="font-size: 14.5px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); margin-top: 3px; word-break: break-word;">
                          ${item.name}
                        </h4>
                      </div>
                    </div>

                    <!-- Editable Purchase Rate Badge (3D Click to Edit) -->
                    <div style="text-align: right; flex-shrink: 0;">
                      <button 
                        onclick="InventoryView.quickEditPrice('${item.id}', ${item.unitCost})" 
                        class="btn-3d btn-3d-secondary"
                        style="padding: 4px 10px; font-size: 12px; font-weight: 800; color: var(--c-primary); display: inline-flex; align-items: center; gap: 5px;"
                        title="Click to edit unit purchase price"
                      >
                        <span style="font-variant-numeric: tabular-nums;">
                          ${BakeryUI.formatCurrency(item.unitCost)} / ${item.unit}
                        </span>
                        <i data-lucide="edit-2" style="width: 10px; height: 10px; opacity: 0.7;"></i>
                      </button>
                      <div style="margin-top: 5px;">
                        ${isOut ? BakeryUI.renderStatusBadge('outstock') : isLow ? BakeryUI.renderStatusBadge('lowstock') : BakeryUI.renderStatusBadge('instock')}
                      </div>
                    </div>
                  </div>

                  <!-- Bottom: Stock Quantity & Steppers -->
                  <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 9px; margin-top: 9px;">
                    <div style="font-size: 11.5px; color: var(--text-muted);">
                      Stock: <strong style="color: var(--text-main); font-variant-numeric: tabular-nums;">${item.currentStock} ${item.unit}</strong> <span style="font-size: 10.5px; color: var(--text-faint);">(Min: ${item.minThreshold} ${item.unit})</span>
                    </div>

                    <div style="display: flex; align-items: center; gap: 6px;">
                      <div class="quantity-stepper">
                        <button class="stepper-btn" onclick="InventoryView.adjustStock('${item.id}', -1)" aria-label="Decrease stock">-</button>
                        <span class="stepper-value" style="font-variant-numeric: tabular-nums;">${item.currentStock}</span>
                        <button class="stepper-btn" onclick="InventoryView.adjustStock('${item.id}', 1)" aria-label="Increase stock">+</button>
                      </div>

                      <button onclick="InventoryView.openEditIngredient('${item.id}')" class="btn-3d btn-3d-secondary" style="padding: 4px 8px; border-radius: var(--radius-sm);" title="Edit Full Details">
                        <i data-lucide="more-horizontal" style="width: 14px; height: 14px;"></i>
                      </button>
                    </div>
                  </div>

                </div>
              `;
            }).join('')}
          </div>
        `}

      </div>
    `;
  },

  handleSearch(val) {
    this.searchQuery = val;
    window.bakeryApp.refreshCurrentView();
  },

  clearSearch() {
    this.searchQuery = '';
    window.bakeryApp.refreshCurrentView();
  },

  setCategory(cat) {
    this.activeCategory = cat;
    window.bakeryApp.refreshCurrentView();
  },

  filterLowStock() {
    this.showLowStockOnly = !this.showLowStockOnly;
    this.searchQuery = '';
    this.activeCategory = 'All';
    window.bakeryApp.refreshCurrentView();
  },

  quickEditPrice(id, currentPrice) {
    const item = window.bakeryStore.getIngredient(id);
    if (!item) return;

    BakeryUI.promptModal({
      title: `Update ${item.name} Rate`,
      label: `Purchase Price (₹ per ${item.unit})`,
      defaultValue: currentPrice,
      placeholder: 'e.g. 195.00',
      onConfirm: (newPriceStr) => {
        if (newPriceStr !== null && newPriceStr.trim() !== '') {
          const parsed = parseFloat(newPriceStr);
          if (!isNaN(parsed) && parsed >= 0) {
            window.bakeryStore.updateIngredientPrice(id, parsed);
            BakeryUI.toast(`Updated ${item.name} rate to ₹${parsed}/${item.unit}. All recipe estimates recalculated!`);
            window.bakeryApp.refreshCurrentView();
          }
        }
      }
    });
  },

  adjustStock(id, delta) {
    const updated = window.bakeryStore.updateStock(id, delta);
    if (updated) {
      BakeryUI.toast(`${updated.name}: ${updated.currentStock} ${updated.unit}`);
      window.bakeryApp.refreshCurrentView();
    }
  },

  openAddIngredientModal() {
    const suppliers = window.bakeryStore.getSuppliers();
    const html = `
      <form onsubmit="InventoryView.handleAddIngredientSubmit(event)" style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label class="form-label">Item / Ingredient / Box Name</label>
          <input type="text" name="name" required placeholder="e.g. Dark compound, 10 inch Cake Box, Cocoa..." class="form-input" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Category</label>
            <select name="category" class="form-select">
              <option value="Compounds & Chocolates">Compounds & Chocolates</option>
              <option value="Dairy & Fats">Dairy & Fats</option>
              <option value="Flours & Sugars">Flours & Sugars</option>
              <option value="Essences & Flavours">Essences & Flavours</option>
              <option value="Boxes & Packaging">Boxes & Packaging</option>
              <option value="Cafe & Savoury">Cafe & Savoury</option>
              <option value="Party & Decor">Party & Decor</option>
              <option value="Leavening & Essentials">Leavening & Essentials</option>
              <option value="Nuts & Inclusions">Nuts & Inclusions</option>
            </select>
          </div>
          <div>
            <label class="form-label">Unit of Measure</label>
            <select name="unit" class="form-select">
              <option value="kg">kg (Kilograms)</option>
              <option value="g">g (Grams)</option>
              <option value="L">L (Liters)</option>
              <option value="ml">ml (Milliliters)</option>
              <option value="pcs">pcs (Pieces / Boxes)</option>
              <option value="pkt">pkt (Packets)</option>
              <option value="loaf">loaf (Bread)</option>
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Purchase Rate / Cost (₹)</label>
            <input type="number" step="0.5" name="unitCost" required placeholder="e.g. 195.00" class="form-input" />
          </div>
          <div>
            <label class="form-label">Current Stock</label>
            <input type="number" step="0.1" name="currentStock" required placeholder="10.0" class="form-input" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Min Safety Threshold</label>
            <input type="number" step="0.1" name="minThreshold" required placeholder="3.0" class="form-input" />
          </div>
          <div>
            <label class="form-label">Supplier / Store</label>
            <select name="supplier" class="form-select">
              <option value="Wholesale Market">Local Wholesale Market</option>
              ${suppliers.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Optional Item Photo -->
        ${BakeryUI.renderImageUpload({
          id: 'ingredient-image',
          label: 'Item / Packaging Photo (Optional)',
          helpText: 'Helps quick pantry identification.'
        })}

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button type="button" onclick="BakeryUI.closeSheet()" class="btn-3d btn-3d-secondary" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1;">Save Item to Pantry</button>
        </div>
      </form>
    `;
    BakeryUI.openSheet(html, 'Add Pantry Item or Box');
  },

  handleAddIngredientSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const imageVal = document.getElementById('ingredient-image-value')?.value || '';

    const newIng = {
      name: formData.get('name'),
      category: formData.get('category'),
      unit: formData.get('unit'),
      unitCost: parseFloat(formData.get('unitCost')) || 0,
      currentStock: parseFloat(formData.get('currentStock')) || 0,
      minThreshold: parseFloat(formData.get('minThreshold')) || 0,
      supplier: formData.get('supplier'),
      image: imageVal
    };

    window.bakeryStore.saveIngredient(newIng);
    BakeryUI.closeSheet();
    BakeryUI.toast(`Saved ${newIng.name} at ₹${newIng.unitCost}/${newIng.unit}`);
    window.bakeryApp.refreshCurrentView();
  },

  openEditIngredient(id) {
    const item = window.bakeryStore.getIngredient(id);
    if (!item) return;

    const html = `
      <form onsubmit="InventoryView.handleEditIngredientSubmit(event, '${id}')" style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label class="form-label">Item Name</label>
          <input type="text" name="name" value="${item.name}" required class="form-input" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Purchase Rate (₹ per ${item.unit})</label>
            <input type="number" step="0.5" name="unitCost" value="${item.unitCost}" required class="form-input" />
          </div>
          <div>
            <label class="form-label">Current Stock (${item.unit})</label>
            <input type="number" step="0.1" name="currentStock" value="${item.currentStock}" required class="form-input" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Min Threshold (${item.unit})</label>
            <input type="number" step="0.1" name="minThreshold" value="${item.minThreshold}" required class="form-input" />
          </div>
          <div>
            <label class="form-label">Supplier</label>
            <input type="text" name="supplier" value="${item.supplier || ''}" class="form-input" />
          </div>
        </div>

        <!-- Image Edit -->
        ${BakeryUI.renderImageUpload({
          id: 'edit-ingredient-image',
          currentImage: item.image || '',
          label: 'Item / Packaging Photo',
          helpText: 'Replace or remove photo.'
        })}

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button type="button" onclick="InventoryView.deleteIngredientConfirm('${id}')" class="btn-3d btn-3d-secondary" style="padding: 10px 14px; color: var(--error);" title="Delete item">
            <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
          </button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1;">Update Item</button>
        </div>
      </form>
    `;
    BakeryUI.openSheet(html, `Edit ${item.name}`);
  },

  handleEditIngredientSubmit(e, id) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const imageVal = document.getElementById('edit-ingredient-image-value')?.value || '';

    window.bakeryStore.saveIngredient({
      id,
      name: formData.get('name'),
      unitCost: parseFloat(formData.get('unitCost')) || 0,
      currentStock: parseFloat(formData.get('currentStock')) || 0,
      minThreshold: parseFloat(formData.get('minThreshold')) || 0,
      supplier: formData.get('supplier'),
      image: imageVal
    });

    BakeryUI.closeSheet();
    BakeryUI.toast('Item details and pricing updated');
    window.bakeryApp.refreshCurrentView();
  },

  deleteIngredientConfirm(id) {
    BakeryUI.confirmModal({
      title: 'Delete Pantry Item',
      message: 'Remove this item from your pantry? It will be unlinked from current recipes.',
      confirmText: 'Delete Item',
      onConfirm: () => {
        window.bakeryStore.deleteIngredient(id);
        BakeryUI.toast('Item removed from pantry', 'warning');
        window.bakeryApp.refreshCurrentView();
      }
    });
  }
};

window.InventoryView = InventoryView;
