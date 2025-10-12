;(() => {
  const BASE_URL = "https://exquisite-clarity-production.up.railway.app";

  async function fetchJSON(path, opts = {}) {
    const token = localStorage.getItem("auth_token");
    const headers = {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const url = path.startsWith("http") ? path : BASE_URL + path;
    const res = await fetch(url, { ...opts, headers });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      const msg = (data && (data.detail || data.message)) || `HTTP ${res.status}`;
      throw new Error(msg);
    }
    return data;
  }

  window.API = { fetchJSON, BASE_URL };
})();
