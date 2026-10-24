/* ==========================================================================
   VIEW: PRODUCTION PLANNER — INDIAN MARKET
   Baking Batches, Oven Timers, Morning Prep & Batch Completion
   ========================================================================== */

const ProductionView = {
  ovenTimerRunning: false,
  ovenSecondsLeft: 20 * 60,
  timerInterval: null,

  render() {
    const store = window.bakeryStore;
    const tasks = store.getProduction();
    const completedCount = tasks.filter(t => t.completed).length;
    const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    const mins = Math.floor(this.ovenSecondsLeft / 60);
    const secs = this.ovenSecondsLeft % 60;
    const timerStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    return `
      <div class="production-screen" style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="font-size: 20px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading); letter-spacing: -0.02em;">Production Schedule</h2>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 1px;">Daily baking queues, oven timers & batch tracking</p>
          </div>
          <button onclick="ProductionView.openAddTaskModal()" class="clay-btn" style="font-size: 12px; padding: 8px 14px; background: var(--pastel-rose-subtle); color: var(--pastel-rose-deep);">
            <i data-lucide="plus" style="width: 15px; height: 15px;"></i>
            <span>Add Batch</span>
          </button>
        </div>

        <!-- Progress & Oven Live Widget -->
        <div class="glass-card" style="padding: 16px 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div>
              <span style="font-size: 11px; font-weight: 700; color: var(--text-faint); text-transform: uppercase;">
                Daily Progress
              </span>
              <div style="font-size: 16px; font-weight: 800; color: var(--text-main); font-family: var(--font-heading);">
                ${completedCount} of ${tasks.length} Batches Ready
              </div>
            </div>
            <span class="status-badge badge-mint" style="font-size: 13px; font-weight: 800; padding: 4px 10px;">
              ${progressPercent}%
            </span>
          </div>

          <!-- Progress Bar -->
          <div style="height: 7px; background: rgba(0,0,0,0.05); border-radius: 8px; overflow: hidden; margin-bottom: 14px; border: 1px solid var(--border-hairline);">
            <div style="height: 100%; width: ${progressPercent}%; background: linear-gradient(90deg, var(--pastel-rose), var(--pastel-rose-deep)); transition: width 0.3s ease;"></div>
          </div>

          <!-- Oven Timer -->
          <div style="background: rgba(255, 255, 255, 0.65); padding: 12px 14px; border-radius: 12px; border: 1px solid var(--border-hairline); box-shadow: var(--clay-shadow-sm); display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: var(--pastel-yellow-subtle); color: var(--warning); display: flex; align-items: center; justify-content: center; box-shadow: var(--clay-shadow-sm);">
                <i data-lucide="flame" style="width: 20px; height: 20px;"></i>
              </div>
              <div>
                <div style="font-size: 10.5px; font-weight: 800; color: var(--warning); text-transform: uppercase;">
                  Oven #1 (175°C)
                </div>
                <div style="font-size: 13.5px; font-weight: 700; color: var(--text-main); font-family: var(--font-heading);">
                  Classic Fudgy Brownie • Batch #1
                </div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="font-size: 18px; font-weight: 800; font-family: monospace; color: var(--text-main); background: #FFFFFF; padding: 4px 10px; border-radius: 8px; border: 1px solid var(--border-hairline); box-shadow: var(--clay-shadow-sm);">
                ${timerStr}
              </div>
              <button onclick="ProductionView.toggleOvenTimer()" class="clay-btn" style="padding: 5px 12px; font-size: 11.5px; min-height: 30px; ${this.ovenTimerRunning ? 'background: var(--pastel-yellow-subtle); color: var(--warning);' : 'background: var(--pastel-rose-subtle); color: var(--pastel-rose-deep);'}">
                ${this.ovenTimerRunning ? 'Pause' : 'Start'}
              </button>
            </div>
          </div>
        </div>

        <!-- Morning Mise En Place Prep Checklist -->
        <div class="glass-card" style="padding: 14px 16px;">
          <h4 style="font-size: 11.5px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">
            Morning Kitchen Mise en Place
          </h4>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
              <input type="checkbox" checked style="width: 16px; height: 16px; accent-color: var(--pastel-rose-deep);" />
              <span>Amul butter cut into cubes and softened to room temperature</span>
            </label>
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
              <input type="checkbox" checked style="width: 16px; height: 16px; accent-color: var(--pastel-rose-deep);" />
              <span>Morde Dark & Milk compound slabs chopped for double boiler</span>
            </label>
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
              <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--pastel-rose-deep);" />
              <span>Pre-fold 8-inch and 10-inch Brownie boxes and line with parchment</span>
            </label>
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
              <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--pastel-rose-deep);" />
              <span>Chill whipping cream bowls & whisks for Rosemilk cake frosting</span>
            </label>
          </div>
        </div>

        <!-- Baking Queue -->
        <div>
          <div style="font-size: 11.5px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; padding-left: 2px;">
            Today's Batches (${tasks.length})
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${tasks.map(task => `
              <div class="glass-card" style="padding: 12px 14px; border-left: 3.5px solid ${task.completed ? 'var(--success)' : 'var(--pastel-rose-deep)'};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div style="display: flex; align-items: flex-start; gap: 10px;">
                    <input 
                      type="checkbox" 
                      ${task.completed ? 'checked' : ''} 
                      onchange="ProductionView.toggleTaskComplete('${task.id}')"
                      style="width: 17px; height: 17px; accent-color: var(--pastel-rose-deep); margin-top: 2px; cursor: pointer;"
                    />
                    <div>
                      <h4 style="font-size: 14.5px; font-weight: 700; color: var(--text-main); font-family: var(--font-heading); text-decoration: ${task.completed ? 'line-through' : 'none'}; opacity: ${task.completed ? '0.5' : '1'};">
                        ${task.product} (${task.batchQty} units)
                      </h4>
                      <div style="font-size: 11.5px; color: var(--text-faint); margin-top: 2px;">
                        Target: <strong>${task.targetTime}</strong> • Baker: ${task.assignedBaker || 'Ananya'}
                      </div>
                      ${task.notes ? `
                        <div style="font-size: 11.5px; color: var(--pastel-rose-deep); margin-top: 3px;">
                          ${task.notes}
                        </div>
                      ` : ''}
                    </div>
                  </div>

                  <div>
                    <span class="status-badge ${task.completed ? 'badge-delivered' : 'badge-baking'}" style="font-size: 10px;">
                      ${task.stage}
                    </span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  },

  toggleTaskComplete(id) {
    window.bakeryStore.toggleProductionComplete(id);
    BakeryUI.toast('Batch status updated');
    window.bakeryApp.refreshCurrentView();
  },

  toggleOvenTimer() {
    this.ovenTimerRunning = !this.ovenTimerRunning;
    if (this.ovenTimerRunning) {
      this.timerInterval = setInterval(() => {
        if (this.ovenSecondsLeft > 0) {
          this.ovenSecondsLeft -= 1;
          const mins = Math.floor(this.ovenSecondsLeft / 60);
          const secs = this.ovenSecondsLeft % 60;
          const timerEl = document.querySelector('.production-screen [style*="font-family: monospace"]');
          if (timerEl) {
            timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
          }
        } else {
          clearInterval(this.timerInterval);
          this.ovenTimerRunning = false;
          BakeryUI.toast('Oven timer finished! Remove brownie tray to cooling rack.');
          window.bakeryApp.refreshCurrentView();
        }
      }, 1000);
    } else {
      clearInterval(this.timerInterval);
    }
    window.bakeryApp.refreshCurrentView();
  },

  openAddTaskModal() {
    const products = window.bakeryStore.getProducts();
    const html = `
      <form onsubmit="ProductionView.handleAddTaskSubmit(event)" style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label class="form-label">Product to Bake</label>
          <select name="product" class="form-select">
            ${products.map(p => `<option value="${p.name}">${p.name}</option>`).join('')}
          </select>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label class="form-label">Batch Quantity</label>
            <input type="number" name="batchQty" required value="2" min="1" class="form-input" />
          </div>
          <div>
            <label class="form-label">Target Ready Time</label>
            <input type="time" name="targetTime" value="14:00" required class="form-input" />
          </div>
        </div>

        <div>
          <label class="form-label">Current Stage</label>
          <select name="stage" class="form-select">
            <option value="Prep">Prep & Measuring</option>
            <option value="Baking">In Oven Baking</option>
            <option value="Cooling">Cooling Rack</option>
            <option value="Packing">Boxing & Slicing</option>
          </select>
        </div>

        <div>
          <label class="form-label">Special Notes</label>
          <textarea name="notes" placeholder="e.g. Cut into 8 slices, use 8-inch window box..." class="form-textarea" rows="2"></textarea>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button type="button" onclick="BakeryUI.closeSheet()" class="btn btn-secondary" style="flex: 1;">Cancel</button>
          <button type="submit" class="btn btn-primary" style="flex: 1;">Schedule Batch</button>
        </div>
      </form>
    `;
    BakeryUI.openSheet(html, 'Schedule Baking Batch');
  },

  handleAddTaskSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const newTask = {
      product: formData.get('product'),
      batchQty: parseInt(formData.get('batchQty')) || 1,
      targetTime: formData.get('targetTime'),
      stage: formData.get('stage'),
      notes: formData.get('notes'),
      assignedBaker: 'Ananya'
    };

    window.bakeryStore.addProductionTask(newTask);
    BakeryUI.closeSheet();
    BakeryUI.toast(`Scheduled ${newTask.product}!`);
    window.bakeryApp.refreshCurrentView();
  }
};

window.ProductionView = ProductionView;
