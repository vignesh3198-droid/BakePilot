/* ==========================================================================
   VIEW: DASHBOARD (HOME) — LUMORA LUXURY DESIGN & BAKEPILOT BRANDING
   Business Name & Tagline • BakePilot Logo • Appetite Hero • Bento Tiles
   ========================================================================== */

const DashboardView = {
  render() {
    const store = window.bakeryStore;
    const profile = store.getProfile();
    const summary = store.getFinancialSummary();
    const orders = store.getOrders().slice(0, 3);
    const lowStockItems = store.getInventory().filter(i => i.currentStock <= i.minThreshold);
    const logoSrc = profile.logo || 'assets/bakepilot-logo.png';

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning, Baker! ☀️' : hour < 17 ? 'Good afternoon, Baker! 🧁' : 'Good evening, Baker! 🌙';

    const todayDateFormatted = new Date().toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });

    return `
      <div class="dashboard-screen" style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Header: BakePilot Business Logo, Business Name, Tagline & Small Green Sync Dot -->
        <div class="bento-card" style="padding: 14px 16px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
            <!-- Brand Logo Thumbnail -->
            <div style="width: 48px; height: 48px; border-radius: 14px; background: var(--bg-card); display: flex; align-items: center; justify-content: center; border: 1.5px solid var(--border-light); box-shadow: var(--shadow-bento); overflow: hidden; flex-shrink: 0; padding: 2px;">
              <img src="${logoSrc}" alt="BakePilot Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 10px;" onerror="this.src='assets/bakepilot-logo.png'" />
            </div>

            <!-- Business Name & Tagline (NOT Owner Name) -->
            <div style="min-width: 0;">
              <h2 style="font-size: 16px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${profile.name || 'BakePilot Patisserie'}
              </h2>
              <p style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${profile.tagline || 'Smart Artisan Bakery & Cloud Kitchen'}
              </p>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
            <!-- Small Green Pulse Dot (Live Cloud Sync) -->
            <div 
              class="cloud-dot-container" 
              onclick="window.bakeryApp.navigate('settings')" 
              title="Cloud Synced Live (BakePilot Cloud Active)"
            >
              <div class="cloud-dot-pulse"></div>
            </div>

            <!-- Dark Mode Toggle Button -->
            <button 
              type="button" 
              onclick="BakeryUI.toggleDarkMode()" 
              class="btn-3d btn-3d-secondary btn-3d-sm" 
              style="padding: 6px 10px;"
              title="Toggle Dark / Light Mode"
            >
              <i data-lucide="moon" style="width: 15px; height: 15px;"></i>
            </button>
          </div>
        </div>

        <!-- Super Admin Broadcast Update Announcement Mount -->
        <div id="dashboard-broadcast-container"></div>

        <!-- Appetizing Hero Banner (Animated Shimmer, Floating Pastry & Ultra-Luxe Dark/Light Mode) -->
        <div class="dashboard-hero-card">
          <div style="min-width: 0; z-index: 2;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="status-badge badge-mint" style="font-size: 9.5px; padding: 2px 7px; letter-spacing: 0.04em;">
                ${greeting}
              </span>
            </div>
            <h3 style="font-size: 19px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); line-height: 1.25; margin-top: 5px;">
              BakePilot Command
            </h3>
            <p style="font-size: 11.5px; color: var(--text-muted); margin-top: 3px; line-height: 1.35;">
              ${orders.length > 0 ? `${orders.length} active order${orders.length > 1 ? 's' : ''} in queue. Ready for baking & dispatch.` : 'Ready for fresh orders, instant POS billing and recipe costing.'}
            </p>
            <div style="display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap;">
              <button onclick="window.bakeryApp.navigate('billing')" class="btn-3d btn-3d-primary btn-3d-xs" style="padding: 6px 14px; font-size: 11.5px;">
                <i data-lucide="receipt" style="width: 13px; height: 13px;"></i>
                <span>Quick Bill</span>
              </button>
              <button onclick="OrdersView.openNewOrderModal()" class="btn-3d btn-3d-secondary btn-3d-xs" style="padding: 6px 14px; font-size: 11.5px;">
                <i data-lucide="plus" style="width: 13px; height: 13px;"></i>
                <span>Custom Order</span>
              </button>
            </div>
          </div>

          <!-- Animated Floating Bakery Pastry Visual Badge -->
          <div class="hero-pastry-container" title="BakePilot Kitchen Studio">
            <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80" alt="Fresh artisan cake" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
        </div>

        <!-- Kitchen Signature Bakes Visual Strip (Delightful, appetizing showcase) -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding: 0 2px;">
            <span style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
              Bakery Quick Showcase
            </span>
            <span style="font-size: 10.5px; color: var(--text-faint); font-weight: 600;">Tap to open</span>
          </div>

          <div class="showcase-strip">
            <!-- 1. Fudgy Brownie -->
            <div class="showcase-card" onclick="window.bakeryApp.navigate('recipes')">
              <img src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop&q=80" alt="Fudge Brownies" class="showcase-card-img" />
              <div>
                <div style="font-size: 12px; font-weight: 800; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Classic Brownie</div>
                <div style="font-size: 10px; color: var(--text-muted);">Cost: ₹34.20 • 62% margin</div>
              </div>
            </div>

            <!-- 2. Custom Celebration Cake -->
            <div class="showcase-card" onclick="OrdersView.openNewOrderModal()">
              <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=80" alt="Celebration Cake" class="showcase-card-img" onerror="this.src='https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400&auto=format&fit=crop&q=80'" />
              <div>
                <div style="font-size: 12px; font-weight: 800; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Custom Cakes</div>
                <div style="font-size: 10px; color: var(--text-muted);">Tiered & Inscription</div>
              </div>
            </div>

            <!-- 3. Red Velvet & Cupcakes -->
            <div class="showcase-card" onclick="window.bakeryApp.navigate('catalogue')">
              <img src="https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=300&auto=format&fit=crop&q=80" alt="Cupcakes" class="showcase-card-img" />
              <div>
                <div style="font-size: 12px; font-weight: 800; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Velvet Cupcake</div>
                <div style="font-size: 10px; color: var(--text-muted);">Box of 6 & 12</div>
              </div>
            </div>

            <!-- 4. Pantry Compounds & Essence -->
            <div class="showcase-card" onclick="window.bakeryApp.navigate('inventory')">
              <img src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&auto=format&fit=crop&q=80" alt="Dark Compound" class="showcase-card-img" />
              <div>
                <div style="font-size: 12px; font-weight: 800; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Choco Compounds</div>
                <div style="font-size: 10px; color: var(--text-muted);">Stock & rates tracker</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sales & Performance Bento Card -->
        <div class="bento-card" style="padding: 18px 20px; position: relative; border-left: 4px solid var(--c-deep);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
            <div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;">
                  Today's Gross Sales
                </span>
                <span style="font-size: 10.5px; color: var(--text-faint);">• ${todayDateFormatted}</span>
              </div>
              <div style="font-size: 28px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); letter-spacing: -0.02em; line-height: 1.2; margin-top: 2px;" class="tabular-nums">
                ${BakeryUI.formatCurrency(summary.todayRevenue)}
              </div>
            </div>

            <span class="status-badge badge-delivered" style="font-size: 11px;">
              +18.5% Growth
            </span>
          </div>

          <!-- Trend Sparkline -->
          <div style="margin: 6px 0 14px;">
            ${BakeryUI.renderSparkline()}
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--text-faint); font-weight: 600; margin-top: 4px;">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Today</span>
            </div>
          </div>

          <!-- Expenses & Margin Split -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding-top: 12px; border-top: 1px solid var(--border-light);">
            <div style="background: var(--c-sand); padding: 10px 12px; border-radius: 14px; border: 1px solid var(--border-light);">
              <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                Today's Expenses
              </div>
              <div style="font-size: 16px; font-weight: 800; color: var(--text-main); margin-top: 2px;" class="tabular-nums">
                ${BakeryUI.formatCurrency(summary.todayExpenses)}
              </div>
            </div>

            <div style="background: var(--success-bg); padding: 10px 12px; border-radius: 14px; border: 1px solid rgba(46, 125, 91, 0.2);">
              <div style="font-size: 11px; font-weight: 700; color: var(--success); text-transform: uppercase;">
                Net Margin
              </div>
              <div style="font-size: 16px; font-weight: 800; color: var(--success); margin-top: 2px;" class="tabular-nums">
                ${BakeryUI.formatCurrency(summary.todayProfit)}
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Kitchen Bento 3D Action Tiles -->
        <div>
          <div style="font-size: 11.5px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; padding-left: 2px;">
            Quick Kitchen Actions
          </div>

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
            <button class="action-tile" onclick="window.bakeryApp.navigate('billing')">
              <div class="tile-icon-box">
                <i data-lucide="receipt" style="width: 20px; height: 20px;"></i>
              </div>
              <span style="font-size: 11.5px; font-weight: 700; color: var(--text-main);">Counter Bill</span>
            </button>

            <button class="action-tile" onclick="OrdersView.openNewOrderModal()">
              <div class="tile-icon-box" style="background: var(--success-bg); color: var(--success);">
                <i data-lucide="plus-circle" style="width: 20px; height: 20px;"></i>
              </div>
              <span style="font-size: 11.5px; font-weight: 700; color: var(--text-main);">Add Order</span>
            </button>

            <button class="action-tile" onclick="window.bakeryApp.navigate('recipes')">
              <div class="tile-icon-box">
                <i data-lucide="calculator" style="width: 20px; height: 20px;"></i>
              </div>
              <span style="font-size: 11.5px; font-weight: 700; color: var(--text-main);">Cost Estimate</span>
            </button>

            <button class="action-tile" onclick="window.bakeryApp.navigate('inventory')">
              <div class="tile-icon-box">
                <i data-lucide="package" style="width: 20px; height: 20px;"></i>
              </div>
              <span style="font-size: 11.5px; font-weight: 700; color: var(--text-main);">Stock & Price</span>
            </button>
          </div>
        </div>

        <!-- Low Stock Ingredient Alert Banner -->
        ${lowStockItems.length > 0 ? `
          <div class="bento-card" style="padding: 12px 14px; background: var(--error-bg); border: 1.5px solid rgba(181, 66, 77, 0.25); display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i data-lucide="alert-triangle" style="width: 18px; height: 18px; color: var(--error); flex-shrink: 0;"></i>
              <div>
                <div style="font-size: 13px; font-weight: 700; color: var(--error);">
                  ${lowStockItems.length} Ingredients Below Safety Level
                </div>
                <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 1px;">
                  ${lowStockItems.map(i => i.name).slice(0, 2).join(', ')} require replenishment
                </div>
              </div>
            </div>
            <button onclick="window.bakeryApp.navigate('inventory')" class="btn-3d btn-3d-secondary btn-3d-sm">
              Pantry
            </button>
          </div>
        ` : ''}

        <!-- Active Orders Section -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 0 2px;">
            <div style="font-size: 11.5px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
              Orders in Progress (${orders.length})
            </div>
            <button onclick="window.bakeryApp.navigate('orders')" style="background: none; border: none; color: var(--c-deep); font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 2px;">
              <span>View All</span>
              <i data-lucide="chevron-right" style="width: 13px; height: 13px;"></i>
            </button>
          </div>

          ${orders.length === 0 ? `
            <div class="bento-card" style="padding: 24px 16px; text-align: center;">
              <div style="font-size: 30px; margin-bottom: 6px;">🎂</div>
              <h4 style="font-size: 14px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading);">No Active Orders</h4>
              <p style="font-size: 12px; color: var(--text-muted); margin: 3px 0 12px;">Create custom celebration cake orders or generate instant counter bills.</p>
              <div style="display: flex; gap: 8px; justify-content: center;">
                <button onclick="OrdersView.openNewOrderModal()" class="btn-3d btn-3d-primary btn-3d-sm">
                  + Create Order
                </button>
                <button onclick="window.bakeryApp.navigate('billing')" class="btn-3d btn-3d-secondary btn-3d-sm">
                  Counter Bill
                </button>
              </div>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${orders.map(order => `
                <div class="bento-card bento-card-interactive" onclick="OrdersView.showOrderDetails('${order.id}')" style="padding: 14px 16px; cursor: pointer;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                      <span style="font-size: 11px; font-weight: 700; color: var(--text-faint);">${order.id}</span>
                      <h4 style="font-size: 15px; font-weight: 700; color: var(--text-main); font-family: var(--font-heading); margin-top: 2px;">${order.customerName}</h4>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-size: 16px; font-weight: 800; color: var(--text-main);" class="tabular-nums">${BakeryUI.formatCurrency(order.total)}</div>
                      <div style="margin-top: 3px;">${BakeryUI.renderStatusBadge(order.status)}</div>
                    </div>
                  </div>

                  <div style="font-size: 11.5px; color: var(--text-muted); display: flex; align-items: center; gap: 10px; border-top: 1px solid var(--border-light); padding-top: 8px; margin-top: 8px;">
                    <span style="display: flex; align-items: center; gap: 3px;">
                      <i data-lucide="clock" style="width: 12px; height: 12px;"></i>
                      <span>${order.deliverySlot}</span>
                    </span>
                    <span>•</span>
                    <span>${order.deliveryType}</span>
                    <span>•</span>
                    <span>${order.items.length} item(s)</span>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

      </div>
    `;
  },

  checkBroadcast() {
    const url = typeof window.getServerUrl === 'function' ? window.getServerUrl('/api/broadcast') : '/api/broadcast';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!data || !data.broadcast || !data.broadcast.active) return;
        const bc = data.broadcast;
        const dismissedKey = 'bakepilot_dismissed_bc_' + bc.id;
        if (sessionStorage.getItem(dismissedKey)) return;

        const container = document.getElementById('dashboard-broadcast-container');
        if (!container) return;

        container.innerHTML = `
          <div class="bento-card" style="background: linear-gradient(135deg, #134435 0%, #0F382C 100%); border: 1.5px solid #8EBAA8; padding: 12px 14px; position: relative; margin-bottom: 2px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
              <div style="display: flex; align-items: flex-start; gap: 10px;">
                <span style="font-size: 20px; line-height: 1;">📢</span>
                <div>
                  <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
                    <span class="status-badge badge-mint" style="font-size: 9px; padding: 1px 6px;">${bc.tag || 'UPDATE'}</span>
                    <strong style="font-size: 13.5px; color: #FAF1E4; font-weight: 800;">${bc.title}</strong>
                  </div>
                  <p style="font-size: 12px; color: #8EBAA8; line-height: 1.4;">${bc.message}</p>
                </div>
              </div>
              <button onclick="DashboardView.dismissBroadcast('${bc.id}')" style="background: none; border: none; color: #8EBAA8; font-size: 14px; cursor: pointer; padding: 2px;" title="Dismiss Announcement">✕</button>
            </div>
          </div>
        `;
        lucide.createIcons();
      })
      .catch(() => {});
  },

  dismissBroadcast(id) {
    sessionStorage.setItem('bakepilot_dismissed_bc_' + id, 'true');
    const container = document.getElementById('dashboard-broadcast-container');
    if (container) container.innerHTML = '';
  }
};

window.DashboardView = DashboardView;
