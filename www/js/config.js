/* ==========================================================================
   BAKEPILOT CLOUD & PRODUCTION CONFIGURATION
   Centralized 24/7 Cloud Backend Gateway for Mobile APK & Play Store
   ========================================================================== */

(function(window) {
  'use strict';

  // 1. Default Production Cloud API URL
  // Replace with your live Render, Railway, or VPS domain (e.g., https://bakepilot-api.onrender.com)
  const DEFAULT_CLOUD_API = 'https://bakepilot-cloud.onrender.com';

  function resolveApiHost() {
    // Priority 1: User or Admin manual override saved in localStorage
    try {
      const customUrl = localStorage.getItem('bakepilot_server_url');
      if (customUrl && customUrl.trim()) return customUrl.trim().replace(/\/+$/, '');
    } catch(e) {}

    // Priority 2: Explicit window global override (e.g. injected at build time)
    if (window.BAKEPILOT_API_HOST && typeof window.BAKEPILOT_API_HOST === 'string') {
      return window.BAKEPILOT_API_HOST.trim().replace(/\/+$/, '');
    }

    // Priority 3: If running in web browser on a real remote server domain (not localhost)
    if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
      const host = window.location.hostname;
      if (host !== 'localhost' && !host.startsWith('127.') && !host.startsWith('192.168.')) {
        return window.location.origin;
      }
    }

    // Priority 4: Production Cloud Backend for mobile APK / PWA
    return DEFAULT_CLOUD_API;
  }

  window.BAKEPILOT_CONFIG = {
    appName: 'BakePilot',
    version: '1.1.43',
    getApiUrl: resolveApiHost,
    setApiUrl: function(url) {
      if (url) {
        localStorage.setItem('bakepilot_server_url', url.trim());
      } else {
        localStorage.removeItem('bakepilot_server_url');
      }
    }
  };

  // Global helper accessible anywhere in the application
  window.getServerUrl = function(endpoint) {
    if (!endpoint) return '/';
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    const cleanPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // If running in desktop browser on the actual web server
    if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
      const host = window.location.hostname;
      if (host !== 'localhost' && !host.startsWith('127.')) {
        return cleanPath;
      }
    }

    const base = resolveApiHost();
    return base ? `${base}${cleanPath}` : cleanPath;
  };

})(typeof window !== 'undefined' ? window : this);
