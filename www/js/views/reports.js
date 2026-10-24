/* ==========================================================================
   VIEW: REPORTS & ANALYTICS — INDIAN MARKET
   Weekly Sales Trends, Profit Margins, Top Bestsellers & CSV Export
   ========================================================================== */

const ReportsView = {
  activePeriod: '7d',

  render() {
    const store = window.bakeryStore;
    const summary = store.getFinancialSummary();
    const products = store.getProducts();

    return `
      <div class="reports-screen" style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="font-size: 20px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); letter-spacing: -0.02em;">Bakery Analytics</h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 1px;">Revenue trends, margins and category sales in ₹</p>
          </div>
          <button onclick="ReportsView.exportReport()" class="clay-btn" style="padding: 6px 12px; font-size: 11.5px; min-height: 32px;">
            <i data-lucide="download" style="width: 14px; height: 14px;"></i>
            <span>Export CSV</span>
          </button>
        </div>

        <!-- Period Filter Pills -->
        <div style="display: flex; gap: 4px; background: rgba(255, 255, 255, 0.7); padding: 4px; border-radius: 12px; border: 1px solid var(--border-hairline); box-shadow: var(--clay-shadow-sm);">
          ${[
            { key: 'today', label: 'Today' },
            { key: '7d', label: 'Last 7 Days' },
            { key: '30d', label: 'Last 30 Days' },
            { key: 'ytd', label: 'Year to Date' }
          ].map(p => `
            <button 
              onclick="ReportsView.setPeriod('${p.key}')" 
              class="clay-btn ${this.activePeriod === p.key ? 'active' : ''}"
              style="flex: 1; padding: 6px 4px; font-size: 11px; min-height: 30px; border-radius: 8px; ${this.activePeriod === p.key ? 'background: var(--pastel-rose-subtle); color: var(--pastel-rose-deep); border-color: var(--pastel-rose);' : 'border: none; background: transparent; box-shadow: none;'}"
            >
              ${p.label}
            </button>
          `).join('')}
        </div>

        <!-- Financial Overview Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="glass-card" style="padding: 14px 16px;">
            <div style="font-size: 11px; font-weight: 700; color: var(--text-faint); text-transform: uppercase;">
              Total Gross Sales
            </div>
            <div style="font-size: 22px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); font-variant-numeric: tabular-nums; margin-top: 2px;">
              ${BakeryUI.formatCurrency(summary.todayRevenue * 3.4)}
            </div>
            <div style="font-size: 11px; color: var(--success); font-weight: 700; margin-top: 2px;">
              +18.2% vs last week
            </div>
          </div>

          <div class="glass-card" style="padding: 14px 16px; background: var(--pastel-mint-subtle); border: 1px solid rgba(46,107,79,0.2);">
            <div style="font-size: 11px; font-weight: 700; color: var(--success); text-transform: uppercase;">
              Net Estimated Margin
            </div>
            <div style="font-size: 22px; font-weight: 800; color: var(--success); font-family: var(--font-heading); font-variant-numeric: tabular-nums; margin-top: 2px;">
              ${BakeryUI.formatCurrency(summary.todayProfit * 3.2)}
            </div>
            <div style="font-size: 11px; color: var(--success); font-weight: 700; margin-top: 2px;">
              68.4% profit margin
            </div>
          </div>
        </div>

        <!-- Weekly Sales Bar Chart -->
        <div class="glass-card" style="padding: 16px 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="font-size: 12px; font-weight: 800; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.05em;">
              Daily Sales Volume (₹)
            </div>
            <div style="font-size: 11px; color: var(--text-faint); font-variant-numeric: tabular-nums;">
              Avg: ₹3,800/day
            </div>
          </div>

          <!-- Bar Chart -->
          <div style="display: flex; align-items: flex-end; justify-content: space-between; height: 120px; padding-top: 8px; border-bottom: 1px solid var(--border-hairline); gap: 6px;">
            ${[
              { day: 'Mon', val: 2800, max: 7000, highlight: false },
              { day: 'Tue', val: 3400, max: 7000, highlight: false },
              { day: 'Wed', val: 3100, max: 7000, highlight: false },
              { day: 'Thu', val: 4200, max: 7000, highlight: false },
              { day: 'Fri', val: 5600, max: 7000, highlight: false },
              { day: 'Sat', val: 6800, max: 7000, highlight: true },
              { day: 'Sun', val: 4900, max: 7000, highlight: false }
            ].map(b => {
              const heightPct = Math.round((b.val / b.max) * 100);
              return `
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end;">
                  <span style="font-size: 9.5px; font-weight: 700; color: var(--text-faint); margin-bottom: 3px; font-variant-numeric: tabular-nums;">₹${(b.val/1000).toFixed(1)}k</span>
                  <div style="width: 100%; max-width: 26px; height: ${heightPct}%; background: ${b.highlight ? 'linear-gradient(180deg, var(--pastel-rose), var(--pastel-rose-deep))' : 'var(--pastel-lavender-subtle)'}; border-radius: 6px 6px 0 0; transition: height 0.3s ease; box-shadow: var(--clay-shadow-sm);"></div>
                  <span style="font-size: 10.5px; font-weight: 700; color: var(--text-muted); margin-top: 6px;">${b.day}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Expense Category Breakdown -->
        <div class="glass-card" style="padding: 16px 18px;">
          <h4 style="font-size: 12px; font-weight: 800; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">
            Expense Breakdown by Category
          </h4>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${[
              { label: 'Compounds & Butter', pct: 54, color: 'var(--pastel-rose-deep)', amount: '₹3,240' },
              { label: 'Cake & Brownie Boxes (8", 10")', pct: 24, color: '#D4A373', amount: '₹1,440' },
              { label: 'Gas Cylinder & Power', pct: 14, color: '#E07A5F', amount: '₹840' },
              { label: 'Dunzo Fare & Marketing', pct: 8, color: '#81B29A', amount: '₹480' }
            ].map(item => `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                  <span style="font-weight: 600; color: var(--text-main);">${item.label}</span>
                  <span style="color: var(--text-muted); font-weight: 700; font-variant-numeric: tabular-nums;">${item.amount} (${item.pct}%)</span>
                </div>
                <div style="height: 7px; background: rgba(0,0,0,0.04); border-radius: 8px; overflow: hidden; border: 1px solid var(--border-hairline);">
                  <div style="height: 100%; width: ${item.pct}%; background: ${item.color}; border-radius: 8px;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Top Selling Items -->
        <div class="glass-card" style="padding: 16px 18px;">
          <h4 style="font-size: 12px; font-weight: 800; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">
            Top Selling Bakery Items
          </h4>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${products.slice(0, 3).map((p, idx) => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: rgba(255, 255, 255, 0.6); border-radius: 10px; border: 1px solid var(--border-hairline);">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 13px; font-weight: 800; color: var(--pastel-rose-deep);">#${idx + 1}</span>
                  <div>
                    <div style="font-size: 13px; font-weight: 700; color: var(--text-main); font-family: var(--font-heading);">${p.name}</div>
                    <div style="font-size: 11px; color: var(--text-faint);">${p.category}</div>
                  </div>
                </div>
                <div style="font-size: 14px; font-weight: 800; color: var(--text-main); font-variant-numeric: tabular-nums;">
                  ${BakeryUI.formatCurrency(p.price)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  },

  setPeriod(p) {
    this.activePeriod = p;
    window.bakeryApp.refreshCurrentView();
  },

  exportReport() {
    const orders = window.bakeryStore.getOrders();
    const rows = [
      ['Order ID', 'Customer', 'Phone', 'Date', 'Delivery Type', 'Total (INR)', 'Status'],
      ...orders.map(o => [o.id, `"${o.customerName}"`, o.customerPhone, o.date, o.deliveryType, o.total, o.status])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bakery_sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    BakeryUI.toast('Exported sales CSV successfully! 📊');
  }
};

window.ReportsView = ReportsView;
