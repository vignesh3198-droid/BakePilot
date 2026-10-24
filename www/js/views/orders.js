/* ==========================================================================
   VIEW: ORDERS PIPELINE — LUMORA LUXURY DESIGN
   Status Dropdown • Date / Period Dropdown • 3D Bento Cards • Advance Tracking
   ========================================================================== */

const OrdersView = {
  activeStatusFilter: 'all',
  activePeriodFilter: 'all', // 'all', 'today', 'weekly', 'monthly', 'custom'
  customStartDate: '',
  customEndDate: '',
  activeViewMode: 'list',
  searchQuery: '',

  render() {
    const store = window.bakeryStore;
    let orders = store.getOrders();

    // 1. Text Search Filter
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      orders = orders.filter(o => 
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        (o.customerPhone && o.customerPhone.includes(q)) ||
        (o.items && o.items.some(i => i.name.toLowerCase().includes(q)))
      );
    }

    // 2. Status Dropdown Filter
    if (this.activeStatusFilter !== 'all') {
      orders = orders.filter(o => o.status === this.activeStatusFilter);
    }

    // 3. Date / Period Dropdown Filter
    const todayStr = new Date().toISOString().split('T')[0];
    if (this.activePeriodFilter === 'today') {
      orders = orders.filter(o => o.date === todayStr);
    } else if (this.activePeriodFilter === 'weekly') {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      orders = orders.filter(o => o.date >= weekAgo);
    } else if (this.activePeriodFilter === 'monthly') {
      const monthStart = todayStr.slice(0, 7) + '-01';
      orders = orders.filter(o => o.date >= monthStart);
    } else if (this.activePeriodFilter === 'custom') {
      if (this.customStartDate) {
        orders = orders.filter(o => o.date >= this.customStartDate);
      }
      if (this.customEndDate) {
        orders = orders.filter(o => o.date <= this.customEndDate);
      }
    }

    const pendingCount = store.getOrders().filter(o => o.status === 'pending').length;
    const bakingCount = store.getOrders().filter(o => o.status === 'in-oven').length;
    const readyCount = store.getOrders().filter(o => o.status === 'ready').length;

    return `
      <div class="orders-screen" style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Standard Header -->
        ${BakeryUI.renderHeader({
          title: 'Bakery Orders',
          subtitle: 'Orders, delivery schedules, advance payments & invoices',
          actionHtml: `
            <button onclick="OrdersView.openNewOrderModal()" class="btn-3d btn-3d-primary btn-3d-sm">
              <i data-lucide="plus" style="width: 15px; height: 15px;"></i>
              <span>New Order</span>
            </button>
          `
        })}

        <!-- Quick Summary Ribbon -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
          <div class="bento-card" style="padding: 10px 12px; text-align: center; border-bottom: 3px solid var(--warning);">
            <div style="font-size: 10.5px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">Pending</div>
            <div style="font-size: 17px; font-weight: 800; color: var(--warning); margin-top: 1px;" class="tabular-nums">${pendingCount}</div>
          </div>
          <div class="bento-card" style="padding: 10px 12px; text-align: center; border-bottom: 3px solid var(--c-deep);">
            <div style="font-size: 10.5px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">In Oven</div>
            <div style="font-size: 17px; font-weight: 800; color: var(--c-deep); margin-top: 1px;" class="tabular-nums">${bakingCount}</div>
          </div>
          <div class="bento-card" style="padding: 10px 12px; text-align: center; border-bottom: 3px solid var(--success);">
            <div style="font-size: 10.5px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">Ready</div>
            <div style="font-size: 17px; font-weight: 800; color: var(--success); margin-top: 1px;" class="tabular-nums">${readyCount}</div>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="search-input-wrapper">
          <i data-lucide="search" style="width: 16px; height: 16px;"></i>
          <input 
            type="text" 
            placeholder="Search order #, customer name, phone, or cake..." 
            class="form-input" 
            value="${this.searchQuery}"
            oninput="OrdersView.handleSearch(this.value)"
          />
          ${this.searchQuery ? `
            <button onclick="OrdersView.clearSearch()" style="position: absolute; right: 14px; background: none; border: none; font-size: 15px; color: var(--text-faint); cursor: pointer;">✕</button>
          ` : ''}
        </div>

        <!-- Dual Dropdown Filters: Status & Date Range (As Requested) -->
        <div class="bento-card" style="padding: 12px 14px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <!-- Status Dropdown Filter -->
            <div>
              <label class="form-label">Order Status</label>
              <select onchange="OrdersView.setStatusFilter(this.value)" class="form-select" style="font-weight: 700; border-radius: var(--radius-full); padding: 8px 12px; font-size: 12.5px;">
                <option value="all" ${this.activeStatusFilter === 'all' ? 'selected' : ''}>All Orders (All)</option>
                <option value="pending" ${this.activeStatusFilter === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="in-oven" ${this.activeStatusFilter === 'in-oven' ? 'selected' : ''}>In Oven (Baking)</option>
                <option value="ready" ${this.activeStatusFilter === 'ready' ? 'selected' : ''}>Ready for Pickup</option>
                <option value="delivered" ${this.activeStatusFilter === 'delivered' ? 'selected' : ''}>Delivered / Completed</option>
              </select>
            </div>

            <!-- Date Period Filter Dropdown -->
            <div>
              <label class="form-label">Time Period</label>
              <select onchange="OrdersView.setPeriodFilter(this.value)" class="form-select" style="font-weight: 700; border-radius: var(--radius-full); padding: 8px 12px; font-size: 12.5px;">
                <option value="all" ${this.activePeriodFilter === 'all' ? 'selected' : ''}>Overall (All Time)</option>
                <option value="today" ${this.activePeriodFilter === 'today' ? 'selected' : ''}>Date wise (Today)</option>
                <option value="weekly" ${this.activePeriodFilter === 'weekly' ? 'selected' : ''}>Weekly (Last 7 Days)</option>
                <option value="monthly" ${this.activePeriodFilter === 'monthly' ? 'selected' : ''}>Monthly (This Month)</option>
                <option value="custom" ${this.activePeriodFilter === 'custom' ? 'selected' : ''}>Customised Date Range...</option>
              </select>
            </div>
          </div>

          <!-- Customised Date Picker Inputs (shown when custom is selected) -->
          ${this.activePeriodFilter === 'custom' ? `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding-top: 6px; border-top: 1px dashed var(--border-light);">
              <div>
                <label class="form-label">From Date</label>
                <input type="date" value="${this.customStartDate}" onchange="OrdersView.setCustomStartDate(this.value)" class="form-input" style="padding: 7px 10px; font-size: 12px;" />
              </div>
              <div>
                <label class="form-label">To Date</label>
                <input type="date" value="${this.customEndDate}" onchange="OrdersView.setCustomEndDate(this.value)" class="form-input" style="padding: 7px 10px; font-size: 12px;" />
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Orders Cards -->
        ${orders.length === 0 ? BakeryUI.getEmptyIllustration('orders') : this.renderList(orders)}

      </div>
    `;
  },

  renderList(orders) {
    return `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${orders.map(order => {
          const delivery = Number(order.deliveryCharge || 0);
          const advance = Number(order.advancePaid || 0);
          const balance = Number(order.balanceDue || 0);

          return `
            <div class="bento-card bento-card-interactive" onclick="OrdersView.showOrderDetails('${order.id}')" style="padding: 14px 16px; border-left: 4px solid ${order.status === 'ready' ? 'var(--success)' : order.status === 'in-oven' ? 'var(--c-deep)' : order.status === 'delivered' ? 'var(--text-muted)' : 'var(--warning)'}; cursor: pointer;">
              
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 11px; font-weight: 800; color: var(--c-primary); background: var(--c-almond); padding: 2px 7px; border-radius: 6px;">
                      ${order.id}
                    </span>
                    <span style="font-size: 11px; color: var(--text-faint);">
                      ${BakeryUI.formatDate(order.date)}
                    </span>
                  </div>
                  <h3 style="font-size: 15px; font-weight: 700; color: var(--text-main); font-family: var(--font-heading); margin-top: 4px;">
                    ${order.customerName}
                  </h3>
                </div>

                <div style="text-align: right;">
                  <div style="font-size: 16px; font-weight: 800; color: var(--text-main);" class="tabular-nums">
                    ${BakeryUI.formatCurrency(order.total)}
                  </div>
                  <div style="margin-top: 3px;">
                    ${BakeryUI.renderStatusBadge(order.status)}
                  </div>
                </div>
              </div>

              <!-- Items Ordered -->
              <div style="margin: 8px 0; padding: 7px 11px; background: var(--c-sand); border-radius: 12px; border: 1px solid var(--border-light);">
                ${order.items.map(i => `
                  <div style="font-size: 12px; color: var(--text-main); display: flex; justify-content: space-between; padding: 1.5px 0;">
                    <span><strong>${i.qty}x</strong> ${i.name} ${i.variantName ? `<small style="color:var(--text-muted);">(${i.variantName})</small>` : ''}</span>
                    <span style="color: var(--text-muted);" class="tabular-nums">${BakeryUI.formatCurrency(i.price * i.qty)}</span>
                  </div>
                `).join('')}

                ${order.cakeMessage ? `
                  <div style="font-size: 11px; color: var(--c-deep); margin-top: 4px; font-style: italic;">
                    🎂 Message: "${order.cakeMessage}"
                  </div>
                ` : ''}
              </div>

              <!-- Advance & Balance Indicator (if applicable) -->
              ${advance > 0 && balance > 0 ? `
                <div style="display: flex; justify-content: space-between; font-size: 11.5px; padding: 3px 0; color: var(--text-muted);">
                  <span>Advance: <strong style="color: var(--success);">${BakeryUI.formatCurrency(advance)}</strong></span>
                  <span>Balance Due: <strong style="color: var(--error);">${BakeryUI.formatCurrency(balance)}</strong></span>
                </div>
              ` : ''}

              <!-- Footer: Slot, Fulfilment Method & Status Progression Button -->
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 8px; margin-top: 4px;">
                <div style="font-size: 11.5px; color: var(--text-muted); display: flex; align-items: center; gap: 8px;">
                  <span style="display: flex; align-items: center; gap: 3px;">
                    <i data-lucide="clock" style="width: 12px; height: 12px;"></i>
                    <span>${order.deliverySlot}</span>
                  </span>
                  <span>•</span>
                  <span>${order.fulfilmentMethod === 'self_pickup' ? 'Pickup (₹0)' : `Delivery (+₹${delivery})`}</span>
                </div>

                <button 
                  type="button"
                  onclick="event.stopPropagation(); OrdersView.advanceStatus('${order.id}', '${order.status}')" 
                  class="btn-3d btn-3d-secondary btn-3d-sm"
                >
                  ${OrdersView.getNextStatusLabel(order.status)}
                </button>
              </div>

            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  getNextStatusLabel(currentStatus) {
    switch (currentStatus) {
      case 'pending': return 'Start Baking →';
      case 'in-oven': return 'Mark Ready →';
      case 'ready': return 'Complete ✓';
      default: return 'Completed';
    }
  },

  advanceStatus(orderId, currentStatus) {
    let next = 'in-oven';
    if (currentStatus === 'pending') next = 'in-oven';
    else if (currentStatus === 'in-oven') next = 'ready';
    else if (currentStatus === 'ready') next = 'delivered';
    else return;

    window.bakeryStore.updateOrderStatus(orderId, next);
    BakeryUI.toast(`Order ${orderId} moved to ${next.toUpperCase()}`);
    window.bakeryApp.refreshCurrentView();
  },

  setStatusFilter(status) {
    this.activeStatusFilter = status;
    window.bakeryApp.refreshCurrentView();
  },

  setPeriodFilter(period) {
    this.activePeriodFilter = period;
    window.bakeryApp.refreshCurrentView();
  },

  setCustomStartDate(date) {
    this.customStartDate = date;
    window.bakeryApp.refreshCurrentView();
  },

  setCustomEndDate(date) {
    this.customEndDate = date;
    window.bakeryApp.refreshCurrentView();
  },

  handleSearch(val) {
    this.searchQuery = val;
    window.bakeryApp.refreshCurrentView();
  },

  clearSearch() {
    this.searchQuery = '';
    window.bakeryApp.refreshCurrentView();
  },

  showOrderDetails(orderId) {
    const order = window.bakeryStore.getOrder(orderId);
    if (!order) return;

    const delivery = Number(order.deliveryCharge || 0);
    const advance = Number(order.advancePaid || 0);
    const balance = Number(order.balanceDue || 0);

    const html = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 10px; border-bottom: 1px solid var(--border-light);">
          <div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 13px; font-weight: 800; color: var(--c-primary);">${order.id}</span>
              <span style="font-size: 12px; color: var(--text-faint);">• ${BakeryUI.formatDate(order.date)}</span>
            </div>
            <h3 style="font-size: 17px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); margin-top: 2px;">
              ${order.customerName}
            </h3>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 1px;">
              📞 ${order.customerPhone}
            </div>
          </div>
          <div>${BakeryUI.renderStatusBadge(order.status)}</div>
        </div>

        <!-- Fulfilment Info -->
        <div class="bento-card" style="padding: 12px 14px; background: var(--c-sand); border-radius: 14px;">
          <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">Fulfilment Details</div>
          <div style="font-size: 13.5px; font-weight: 700; color: var(--text-main); margin-top: 3px;">
            ${order.deliveryType} • ${order.deliverySlot}
          </div>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
            📍 ${order.deliveryAddress || 'Self Pickup at Kitchen'}
          </div>
          ${order.porterTrackingRef ? `
            <div style="margin-top: 6px; display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 11.5px; font-weight: 700; color: var(--c-deep);">Porter Ref: ${order.porterTrackingRef}</span>
              <a href="https://www.porter.in" target="_blank" class="btn-3d btn-3d-secondary btn-3d-sm" style="padding: 3px 8px; font-size: 10px;">
                Track Live
              </a>
            </div>
          ` : ''}
        </div>

        <!-- Items Breakdown -->
        <div class="bento-card" style="padding: 12px 14px; border-radius: 14px;">
          <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">
            Items Ordered
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${order.items.map(it => `
              <div style="display: flex; justify-content: space-between; font-size: 13px;">
                <span><strong>${it.qty}x</strong> ${it.name} ${it.variantName ? `<small>(${it.variantName})</small>` : ''}</span>
                <span style="font-weight: 700;" class="tabular-nums">${BakeryUI.formatCurrency(it.price * it.qty)}</span>
              </div>
            `).join('')}
          </div>

          <div style="border-top: 1px solid var(--border-light); margin-top: 10px; padding-top: 8px; display: flex; flex-direction: column; gap: 4px; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
              <span>Subtotal:</span><span class="tabular-nums">${BakeryUI.formatCurrency(order.subtotal || order.total)}</span>
            </div>
            ${order.discount ? `
              <div style="display: flex; justify-content: space-between; color: var(--success); font-weight: 700;">
                <span>Discount:</span><span class="tabular-nums">-${BakeryUI.formatCurrency(order.discount)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
              <span>Delivery Charge:</span><span>${delivery > 0 ? `+${BakeryUI.formatCurrency(delivery)}` : '₹0.00 (Self Pickup / Free)'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: 800; color: var(--text-main); border-top: 1.5px solid var(--border-light); padding-top: 5px; margin-top: 2px;">
              <span>Total Amount:</span><span class="tabular-nums">${BakeryUI.formatCurrency(order.total)}</span>
            </div>

            <!-- Advance and Balance -->
            <div style="display: flex; justify-content: space-between; color: var(--success); font-weight: 700; margin-top: 2px;">
              <span>Advance Paid:</span><span class="tabular-nums">${BakeryUI.formatCurrency(advance)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: 800; color: ${balance > 0 ? 'var(--error)' : 'var(--success)'};">
              <span>Balance Due:</span><span class="tabular-nums">${BakeryUI.formatCurrency(balance)}</span>
            </div>
          </div>
        </div>

        <!-- Quick Payment Settlement Action if balance is due -->
        ${balance > 0 ? `
          <div style="background: var(--warning-bg); padding: 10px 14px; border-radius: 14px; border: 1px solid rgba(166,104,36,0.25); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 12.5px; font-weight: 800; color: var(--warning);">Collect Remaining Balance</div>
              <div style="font-size: 11px; color: var(--text-muted);">₹${balance.toFixed(2)} due on delivery</div>
            </div>
            <button onclick="OrdersView.markFullPayment('${order.id}')" class="btn-3d btn-3d-mint btn-3d-sm">
              Mark Paid ✓
            </button>
          </div>
        ` : ''}

        <!-- Status Toggles -->
        <div>
          <label class="form-label">Update Status</label>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;">
            ${['pending', 'in-oven', 'ready', 'delivered'].map(st => `
              <button 
                onclick="OrdersView.updateStatusAndClose('${order.id}', '${st}')" 
                class="btn-3d ${order.status === st ? 'btn-3d-primary' : 'btn-3d-secondary'} btn-3d-sm"
                style="text-transform: capitalize; padding: 6px 2px; font-size: 11px;"
              >
                ${st.replace('-', ' ')}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Actions -->
        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button onclick="OrdersView.viewInvoiceForOrder('${order.id}')" class="btn-3d btn-3d-primary" style="flex: 1;">
            <i data-lucide="receipt" style="width: 15px; height: 15px;"></i>
            <span>Official Invoice</span>
          </button>
          <button onclick="OrdersView.deleteOrderConfirm('${order.id}')" class="btn-destructive" style="padding: 8px 14px;">
            <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
          </button>
        </div>

      </div>
    `;

    BakeryUI.openSheet(html, `Order ${order.id}`);
  },

  markFullPayment(orderId) {
    const order = window.bakeryStore.getOrder(orderId);
    if (!order) return;

    window.bakeryStore.updateOrder(orderId, {
      advancePaid: order.total,
      balanceDue: 0,
      paymentStatus: 'paid'
    });

    BakeryUI.toast(`Order ${orderId} marked as fully paid! ✓`);
    this.showOrderDetails(orderId);
    window.bakeryApp.refreshCurrentView();
  },

  updateStatusAndClose(orderId, st) {
    window.bakeryStore.updateOrderStatus(orderId, st);
    BakeryUI.closeSheet();
    BakeryUI.toast(`Status updated to ${st.toUpperCase()}`);
    window.bakeryApp.refreshCurrentView();
  },

  deleteOrderConfirm(orderId) {
    BakeryUI.confirmModal({
      title: 'Delete Order',
      message: `Are you sure you want to delete order ${orderId}? This cannot be undone.`,
      confirmText: 'Delete Order',
      onConfirm: () => {
        window.bakeryStore.deleteOrder(orderId);
        BakeryUI.toast('Order deleted', 'warning');
        window.bakeryApp.refreshCurrentView();
      }
    });
  },

  viewInvoiceForOrder(orderId) {
    BakeryUI.closeSheet();
    window.InvoiceView.openForOrder(orderId);
  },

  openNewOrderModal() {
    window.OrderWizard.initWizard();
  }
};

window.OrdersView = OrdersView;
