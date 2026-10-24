/* ==========================================================================
   VIEW: EXPENSES — LUMORA DESIGN & INDIAN MARKET
   Track Wholesale Compound, Amul Butter, Boxes, Cylinders & Utility Costs
   Date Filter (Today, Weekly, Monthly, Custom) & Editable Gas/Power Utilities
   ========================================================================== */

const ExpensesView = {
  activeCategory: 'All',
  timeFilter: 'all', // 'all', 'today', 'week', 'month', 'custom'
  customStartDate: '',
  customEndDate: '',

  render() {
    const store = window.bakeryStore;
    let expenses = store.getExpenses() || [];
    const utilities = store.getUtilities();

    const categories = [
      'All', 
      'Ingredients', 
      'Packaging', 
      'Dairy & Fats', 
      'Gas & Power', 
      'Equipment', 
      'Delivery'
    ];

    // Filter by Category
    if (this.activeCategory !== 'All') {
      expenses = expenses.filter(e => e.category === this.activeCategory);
    }

    // Filter by Date / When Bought
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (this.timeFilter === 'today') {
      expenses = expenses.filter(e => (e.date || '').split('T')[0] === todayStr);
    } else if (this.timeFilter === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      expenses = expenses.filter(e => new Date(e.date || 0) >= oneWeekAgo);
    } else if (this.timeFilter === 'month') {
      const currentYearMonth = todayStr.slice(0, 7);
      expenses = expenses.filter(e => (e.date || '').startsWith(currentYearMonth));
    } else if (this.timeFilter === 'custom' && this.customStartDate && this.customEndDate) {
      expenses = expenses.filter(e => {
        const d = (e.date || '').split('T')[0];
        return d >= this.customStartDate && d <= this.customEndDate;
      });
    }

    const totalExpenseAmount = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    return `
      <div class="expenses-screen" style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="font-size: 20px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); letter-spacing: -0.02em;">Kitchen Expenses</h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 1px;">Compounds, packaging boxes, commercial gas cylinders & utilities</p>
          </div>
          <button onclick="ExpensesView.openAddExpenseModal()" class="btn-3d btn-3d-primary" style="font-size: 12px; padding: 8px 14px;">
            <i data-lucide="plus" style="width: 15px; height: 15px;"></i>
            <span>Log Expense</span>
          </button>
        </div>

        <!-- Editable Gas, Cylinder & Power Utility Rates Card -->
        <div class="bento-card" style="padding: 14px 16px; background: var(--bg-card); border-left: 4px solid var(--c-primary);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <i data-lucide="flame" style="width: 15px; height: 15px; color: #D97706;"></i>
                <span style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
                  Commercial Cylinder & Kitchen Power Rates
                </span>
              </div>
              <div style="display: flex; gap: 14px; margin-top: 6px; flex-wrap: wrap;">
                <div>
                  <span style="font-size: 10.5px; color: var(--text-faint);">19kg Gas Cylinder:</span>
                  <span style="font-size: 13px; font-weight: 800; color: var(--text-main); font-variant-numeric: tabular-nums;">
                    ${BakeryUI.formatCurrency(utilities.gasCylinderRate || 1850)}
                  </span>
                  <span style="font-size: 10.5px; color: var(--text-muted);"> (~${utilities.gasCylinderLifeDays || 20} days)</span>
                </div>
                <div>
                  <span style="font-size: 10.5px; color: var(--text-faint);">Power Tariff:</span>
                  <span style="font-size: 13px; font-weight: 800; color: var(--text-main); font-variant-numeric: tabular-nums;">
                    ${BakeryUI.formatCurrency(utilities.electricityRatePerUnit || 8.5)}/unit
                  </span>
                </div>
              </div>
            </div>
            
            <button onclick="ExpensesView.openEditUtilitiesModal()" class="btn-3d btn-3d-secondary" style="font-size: 11px; padding: 6px 10px; flex-shrink: 0;">
              <i data-lucide="settings" style="width: 13px; height: 13px;"></i>
              <span>Edit Rates</span>
            </button>
          </div>
        </div>

        <!-- Filter Dropdowns Row: When Bought (Date Filter) & Category Dropdown -->
        <div class="bento-card" style="padding: 12px 14px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label class="form-label" style="font-size: 10.5px; margin-bottom: 4px;">When Bought (Date)</label>
              <select onchange="ExpensesView.setTimeFilter(this.value)" class="form-select" style="font-size: 11.5px; font-weight: 700; padding: 8px 10px;">
                <option value="all" ${this.timeFilter === 'all' ? 'selected' : ''}>All Time</option>
                <option value="today" ${this.timeFilter === 'today' ? 'selected' : ''}>Today</option>
                <option value="week" ${this.timeFilter === 'week' ? 'selected' : ''}>This Week</option>
                <option value="month" ${this.timeFilter === 'month' ? 'selected' : ''}>This Month</option>
                <option value="custom" ${this.timeFilter === 'custom' ? 'selected' : ''}>Custom Date Range...</option>
              </select>
            </div>

            <div>
              <label class="form-label" style="font-size: 10.5px; margin-bottom: 4px;">Category Filter</label>
              <select onchange="ExpensesView.setCategory(this.value)" class="form-select" style="font-size: 11.5px; font-weight: 700; padding: 8px 10px;">
                ${categories.map(c => `<option value="${c}" ${this.activeCategory === c ? 'selected' : ''}>${c === 'All' ? 'All Categories' : c}</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- Custom Date Range Pickers (shown when 'custom' selected) -->
          ${this.timeFilter === 'custom' ? `
            <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 6px; align-items: end; margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--border-light);">
              <div>
                <label class="form-label" style="font-size: 10px;">From Date</label>
                <input type="date" value="${this.customStartDate}" onchange="ExpensesView.setCustomDates(this.value, ExpensesView.customEndDate)" class="form-input" style="font-size: 11px; padding: 6px 8px;" />
              </div>
              <div>
                <label class="form-label" style="font-size: 10px;">To Date</label>
                <input type="date" value="${this.customEndDate}" onchange="ExpensesView.setCustomDates(ExpensesView.customStartDate, this.value)" class="form-input" style="font-size: 11px; padding: 6px 8px;" />
              </div>
              <button onclick="ExpensesView.clearCustomDates()" class="btn-3d btn-3d-secondary" style="padding: 7px 10px; font-size: 11px;">
                Reset
              </button>
            </div>
          ` : ''}
        </div>

        <!-- Total Card -->
        <div class="bento-card" style="padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 10.5px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
              Total Filtered Expenses (${expenses.length} bills)
            </div>
            <div style="font-size: 24px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); font-variant-numeric: tabular-nums; margin-top: 2px;">
              ${BakeryUI.formatCurrency(totalExpenseAmount)}
            </div>
          </div>
          <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--c-sand); color: var(--c-primary); display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-light);">
            <i data-lucide="wallet" style="width: 20px; height: 20px;"></i>
          </div>
        </div>

        <!-- Expense Transactions List -->
        ${expenses.length === 0 ? BakeryUI.getEmptyIllustration('expenses') : `
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${expenses.map(exp => `
              <div class="bento-card" style="padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                  <div style="width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--c-sand); color: var(--c-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid var(--border-light); overflow: hidden;">
                    ${exp.receipt ? `
                      <img src="${exp.receipt}" alt="Receipt" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;" onclick="ExpensesView.viewReceipt('${exp.receipt}')" />
                    ` : `
                      <i data-lucide="receipt" style="width: 18px; height: 18px;"></i>
                    `}
                  </div>
                  <div style="min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <h4 style="font-size: 14px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); word-break: break-word;">
                        ${exp.vendor || exp.category}
                      </h4>
                      <span style="font-size: 9.5px; font-weight: 700; color: var(--text-muted); background: var(--c-sand); padding: 2px 6px; border-radius: 4px;">
                        ${exp.category}
                      </span>
                    </div>
                    ${exp.notes ? `<div style="font-size: 11.5px; color: var(--text-muted); margin-top: 1px;">${exp.notes}</div>` : ''}
                    <div style="font-size: 10.5px; color: var(--text-faint); margin-top: 2px; display: flex; gap: 6px; flex-wrap: wrap;">
                      <span>Bought: <strong>${BakeryUI.formatDate(exp.date)}</strong></span>
                      <span>•</span>
                      <span>Paid via <strong>${exp.paymentMethod || 'UPI'}</strong></span>
                    </div>
                  </div>
                </div>

                <div style="text-align: right; flex-shrink: 0;">
                  <div style="font-size: 16px; font-weight: 800; color: var(--c-primary); font-variant-numeric: tabular-nums;">
                    -${BakeryUI.formatCurrency(exp.amount)}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}

      </div>
    `;
  },

  setCategory(cat) {
    this.activeCategory = cat;
    window.bakeryApp.refreshCurrentView();
  },

  setTimeFilter(val) {
    this.timeFilter = val;
    if (val === 'custom' && !this.customStartDate) {
      const today = new Date().toISOString().split('T')[0];
      this.customStartDate = today;
      this.customEndDate = today;
    }
    window.bakeryApp.refreshCurrentView();
  },

  setCustomDates(start, end) {
    this.customStartDate = start;
    this.customEndDate = end;
    window.bakeryApp.refreshCurrentView();
  },

  clearCustomDates() {
    this.timeFilter = 'all';
    this.customStartDate = '';
    this.customEndDate = '';
    window.bakeryApp.refreshCurrentView();
  },

  openEditUtilitiesModal() {
    const store = window.bakeryStore;
    const u = store.getUtilities();

    const html = `
      <form onsubmit="ExpensesView.handleSaveUtilitiesSubmit(event)" style="display: flex; flex-direction: column; gap: 12px;">
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 2px;">
          Update your recurring gas cylinder cost and commercial power tariff so recipe costing accurately captures oven baking expenses.
        </p>

        <div>
          <label class="form-label">Commercial Gas Cylinder Rate (₹)</label>
          <input type="number" step="1" name="gasCylinderRate" value="${u.gasCylinderRate || 1850}" required class="form-input" style="font-size: 16px; font-weight: 800;" />
          <span style="font-size: 10.5px; color: var(--text-muted);">19kg commercial Indane / Bharat Gas cylinder refilling price.</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Cylinder Life (Days)</label>
            <input type="number" step="1" name="gasCylinderLifeDays" value="${u.gasCylinderLifeDays || 20}" required class="form-input" />
            <span style="font-size: 10px; color: var(--text-faint);">Average baking days per cylinder</span>
          </div>
          <div>
            <label class="form-label">Electricity Rate / Unit (₹)</label>
            <input type="number" step="0.1" name="electricityRatePerUnit" value="${u.electricityRatePerUnit || 8.5}" required class="form-input" />
            <span style="font-size: 10px; color: var(--text-faint);">Commercial / domestic tariff</span>
          </div>
        </div>

        <div>
          <label class="form-label">Estimated Monthly Power Bill (₹)</label>
          <input type="number" step="10" name="monthlyEstimatedPower" value="${u.monthlyEstimatedPower || 3200}" class="form-input" />
          <span style="font-size: 10.5px; color: var(--text-muted);">Deck oven, mixer and blast chiller estimated monthly bill.</span>
        </div>

        <div>
          <label class="form-label">Utility & Equipment Notes</label>
          <textarea name="notes" class="form-input" rows="2" style="font-size: 12px;">${u.notes || ''}</textarea>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button type="button" onclick="BakeryUI.closeSheet()" class="btn-3d btn-3d-secondary" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1;">Save Utility Rates</button>
        </div>
      </form>
    `;
    BakeryUI.openSheet(html, 'Edit Kitchen Utility & Cylinder Rates');
  },

  handleSaveUtilitiesSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    window.bakeryStore.saveUtilities({
      gasCylinderRate: parseFloat(formData.get('gasCylinderRate')) || 1850,
      gasCylinderLifeDays: parseInt(formData.get('gasCylinderLifeDays')) || 20,
      electricityRatePerUnit: parseFloat(formData.get('electricityRatePerUnit')) || 8.5,
      monthlyEstimatedPower: parseFloat(formData.get('monthlyEstimatedPower')) || 3200,
      notes: formData.get('notes') || ''
    });

    BakeryUI.closeSheet();
    BakeryUI.toast('Updated kitchen utility & cylinder rates!');
    window.bakeryApp.refreshCurrentView();
  },

  openAddExpenseModal() {
    const suppliers = window.bakeryStore.getSuppliers();
    const html = `
      <form onsubmit="ExpensesView.handleAddExpenseSubmit(event)" style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label class="form-label">Expense Amount (₹)</label>
          <input type="number" step="1" name="amount" required placeholder="e.g. 1850" class="form-input" style="font-size: 18px; font-weight: 800;" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Category</label>
            <select name="category" class="form-select">
              <option value="Ingredients">Compounds & Ingredients</option>
              <option value="Packaging">Boxes, Sleeves & Bags</option>
              <option value="Dairy & Fats">Amul Butter & Cream</option>
              <option value="Gas & Power">Commercial Gas Cylinder</option>
              <option value="Equipment">Baking Trays & Tools</option>
              <option value="Delivery">Porter / Dunzo Auto Fare</option>
            </select>
          </div>
          <div>
            <label class="form-label">Payment Mode</label>
            <select name="paymentMethod" class="form-select">
              <option value="UPI / GPay">UPI (GPay / PhonePe)</option>
              <option value="Cash">Cash (Updates Drawer)</option>
              <option value="Card / Netbanking">Bank Transfer / Card</option>
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Date Bought</label>
            <input type="date" name="date" value="${new Date().toISOString().split('T')[0]}" required class="form-input" />
          </div>
          <div>
            <label class="form-label">Vendor / Store Name</label>
            <input type="text" name="vendor" placeholder="e.g. BakePro or Amul" class="form-input" list="supplier-datalist" />
            <datalist id="supplier-datalist">
              ${suppliers.map(s => `<option value="${s.name}"></option>`).join('')}
            </datalist>
          </div>
        </div>

        <div>
          <label class="form-label">Expense Notes / Invoice Ref</label>
          <input type="text" name="notes" placeholder="e.g. 19kg commercial cylinder refilled or 5kg butter" class="form-input" />
        </div>

        <!-- Receipt Photo -->
        ${BakeryUI.renderImageUpload({
          id: 'expense-receipt',
          label: 'Receipt / Bill Photo (Optional)',
          helpText: 'Snap bill with camera or pick from gallery.'
        })}

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button type="button" onclick="BakeryUI.closeSheet()" class="btn-3d btn-3d-secondary" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1;">Log Expense</button>
        </div>
      </form>
    `;
    BakeryUI.openSheet(html, 'Record Kitchen Expense');
  },

  handleAddExpenseSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const receiptVal = document.getElementById('expense-receipt-value')?.value || '';
    const dateVal = formData.get('date') ? `${formData.get('date')}T12:00:00.000Z` : new Date().toISOString();

    const newExp = {
      amount: parseFloat(formData.get('amount')) || 0,
      category: formData.get('category'),
      paymentMethod: formData.get('paymentMethod'),
      vendor: formData.get('vendor') || 'Kitchen Store',
      notes: formData.get('notes') || '',
      receipt: receiptVal,
      date: dateVal
    };

    window.bakeryStore.saveExpense(newExp);
    BakeryUI.closeSheet();
    BakeryUI.toast(`Logged expense of ${BakeryUI.formatCurrency(newExp.amount)}!`);
    window.bakeryApp.refreshCurrentView();
  },

  viewReceipt(receiptUrl) {
    const html = `
      <div style="text-align: center;">
        <img src="${receiptUrl}" alt="Bill Receipt" style="max-width: 100%; max-height: 70vh; border-radius: 12px; box-shadow: var(--shadow-sm);" />
        <div style="margin-top: 12px;">
          <button onclick="BakeryUI.closeSheet()" class="btn-3d btn-3d-secondary" style="width: 100%;">Close</button>
        </div>
      </div>
    `;
    BakeryUI.openSheet(html, 'Receipt Preview');
  }
};

window.ExpensesView = ExpensesView;
