/* ==========================================================================
   VIEW: VENDORS (SUPPLIERS) — LUMORA DESIGN & INDIAN MARKET
   Vendors for Compounds, Butter, Packaging Boxes & Essences
   Renamed to Vendors as Requested & Upgraded to Modern 3D Tactile Buttons
   ========================================================================== */

const SuppliersView = {
  render() {
    const store = window.bakeryStore;
    const vendors = store.getSuppliers();

    return `
      <div class="suppliers-screen" style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="font-size: 20px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); letter-spacing: -0.02em;">Bakery Vendors</h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 1px;">Compound importers, dairy distributors, box corrugators & essences</p>
          </div>
          <button onclick="SuppliersView.openAddSupplierModal()" class="btn-3d btn-3d-primary" style="font-size: 12px; padding: 8px 14px;">
            <i data-lucide="plus" style="width: 15px; height: 15px;"></i>
            <span>Add Vendor</span>
          </button>
        </div>

        <!-- Vendor List -->
        <div style="display: flex; flex-direction: column; gap: 9px;">
          ${vendors.map(s => {
            const cleanPhone = (s.phone || '').replace(/[^0-9]/g, '');
            const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
            const waLink = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${s.contact || s.name}, need to place a restock order for our kitchen studio.`)}` : null;

            return `
              <div class="bento-card" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                  <div style="min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                      <h3 style="font-size: 15px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); margin: 0; word-break: break-word;">${s.name}</h3>
                      <span class="status-badge badge-peach" style="font-size: 9.5px; padding: 2px 7px;">
                        ${s.leadDays} Day Lead Time
                      </span>
                    </div>
                    <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">
                      Contact: <strong>${s.contact}</strong> • ${s.category}
                    </div>
                  </div>

                  <div style="text-align: right; flex-shrink: 0;">
                    <span style="font-size: 10px; color: var(--text-faint); text-transform: uppercase;">Min Order</span>
                    <div style="font-size: 13.5px; font-weight: 800; color: var(--text-main); font-variant-numeric: tabular-nums;">${s.minOrder}</div>
                  </div>
                </div>

                <div style="font-size: 11px; color: var(--text-faint); display: flex; gap: 10px; margin-top: 2px; flex-wrap: wrap;">
                  <span>📞 ${s.phone}</span>
                  ${s.email ? `<span>✉️ ${s.email}</span>` : ''}
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 6px; border-top: 1px solid var(--border-light); padding-top: 8px; margin-top: 4px; flex-wrap: wrap;">
                  ${waLink ? `
                    <a href="${waLink}" target="_blank" class="btn-3d btn-3d-mint" style="padding: 5px 11px; font-size: 11px; text-decoration: none;">
                      <i data-lucide="message-circle" style="width: 13px; height: 13px;"></i>
                      <span>WhatsApp</span>
                    </a>
                  ` : ''}
                  <a href="tel:${s.phone}" class="btn-3d btn-3d-secondary" style="padding: 5px 11px; font-size: 11px; text-decoration: none;">
                    <i data-lucide="phone" style="width: 12px; height: 12px;"></i>
                    <span>Call</span>
                  </a>
                  <button onclick="SuppliersView.deleteSupplierConfirm('${s.id}')" class="btn-3d btn-3d-secondary" style="padding: 5px 8px; font-size: 11px; color: var(--error);" title="Remove Vendor">
                    <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;
  },

  openAddSupplierModal() {
    const html = `
      <form onsubmit="SuppliersView.handleAddSupplierSubmit(event)" style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label class="form-label">Vendor / Wholesale Mart Name *</label>
          <input type="text" name="name" required placeholder="e.g. BakePro Wholesale Chennai" class="form-input" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Contact Person</label>
            <input type="text" name="contact" required placeholder="e.g. Ramesh" class="form-input" />
          </div>
          <div>
            <label class="form-label">Category</label>
            <input type="text" name="category" placeholder="e.g. Compounds & Packaging" class="form-input" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Phone Number</label>
            <input type="tel" name="phone" required placeholder="+91 98401 00000" class="form-input" />
          </div>
          <div>
            <label class="form-label">Lead Time (Days)</label>
            <input type="number" name="leadDays" value="2" min="1" class="form-input" />
          </div>
        </div>

        <div>
          <label class="form-label">Minimum Order Requirement</label>
          <input type="text" name="minOrder" placeholder="e.g. ₹2,000 or 10kg" class="form-input" />
        </div>

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button type="button" onclick="BakeryUI.closeSheet()" class="btn-3d btn-3d-secondary" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1;">Save Vendor</button>
        </div>
      </form>
    `;
    BakeryUI.openSheet(html, 'Add Bakery Vendor');
  },

  handleAddSupplierSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const newSup = {
      name: formData.get('name'),
      contact: formData.get('contact'),
      category: formData.get('category'),
      phone: formData.get('phone'),
      leadDays: parseInt(formData.get('leadDays')) || 2,
      minOrder: formData.get('minOrder') || '₹1,500'
    };

    window.bakeryStore.saveSupplier(newSup);
    BakeryUI.closeSheet();
    BakeryUI.toast(`Vendor "${newSup.name}" saved!`);
    window.bakeryApp.refreshCurrentView();
  },

  deleteSupplierConfirm(id) {
    BakeryUI.confirmModal({
      title: 'Remove Vendor',
      message: 'Remove this vendor from your bakery directory?',
      confirmText: 'Remove',
      onConfirm: () => {
        window.bakeryStore.data.suppliers = window.bakeryStore.data.suppliers.filter(s => s.id !== id);
        window.bakeryStore.save(true);
        BakeryUI.toast('Vendor removed', 'warning');
        window.bakeryApp.refreshCurrentView();
      }
    });
  }
};

window.SuppliersView = SuppliersView;
