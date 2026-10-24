/* ==========================================================================
   VIEW: CASHBOOK — INDIAN MARKET
   Cash Drawer Float, Daily Cash In vs Out Ledger & Reconciliation
   ========================================================================== */

const CashbookView = {
  render() {
    const store = window.bakeryStore;
    const cashbook = store.getCashbook();

    return `
      <div class="cashbook-screen" style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="font-size: 20px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); letter-spacing: -0.02em;">Kitchen Cashbook</h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 1px;">Daily cash register float, counter cash sales & petty cash</p>
          </div>
          <button onclick="CashbookView.openAddEntryModal()" class="clay-btn" style="font-size: 12px; padding: 8px 14px; background: var(--pastel-rose-subtle); color: var(--pastel-rose-deep);">
            <i data-lucide="plus" style="width: 15px; height: 15px;"></i>
            <span>Log Cash</span>
          </button>
        </div>

        <!-- Cash Drawer Balance Card -->
        <div class="glass-card" style="padding: 18px 20px; border-left: 4px solid var(--pastel-rose-deep);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div>
              <div style="font-size: 11px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.05em;">
                Cash Register Closing Balance
              </div>
              <div style="font-size: 28px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); font-variant-numeric: tabular-nums; margin-top: 2px;">
                ${BakeryUI.formatCurrency(cashbook.closingBalance)}
              </div>
            </div>

            <span class="status-badge badge-mint" style="font-size: 11px;">
              ✓ Balanced
            </span>
          </div>

          <!-- Split -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; border-top: 1px solid var(--border-hairline); padding-top: 10px; font-size: 12px;">
            <div style="background: rgba(255,255,255,0.6); padding: 8px 10px; border-radius: 10px; border: 1px solid var(--border-hairline);">
              <div style="color: var(--text-faint); font-size: 10px; font-weight: 700; text-transform: uppercase;">Opening Float</div>
              <div style="font-size: 14px; font-weight: 800; color: var(--text-main); font-variant-numeric: tabular-nums; margin-top: 2px;">
                ${BakeryUI.formatCurrency(cashbook.openingBalance)}
              </div>
            </div>

            <div style="background: var(--pastel-mint-subtle); padding: 8px 10px; border-radius: 10px; border: 1px solid rgba(46,107,79,0.2);">
              <div style="color: var(--success); font-size: 10px; font-weight: 700; text-transform: uppercase;">Cash In (+)</div>
              <div style="font-size: 14px; font-weight: 800; color: var(--success); font-variant-numeric: tabular-nums; margin-top: 2px;">
                +${BakeryUI.formatCurrency(cashbook.cashIn)}
              </div>
            </div>

            <div style="background: var(--pastel-rose-subtle); padding: 8px 10px; border-radius: 10px; border: 1px solid rgba(184,75,88,0.2);">
              <div style="color: var(--pastel-rose-deep); font-size: 10px; font-weight: 700; text-transform: uppercase;">Cash Out (–)</div>
              <div style="font-size: 14px; font-weight: 800; color: var(--pastel-rose-deep); font-variant-numeric: tabular-nums; margin-top: 2px;">
                -${BakeryUI.formatCurrency(cashbook.cashOut)}
              </div>
            </div>
          </div>
        </div>

        <!-- Cash Ledger -->
        <div>
          <div style="font-size: 11.5px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; padding-left: 2px;">
            Today's Cash Ledger Entries (${cashbook.records.length})
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${cashbook.records.slice().reverse().map(entry => `
              <div class="glass-card" style="padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 32px; height: 32px; border-radius: 8px; background: ${entry.type === 'in' ? 'var(--pastel-mint-subtle)' : 'var(--pastel-rose-subtle)'}; color: ${entry.type === 'in' ? 'var(--success)' : 'var(--pastel-rose-deep)'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; box-shadow: var(--clay-shadow-sm);">
                    ${entry.type === 'in' ? '+' : '–'}
                  </div>
                  <div>
                    <div style="font-size: 13.5px; font-weight: 700; color: var(--text-main); font-family: var(--font-heading);">${entry.description}</div>
                    <div style="font-size: 11px; color: var(--text-faint);">${entry.time} • ${entry.category}</div>
                  </div>
                </div>

                <div style="font-size: 15px; font-weight: 800; color: ${entry.type === 'in' ? 'var(--success)' : 'var(--pastel-rose-deep)'}; font-variant-numeric: tabular-nums;">
                  ${entry.type === 'in' ? '+' : '–'}${BakeryUI.formatCurrency(entry.amount)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  },

  openAddEntryModal() {
    const html = `
      <form onsubmit="CashbookView.handleAddEntrySubmit(event)" style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label class="form-label">Transaction Type</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <label style="background: var(--pastel-mint-subtle); border: 1.5px solid rgba(46, 107, 79, 0.25); padding: 9px; border-radius: 10px; display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="radio" name="type" value="in" checked style="accent-color: var(--success);" />
              <span style="font-weight: 700; font-size: 13px; color: var(--success);">Cash In (+)</span>
            </label>
            <label style="background: var(--pastel-rose-subtle); border: 1.5px solid rgba(184, 75, 88, 0.25); padding: 9px; border-radius: 10px; display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="radio" name="type" value="out" style="accent-color: var(--pastel-rose-deep);" />
              <span style="font-weight: 700; font-size: 13px; color: var(--pastel-rose-deep);">Cash Out (–)</span>
            </label>
          </div>
        </div>

        <div>
          <label class="form-label">Amount (₹)</label>
          <input type="number" step="1" name="amount" required placeholder="0.00" class="form-input" style="font-size: 18px; font-weight: 800;" />
        </div>

        <div>
          <label class="form-label">Category</label>
          <select name="category" class="form-select">
            <option value="Sales">Walk-in Counter Sale</option>
            <option value="Float">Float Adjustment</option>
            <option value="Expense">Petty Cash / Grocery Run</option>
            <option value="Delivery">Auto / Dunzo Delivery Tip</option>
          </select>
        </div>

        <div>
          <label class="form-label">Description</label>
          <input type="text" name="description" required placeholder="e.g. Bought 2kg milk compound or urgent eggs" class="form-input" />
        </div>

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button type="button" onclick="BakeryUI.closeSheet()" class="btn btn-secondary" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn btn-primary" style="flex: 1;">Save Entry</button>
        </div>
      </form>
    `;
    BakeryUI.openSheet(html, 'Log Cashbook Transaction');
  },

  handleAddEntrySubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const amount = parseFloat(formData.get('amount')) || 0;
    const type = formData.get('type');
    const description = formData.get('description');
    const category = formData.get('category');

    window.bakeryStore.addCashRecord({
      type,
      amount,
      description,
      category,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    });

    BakeryUI.closeSheet();
    BakeryUI.toast(`Logged ${type === 'in' ? '+' : '–'}₹${amount} to cashbook!`);
    window.bakeryApp.refreshCurrentView();
  }
};

window.CashbookView = CashbookView;
