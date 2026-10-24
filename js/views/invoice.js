/* ==========================================================================
   VIEW: INVOICE PREVIEW — LUMORA LUXURY DESIGN
   Zero GST Billing, Delivery Fee, Advance & Balance Due
   Mobile-Optimized Layout (No Horizontal Scroll), WhatsApp Image Bill Sharing
   ========================================================================== */

const InvoiceView = {
  currentOrder: null,

  openForOrder(orderId) {
    const order = window.bakeryStore.getOrder(orderId);
    if (!order) return;
    this.currentOrder = order;

    const profile = window.bakeryStore.getProfile();
    const invSettings = window.bakeryStore.getInvoiceSettings();
    const formattedDate = BakeryUI.formatDate(order.date);
    const deliveryChargeVal = Number(order.deliveryCharge) || 0;
    const advanceVal = Number(order.advancePaid) || 0;
    const balanceVal = Number(order.balanceDue) || 0;

    const html = `
      <div id="invoice-modal-content" style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 100%; box-sizing: border-box;">
        
        <!-- Top Action Toolbar with WhatsApp Image Bill, PNG Image Download, Print & Field Customizer -->
        <div class="no-print" style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); padding: 10px 12px; border-radius: var(--radius-md); border: 1px solid var(--border-light); gap: 6px; flex-wrap: wrap;">
          <div style="font-size: 13px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); display: flex; align-items: center; gap: 6px;">
            <i data-lucide="receipt" style="width: 15px; height: 15px; color: var(--c-primary);"></i>
            <span>Bill #${order.id}</span>
          </div>

          <div style="display: flex; gap: 5px; flex-wrap: wrap; align-items: center;">
            <!-- Primary Action: WhatsApp Image Bill -->
            <button onclick="InvoiceView.shareWhatsAppImage()" class="btn-3d btn-3d-primary" style="padding: 7px 12px; font-size: 11.5px;" title="Send beautiful bill image on WhatsApp">
              <i data-lucide="message-circle" style="width: 14px; height: 14px;"></i>
              <span>WhatsApp Image</span>
            </button>

            <!-- Download PNG Image -->
            <button onclick="InvoiceView.downloadBillImage()" class="btn-3d btn-3d-secondary" style="padding: 7px 10px; font-size: 11px;" title="Save bill picture to gallery">
              <i data-lucide="image" style="width: 13px; height: 13px;"></i>
              <span>Save</span>
            </button>

            <!-- Customize Bill Fields Shortcut -->
            <button onclick="MoreView.openInvoiceSettingsModal()" class="btn-3d btn-3d-secondary" style="padding: 7px 10px; font-size: 11px;" title="Customize what fields show on your bills">
              <i data-lucide="sliders" style="width: 13px; height: 13px;"></i>
              <span>Fields</span>
            </button>

            <!-- Print -->
            <button onclick="InvoiceView.printInvoice()" class="btn-3d btn-3d-secondary" style="padding: 7px 10px; font-size: 11px;">
              <i data-lucide="printer" style="width: 13px; height: 13px;"></i>
            </button>
          </div>
        </div>

        <!-- The Printable / Capturable Invoice Sheet (Strictly mobile optimized - 100% width, no horizontal scroll) -->
        <div id="invoice-print-area" style="width: 100%; max-width: 100%; box-sizing: border-box; padding: 18px 14px; background: #FFFFFF; color: #302B35; position: relative; border-radius: var(--radius-md); border: 1px solid var(--border-light); box-shadow: var(--shadow-bento); font-family: var(--font-body); overflow-x: hidden;">
          
          <!-- PAID / PARTIAL Stamp -->
          <div style="position: absolute; right: 14px; top: 14px; border: 2px solid ${order.paymentStatus === 'paid' ? '#2E7D5B' : order.paymentStatus === 'partially-paid' ? '#A66824' : '#B5424D'}; color: ${order.paymentStatus === 'paid' ? '#2E7D5B' : order.paymentStatus === 'partially-paid' ? '#A66824' : '#B5424D'}; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 6px; letter-spacing: 0.06em; background: rgba(255, 255, 255, 0.95); text-transform: uppercase;">
            ${order.paymentStatus === 'paid' ? 'PAID ✓' : order.paymentStatus === 'partially-paid' ? 'ADVANCE PAID' : 'UNPAID'}
          </div>

          <!-- Bakery Header with Logo -->
          <div style="display: flex; gap: 10px; align-items: center; padding-bottom: 12px; border-bottom: 1.5px solid #E8D2C4; margin-right: 70px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: #FFFFFF; border: 1.5px solid #E8D2C4; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; padding: 2px;">
              <img src="${profile.logo || 'assets/bakepilot-logo.png'}" crossOrigin="anonymous" alt="BakePilot" style="width: 100%; height: 100%; object-fit: contain; border-radius: 10px;" onerror="this.src='assets/bakepilot-logo.png'" />
            </div>

            <div style="min-width: 0;">
              <h2 style="font-size: 16px; font-weight: 800; color: #3E3239; margin: 0; line-height: 1.2; word-break: break-word;">
                ${profile.name || 'BakePilot Patisserie'}
              </h2>
              <div style="font-size: 11px; color: #6B5560; margin-top: 1px;">
                ${profile.tagline || 'Artisan Custom Cakes & Fudgy Brownies'}
              </div>
            </div>
          </div>

          <!-- Contact & License Sub-header (Respects customizable invoice field toggles) -->
          <div style="display: flex; justify-content: space-between; font-size: 10.5px; color: #77717D; padding: 6px 0; border-bottom: 1px solid #E8D2C4; flex-wrap: wrap; gap: 4px;">
            ${invSettings.showBakeryAddress && profile.address ? `<span>📍 ${profile.address}</span>` : ''}
            ${invSettings.showBakeryPhone && profile.phone ? `<span>📞 ${profile.phone}</span>` : ''}
            ${invSettings.showFssai && profile.fssaiOrLicense ? `<span>${profile.fssaiOrLicense}</span>` : ''}
            ${invSettings.showPaymentUpi && profile.paymentUpi ? `<span>UPI: <strong>${profile.paymentUpi}</strong></span>` : ''}
          </div>

          <!-- Invoice Metadata Banner -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 10px 0; border-bottom: 1px solid #E8D2C4; font-size: 11.5px;">
            <div>
              <div style="color: #9E8189; font-size: 9.5px; font-weight: 800; text-transform: uppercase;">Billed To</div>
              <div style="font-size: 13px; font-weight: 800; color: #302B35; margin-top: 1px; word-break: break-word;">${order.customerName}</div>
              ${invSettings.showCustomerPhone && order.customerPhone ? `<div style="color: #6B5560; font-size: 11px;">📞 ${order.customerPhone}</div>` : ''}
              ${invSettings.showDeliveryAddress && order.deliveryAddress ? `<div style="color: #6B5560; font-size: 10.5px; margin-top: 1px; word-break: break-word;">📍 ${order.deliveryAddress}</div>` : ''}
            </div>

            <div style="text-align: right;">
              <div style="color: #9E8189; font-size: 9.5px; font-weight: 800; text-transform: uppercase;">Invoice Details</div>
              <div style="font-size: 12.5px; font-weight: 800; color: #302B35; margin-top: 1px;">#${order.id}</div>
              <div style="color: #6B5560; font-size: 11px;">${formattedDate}</div>
              <div style="color: #6B5560; font-size: 10.5px;">Slot: ${order.deliverySlot}</div>
            </div>
          </div>

          <!-- Items Table (Fluid Table Layout, strictly fitting phone width) -->
          <div class="invoice-table-wrapper" style="margin: 10px 0 8px;">
            <table class="invoice-table">
              <thead>
                <tr style="border-bottom: 1.5px solid #E8D2C4; color: #6B5560; font-size: 10px; text-transform: uppercase;">
                  <th style="width: 48%; text-align: left; font-weight: 800; padding: 4px 2px;">Item</th>
                  <th style="width: 14%; text-align: center; font-weight: 800; padding: 4px 2px;">Qty</th>
                  <th style="width: 18%; text-align: right; font-weight: 800; padding: 4px 2px;">Rate</th>
                  <th style="width: 20%; text-align: right; font-weight: 800; padding: 4px 2px;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(it => `
                  <tr style="border-bottom: 1px solid #F7EFE7; font-size: 11.5px;">
                    <td style="padding: 7px 2px; color: #302B35; font-weight: 700; word-break: break-word;">
                      ${it.name}
                      ${it.variantName ? `<div style="font-size: 10px; color: #77717D; font-weight: normal;">${it.variantName}</div>` : ''}
                    </td>
                    <td style="padding: 7px 2px; text-align: center; color: #6B5560; font-weight: 700;">${it.qty}</td>
                    <td style="padding: 7px 2px; text-align: right; color: #77717D;" class="tabular-nums">${BakeryUI.formatCurrency(it.price)}</td>
                    <td style="padding: 7px 2px; text-align: right; font-weight: 800; color: #302B35;" class="tabular-nums">
                      ${BakeryUI.formatCurrency(it.price * it.qty)}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Pure Zero-GST Financial Summary -->
          <div style="display: flex; justify-content: flex-end; padding-top: 4px; border-top: 1px solid #E8D2C4;">
            <div style="width: 100%; max-width: 230px; display: flex; flex-direction: column; gap: 3px; font-size: 11.5px;">
              <div style="display: flex; justify-content: space-between; color: #6B5560;">
                <span>Subtotal:</span>
                <span style="font-weight: 700; color: #302B35;" class="tabular-nums">${BakeryUI.formatCurrency(order.subtotal || order.total)}</span>
              </div>

              ${order.discount ? `
                <div style="display: flex; justify-content: space-between; color: #2E7D5B; font-weight: 700;">
                  <span>Discount:</span>
                  <span class="tabular-nums">-${BakeryUI.formatCurrency(order.discount)}</span>
                </div>
              ` : ''}

              <div style="display: flex; justify-content: space-between; color: #6B5560;">
                <span>Delivery Charge:</span>
                <span style="font-weight: 700; color: #302B35;" class="tabular-nums">
                  ${deliveryChargeVal > 0 ? BakeryUI.formatCurrency(deliveryChargeVal) : '₹0.00'}
                </span>
              </div>

              <div style="display: flex; justify-content: space-between; color: #302B35; font-size: 13.5px; font-weight: 900; border-top: 1.5px solid #302B35; padding-top: 4px; margin-top: 2px;">
                <span>Grand Total:</span>
                <span class="tabular-nums">${BakeryUI.formatCurrency(order.total)}</span>
              </div>

              ${advanceVal > 0 ? `
                <div style="display: flex; justify-content: space-between; color: #2E7D5B; font-size: 11px; font-weight: 700;">
                  <span>Advance Received:</span>
                  <span class="tabular-nums">${BakeryUI.formatCurrency(advanceVal)}</span>
                </div>
              ` : ''}

              <div style="display: flex; justify-content: space-between; color: ${balanceVal > 0 ? '#B5424D' : '#2E7D5B'}; font-size: 11.5px; font-weight: 800;">
                <span>Balance Due:</span>
                <span class="tabular-nums">${balanceVal > 0 ? BakeryUI.formatCurrency(balanceVal) : 'NIL (Fully Paid)'}</span>
              </div>
            </div>
          </div>

          <!-- Cake Message / Notes (Conditionally rendered) -->
          ${invSettings.showCakeMessage && order.cakeMessage ? `
            <div style="margin-top: 8px; background: #F7EFE7; border: 1px dashed #C7A9A3; padding: 6px 10px; border-radius: 8px; font-size: 11px;">
              <strong>Piped Message:</strong> "${order.cakeMessage}"
            </div>
          ` : ''}

          <!-- Footer Notes & Social (Conditionally rendered) -->
          ${invSettings.showFooterNotes || (invSettings.showInstagram && profile.instagram) ? `
            <div style="margin-top: 10px; border-top: 1px solid #E8D2C4; padding-top: 8px; text-align: center; font-size: 10px; color: #77717D; line-height: 1.35;">
              ${invSettings.showFooterNotes ? `<div>${invSettings.invoiceNotes || profile.invoiceNotes || 'Baked fresh with pure butter and premium chocolate. Please refrigerate immediately.'}</div>` : ''}
              ${invSettings.showInstagram && profile.instagram ? `<div style="margin-top: 3px; font-weight: 700; color: #3E3239;">Thank you for your order! Follow us ${profile.instagram}</div>` : ''}
            </div>
          ` : ''}

        </div>

        <!-- Bottom Action Bar -->
        <div class="no-print" style="display: flex; gap: 8px; margin-top: 4px;">
          <button onclick="InvoiceView.downloadBillHtml()" class="btn-3d btn-3d-secondary" style="flex: 1; font-size: 11.5px; padding: 9px 8px;">
            <i data-lucide="file-text" style="width: 14px; height: 14px;"></i>
            <span>HTML Bill</span>
          </button>
          <button onclick="InvoiceView.shareWhatsAppImage()" class="btn-3d btn-3d-primary" style="flex: 1.4; font-size: 12px; padding: 9px 10px;">
            <i data-lucide="share-2" style="width: 15px; height: 15px;"></i>
            <span>Send Image Bill</span>
          </button>
        </div>

      </div>
    `;

    BakeryUI.openSheet(html, `Invoice #${order.id}`);
    return html;
  },

  // In-memory cache for captured bill image to allow direct user-tap sharing without browser gesture loss
  currentShareData: null,

  // Universal share router for invoice view and order wizard
  shareWhatsApp(orderId) {
    if (orderId) {
      this.openForOrder(orderId);
      setTimeout(() => this.shareWhatsAppImage(), 250);
    } else {
      this.shareWhatsAppImage();
    }
  },

  // Generates high-res canvas image of the bill and opens the interactive WhatsApp sharing modal
  async shareWhatsAppImage() {
    if (!this.currentOrder) return;
    const order = this.currentOrder;
    const profile = window.bakeryStore.getProfile();
    const invSettings = window.bakeryStore.getInvoiceSettings ? window.bakeryStore.getInvoiceSettings() : {};
    const billElement = document.getElementById('invoice-print-area');

    if (!billElement) {
      BakeryUI.toast('Bill not visible to capture', 'error');
      return;
    }

    BakeryUI.toast('Rendering crisp bill photo...', 'warning');

    try {
      if (typeof window.html2canvas === 'undefined') {
        throw new Error('Image rendering engine not loaded');
      }

      // Render DOM bill element to crisp 2x scale PNG canvas (without tainting)
      const canvas = await window.html2canvas(billElement, {
        scale: 2.0,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#FFFFFF',
        logging: false
      });

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.95));
      if (!blob) throw new Error('Blob creation failed');
      const dataUrl = canvas.toDataURL('image/png', 0.95);
      const fileName = `Bill_${order.id}_${(order.customerName || 'Guest').replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Save share data in memory
      this.currentShareData = {
        order,
        blob,
        dataUrl,
        file,
        fileName,
        imgUrl: URL.createObjectURL(blob),
        onlineBillUrl: ''
      };

      // Upload to server in background for web backup link
      const uploadUrl = typeof window.getServerUrl === 'function' ? window.getServerUrl('/api/invoices/upload') : '/api/invoices/upload';
      fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, imageBase64: dataUrl })
      }).then(r => r.json()).then(upData => {
        if (upData && (upData.fullUrl || upData.url) && this.currentShareData) {
          this.currentShareData.onlineBillUrl = upData.fullUrl || `http://${window.location.host}${upData.url}`;
        }
      }).catch(e => console.log('Online bill upload note:', e));

      // Resolve custom greeting with tag replacement
      const rawGreeting = invSettings.whatsappGreeting || 'Namaste {customer}! 🙏';
      const defaultGreeting = rawGreeting
        .replace(/{customer}/g, order.customerName || 'Friend')
        .replace(/{bakery}/g, profile.name || 'Our Bakery');

      // Build interactive modal with editable greeting and live photo preview
      const guideHtml = `
        <div style="text-align: center; padding: 2px 0;">
          
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(37, 211, 102, 0.15); color: #25D366; display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(37, 211, 102, 0.3);">
              <i data-lucide="message-circle" style="width: 20px; height: 20px;"></i>
            </div>
            <div style="text-align: left;">
              <h3 style="font-size: 15px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); margin: 0;">
                Share Bill Image to WhatsApp
              </h3>
              <p style="font-size: 11px; color: var(--text-muted); margin: 1px 0 0;">
                Invoice #${order.id} for <strong>${order.customerName}</strong>
              </p>
            </div>
          </div>

          <!-- Bill Thumbnail Preview -->
          <div style="max-height: 140px; overflow: hidden; border-radius: 12px; border: 1.5px solid var(--border-light); margin-bottom: 12px; box-shadow: var(--shadow-bento); background: #FAF9F6; position: relative;">
            <img src="${this.currentShareData.imgUrl}" alt="Bill Preview" style="width: 100%; height: auto; display: block; object-fit: contain;" />
            <div style="position: absolute; bottom: 6px; right: 6px; background: rgba(28, 23, 26, 0.85); color: #FAF1E4; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; display: flex; align-items: center; gap: 4px;">
              <i data-lucide="image" style="width: 10px; height: 10px; color: #D4AF37;"></i>
              <span>High-Res Photo Ready</span>
            </div>
          </div>

          <!-- Customizable Greeting Message Option -->
          <div style="background: var(--bg-card-subtle); border-radius: 12px; padding: 12px; text-align: left; margin-bottom: 12px; border: 1px solid var(--border-light);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <label class="form-label" style="margin-bottom: 0; font-size: 11.5px; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 5px;">
                <i data-lucide="edit-3" style="width: 12px; height: 12px; color: var(--brand-accent);"></i>
                <span>Greeting Message (Editable)</span>
              </label>
              <button type="button" onclick="InvoiceView.resetGreetingDefault('${(order.customerName || '').replace(/'/g, "\\'")}')" style="background: none; border: none; font-size: 10px; color: var(--text-muted); cursor: pointer; text-decoration: underline;">
                Reset Default
              </button>
            </div>
            <input 
              type="text" 
              id="wa-greeting-input" 
              class="form-input" 
              value="${defaultGreeting}" 
              placeholder="e.g. Hello ${order.customerName}! 🎂 or Dear ${order.customerName}," 
              style="font-size: 13px; font-weight: 700; padding: 8px 10px;"
            />
            <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">
              Type any custom greeting you prefer. It will be sent as the photo caption.
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <!-- Primary Action: Share Image -->
            <button 
              type="button" 
              onclick="InvoiceView.executeShareImage()" 
              class="btn-3d btn-3d-primary" 
              style="width: 100%; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); border-color: #128C7E; color: #FFFFFF; font-weight: 800; padding: 12px; font-size: 13.5px; display: flex; align-items: center; justify-content: center; gap: 8px;"
            >
              <i data-lucide="share-2" style="width: 17px; height: 17px;"></i>
              <span>Send Bill Photo to WhatsApp</span>
            </button>

            <div style="display: flex; gap: 8px;">
              <button 
                type="button" 
                onclick="InvoiceView.executeShareText()" 
                class="btn-3d btn-3d-secondary" 
                style="flex: 1; font-size: 11.5px; padding: 8px 10px;" 
                title="Send formatted text without image"
              >
                <i data-lucide="message-square" style="width: 13px; height: 13px;"></i>
                <span>Text Bill Only</span>
              </button>

              <button 
                type="button" 
                onclick="InvoiceView.downloadBillImage()" 
                class="btn-3d btn-3d-secondary" 
                style="flex: 1; font-size: 11.5px; padding: 8px 10px;" 
                title="Save picture to gallery"
              >
                <i data-lucide="download" style="width: 13px; height: 13px;"></i>
                <span>Save to Photos</span>
              </button>
            </div>
          </div>

        </div>
      `;

      BakeryUI.openModal(guideHtml, 'Share Bill on WhatsApp');
      BakeryUI.initLucide();
      BakeryUI.toast('Bill photo ready! Choose greeting & share.');
    } catch (err) {
      console.warn('Canvas share error, falling back to text:', err);
      BakeryUI.toast('Rendering note: sending formatted WhatsApp text bill', 'warning');
      this.shareWhatsAppText();
    }
  },

  resetGreetingDefault(custName) {
    const input = document.getElementById('wa-greeting-input');
    if (!input) return;
    const invSettings = window.bakeryStore.getInvoiceSettings ? window.bakeryStore.getInvoiceSettings() : {};
    const rawGreeting = invSettings.whatsappGreeting || 'Namaste {customer}! 🙏';
    input.value = rawGreeting.replace(/{customer}/g, custName || 'Friend');
  },

  // Called directly from user tap on "Send Bill Photo to WhatsApp"
  async executeShareImage() {
    if (!this.currentShareData) return;
    const { order, file, dataUrl, fileName } = this.currentShareData;
    const profile = window.bakeryStore.getProfile();
    const invSettings = window.bakeryStore.getInvoiceSettings ? window.bakeryStore.getInvoiceSettings() : {};

    const greetingInput = document.getElementById('wa-greeting-input');
    const greeting = (greetingInput && greetingInput.value.trim()) ? greetingInput.value.trim() : `Namaste ${order.customerName}! 🙏`;

    const cleanPhone = (order.customerWhatsapp || order.customerPhone || '').replace(/[^0-9]/g, '');
    const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const captionText = 
      `*${profile.name} — Invoice #${order.id}*\n` +
      `${greeting}\n\n` +
      `*Total:* ${BakeryUI.formatCurrency(order.total)} | *Balance Due:* ${BakeryUI.formatCurrency(order.balanceDue || 0)}\n\n` +
      `${invSettings.invoiceNotes || profile.invoiceNotes || ''}\n\n` +
      `Instagram: ${profile.instagram || ''}`;

    BakeryUI.closeModal();

    // 1. Native Capacitor Android / iOS APK App Sharing
    if (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) {
      try {
        const { Filesystem, Directory } = window.Capacitor.Plugins || {};
        const { Share } = window.Capacitor.Plugins || {};
        if (Filesystem && Share) {
          const base64Data = dataUrl.split(',')[1];
          const writeRes = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache
          });
          await Share.share({
            title: `Invoice #${order.id} - ${profile.name}`,
            text: captionText,
            url: writeRes.uri,
            dialogTitle: 'Share Bill Photo to WhatsApp'
          });
          BakeryUI.toast('Shared bill photo to WhatsApp! ✓');
          return;
        }
      } catch (capErr) {
        if (capErr.name === 'AbortError') return;
        console.warn('Capacitor native share note:', capErr);
      }
    }

    // 2. Web Share API with Files (Mobile Chrome Android / Mobile Safari iOS)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: `Invoice #${order.id} - ${profile.name}`,
          text: captionText,
          files: [file]
        });
        BakeryUI.toast('Shared bill photo to WhatsApp! ✓');
        return;
      } catch (shareErr) {
        if (shareErr.name === 'AbortError') return;
        console.warn('Web Share file failed, using fallback:', shareErr);
      }
    }

    // 3. Desktop / Unsupported Browser Fallback:
    // Copy image to clipboard, trigger download, and open WhatsApp chat with caption
    try {
      if (navigator.clipboard && window.ClipboardItem && this.currentShareData.blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': this.currentShareData.blob })
        ]);
        BakeryUI.toast('Bill photo copied! Paste (Ctrl+V) in WhatsApp.', 'success');
      }
    } catch(e){}

    // Trigger download of the image
    this.downloadBillImage();

    // Open WhatsApp Chat
    const waUrl = waNumber 
      ? `https://wa.me/${waNumber}?text=${encodeURIComponent(captionText)}`
      : `https://wa.me/?text=${encodeURIComponent(captionText)}`;
    window.open(waUrl, '_blank');
  },

  executeShareText() {
    const greetingInput = document.getElementById('wa-greeting-input');
    const greeting = (greetingInput && greetingInput.value.trim()) ? greetingInput.value.trim() : null;
    BakeryUI.closeModal();
    this.shareWhatsAppText(greeting);
  },

  // 1-Click PNG Image Download to device photos/downloads
  async downloadBillImage() {
    if (!this.currentOrder) return;
    const order = this.currentOrder;
    const billElement = document.getElementById('invoice-print-area');
    if (!billElement) return;

    BakeryUI.toast('Saving bill image...', 'warning');
    try {
      const canvas = await window.html2canvas(billElement, {
        scale: 2.0,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#FFFFFF',
        logging: false
      });

      const fileName = `Bill_${order.id}_${(order.customerName || 'Guest').replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      const link = document.createElement('a');
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      link.click();
      BakeryUI.toast('Saved bill PNG image to your device!');
    } catch (e) {
      BakeryUI.toast('Failed to save image: ' + e.message, 'error');
    }
  },

  downloadBillHtml() {
    if (!this.currentOrder) return;
    BakeryUI.downloadBill(this.currentOrder.id);
  },

  printInvoice() {
    window.print();
  },

  shareWhatsAppText(customGreeting) {
    if (!this.currentOrder) return;
    const o = this.currentOrder;
    const profile = window.bakeryStore.getProfile();
    const invSettings = window.bakeryStore.getInvoiceSettings ? window.bakeryStore.getInvoiceSettings() : {};
    const cleanPhone = (o.customerWhatsapp || o.customerPhone || '').replace(/[^0-9]/g, '');
    const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    
    const greeting = customGreeting || (invSettings.whatsappGreeting || 'Namaste {customer}! 🙏')
      .replace(/{customer}/g, o.customerName || 'Friend')
      .replace(/{bakery}/g, profile.name || 'Our Bakery');

    const itemsSummary = o.items.map(i => `• ${i.qty}x ${i.name} - ${BakeryUI.formatCurrency(i.qty * i.price)}`).join('\n');
    const msg = `*${profile.name} — Order Invoice #${o.id}*\n` +
      `${greeting}\n\n` +
      `Thank you for ordering with us:\n` +
      `${itemsSummary}\n\n` +
      `*Total Amount:* ${BakeryUI.formatCurrency(o.total)}\n` +
      `*Balance Due:* ${BakeryUI.formatCurrency(o.balanceDue || 0)}\n\n` +
      `${invSettings.invoiceNotes || profile.invoiceNotes || ''}\n\n` +
      `Instagram: ${profile.instagram || ''}`;

    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  }
};

window.InvoiceView = InvoiceView;
