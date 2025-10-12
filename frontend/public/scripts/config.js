;(() => {
  const CONFIG = {
    API_BASE_URL: (() => {
      // Jika ada override manual, misal window.APP_CONFIG._OVERRIDE_API dari build tools
      if (window.APP_CONFIG && window.APP_CONFIG._OVERRIDE_API) {
        return window.APP_CONFIG._OVERRIDE_API;
      }

      const hostname = window.location.hostname;

      // --- Mode lokal ---
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return "http://localhost:8000";
      }

      // --- Mode production ---
      // Railway backend (HARUS pakai https agar fetch() tidak gagal mixed content)
      return "https://exquisite-clarity-production.up.railway.app";
    })(),

    REQUEST_TIMEOUT: 30000, // 30 detik timeout default
    APP_NAME: "virtual_learning",
  };

  window.APP_CONFIG = CONFIG;
})();