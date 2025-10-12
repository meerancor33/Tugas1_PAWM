;(() => {
  const CONFIG = {
    API_BASE_URL: (() => {
      // Jika ada env var (dibuat saat build), gunakan itu.
      // Untuk static sites, banyak host menyediakan REPLACEMENT via process.env.* saat build (React/Vite).
      if (window.APP_CONFIG && window.APP_CONFIG._OVERRIDE_API) {
        return window.APP_CONFIG._OVERRIDE_API;
      }

      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8000';
      } else {
        // fallback: construct from location (si FE dan BE deploy di subdomain berbeda => ubah sesuai)
        return `https://tugas1pawm-production.up.railway.app`;
      }
    })(),
    REQUEST_TIMEOUT: 30000,
    APP_NAME: 'virtual_learning',
  };
  window.APP_CONFIG = CONFIG;
})();
