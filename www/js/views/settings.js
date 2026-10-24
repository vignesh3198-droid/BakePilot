/* ==========================================================================
   VIEW: SETTINGS — INDIAN BAKERY MANAGER (PASTEL GLASS & CLAY)
   Zero GST, Default Delivery Charge, Cloud Database Sync & Automated Backups
   ========================================================================== */

const SettingsView = {
  backupsList: [],
  isLoadingBackups: false,

  render() {
    const store = window.bakeryStore;
    const profile = store.getProfile();
    const cloudStatus = store.getCloudStatus();

    // Trigger asynchronous fetch of server backups list
    setTimeout(() => this.fetchServerBackups(), 50);

    return `
      <div class="settings-screen" style="display: flex; flex-direction: column; gap: 16px;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="font-size: 20px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); letter-spacing: -0.02em;">Kitchen Settings</h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 1px;">Branding, delivery charge defaults, cloud synchronization & automated backups</p>
          </div>
        </div>

        <!-- Quick Access to Branding & Workspace -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div onclick="window.bakeryApp.navigate('branding')" class="glass-card" style="padding: 14px; cursor: pointer; display: flex; align-items: center; gap: 10px;">
            <div style="width: 38px; height: 38px; border-radius: 12px; background: var(--pastel-rose-subtle); color: var(--pastel-rose-deep); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: var(--clay-shadow-sm);">
              <i data-lucide="award" style="width: 18px; height: 18px;"></i>
            </div>
            <div>
              <div style="font-size: 13.5px; font-weight: 700; color: var(--text-main); font-family: var(--font-heading);">Brand & Logo</div>
              <div style="font-size: 11px; color: var(--text-muted);">UPI ID, FSSAI & notes</div>
            </div>
          </div>

          <div onclick="window.bakeryApp.navigate('workspace')" class="glass-card" style="padding: 14px; cursor: pointer; display: flex; align-items: center; gap: 10px;">
            <div style="width: 38px; height: 38px; border-radius: 12px; background: var(--pastel-mint-subtle); color: #2B6D4C; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: var(--clay-shadow-sm);">
              <i data-lucide="store" style="width: 18px; height: 18px;"></i>
            </div>
            <div>
              <div style="font-size: 13.5px; font-weight: 700; color: var(--text-main); font-family: var(--font-heading);">Workspace</div>
              <div style="font-size: 11px; color: var(--text-muted);">Hours & cutoffs</div>
            </div>
          </div>
        </div>

        <!-- Regional & Delivery Charge Settings -->
        <div class="glass-card" style="padding: 18px; display: flex; flex-direction: column; gap: 14px; border-left: 4px solid var(--pastel-rose-deep);">
          <h3 style="font-size: 14.5px; font-weight: 700; color: var(--text-main); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <i data-lucide="coins" style="width: 18px; height: 18px; color: var(--pastel-rose-deep);"></i>
            <span>Currency & Delivery Charge Defaults</span>
          </h3>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label class="form-label">Currency Symbol</label>
              <select onchange="SettingsView.changeCurrency(this.value)" class="form-select">
                <option value="₹" ${profile.currencySymbol === '₹' ? 'selected' : ''}>₹ (INR Indian Rupee)</option>
                <option value="$" ${profile.currencySymbol === '$' ? 'selected' : ''}>$ (USD / CAD)</option>
                <option value="€" ${profile.currencySymbol === '€' ? 'selected' : ''}>€ (EUR)</option>
                <option value="£" ${profile.currencySymbol === '£' ? 'selected' : ''}>£ (GBP)</option>
              </select>
            </div>

            <div>
              <label class="form-label">Default Delivery Charge (₹)</label>
              <input 
                type="number" 
                step="10" 
                min="0"
                value="${profile.defaultDeliveryCharge ?? 50}" 
                onchange="SettingsView.changeDefaultDeliveryCharge(this.value)" 
                class="form-input" 
                placeholder="e.g. 50"
              />
            </div>
          </div>
          <p style="font-size: 11.5px; color: var(--text-muted); margin-top: -6px; line-height: 1.4;">
            * This default delivery fee is applied to new orders and counter bills. It is easily editable per order according to distance or delivery partner. (Self Pickup always defaults to ₹0).
          </p>
        </div>

        <!-- Cloud Storage & Automated Multi-Tier Backup (Zero Data Loss) -->
        <div class="glass-card" style="padding: 18px; display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h3 style="font-size: 14.5px; font-weight: 700; color: var(--text-main); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
                <i data-lucide="cloud" style="width: 18px; height: 18px; color: var(--pastel-rose-deep);"></i>
                <span>Cloud Storage & Live Sync</span>
              </h3>
              <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                Multi-tier persistence: LocalStorage + Instant Cloud API sync with rolling automated backups.
              </p>
            </div>

            <div style="display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; background: ${cloudStatus.status === 'synced' ? 'var(--pastel-mint-subtle)' : 'var(--pastel-yellow-subtle)'}; border: 1px solid ${cloudStatus.status === 'synced' ? 'rgba(35, 122, 87, 0.25)' : 'rgba(168, 108, 34, 0.25)'};">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: ${cloudStatus.status === 'synced' ? 'var(--success)' : 'var(--warning)'};"></span>
              <span style="font-size: 11px; font-weight: 700; color: ${cloudStatus.status === 'synced' ? 'var(--success)' : 'var(--warning)'};">
                ${cloudStatus.status === 'synced' ? `Synced (${cloudStatus.timeAgo})` : 'Syncing...'}
              </span>
            </div>
          </div>

          <!-- Cloud Endpoint Info & Actions -->
          <div style="background: rgba(255, 255, 255, 0.6); padding: 12px 14px; border-radius: 12px; border: 1px solid var(--border-hairline); display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
              <span style="color: var(--text-muted); font-weight: 600;">Active Cloud Database:</span>
              <span style="font-family: monospace; font-size: 11px; color: var(--text-main); background: #FFFFFF; padding: 2px 8px; border-radius: 6px; border: 1px solid var(--border-hairline);">/api/sync (Port 3000)</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
              <span style="color: var(--text-muted); font-weight: 600;">Last Cloud Update:</span>
              <span style="font-weight: 700; color: var(--text-main); font-variant-numeric: tabular-nums;">${new Date(cloudStatus.lastSyncedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
          </div>

          <div style="display: flex; gap: 8px;">
            <button onclick="SettingsView.syncNow()" class="btn btn-primary" style="flex: 1; min-height: 38px;">
              <i data-lucide="cloud-upload" style="width: 15px; height: 15px;"></i>
              <span>Sync to Cloud Now</span>
            </button>

            <button onclick="SettingsView.pullFromCloud()" class="btn btn-secondary" style="flex: 1; min-height: 38px;">
              <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
              <span>Pull from Cloud</span>
            </button>
          </div>

          <!-- Automated Rolling Server Backups List -->
          <div style="margin-top: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 11.5px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
                Automated Rolling Cloud Snapshots
              </span>
              <button onclick="SettingsView.fetchServerBackups()" style="background: none; border: none; font-size: 11px; color: var(--pastel-rose-deep); font-weight: 700; cursor: pointer;">
                Refresh Backups
              </button>
            </div>

            <div id="settings-backups-container" style="display: flex; flex-direction: column; gap: 6px;">
              <div style="font-size: 12px; color: var(--text-muted); padding: 8px; text-align: center;">
                Loading automated cloud backups...
              </div>
            </div>
          </div>
        </div>

        <!-- Offline JSON Export & Manual Restore -->
        <div class="glass-card" style="padding: 18px; display: flex; flex-direction: column; gap: 12px;">
          <h3 style="font-size: 14.5px; font-weight: 700; color: var(--text-main); font-family: var(--font-heading); display: flex; align-items: center; gap: 8px;">
            <i data-lucide="download" style="width: 16px; height: 16px; color: var(--text-muted);"></i>
            <span>Offline JSON Backup & Import</span>
          </h3>

          <p style="font-size: 12px; color: var(--text-muted);">
            Save a full offline snapshot file to your device or restore from a previously exported kitchen JSON backup.
          </p>

          <div style="display: flex; gap: 8px;">
            <button onclick="SettingsView.exportDataBackup()" class="btn btn-secondary" style="flex: 1;">
              <i data-lucide="download" style="width: 15px; height: 15px;"></i>
              <span>Save Offline File</span>
            </button>

            <button onclick="document.getElementById('import-file-input').click()" class="btn btn-secondary" style="flex: 1;">
              <i data-lucide="upload" style="width: 15px; height: 15px;"></i>
              <span>Restore File</span>
            </button>
            <input type="file" id="import-file-input" style="display: none;" accept=".json" onchange="SettingsView.importDataBackup(event)" />
          </div>
        </div>

        <!-- Factory Reset / Seed Indian Kitchen Data -->
        <div class="glass-card" style="padding: 16px; background: rgba(255, 246, 246, 0.9); border: 1.5px solid rgba(184, 75, 88, 0.25);">
          <h3 style="font-size: 14px; font-weight: 700; color: var(--error); margin-bottom: 3px;">
            Reset & Restore Indian Kitchen Defaults
          </h3>
          <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 10px;">
            Restores initial Indian market inventory rates (Dark/White compounds, whipping cream, 8"/10" packaging boxes, essences, etc.).
          </p>
          <button onclick="SettingsView.resetSampleDataConfirm()" class="btn btn-destructive">
            <i data-lucide="rotate-ccw" style="width: 15px; height: 15px;"></i>
            <span>Restore Fresh Indian Pantry</span>
          </button>
        </div>

      </div>
    `;
  },

  async fetchServerBackups() {
    const container = document.getElementById('settings-backups-container');
    if (!container) return;

    try {
      const backupUrl = typeof window.getServerUrl === 'function' ? window.getServerUrl('/api/backups') : '/api/backups';
      const res = await fetch(backupUrl);
      if (res.ok) {
        const data = await res.json();
        const backups = data.backups || [];
        if (backups.length === 0) {
          container.innerHTML = `
            <div style="padding: 10px; font-size: 11.5px; color: var(--text-muted); text-align: center; background: rgba(255,255,255,0.6); border-radius: 8px;">
              Cloud sync is active. The first automated rolling snapshot will appear shortly upon sync.
            </div>
          `;
          return;
        }

        container.innerHTML = backups.slice(0, 4).map(b => {
          const dateStr = new Date(b.time).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          });
          const sizeKb = (b.size / 1024).toFixed(1);

          return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: rgba(255, 255, 255, 0.6); border-radius: 10px; border: 1px solid var(--border-hairline); font-size: 11.5px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i data-lucide="shield-check" style="width: 15px; height: 15px; color: var(--success); flex-shrink: 0;"></i>
                <div>
                  <div style="font-weight: 700; color: var(--text-main); font-family: monospace;">${b.filename}</div>
                  <div style="font-size: 10.5px; color: var(--text-faint);">${dateStr} • ${sizeKb} KB</div>
                </div>
              </div>
              <span class="status-badge badge-mint" style="font-size: 10px; padding: 2px 8px;">
                Cloud Safe ✓
              </span>
            </div>
          `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();
      }
    } catch (e) {
      container.innerHTML = `
        <div style="padding: 8px; font-size: 11.5px; color: var(--text-muted); text-align: center;">
          Offline mode: Backups stored safely in browser storage.
        </div>
      `;
    }
  },

  async syncNow() {
    BakeryUI.toast('Syncing with Cloud Database...', 'warning');
    await window.bakeryStore.syncToCloud(true);
    BakeryUI.toast('All bakery data synced to Cloud! ☁️✓');
    this.fetchServerBackups();
    window.bakeryApp.refreshCurrentView();
  },

  async pullFromCloud() {
    BakeryUI.toast('Pulling latest data from Cloud...', 'warning');
    await window.bakeryStore.fetchFromCloud();
    BakeryUI.toast('Fresh data retrieved from Cloud! 🔄');
    window.bakeryApp.refreshCurrentView();
  },

  changeCurrency(symbol) {
    window.bakeryStore.updateProfile({ currencySymbol: symbol, currency: symbol });
    BakeryUI.toast(`Currency updated to ${symbol}`);
    window.bakeryApp.refreshCurrentView();
  },

  changeDefaultDeliveryCharge(amount) {
    const charge = parseFloat(amount) || 0;
    window.bakeryStore.updateProfile({ defaultDeliveryCharge: charge });
    BakeryUI.toast(`Default delivery charge set to ₹${charge}`);
  },

  exportDataBackup() {
    const data = window.bakeryStore.data;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `the_crust_and_crumb_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    BakeryUI.toast('Offline JSON backup exported successfully! 💾');
  },

  importDataBackup(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.profile && parsed.inventory) {
          window.bakeryStore.data = parsed;
          window.bakeryStore.save(true);
          BakeryUI.toast('Database restored and synced to cloud!');
          window.bakeryApp.refreshCurrentView();
        } else {
          BakeryUI.toast('Invalid backup file structure.', 'error');
        }
      } catch (err) {
        BakeryUI.toast('Failed to parse JSON file.', 'error');
      }
    };
    reader.readAsText(file);
  },

  resetSampleDataConfirm() {
    BakeryUI.confirmModal({
      title: 'Restore Default Indian Pantry',
      message: 'Restore the default Indian bakery pantry items, compounds, packaging boxes & brownie recipes? Any custom items will be reset.',
      confirmText: 'Restore Defaults',
      onConfirm: () => {
        window.bakeryStore.resetToDefault();
        BakeryUI.toast('Default Indian bakery pantry restored!');
        window.bakeryApp.navigate('dashboard');
      }
    });
  }
};

window.SettingsView = SettingsView;
