/* ==========================================================================
   VIEW: KITCHEN WORKSPACE SETTINGS — LUMORA DESIGN & MOBILE FIRST
   Production Environment, Cover Image, Operating Hours, Lead Times & Privacy
   ========================================================================== */

const WorkspaceView = {
  render() {
    const store = window.bakeryStore;
    const ws = store.getWorkspace();
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return `
      <div class="workspace-screen" style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="font-size: 20px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); letter-spacing: -0.02em;">Kitchen Studio Setup</h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 1px;">Operating hours, order cutoffs, pickup address & prep times</p>
          </div>
        </div>

        <!-- Cover Photo Banner Bento Card -->
        <div class="bento-card" style="padding: 0; overflow: hidden;">
          <div style="height: 145px; background: var(--c-sand); position: relative; overflow: hidden;">
            <img 
              id="workspace-cover-img" 
              src="${ws.coverPhoto || BAKERY_ASSETS.workspacePhoto}" 
              alt="${ws.name}" 
              style="width: 100%; height: 100%; object-fit: cover;" 
            />
            <button 
              type="button" 
              onclick="document.getElementById('workspace-photo-input').click()" 
              class="btn-3d btn-3d-secondary" 
              style="position: absolute; bottom: 10px; right: 10px; padding: 6px 12px; font-size: 11px; background: rgba(255, 255, 255, 0.95);"
            >
              <i data-lucide="camera" style="width: 13px; height: 13px;"></i>
              <span>Change Photo</span>
            </button>
            <input 
              type="file" 
              id="workspace-photo-input" 
              accept="image/*" 
              style="display: none;" 
              onchange="WorkspaceView.handleCoverUpload(event)" 
            />
          </div>

          <div style="padding: 14px 16px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
              <div style="min-width: 0;">
                <h3 style="font-size: 16px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); margin: 0; word-break: break-word;">${ws.name}</h3>
                <p style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">${ws.address}</p>
              </div>
              <span class="status-badge badge-mint" style="font-size: 10px; flex-shrink: 0;">
                ${ws.isHomeKitchenPrivate ? '🔒 Private Studio' : '🏢 Public Kitchen'}
              </span>
            </div>

            <div style="display: flex; gap: 10px; font-size: 11px; color: var(--text-muted); margin-top: 10px; border-top: 1px solid var(--border-light); padding-top: 10px; flex-wrap: wrap;">
              <span>🕒 Hours: <strong style="color: var(--text-main);">${ws.workingHours}</strong></span>
              <span>•</span>
              <span>⚡ Lead Time: <strong style="color: var(--text-main);">${ws.minAdvanceNoticeHours}h</strong></span>
            </div>
          </div>
        </div>

        <!-- Workspace Edit Form -->
        <form onsubmit="WorkspaceView.handleSubmit(event)" class="bento-card" style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
          <h4 style="font-size: 12px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">
            Studio Configuration
          </h4>

          <div>
            <label class="form-label">Studio / Workspace Name *</label>
            <input type="text" name="name" value="${ws.name}" required class="form-input" />
          </div>

          <div>
            <label class="form-label">Kitchen Production Address</label>
            <input type="text" name="address" value="${ws.address}" class="form-input" />
          </div>

          <!-- Private Address Toggle for Home Bakers -->
          <div style="background: var(--c-sand); border: 1px solid var(--border-light); padding: 12px; border-radius: var(--radius-sm); display: flex; gap: 10px; align-items: flex-start;">
            <input 
              type="checkbox" 
              id="ws-is-private" 
              name="isHomeKitchenPrivate" 
              ${ws.isHomeKitchenPrivate ? 'checked' : ''} 
              style="width: 18px; height: 18px; margin-top: 2px; accent-color: var(--c-primary); cursor: pointer;" 
            />
            <label for="ws-is-private" style="cursor: pointer;">
              <div style="font-size: 12.5px; font-weight: 800; color: var(--text-main);">Private Home Kitchen Studio</div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px; line-height: 1.35;">
                When enabled, exact street address is hidden from public invoices and only customer pickup instructions are shared upon confirmation.
              </div>
            </label>
          </div>

          <div>
            <label class="form-label">Customer Pickup Location Instructions</label>
            <textarea name="pickupLocationInstructions" class="form-input" rows="2" placeholder="e.g. Ground floor gate 2, ring bell">${ws.pickupLocationInstructions}</textarea>
          </div>

          <!-- Operating Days Checkboxes -->
          <div>
            <label class="form-label">Active Baking / Working Days</label>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)); gap: 6px; margin-top: 4px;">
              ${daysOfWeek.map(d => `
                <label style="display: flex; align-items: center; justify-content: center; gap: 5px; background: var(--c-sand); padding: 7px 4px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; border: 1px solid var(--border-light);">
                  <input 
                    type="checkbox" 
                    name="workingDays" 
                    value="${d}" 
                    ${ws.workingDays.includes(d) ? 'checked' : ''} 
                    style="accent-color: var(--c-primary);"
                  />
                  <span>${d.slice(0, 3)}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Hours & Lead Times -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label class="form-label">Daily Working Hours</label>
              <input type="text" name="workingHours" value="${ws.workingHours}" class="form-input" placeholder="08:30 AM - 08:30 PM" />
            </div>

            <div>
              <label class="form-label">Cutoff Time</label>
              <input type="text" name="orderAcceptanceHours" value="${ws.orderAcceptanceHours}" class="form-input" placeholder="09:00 AM - 07:00 PM" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label class="form-label">Min Advance (Hours)</label>
              <input type="number" name="minAdvanceNoticeHours" min="0" step="1" value="${ws.minAdvanceNoticeHours}" class="form-input" />
            </div>

            <div>
              <label class="form-label">Default Prep (Hours)</label>
              <input type="number" name="defaultPrepTimeHours" min="0" step="1" value="${ws.defaultPrepTimeHours}" class="form-input" />
            </div>
          </div>

          <div>
            <label class="form-label">Production & Equipment Notes</label>
            <textarea name="notes" class="form-input" rows="2" placeholder="e.g. Blast chiller storage notes, oven calibration">${ws.notes}</textarea>
          </div>

          <button type="submit" class="btn-3d btn-3d-primary" style="margin-top: 6px; padding: 12px; font-size: 13.5px;">
            <i data-lucide="check" style="width: 15px; height: 15px;"></i>
            <span>Save Workspace Settings</span>
          </button>
        </form>

      </div>
    `;
  },

  handleCoverUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        window.bakeryStore.updateWorkspace({ coverPhoto: dataUrl });
        BakeryUI.toast('Workspace cover photo updated! ✓');
        window.bakeryApp.refreshCurrentView();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  },

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const workingDays = [];
    form.querySelectorAll('input[name="workingDays"]:checked').forEach(cb => {
      workingDays.push(cb.value);
    });

    window.bakeryStore.updateWorkspace({
      name: formData.get('name'),
      address: formData.get('address'),
      isHomeKitchenPrivate: form.querySelector('#ws-is-private').checked,
      pickupLocationInstructions: formData.get('pickupLocationInstructions'),
      workingDays,
      workingHours: formData.get('workingHours'),
      orderAcceptanceHours: formData.get('orderAcceptanceHours'),
      minAdvanceNoticeHours: Number(formData.get('minAdvanceNoticeHours')) || 24,
      defaultPrepTimeHours: Number(formData.get('defaultPrepTimeHours')) || 4,
      notes: formData.get('notes')
    });

    BakeryUI.toast('Kitchen studio settings saved! ✓');
    window.bakeryApp.refreshCurrentView();
  }
};

window.WorkspaceView = WorkspaceView;
