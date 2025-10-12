;(() => {
  if (!window.API) {
    console.error("❌ API module belum dimuat. Pastikan api.js dimuat sebelum auth.js.");
    return;
  }

  const Auth = {
    /**
     * Register new user
     */
    async register(email, password, fullName = null) {
      if (!email || !password) {
        throw new Error("Email dan password harus diisi");
      }

      // Validate password
      if (password.length < 6) {
        throw new Error("Kata sandi harus minimal 6 karakter");
      }

      // Create FormData for OAuth2 compatibility
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      if (fullName) {
        formData.append('full_name', fullName);
      }

      const response = await fetch(`${API.BASE_URL}/auth/register`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `Registration failed: ${response.status}`);
      }

      return data;
    },

    /**
     * Login user with OAuth2 password flow
     */
    async login(email, password) {
      if (!email || !password) {
        throw new Error("Email dan password harus diisi");
      }

      // OAuth2PasswordRequestForm expects 'username' and 'password' fields
      const formData = new FormData();
      formData.append('username', email); // OAuth2 uses 'username' field
      formData.append('password', password);

      const response = await fetch(`${API.BASE_URL}/auth/login`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login gagal");
      }

      // Store token and user info
      if (data?.access_token) {
        localStorage.setItem("auth_token", data.access_token);
        
        // Fetch user info after login
        try {
          const userInfo = await this.fetchProtected("/users/me");
          localStorage.setItem("user_email", userInfo.email);
          localStorage.setItem("user_id", userInfo.id);
          if (userInfo.full_name) {
            localStorage.setItem("user_name", userInfo.full_name);
          }
          localStorage.setItem("user_created", userInfo.created_at);
        } catch (error) {
          console.warn("Could not fetch user info:", error);
          localStorage.setItem("user_email", email);
        }
        
        window.dispatchEvent(new Event("authStateChanged"));
        return data;
      } else {
        throw new Error("Token tidak ditemukan dalam response");
      }
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
      
      // Redirect to login page
      const loginPath = window.location.pathname.includes('/pages/') 
        ? 'login.html' 
        : '../pages/login.html';
      window.location.href = loginPath;
    },

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
      const token = localStorage.getItem("auth_token");
      if (!token) return false;

      // Optional: Check token expiration
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; // Convert to milliseconds
        if (Date.now() >= exp) {
          this.logout();
          return false;
        }
        return true;
      } catch (error) {
        console.warn("Invalid token format:", error);
        return true; // Assume valid if can't parse
      }
    },

    /**
     * Get user information
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
     * Get auth token
     */
    getToken() {
      return localStorage.getItem("auth_token");
    },

    /**
     * Fetch protected endpoint
     */
    async fetchProtected(url, options = {}) {
      if (!this.isLoggedIn()) {
        throw new Error("Anda harus login terlebih dahulu");
      }

      const token = this.getToken();
      const headers = {
        "Authorization": `Bearer ${token}`,
        ...options.headers,
      };

      // Handle JSON body
      if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(options.body);
      }

      const fullUrl = url.startsWith('http') ? url : `${API.BASE_URL}${url}`;
      const response = await fetch(fullUrl, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.logout();
        throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `Request failed: ${response.status}`);
      }

      return data;
    },

    /**
     * Get user profile with progress data
     */
    async getProfile() {
      try {
        return await this.fetchProtected("/profile");
      } catch (error) {
        if (error.message.includes("401") || error.message.includes("Token")) {
          this.logout();
        }
        throw error;
      }
    },

    /**
     * Save flashcard progress
     */
    async saveFlashcardProgress(module, current, total) {
      return await this.fetchProtected("/progress/flashcard", {
        method: "POST",
        body: { module, current, total },
      });
    },

    /**
     * Save quiz result
     */
    async saveQuizResult(module, score, total) {
      return await this.fetchProtected("/progress/quiz", {
        method: "POST",
        body: { module, score, total },
      });
    },

    /**
     * Save game statistics
     */
    async saveGameStat(game, metric, value) {
      return await this.fetchProtected("/progress/game", {
        method: "POST",
        body: { game, metric, value },
      });
    },

    /**
     * Track learning action
     */
    async trackLearning(module, action) {
      return await this.fetchProtected("/progress/learning", {
        method: "POST",
        body: { module, action },
      });
    },
  };

  window.Auth = Auth;
})();