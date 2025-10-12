// /js/auth.js
;(() => {
  if (!window.API) {
    console.error("❌ API module belum dimuat. Pastikan api.js dimuat sebelum auth.js.");
    return;
  }

  const Auth = {
    // ---------- Register ----------
    async register(email, password, fullName = null, { useJson = false } = {}) {
      if (!email || !password) throw new Error("Email dan password harus diisi");
      if (String(password).length < 6) throw new Error("Kata sandi harus minimal 6 karakter");

      if (useJson) {
        // Jika backend menerima JSON
        const body = { email, password };
        if (fullName) body.full_name = fullName;
        return await API.post("/auth/register", body, { auth: false });
      } else {
        // Default: FormData (sesuai app.py)
        const form = new FormData();
        form.append("email", email);
        form.append("password", password);
        if (fullName) form.append("full_name", fullName);
        return await API.postForm("/auth/register", form, { auth: false });
      }
    },

    // ---------- Login (OAuth2 password flow) ----------
    async login(email, password) {
      if (!email || !password) throw new Error("Email dan password harus diisi");

      // OAuth2PasswordRequestForm mensyaratkan field 'username' + 'password'
      const form = new FormData();
      form.append("username", email);
      form.append("password", password);

      const data = await API.postForm("/auth/login", form, { auth: false });
      if (!data?.access_token) throw new Error("Token tidak ditemukan dalam response");

      // Simpan token
      localStorage.setItem("auth_token", data.access_token);

      // Ambil data user & cache
      try {
        const me = await this.fetchProtected("/users/me");
        if (me?.email) localStorage.setItem("user_email", me.email);
        if (me?.id) localStorage.setItem("user_id", me.id);
        if (me?.full_name) localStorage.setItem("user_name", me.full_name);
        if (me?.created_at) localStorage.setItem("user_created", me.created_at);
      } catch (e) {
        console.warn("Tidak bisa mengambil /users/me:", e);
        localStorage.setItem("user_email", email);
      }

      window.dispatchEvent(new Event("authStateChanged"));
      return data;
    },

    // ---------- Logout ----------
    logout() {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_created");

      window.dispatchEvent(new Event("authStateChanged"));

      // Redirect ke login page (menyesuaikan struktur folder)
      const loginPath = location.pathname.includes("/pages/")
        ? "login.html"
        : "/pages/login.html";
      location.href = loginPath;
    },

    // ---------- Status ----------
    isLoggedIn() {
      const token = localStorage.getItem("auth_token");
      if (!token) return false;

      // Coba cek expiry JWT (jika formatnya JWT)
      try {
        const parts = token.split(".");
        if (parts.length !== 3) return true; // bukan JWT -> biarkan
        const payload = JSON.parse(atob(parts[1]));
        if (payload?.exp && Date.now() >= payload.exp * 1000) {
          this.logout();
          return false;
        }
        return true;
      } catch (e) {
        console.warn("Token bukan JWT atau gagal parse:", e);
        return true;
      }
    },

    getUser() {
      if (!this.isLoggedIn()) return null;
      return {
        id: localStorage.getItem("user_id"),
        email: localStorage.getItem("user_email"),
        fullName: localStorage.getItem("user_name"),
        created_at: localStorage.getItem("user_created"),
      };
    },

    getToken() {
      return localStorage.getItem("auth_token");
    },

    // ---------- Fetch protected ----------
    async fetchProtected(pathOrUrl, options = {}) {
      if (!this.isLoggedIn()) throw new Error("Anda harus login terlebih dahulu");

      try {
        return await API.fetchJSON(pathOrUrl, { ...options, auth: true });
      } catch (err) {
        const msg = String(err?.message || "");
        // Tangani 401/expired
        if (/401|unauthorized|expired|token/i.test(msg)) {
          this.logout();
          throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
        }
        throw err;
      }
    },

    // ---------- API spesifik ----------
    getProfile() {
      return this.fetchProtected("/profile");
    },

    saveFlashcardProgress(module, current, total) {
      if (module == null || module === "") throw new Error("Parameter 'module' wajib diisi");
      return this.fetchProtected("/progress/flashcard", {
        method: "POST",
        body: { module, current, total },
      });
    },

    saveQuizResult(module, score, total) {
      if (module == null || module === "") throw new Error("Parameter 'module' wajib diisi");
      return this.fetchProtected("/progress/quiz", {
        method: "POST",
        body: { module, score, total },
      });
    },

    saveGameStat(game, metric, value) {
      if (!game) throw new Error("Parameter 'game' wajib diisi");
      return this.fetchProtected("/progress/game", {
        method: "POST",
        body: { game, metric, value },
      });
    },

    trackLearning(module, action) {
      if (!module) throw new Error("Parameter 'module' wajib diisi");
      if (!action) throw new Error("Parameter 'action' wajib diisi");
      return this.fetchProtected("/progress/learning", {
        method: "POST",
        body: { module, action },
      });
    },
  };

  window.Auth = Auth;
})();