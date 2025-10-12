// /js/auth.js
;(() => {
  if (!window.API) {
    console.error("❌ API module belum dimuat. Pastikan api.js dimuat sebelum auth.js.");
    return;
  }

  const Auth = {
    /**
     * Register user baru
     * Default pakai FormData agar kompatibel dengan OAuth2-style form di server.
     * Jika backend butuh JSON, ubah opsi 'useJson' jadi true.
     */
    async register(email, password, fullName = null, { useJson = false } = {}) {
      if (!email || !password) {
        throw new Error("Email dan password harus diisi");
      }
      if (password.length < 6) {
        throw new Error("Kata sandi harus minimal 6 karakter");
      }

      if (useJson) {
        // Kirim JSON
        const body = { email, password };
        if (fullName) body.full_name = fullName;
        const data = await API.post("/auth/register", body, { auth: false });
        return data;
      } else {
        // Kirim FormData
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        if (fullName) formData.append("full_name", fullName);

        const data = await API.postForm("/auth/register", formData, { auth: false });
        return data;
      }
    },

    /**
     * Login user (OAuth2 password flow)
     * Server FastAPI OAuth2PasswordRequestForm mengharapkan 'username' + 'password'
     */
    async login(email, password) {
      if (!email || !password) {
        throw new Error("Email dan password harus diisi");
      }

      const formData = new FormData();
      formData.append("username", email); // sesuai OAuth2
      formData.append("password", password);

      const data = await API.postForm("/auth/login", formData, { auth: false });

      if (!data?.access_token) {
        throw new Error("Token tidak ditemukan dalam response");
      }

      // Simpan token
      localStorage.setItem("auth_token", data.access_token);

      // Ambil info user setelah login
      try {
        const userInfo = await this.fetchProtected("/users/me");
        if (userInfo?.email) localStorage.setItem("user_email", userInfo.email);
        if (userInfo?.id) localStorage.setItem("user_id", userInfo.id);
        if (userInfo?.full_name) localStorage.setItem("user_name", userInfo.full_name);
        if (userInfo?.created_at) localStorage.setItem("user_created", userInfo.created_at);
      } catch (error) {
        console.warn("Tidak dapat mengambil user info:", error);
        // fallback minimal
        localStorage.setItem("user_email", email);
      }

      window.dispatchEvent(new Event("authStateChanged"));
      return data;
    },

    /**
     * Logout user
     */
    logout() {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_created");

      window.dispatchEvent(new Event("authStateChanged"));

      // Redirect ke login page
      const loginPath = window.location.pathname.includes("/pages/")
        ? "login.html"
        : "../pages/login.html";
      window.location.href = loginPath;
    },

    /**
     * Cek status logged in berdasarkan token + expiry JWT (jika bisa diparse)
     */
    isLoggedIn() {
      const token = localStorage.getItem("auth_token");
      if (!token) return false;

      try {
        const parts = token.split(".");
        if (parts.length !== 3) return true; // bukan JWT standar, anggap saja valid
        const payload = JSON.parse(atob(parts[1]));
        if (payload?.exp) {
          const expMs = payload.exp * 1000;
          if (Date.now() >= expMs) {
            this.logout();
            return false;
          }
        }
        return true;
      } catch (e) {
        console.warn("Gagal parse JWT:", e);
        // Jika gagal parse, anggap token masih valid tapi waspada
        return true;
      }
    },

    /**
     * Ambil informasi user dari localStorage (cache)
     */
    getUser() {
      if (!this.isLoggedIn()) return null;

      return {
        id: localStorage.getItem("user_id"),
        email: localStorage.getItem("user_email"),
        fullName: localStorage.getItem("user_name"),
        created_at: localStorage.getItem("user_created"),
      };
    },

    /**
     * Ambil token auth
     */
    getToken() {
      return localStorage.getItem("auth_token");
    },

    /**
     * Panggil endpoint protected via API.fetchJSON
     * - Otomatis menyertakan Authorization: Bearer <token>
     * - Jika 401: logout & lempar error ramah
     */
    async fetchProtected(pathOrUrl, options = {}) {
      if (!this.isLoggedIn()) {
        throw new Error("Anda harus login terlebih dahulu");
      }

      try {
        const data = await API.fetchJSON(pathOrUrl, { ...options, auth: true });
        return data;
      } catch (err) {
        const msg = (err && err.message) || "";
        if (
          /401/.test(msg) ||
          /unauthorized/i.test(msg) ||
          /expired/i.test(msg) ||
          /token/i.test(msg)
        ) {
          // Token invalid/expired
          this.logout();
          throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
        }
        throw err;
      }
    },

    /**
     * GET /profile
     */
    async getProfile() {
      return await this.fetchProtected("/profile");
    },

    /**
     * POST /progress/flashcard  → { module, current, total }
     */
    async saveFlashcardProgress(module, current, total) {
      if (!module && module !== 0) throw new Error("Parameter 'module' wajib diisi");
      return await this.fetchProtected("/progress/flashcard", {
        method: "POST",
        body: { module, current, total },
      });
    },

    /**
     * POST /progress/quiz  → { module, score, total }
     */
    async saveQuizResult(module, score, total) {
      if (!module && module !== 0) throw new Error("Parameter 'module' wajib diisi");
      return await this.fetchProtected("/progress/quiz", {
        method: "POST",
        body: { module, score, total },
      });
    },

    /**
     * POST /progress/game → { game, metric, value }
     */
    async saveGameStat(game, metric, value) {
      if (!game) throw new Error("Parameter 'game' wajib diisi");
      return await this.fetchProtected("/progress/game", {
        method: "POST",
        body: { game, metric, value },
      });
    },

    /**
     * POST /progress/learning → { module, action }
     */
    async trackLearning(module, action) {
      if (!module) throw new Error("Parameter 'module' wajib diisi");
      if (!action) throw new Error("Parameter 'action' wajib diisi");
      return await this.fetchProtected("/progress/learning", {
        method: "POST",
        body: { module, action },
      });
    },
  };

  window.Auth = Auth;
})();