/* ==========================================================================
   REUSABLE UI COMPONENTS & INTERACTION SYSTEM — LUMORA LUXURY
   Tactile 3D Buttons • Robust Currency Sanitization • Dark Mode • Bill Download
   ========================================================================== */

const BakeryUI = {
  // --- Indian Rupee Currency Formatter with Tabular Numbers & Strict Sanitization ---
  formatCurrency(amount) {
    let sym = window.bakeryStore?.getProfile()?.currencySymbol || '₹';
    // Deep guard against encoding artifacts
    if (!sym || sym.includes('\ufffd') || sym.includes(',') || sym.includes('?') || !['₹', '$', '€', '£'].includes(sym)) {
      sym = '₹';
    }
    const num = Number(amount) || 0;
    return `${sym}${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },

  // --- Date Formatter ---
  formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  },

  // --- Header Generator (Without On-Screen Back Buttons) ---
  renderHeader({ title, subtitle, actionHtml = '' }) {
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 2px 2px 0;">
        <div>
          <h2 style="font-size: 20px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); letter-spacing: -0.02em;">${title}</h2>
          ${subtitle ? `<p style="font-size: 12px; color: var(--text-muted); margin-top: 1px;">${subtitle}</p>` : ''}
        </div>
        ${actionHtml ? `<div>${actionHtml}</div>` : ''}
      </div>
    `;
  },

  // --- Dark Mode Controller ---
  initTheme() {
    const saved = localStorage.getItem('lumora_theme_preference');
    if (saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add('dark-mode');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  },

  toggleDarkMode() {
    const isDark = document.body.classList.contains('dark-mode');
    if (isDark) {
      document.body.classList.remove('dark-mode');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('lumora_theme_preference', 'light');
      BakeryUI.toast('Switched to Light Mode');
    } else {
      document.body.classList.add('dark-mode');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('lumora_theme_preference', 'dark');
      BakeryUI.toast('Switched to Dark Mode');
    }
    if (window.bakeryApp) window.bakeryApp.refreshCurrentView();
  },

  // --- Status Badges ---
  renderStatusBadge(status) {
    const s = (status || '').toLowerCase().replace(/[\s_]+/g, '-');
    let label = status;
    let className = 'status-badge ';

    switch (s) {
      case 'pending':
        className += 'badge-pending';
        label = 'Pending';
        break;
      case 'in-oven':
      case 'baking':
        className += 'badge-baking';
        label = 'In Oven';
        break;
      case 'ready':
      case 'ready-for-pickup':
        className += 'badge-ready';
        label = 'Ready for Pickup';
        break;
      case 'delivered':
      case 'completed':
        className += 'badge-delivered';
        label = 'Delivered';
        break;
      case 'cancelled':
        className += 'btn-destructive';
        label = 'Cancelled';
        break;
      case 'paid':
        className += 'badge-delivered';
        label = 'Paid';
        break;
      case 'unpaid':
        className += 'badge-pending';
        label = 'Unpaid';
        break;
      case 'partially-paid':
        className += 'badge-baking';
        label = 'Advance Paid';
        break;
      case 'instock':
      case 'in-stock':
        className += 'badge-instock';
        label = 'In Stock';
        break;
      case 'lowstock':
      case 'low-stock':
        className += 'badge-lowstock';
        label = 'Low Stock';
        break;
      case 'outstock':
      case 'out-of-stock':
        className += 'btn-destructive';
        label = 'Out of Stock';
        break;
      default:
        className += 'badge-pending';
        label = status || 'Status';
    }

    return `<span class="${className}">${label}</span>`;
  },

  // --- Universal Image Upload Component ---
  renderImageUpload({ id, currentImage = '', label = 'Photo / Image', helpText = 'JPG, PNG or WebP. Auto-compressed.', onchange = '' }) {
    const hasImage = Boolean(currentImage && currentImage.trim());
    return `
      <div class="image-uploader-container" style="display: flex; flex-direction: column; gap: 6px;">
        <label class="form-label">${label}</label>
        
        <div style="display: flex; gap: 12px; align-items: center;">
          <!-- Preview Box -->
          <div id="${id}-preview-box" class="image-preview-wrapper" style="width: 76px; height: 76px; flex-shrink: 0; background: var(--c-almond); display: flex; align-items: center; justify-content: center; border-radius: 16px; border: 1.5px solid var(--border-light); overflow: hidden; position: relative; box-shadow: var(--shadow-bento);">
            ${hasImage ? `
              <img src="${currentImage}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;" />
            ` : `
              <div style="text-align: center; color: var(--text-muted);">
                <i data-lucide="image" style="width: 22px; height: 22px; stroke-width: 1.8;"></i>
              </div>
            `}
          </div>

          <!-- Actions & File Inputs -->
          <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
            <input 
              type="file" 
              id="${id}-file-input" 
              accept="image/*" 
              capture="environment" 
              style="display: none;" 
              onchange="BakeryUI.handleImageFileSelect(event, '${id}', '${onchange}')" 
            />
            
            <input type="hidden" id="${id}-value" value="${currentImage || ''}" />

            <div style="display: flex; gap: 6px;">
              <button 
                type="button" 
                class="btn-3d btn-3d-secondary btn-3d-sm" 
                onclick="document.getElementById('${id}-file-input').click()"
              >
                <i data-lucide="camera" style="width: 13px; height: 13px;"></i>
                <span>${hasImage ? 'Change Photo' : 'Upload / Camera'}</span>
              </button>

              <button 
                type="button" 
                class="btn-3d btn-3d-secondary btn-3d-sm" 
                onclick="BakeryUI.clearUploadedImage('${id}', '${onchange}')"
                title="Remove photo"
              >
                <i data-lucide="x" style="width: 13px; height: 13px;"></i>
              </button>
            </div>

            <span style="font-size: 11px; color: var(--text-muted);">${helpText}</span>
          </div>
        </div>
      </div>
    `;
  },

  handleImageFileSelect(event, elementId, callbackName) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      BakeryUI.toast('Please select an image file', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // High quality client-side canvas compression (max 600x600, ~30-40KB)
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);

        const hiddenInput = document.getElementById(`${elementId}-value`);
        if (hiddenInput) hiddenInput.value = dataUrl;

        const previewBox = document.getElementById(`${elementId}-preview-box`);
        if (previewBox) {
          previewBox.innerHTML = `<img src="${dataUrl}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;" />`;
        }

        BakeryUI.toast('Photo ready! ✓');

        if (callbackName && typeof window[callbackName] === 'function') {
          window[callbackName](dataUrl);
        } else if (callbackName && callbackName.includes('.')) {
          const parts = callbackName.split('.');
          if (window[parts[0]] && typeof window[parts[0]][parts[1]] === 'function') {
            window[parts[0]][parts[1]](dataUrl);
          }
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  clearUploadedImage(elementId, callbackName) {
    const hiddenInput = document.getElementById(`${elementId}-value`);
    if (hiddenInput) hiddenInput.value = '';

    const previewBox = document.getElementById(`${elementId}-preview-box`);
    if (previewBox) {
      previewBox.innerHTML = `
        <div style="text-align: center; color: var(--text-muted);">
          <i data-lucide="image" style="width: 22px; height: 22px; stroke-width: 1.8;"></i>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
    }

    BakeryUI.toast('Image removed');

    if (callbackName && typeof window[callbackName] === 'function') {
      window[callbackName]('');
    } else if (callbackName && callbackName.includes('.')) {
      const parts = callbackName.split('.');
      if (window[parts[0]] && typeof window[parts[0]][parts[1]] === 'function') {
        window[parts[0]][parts[1]]('');
      }
    }
  },

  // --- In-App Confirmation Modal with 3D Buttons ---
  confirmModal({ title = 'Confirm Action', message = 'Are you sure?', confirmText = 'Confirm', cancelText = 'Cancel', onConfirm }) {
    const html = `
      <div style="display: flex; flex-direction: column; gap: 14px; text-align: center; padding: 6px 4px;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--c-almond); color: var(--c-primary); margin: 0 auto; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-bento);">
          <i data-lucide="alert-triangle" style="width: 22px; height: 22px;"></i>
        </div>
        <div>
          <h3 style="font-size: 17px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading);">${title}</h3>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px; line-height: 1.4;">${message}</p>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 8px;">
          <button onclick="BakeryUI.closeSheet()" class="btn-3d btn-3d-secondary" style="flex: 1;">
            ${cancelText}
          </button>
          <button id="modal-confirm-btn" class="btn-3d btn-3d-primary" style="flex: 1;">
            ${confirmText}
          </button>
        </div>
      </div>
    `;

    BakeryUI.openSheet(html, title);
    const confirmBtn = document.getElementById('modal-confirm-btn');
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        BakeryUI.closeSheet();
        if (typeof onConfirm === 'function') onConfirm();
      };
    }
  },

  // --- In-App Prompt Modal with 3D Buttons ---
  promptModal({ title = 'Input Required', label = 'Value', defaultValue = '', placeholder = '', onConfirm }) {
    const inputId = 'prompt-input-' + Date.now();
    const html = `
      <form onsubmit="event.preventDefault(); BakeryUI.handlePromptSubmit('${inputId}');" style="display: flex; flex-direction: column; gap: 14px; padding: 4px;">
        <div>
          <label class="form-label">${label}</label>
          <input type="text" id="${inputId}" class="form-input" value="${defaultValue}" placeholder="${placeholder}" autofocus required />
        </div>
        <div style="display: flex; gap: 10px;">
          <button type="button" onclick="BakeryUI.closeSheet()" class="btn-3d btn-3d-secondary" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn-3d btn-3d-primary" style="flex: 1;">Save</button>
        </div>
      </form>
    `;

    BakeryUI.openSheet(html, title);
    this._activePromptCallback = onConfirm;
  },

  handlePromptSubmit(inputId) {
    const input = document.getElementById(inputId);
    const val = input ? input.value : '';
    BakeryUI.closeSheet();
    if (typeof this._activePromptCallback === 'function') {
      this._activePromptCallback(val);
      this._activePromptCallback = null;
    }
  },

  // --- Toast Notifications ---
  toast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toastEl = document.createElement('div');
    toastEl.className = 'toast';

    let iconHtml = '<i data-lucide="check-circle-2" style="width: 17px; height: 17px; color: var(--success); flex-shrink: 0;"></i>';
    if (type === 'warning') iconHtml = '<i data-lucide="alert-circle" style="width: 17px; height: 17px; color: var(--warning); flex-shrink: 0;"></i>';
    if (type === 'error') iconHtml = '<i data-lucide="x-circle" style="width: 17px; height: 17px; color: var(--error); flex-shrink: 0;"></i>';

    toastEl.innerHTML = `
      ${iconHtml}
      <div style="flex: 1; color: var(--text-main); font-size: 13px; font-weight: 600;">${message}</div>
      <button style="border: none; background: transparent; cursor: pointer; color: var(--text-faint); font-size: 16px; padding: 2px 4px;" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toastEl);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toastEl.classList.add('toast-exit');
      setTimeout(() => toastEl.remove(), 220);
    }, 3200);
  },

  // --- Modal & Bottom Sheet Handlers ---
  openSheet(contentHtml, title = '') {
    const backdrop = document.getElementById('global-modal-backdrop');
    const headerTitle = document.getElementById('sheet-title-text');
    const bodyContainer = document.getElementById('sheet-content-container');

    if (backdrop && bodyContainer) {
      if (headerTitle) headerTitle.textContent = title;
      bodyContainer.innerHTML = contentHtml;
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  },

  closeSheet() {
    const backdrop = document.getElementById('global-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  // --- Download Bill Handler ---
  downloadBill(orderId) {
    const order = window.bakeryStore?.getOrder(orderId);
    if (!order) {
      BakeryUI.toast('Order not found', 'error');
      return;
    }

    const profile = window.bakeryStore?.getProfile() || {};
    const deliveryCharge = Number(order.deliveryCharge) || 0;
    const advanceVal = Number(order.advancePaid) || 0;
    const balanceVal = Number(order.balanceDue) || 0;

    const receiptHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice #${order.id} — ${profile.name || 'Bakery'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #FFF9F2; color: #3E3239; padding: 30px; margin: 0; }
    .invoice-card { max-width: 500px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E8D2C4; padding: 26px; box-shadow: 0 4px 20px rgba(62,50,57,0.08); }
    h1 { margin: 0 0 4px; font-size: 20px; color: #3E3239; }
    .tagline { font-size: 12px; color: #9E8189; margin-bottom: 16px; }
    .info-row { display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 6px; }
    .divider { border-top: 1px solid #E8D2C4; margin: 16px 0; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 12px 0; }
    th { text-align: left; padding: 8px 4px; border-bottom: 2px solid #E8D2C4; color: #6B5560; font-size: 11.5px; }
    td { padding: 9px 4px; border-bottom: 1px solid #F7EFE7; }
    .total-row { display: flex; justify-content: space-between; font-weight: 800; font-size: 16px; margin-top: 12px; padding-top: 10px; border-top: 2px solid #3E3239; }
    .footer { text-align: center; font-size: 11px; color: #9E8189; margin-top: 24px; border-top: 1px dashed #C7A9A3; padding-top: 14px; }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
      <div>
        <h1>${profile.name || 'The Crust & Crumb'}</h1>
        <div class="tagline">${profile.tagline || 'Artisan Custom Cakes & Brownies'}</div>
        <div style="font-size:12px; color:#6B5560;">📍 ${profile.address || 'Chennai'}</div>
        <div style="font-size:12px; color:#6B5560;">📞 ${profile.phone || ''} • FSSAI: ${profile.fssaiOrLicense || 'Registered'}</div>
      </div>
      <div style="text-align:right;">
        <span style="display:inline-block; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:800; background:#E3F2E9; color:#1F6B47;">${order.paymentStatus?.toUpperCase() || 'PAID'}</span>
        <div style="font-size:13px; font-weight:800; margin-top:6px;">Bill #${order.id}</div>
        <div style="font-size:11.5px; color:#9E8189;">${new Date(order.date).toLocaleDateString('en-IN')}</div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="info-row">
      <span><strong>Customer:</strong> ${order.customerName}</span>
      <span><strong>Phone:</strong> ${order.customerPhone}</span>
    </div>
    <div class="info-row">
      <span><strong>Fulfilment:</strong> ${order.deliveryType}</span>
      <span><strong>Slot:</strong> ${order.deliverySlot || 'Standard'}</span>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Rate</th>
          <th style="text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${(order.items || []).map(it => `
          <tr>
            <td><strong>${it.name}</strong>${it.variantName ? `<br><small style="color:#9E8189;">${it.variantName}</small>` : ''}</td>
            <td style="text-align:center;">${it.qty}</td>
            <td style="text-align:right;">₹${Number(it.price).toFixed(2)}</td>
            <td style="text-align:right;">₹${(Number(it.price) * Number(it.qty)).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div style="display:flex; flex-direction:column; gap:4px; font-size:12.5px;">
      <div style="display:flex; justify-content:space-between;">
        <span>Subtotal:</span>
        <span>₹${Number(order.subtotal || order.total).toFixed(2)}</span>
      </div>
      ${order.discount ? `
        <div style="display:flex; justify-content:space-between; color:#2E7D5B;">
          <span>Discount:</span>
          <span>-₹${Number(order.discount).toFixed(2)}</span>
        </div>
      ` : ''}
      <div style="display:flex; justify-content:space-between;">
        <span>Delivery Fee:</span>
        <span>${deliveryCharge > 0 ? `+₹${deliveryCharge.toFixed(2)}` : '₹0.00 (Self Pickup / Free)'}</span>
      </div>
      <div class="total-row">
        <span>Total Payable:</span>
        <span>₹${Number(order.total).toFixed(2)}</span>
      </div>
      <div style="display:flex; justify-content:space-between; color:#2E7D5B; font-weight:700; margin-top:4px;">
        <span>Advance Paid:</span>
        <span>₹${advanceVal.toFixed(2)}</span>
      </div>
      <div style="display:flex; justify-content:space-between; font-weight:800; color:${balanceVal > 0 ? '#B5424D' : '#2E7D5B'};">
        <span>Balance Due:</span>
        <span>₹${balanceVal.toFixed(2)}</span>
      </div>
    </div>

    <div class="footer">
      <strong>Care Instructions:</strong> ${profile.invoiceNotes || 'Keep refrigerated.'}<br>
      Thank you for supporting ${profile.name || 'us'}! • UPI: ${profile.paymentUpi || 'Pay at Counter'}
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([receiptHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${order.id}_${order.customerName.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    BakeryUI.toast('Invoice bill downloaded! 📄✓');
  },

  // --- Clean Minimalist Sales Trend Sparkline with LUMORA Glow ---
  renderSparkline(points = [3200, 4100, 3800, 4900, 5200, 6800, 7250]) {
    const min = Math.min(...points) * 0.9;
    const max = Math.max(...points) * 1.1;
    const width = 280;
    const height = 48;

    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * (width - 16) + 8;
      const y = height - ((val - min) / (max - min)) * (height - 14) - 6;
      return { x, y, val };
    });

    let pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      pathD += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const last = coords[coords.length - 1];

    return `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 48px; overflow: visible;">
        <defs>
          <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#C7A9A3" />
            <stop offset="50%" stop-color="#9E8189" />
            <stop offset="100%" stop-color="#3E3239" />
          </linearGradient>
        </defs>
        <path d="${pathD}" fill="none" stroke="url(#sparkline-gradient)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="${last.x}" cy="${last.y}" r="4" fill="#3E3239" stroke="#FFFFFF" stroke-width="2" />
      </svg>
    `;
  },

  getEmptyIllustration(type) {
    let title = 'No records found';
    let subtitle = 'Items will appear here once recorded.';

    if (type === 'orders') {
      title = 'No active orders';
      subtitle = 'New custom cake, brownie and catering orders will appear here.';
    } else if (type === 'inventory') {
      title = 'Pantry inventory is clean';
      subtitle = 'Add chocolate compounds, butter, packaging boxes and essences.';
    } else if (type === 'recipes') {
      title = 'No recipes calculated yet';
      subtitle = 'Build ingredient & packaging cost estimates with live pricing.';
    } else if (type === 'expenses') {
      title = 'No expenses logged';
      subtitle = 'Keep track of kitchen butter, gas cylinders, and packaging runs.';
    }

    return `
      <div style="text-align: center; padding: 36px 20px; background: var(--bg-card); border-radius: var(--radius-md); border: 1.5px dashed var(--border-light);">
        <div style="width: 52px; height: 52px; border-radius: 16px; background: var(--c-almond); margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: var(--c-primary); box-shadow: var(--shadow-bento);">
          <i data-lucide="inbox" style="width: 24px; height: 24px; stroke-width: 1.8;"></i>
        </div>
        <h4 style="font-size: 15px; font-weight: 700; color: var(--text-main); font-family: var(--font-heading); margin-bottom: 4px;">${title}</h4>
        <p style="font-size: 12.5px; color: var(--text-muted); max-width: 280px; margin: 0 auto;">${subtitle}</p>
      </div>
    `;
  }
};

window.BakeryUI = BakeryUI;
