/* ==========================================================================
   VIEW: CUSTOMER PROFILES CRM — LUMORA DESIGN & INDIAN MARKET
   VIP Baker Club, Total Spend (₹), Dietary Preferences, WhatsApp & Calling
   Tactile 3D Buttons & Mobile Optimized Layout
   ========================================================================== */

const CustomersView = {
  render() {
    const store = window.bakeryStore;
    const customers = store.getCustomers();

    return `
      <div class="customers-screen" style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="font-size: 20px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); letter-spacing: -0.02em;">Bakery Clients</h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 1px;">Customer profiles, VIP club, celebration dates & preferences</p>
          </div>
          <button onclick="CustomersView.openAddCustomerModal()" class="btn-3d btn-3d-primary" style="font-size: 12px; padding: 8px 14px;">
            <i data-lucide="plus" style="width: 15px; height: 15px;"></i>
            <span>Add Client</span>
          </button>
        </div>

        <!-- Customer Cards -->
        <div style="display: flex; flex-direction: column; gap: 9px;">
          ${customers.map(c => {
            const cleanPhone = (c.phone || '').replace(/[^0-9]/g, '');
            const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
            const waLink = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${c.name}, greetings from ${store.getProfile().name}! 🎂`)}` : null;

            return `
              <div class="bento-card" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
                
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                  <div style="min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                      <h3 style="font-size: 15px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); margin: 0; word-break: break-word;">${c.name}</h3>
                      <span class="status-badge ${c.tier?.includes('VIP') ? 'badge-rose' : 'badge-mint'}" style="font-size: 9.5px; padding: 2px 7px;">
                        ${c.tier || 'Regular'}
                      </span>
                    </div>
                    <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">
                      📞 ${c.phone || 'No phone'} ${c.email ? `• ✉️ ${c.email}` : ''}
                    </div>
                  </div>

                  <div style="text-align: right; flex-shrink: 0;">
                    <div style="font-size: 16px; font-weight: 800; color: var(--text-main); font-variant-numeric: tabular-nums;">
                      ${BakeryUI.formatCurrency(c.totalSpend)}
                    </div>
                    <div style="font-size: 10.5px; color: var(--text-faint); font-weight: 700;">
                      ${c.totalOrders} order(s)
                    </div>
                  </div>
                </div>

                ${c.notes ? `
                  <div style="font-size: 11.5px; color: var(--text-main); background: var(--c-sand); padding: 7px 11px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
                    <strong>Preferences:</strong> ${c.notes}
                  </div>
                ` : ''}

                <div style="display: flex; justify-content: flex-end; gap: 6px; border-top: 1px solid var(--border-light); padding-top: 8px; margin-top: 2px; flex-wrap: wrap;">
                  ${waLink ? `
                    <a href="${waLink}" target="_blank" class="btn-3d btn-3d-mint" style="padding: 5px 11px; font-size: 11px; text-decoration: none;">
                      <i data-lucide="message-circle" style="width: 13px; height: 13px;"></i>
                      <span>WhatsApp</span>
                    </a>
                  ` : ''}
                  <a href="tel:${c.phone}" class="btn-3d btn-3d-secondary" style="padding: 5px 11px; font-size: 11px; text-decoration: none;">
                    <i data-lucide="phone" style="width: 12px; height: 12px;"></i>
                    <span>Call</span>
                  </a>
                  <button onclick="CustomersView.openEditCustomerModal('${c.id}')" class="btn-3d btn-3d-secondary" style="padding: 5px 10px; font-size: 11px;">
                    <i data-lucide="edit-2" style="width: 12px; height: 12px;"></i>
                    <span>Edit</span>
                  </button>
                </div>

              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;
  },

  openAddCustomerModal() {
    const html = `
      <form onsubmit="CustomersView.handleAddCustomerSubmit(event)" style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label class="form-label">Client Full Name *</label>
          <input type="text" name="name" required placeholder="e.g. Meenakshi Raman" class="form-input" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Phone Number</label>
            <input type="tel" name="phone" placeholder="+91 98400 00000" class="form-input" />
          </div>
          <div>
            <label class="form-label">Email</label>
            <input type="email" name="email" placeholder="client@gmail.com" class="form-input" />
          </div>
        </div>

        <div>
          <label class="form-label">Loyalty Category</label>
          <select name="tier" class="form-select">
            <option value="Regular">Regular Customer</option>
            <option value="VIP Baker Club">VIP Baker Club Member</option>
            <option value="Corporate / Event">Corporate Client</option>
          </select>
        </div>

        <div>
          <label class="form-label">Dietary Preferences & Important Dates</label>
          <textarea name="notes" placeholder="e.g. Prefers eggless dark chocolate, Anniversary on Nov 15th..." class="form-input" rows="2"></textarea>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button type="button" onclick="BakeryUI.closeSheet()" class="btn-3d btn-3d-secondary" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1;">Save Client</button>
        </div>
      </form>
    `;
    BakeryUI.openSheet(html, 'Add Bakery Client');
  },

  handleAddCustomerSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const newCust = {
      name: formData.get('name'),
      phone: formData.get('phone') || '',
      email: formData.get('email') || '',
      tier: formData.get('tier'),
      notes: formData.get('notes')
    };

    window.bakeryStore.saveCustomer(newCust);
    BakeryUI.closeSheet();
    BakeryUI.toast(`Added ${newCust.name} to clients!`);
    window.bakeryApp.refreshCurrentView();
  },

  openEditCustomerModal(id) {
    const c = window.bakeryStore.getCustomers().find(cust => cust.id === id);
    if (!c) return;

    const html = `
      <form onsubmit="CustomersView.handleEditCustomerSubmit(event, '${id}')" style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label class="form-label">Client Full Name</label>
          <input type="text" name="name" value="${c.name}" required class="form-input" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Phone Number</label>
            <input type="tel" name="phone" value="${c.phone || ''}" class="form-input" />
          </div>
          <div>
            <label class="form-label">Email</label>
            <input type="email" name="email" value="${c.email || ''}" class="form-input" />
          </div>
        </div>

        <div>
          <label class="form-label">Loyalty Category</label>
          <select name="tier" class="form-select">
            <option value="Regular" ${c.tier === 'Regular' ? 'selected' : ''}>Regular Customer</option>
            <option value="VIP Baker Club" ${c.tier === 'VIP Baker Club' ? 'selected' : ''}>VIP Baker Club Member</option>
            <option value="Corporate / Event" ${c.tier === 'Corporate / Event' ? 'selected' : ''}>Corporate Client</option>
          </select>
        </div>

        <div>
          <label class="form-label">Dietary Preferences & Important Dates</label>
          <textarea name="notes" class="form-input" rows="2">${c.notes || ''}</textarea>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button type="button" onclick="CustomersView.deleteCustomerConfirm('${id}')" class="btn-3d btn-3d-secondary" style="padding: 10px 14px; color: var(--error);" title="Delete Client">
            <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
          </button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1;">Update Client</button>
        </div>
      </form>
    `;
    BakeryUI.openSheet(html, `Edit ${c.name}`);
  },

  handleEditCustomerSubmit(e, id) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    window.bakeryStore.saveCustomer({
      id,
      name: formData.get('name'),
      phone: formData.get('phone') || '',
      email: formData.get('email') || '',
      tier: formData.get('tier'),
      notes: formData.get('notes')
    });

    BakeryUI.closeSheet();
    BakeryUI.toast('Client profile updated');
    window.bakeryApp.refreshCurrentView();
  },

  deleteCustomerConfirm(id) {
    BakeryUI.confirmModal({
      title: 'Delete Client',
      message: 'Remove this client from your records?',
      confirmText: 'Delete Client',
      onConfirm: () => {
        window.bakeryStore.deleteCustomer(id);
        BakeryUI.toast('Client removed', 'warning');
        window.bakeryApp.refreshCurrentView();
      }
    });
  }
};

window.CustomersView = CustomersView;
