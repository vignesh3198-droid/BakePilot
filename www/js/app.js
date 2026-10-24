/* ==========================================================================
   APPLICATION ROUTER & NAVIGATION ENGINE — LUMORA DESIGN & INDIAN BAKERY MANAGER
   Touch Edge-Swipe Back Navigation, Multi-User Auth Guard & Clean View Mount
   ========================================================================== */

class BakeryApp {
  constructor() {
    this.currentRoute = 'dashboard';
    this.historyStack = ['dashboard'];
    this.viewportMode = 'phone-frame';
    this.scrollContainer = null;
    this.contentContainer = null;
    
    // Touch swipe gesture tracking for native-like swipe back
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
  }

  init() {
    this.scrollContainer = document.getElementById('app-scroll-container');
    this.contentContainer = document.getElementById('view-content-mount');

    // Initialize saved theme (Dark / Light)
    if (window.BakeryUI && window.BakeryUI.initTheme) {
      window.BakeryUI.initTheme();
    }

    // Subscribe store changes
    window.bakeryStore.subscribe(() => {
      this.refreshCurrentView();
    });

    // Browser History / Android Native Back Gesture integration
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.route) {
        this.currentRoute = e.state.route;
        this.renderCurrentView();
      } else if (this.historyStack.length > 1) {
        this.historyStack.pop();
        this.currentRoute = this.historyStack[this.historyStack.length - 1];
        this.renderCurrentView();
      } else {
        this.currentRoute = 'dashboard';
        this.renderCurrentView();
      }
    });

    // Mobile Edge Swipe-Back Gesture Listener (Swipe right from left screen edge)
    this.initSwipeBackGesture();

    // Check authentication: if not logged in and no session, route to login
    const isAuth = window.bakeryStore.isAuthenticated();
    const initialHash = window.location.hash.replace('#', '');
    
    if (!isAuth && initialHash !== 'login') {
      this.navigate('login', false);
    } else {
      this.navigate(initialHash || 'dashboard', false);
    }

    this.applyViewportMode();
  }

  initSwipeBackGesture() {
    document.addEventListener('touchstart', (e) => {
      if (!e.touches || e.touches.length === 0) return;
      // Do not trigger swipe back when touching range sliders or form inputs
      if (e.target && (e.target.closest('input[type="range"]') || e.target.closest('.touch-slider'))) {
        this.touchStartX = 0;
        return;
      }
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.touchStartTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - this.touchStartX;
      const deltaY = touch.clientY - this.touchStartY;
      const elapsedTime = Date.now() - this.touchStartTime;

      // Edge swipe: start within 48px of left edge, swipe right > 65px with minimal vertical angle
      if (this.touchStartX < 48 && deltaX > 65 && Math.abs(deltaY) < 55 && elapsedTime < 450) {
        if (this.currentRoute !== 'dashboard' && this.currentRoute !== 'login' && this.currentRoute !== 'payment-pending') {
          this.goBack();
        }
      }
    }, { passive: true });
  }

  goBack() {
    // If a modal or bottom sheet is open, close it first
    const backdrop = document.getElementById('global-modal-backdrop');
    if (backdrop && backdrop.classList.contains('active')) {
      BakeryUI.closeSheet();
      return;
    }

    if (this.historyStack.length > 1) {
      this.historyStack.pop(); // Pop current
      const prevRoute = this.historyStack[this.historyStack.length - 1] || 'dashboard';
      this.navigate(prevRoute, true, true);
    } else {
      this.navigate('dashboard', true, true);
    }
  }

  navigate(route, updateHistory = true, isBack = false) {
    // If attempting to visit a protected route while unauthenticated, redirect to login
    if (!window.bakeryStore.isAuthenticated() && route !== 'login' && route !== 'payment-pending') {
      route = 'login';
    }

    this.currentRoute = route;

    if (updateHistory && !isBack) {
      this.historyStack.push(route);
      history.pushState({ route }, '', '#' + route);
    }

    if (this.scrollContainer) {
      this.scrollContainer.scrollTop = 0;
    }

    // Toggle navigation bar & FAB visibility on Login and Payment Pending screens
    const bottomNav = document.querySelector('.bottom-nav-container');
    const fab = document.getElementById('global-fab');

    if (route === 'login' || route === 'payment-pending') {
      if (bottomNav) bottomNav.style.display = 'none';
      if (fab) fab.style.display = 'none';
      if (this.scrollContainer) this.scrollContainer.classList.add('route-login');
      document.body.classList.add('route-login');
    } else {
      if (bottomNav) bottomNav.style.display = '';
      if (this.scrollContainer) this.scrollContainer.classList.remove('route-login');
      document.body.classList.remove('route-login');
      // Update Bottom Navigation active state
      const navItems = document.querySelectorAll('.bottom-nav-item');
      navItems.forEach(item => {
        const target = item.getAttribute('data-route');
        if (target === route || (['recipes', 'expenses', 'cashbook', 'reports', 'customers', 'suppliers', 'catalogue', 'branding', 'workspace', 'settings'].includes(route) && target === 'more')) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      this.updateFabContext(route);
    }

    this.renderCurrentView();
  }

  renderCurrentView() {
    if (!this.contentContainer) return;

    let viewHtml = '';
    switch (this.currentRoute) {
      case 'login':
        viewHtml = window.LoginView ? window.LoginView.render() : '<div class="bento-card">Loading login...</div>';
        break;
      case 'payment-pending':
        viewHtml = window.LoginView ? window.LoginView.renderPaymentPending() : '<div class="bento-card">Payment Required</div>';
        break;
      case 'dashboard':
        viewHtml = window.DashboardView.render();
        break;
      case 'orders':
        viewHtml = window.OrdersView.render();
        break;
      case 'billing':
        viewHtml = window.BillingView.render();
        break;
      case 'inventory':
        viewHtml = window.InventoryView.render();
        break;
      case 'recipes':
        viewHtml = window.RecipesView.render();
        break;
      case 'expenses':
        viewHtml = window.ExpensesView.render();
        break;
      case 'cashbook':
        viewHtml = window.CashbookView.render();
        break;
      case 'reports':
        viewHtml = window.ReportsView.render();
        break;
      case 'customers':
        viewHtml = window.CustomersView.render();
        break;
      case 'suppliers':
        viewHtml = window.SuppliersView.render();
        break;
      case 'catalogue':
        viewHtml = window.CatalogueView.render();
        break;
      case 'branding':
        viewHtml = window.BrandingView.render();
        break;
      case 'workspace':
        viewHtml = window.WorkspaceView.render();
        break;
      case 'settings':
        viewHtml = window.SettingsView.render();
        break;
      case 'invoice-config':
        viewHtml = window.MoreView.render();
        setTimeout(() => window.MoreView.openInvoiceSettingsModal(), 120);
        break;
      case 'more':
      default:
        viewHtml = window.MoreView.render();
        break;
    }

    // No top back-button bar on screen — pure native app edge swipe navigation
    this.contentContainer.innerHTML = `<div class="view-pane-active">${viewHtml}</div>`;

    if (this.currentRoute === 'dashboard' && window.DashboardView && window.DashboardView.checkBroadcast) {
      setTimeout(() => window.DashboardView.checkBroadcast(), 60);
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  refreshCurrentView() {
    this.renderCurrentView();
  }

  toggleViewportMode() {
    this.viewportMode = this.viewportMode === 'phone-frame' ? 'fluid' : 'phone-frame';
    this.applyViewportMode();
  }

  applyViewportMode() {
    const btn = document.getElementById('viewport-mode-toggle-btn');
    if (this.viewportMode === 'phone-frame') {
      document.body.classList.add('mode-phone-frame');
      document.body.classList.remove('mode-fluid');
      if (btn) btn.innerHTML = '<i data-lucide="maximize-2" style="width: 14px; height: 14px;"></i><span>Expand View</span>';
    } else {
      document.body.classList.remove('mode-phone-frame');
      document.body.classList.add('mode-fluid');
      if (btn) btn.innerHTML = '<i data-lucide="smartphone" style="width: 14px; height: 14px;"></i><span>Phone Frame</span>';
    }

    if (window.lucide) window.lucide.createIcons();
  }

  updateFabContext(route) {
    const fab = document.getElementById('global-fab');
    if (!fab) return;

    if (route === 'billing' || route === 'login') {
      fab.style.display = 'none';
      return;
    }

    fab.style.display = 'flex';

    if (route === 'inventory') {
      fab.setAttribute('onclick', 'InventoryView.openAddIngredientModal()');
      fab.setAttribute('title', 'Add Pantry Item');
    } else if (route === 'expenses') {
      fab.setAttribute('onclick', 'ExpensesView.openAddExpenseModal()');
      fab.setAttribute('title', 'Log Expense');
    } else if (route === 'recipes') {
      fab.setAttribute('onclick', 'RecipesView.openAddRecipeModal()');
      fab.setAttribute('title', 'Calculate Recipe');
    } else {
      fab.setAttribute('onclick', 'OrdersView.openNewOrderModal()');
      fab.setAttribute('title', 'New Order');
    }
  }
}

window.bakeryApp = new BakeryApp();

document.addEventListener('DOMContentLoaded', () => {
  window.bakeryApp.init();
});
