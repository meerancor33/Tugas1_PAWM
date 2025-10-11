// config.js - Konfigurasi untuk koneksi ke backend
;(() => {
  const CONFIG = {
    // Backend API URL
    API_BASE_URL: (() => {
      // Auto-detect environment
      const hostname = window.location.hostname;
      
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Development - FastAPI biasanya berjalan di port 8000
        return 'http://localhost:8000';
      } else {
        // Production - Ganti dengan URL backend Anda
        // Contoh: 'https://api.virtuallearning.com'
        // Atau jika menggunakan Railway/Render: 'https://your-app.railway.app'
        return 'https://your-backend-url.com';
      }
    })(),
    
    // Timeout untuk request (ms)
    REQUEST_TIMEOUT: 30000,
    
    // Nama aplikasi untuk localStorage prefix
    APP_NAME: 'virtual_learning',
  };

  // Expose CONFIG ke window
  window.APP_CONFIG = CONFIG;
})();