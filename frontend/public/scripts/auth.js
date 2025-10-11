;(() => {
  if (!window.API) {
    console.error("❌ API module belum dimuat. Pastikan api.js dimuat sebelum auth.js.");
    return;
  }

  const Auth = {
    async register(email, password) {
      if (!email || !password) throw new Error("Email dan password harus diisi");

      // Validate password: min 8 characters, uppercase, lowercase, number, special char
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (password.length < minLength) {
        throw new Error("Kata sandi harus minimal 8 karakter.");
      }
      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        throw new Error("Kata sandi harus mengandung huruf besar, huruf kecil, angka, dan karakter khusus.");
      }

      return API.fetchJSON("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    },

    async login(email, password) {
      if (!email || !password) throw new Error("Email dan password harus diisi");

      const data = await API.fetchJSON("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data?.access_token) {
        localStorage.setItem("auth_token", data.access_token);
        localStorage.setItem("user_email", data.user?.email || email);
        localStorage.setItem("user_created", data.user?.created_at || new Date().toISOString());
        window.dispatchEvent(new Event("authStateChanged"));
      } else {
        throw new Error("Token tidak ditemukan dalam response");
      }

      return data;
    },

    logout() {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_created");
      window.dispatchEvent(new Event("authStateChanged"));
      window.location.href = "../pages/login.html";
    },

    isLoggedIn() {
      return !!localStorage.getItem("auth_token");
    },

    getUser() {
      return this.isLoggedIn()
        ? {
            email: localStorage.getItem("user_email"),
            created_at: localStorage.getItem("user_created"),
          }
        : null;
    },

    getToken() {
      return localStorage.getItem("auth_token");
    },

    async fetchProtected(url, options = {}) {
      if (!this.isLoggedIn()) throw new Error("Anda harus login terlebih dahulu");
      return API.fetchJSON(url, options);
    },

    async getProfile() {
      try {
        return await this.fetchProtected("/profile");
      } catch (error) {
        if (error.message.includes("401") || error.message.includes("Token")) this.logout();
        throw error;
      }
    },
  };

  window.Auth = Auth;
})();