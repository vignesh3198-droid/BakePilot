/* ==========================================================================
   VIEW: PRODUCT CATALOGUE — LUMORA DESIGN & INDIAN MARKET
   Menu Items, Product Photos, Variants & Sizes, Cost Margins & Availability
   Clean Dropdown Category Selector & Modern 3D Add Item Button
   ========================================================================== */

const CatalogueView = {
  activeCategory: 'All',
  searchQuery: '',

  render() {
    const store = window.bakeryStore;
    let products = store.getProducts();
    const categories = ['All', 'Brownies', 'Cakes', 'Cupcakes', 'Pastries', 'Savouries'];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (this.activeCategory !== 'All') {
      products = products.filter(p => p.category === this.activeCategory);
    }

    return `
      <div class="catalogue-screen" style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Header with Modern 3D Add Item Button -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="font-size: 20px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); letter-spacing: -0.02em;">Menu Catalogue</h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 1px;">Manage your bakery items, product photos, variants & margins</p>
          </div>
          <button onclick="CatalogueView.openAddProductModal()" class="btn-3d btn-3d-primary" style="font-size: 12px; padding: 8px 14px;">
            <i data-lucide="plus" style="width: 15px; height: 15px;"></i>
            <span>Add Item</span>
          </button>
        </div>

        <!-- Clean Filter Row: Search & Category Dropdown (Replacing old buttons) -->
        <div style="display: flex; gap: 8px; align-items: center;">
          <div class="search-input-wrapper" style="flex: 1;">
            <i data-lucide="search" style="width: 15px; height: 15px;"></i>
            <input 
              type="text" 
              placeholder="Search brownies, celebration cakes..." 
              class="form-input" 
              value="${this.searchQuery}"
              oninput="CatalogueView.handleSearch(this.value)"
            />
            ${this.searchQuery ? `
              <button onclick="CatalogueView.clearSearch()" style="position: absolute; right: 10px; background: none; border: none; font-size: 13px; color: var(--text-faint); cursor: pointer;">✕</button>
            ` : ''}
          </div>

          <!-- Modern Category Dropdown -->
          <div style="min-width: 135px; flex-shrink: 0;">
            <select 
              onchange="CatalogueView.setCategory(this.value)" 
              class="form-select" 
              style="font-size: 12px; font-weight: 700; padding: 10px 12px; border-radius: var(--radius-md); background: var(--bg-card); color: var(--text-main);"
              aria-label="Filter products by category"
            >
              ${categories.map(cat => `
                <option value="${cat}" ${this.activeCategory === cat ? 'selected' : ''}>
                  ${cat === 'All' ? 'All Menu Items' : cat}
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Products Bento List -->
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${products.length === 0 ? `
            <div class="bento-card" style="padding: 30px; text-align: center; color: var(--text-muted); font-size: 13px;">
              No products found in this category.
            </div>
          ` : products.map(p => {
            const marginPct = p.price > 0 ? Math.round(((p.price - p.costPrice) / p.price) * 100) : 0;
            const hasVariants = p.variants && p.variants.length > 0;

            return `
              <div class="bento-card" style="padding: 14px 15px; display: flex; flex-direction: column; gap: 10px;">
                
                <div style="display: flex; gap: 12px; align-items: flex-start;">
                  <!-- Product Image / Thumbnail with Fallback -->
                  <div style="width: 72px; height: 72px; border-radius: var(--radius-md); overflow: hidden; background: var(--c-sand); flex-shrink: 0; border: 1px solid var(--border-light);">
                    <img src="${p.image || BAKERY_ASSETS.cakeChocolate}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />
                  </div>

                  <!-- Details -->
                  <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 6px;">
                      <div style="min-width: 0;">
                        <span style="font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; background: var(--c-sand); padding: 2px 6px; border-radius: 4px;">
                          ${p.category}
                        </span>
                        <h3 style="font-size: 14.5px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); margin-top: 2px; word-break: break-word;">
                          ${p.name}
                        </h3>
                      </div>

                      <div style="text-align: right; flex-shrink: 0;">
                        <div style="font-size: 16px; font-weight: 800; color: var(--text-main);" class="tabular-nums">
                          ${BakeryUI.formatCurrency(p.price)}
                        </div>
                        <span style="font-size: 9.5px; font-weight: 800; color: #2E7D5B; background: rgba(46, 125, 91, 0.12); padding: 2px 6px; border-radius: 4px;">
                          ${marginPct}% Margin
                        </span>
                      </div>
                    </div>

                    ${p.description ? `
                      <p style="font-size: 11.5px; color: var(--text-muted); margin-top: 3px; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${p.description}
                      </p>
                    ` : ''}
                  </div>
                </div>

                <!-- Available Variants & Sizes Chips -->
                ${hasVariants ? `
                  <div style="background: var(--c-sand); padding: 8px 10px; border-radius: var(--radius-sm); font-size: 11px; border: 1px solid var(--border-light);">
                    <span style="font-size: 9.5px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 4px;">
                      Sizes & Available Variants:
                    </span>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                      ${p.variants.map(v => `
                        <span style="background: var(--bg-card); border: 1px solid var(--border-light); padding: 2px 7px; border-radius: 6px; font-weight: 700; color: var(--text-main); font-size: 10.5px;">
                          ${v.name}: <strong style="color: var(--c-primary);">${BakeryUI.formatCurrency(v.price)}</strong>
                        </span>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                <!-- Footer: Cost & 3D Edit Actions -->
                <div style="border-top: 1px solid var(--border-light); padding-top: 8px; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 11px; color: var(--text-muted);">
                    Cost to bake: <strong style="color: var(--text-main);">${BakeryUI.formatCurrency(p.costPrice)}</strong>
                  </span>

                  <div style="display: flex; gap: 6px;">
                    <button onclick="CatalogueView.openEditProductModal('${p.id}')" class="btn-3d btn-3d-secondary" style="padding: 5px 10px; font-size: 11px;">
                      <i data-lucide="edit-2" style="width: 12px; height: 12px;"></i>
                      <span>Edit & Photo</span>
                    </button>
                    <button onclick="CatalogueView.deleteProductConfirm('${p.id}')" class="btn-3d btn-3d-secondary" style="padding: 5px 8px; font-size: 11px; color: var(--error);" title="Delete Product">
                      <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i>
                    </button>
                  </div>
                </div>

              </div>
            `;
          }).join('')}
        </div>

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

  setCategory(c) {
    this.activeCategory = c;
    window.bakeryApp.refreshCurrentView();
  },

  openAddProductModal() {
    const html = `
      <form onsubmit="CatalogueView.handleAddProductSubmit(event)" style="display: flex; flex-direction: column; gap: 12px;">
        
        <!-- Image Upload Component -->
        ${BakeryUI.renderImageUpload({
          id: 'prod-add-image',
          currentImage: '',
          label: 'Product Photo / Cake Reference',
          helpText: 'Snap photo from phone or pick from device gallery'
        })}

        <div>
          <label class="form-label">Item / Product Name *</label>
          <input type="text" name="name" required placeholder="e.g. Belgian Truffle Celebration Cake" class="form-input" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Category</label>
            <select name="category" class="form-select">
              <option value="Brownies">Brownies</option>
              <option value="Cakes">Cakes</option>
              <option value="Cupcakes">Cupcakes</option>
              <option value="Pastries">Pastries</option>
              <option value="Savouries">Savouries & Cafe</option>
            </select>
          </div>
          <div>
            <label class="form-label">Selling Price (₹) *</label>
            <input type="number" step="10" name="price" required placeholder="550" class="form-input" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Estimated Cost (₹)</label>
            <input type="number" step="5" name="costPrice" placeholder="210" class="form-input" />
          </div>
          <div>
            <label class="form-label">Base Unit</label>
            <input type="text" name="unit" placeholder="box, cake, pack" class="form-input" value="box" />
          </div>
        </div>

        <div>
          <label class="form-label">Description & Inclusions</label>
          <textarea name="description" class="form-input" rows="2" placeholder="Rich chocolate layers, buttercream, packing box included..."></textarea>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button type="button" onclick="BakeryUI.closeSheet()" class="btn-3d btn-3d-secondary" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1;">Save Product</button>
        </div>
      </form>
    `;

    BakeryUI.openSheet(html, 'Add New Bakery Product');
  },

  handleAddProductSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const photoData = document.getElementById('prod-add-image-value')?.value || BAKERY_ASSETS.cakeChocolate;

    window.bakeryStore.saveProduct({
      name: formData.get('name'),
      category: formData.get('category'),
      price: Number(formData.get('price')) || 0,
      costPrice: Number(formData.get('costPrice')) || 0,
      unit: formData.get('unit') || 'box',
      description: formData.get('description'),
      image: photoData
    });

    BakeryUI.closeSheet();
    BakeryUI.toast('Product added to catalogue! ✓');
    window.bakeryApp.refreshCurrentView();
  },

  openEditProductModal(productId) {
    const p = window.bakeryStore.getProduct(productId);
    if (!p) return;

    const html = `
      <form onsubmit="CatalogueView.handleEditProductSubmit(event, '${p.id}')" style="display: flex; flex-direction: column; gap: 12px;">
        
        <!-- Image Upload Component -->
        ${BakeryUI.renderImageUpload({
          id: 'prod-edit-image',
          currentImage: p.image || '',
          label: 'Product Photo / Illustration',
          helpText: 'Select image from device or take photo with camera'
        })}

        <div>
          <label class="form-label">Item Name</label>
          <input type="text" name="name" value="${p.name}" required class="form-input" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Category</label>
            <select name="category" class="form-select">
              <option value="Brownies" ${p.category === 'Brownies' ? 'selected' : ''}>Brownies</option>
              <option value="Cakes" ${p.category === 'Cakes' ? 'selected' : ''}>Cakes</option>
              <option value="Cupcakes" ${p.category === 'Cupcakes' ? 'selected' : ''}>Cupcakes</option>
              <option value="Pastries" ${p.category === 'Pastries' ? 'selected' : ''}>Pastries</option>
              <option value="Savouries" ${p.category === 'Savouries' ? 'selected' : ''}>Savouries & Cafe</option>
            </select>
          </div>
          <div>
            <label class="form-label">Selling Price (₹)</label>
            <input type="number" step="10" name="price" value="${p.price}" required class="form-input" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Cost Price (₹)</label>
            <input type="number" step="5" name="costPrice" value="${p.costPrice}" class="form-input" />
          </div>
          <div>
            <label class="form-label">Unit</label>
            <input type="text" name="unit" value="${p.unit || 'box'}" class="form-input" />
          </div>
        </div>

        <div>
          <label class="form-label">Description</label>
          <textarea name="description" class="form-input" rows="2">${p.description || ''}</textarea>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button type="button" onclick="BakeryUI.closeSheet()" class="btn-3d btn-3d-secondary" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1;">Update Product</button>
        </div>
      </form>
    `;

    BakeryUI.openSheet(html, `Edit ${p.name}`);
  },

  handleEditProductSubmit(e, productId) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const photoData = document.getElementById('prod-edit-image-value')?.value || '';

    window.bakeryStore.saveProduct({
      id: productId,
      name: formData.get('name'),
      category: formData.get('category'),
      price: Number(formData.get('price')) || 0,
      costPrice: Number(formData.get('costPrice')) || 0,
      unit: formData.get('unit'),
      description: formData.get('description'),
      image: photoData || undefined
    });

    BakeryUI.closeSheet();
    BakeryUI.toast('Product updated successfully! ✓');
    window.bakeryApp.refreshCurrentView();
  },

  deleteProductConfirm(id) {
    BakeryUI.confirmModal({
      title: 'Delete Product',
      message: 'Remove this product from your bakery catalogue?',
      confirmText: 'Delete',
      onConfirm: () => {
        window.bakeryStore.deleteProduct(id);
        BakeryUI.toast('Product removed');
        window.bakeryApp.refreshCurrentView();
      }
    });
  }
};

window.CatalogueView = CatalogueView;
