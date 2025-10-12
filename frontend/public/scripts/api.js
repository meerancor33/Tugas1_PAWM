// /js/api.js
;(() => {
  // Ubah jika perlu (tanpa trailing slash)
  let BASE_URL = "https://exquisite-clarity-production.up.railway.app";

  function resolveUrl(path) {
    return path.startsWith("http") ? path : BASE_URL + (path.startsWith("/") ? path : `/${path}`);
  }

  function isFormLike(body) {
    return body instanceof FormData || body instanceof URLSearchParams;
  }
  function isPlainObject(body) {
    return (
      body &&
      typeof body === "object" &&
      !isFormLike(body) &&
      !(body instanceof Blob) &&
      !(body instanceof ArrayBuffer)
    );
  }

  /**
   * fetchJSON
   * Opsi:
   * - auth: boolean (default: true) → sertakan Authorization bila token ada
   * - parse: 'auto' | 'json' | 'text' | 'blob' (default: 'auto')
   * - baseUrl: override BASE_URL bila perlu
   */
  async function fetchJSON(path, opts = {}) {
    const { auth = true, parse = "auto", baseUrl, ...rest } = opts;

    const token = localStorage.getItem("auth_token");
    const headers = new Headers(rest.headers || {});

    // Tambah Authorization kalau diminta & token tersedia
    if (auth && token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // Siapkan body & Content-Type hanya jika perlu
    let body = rest.body;
    if (isPlainObject(body)) {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      body = JSON.stringify(body);
    } else if (isFormLike(body)) {
      // Biarkan browser set boundary; jangan paksa Content-Type
      if (headers.has("Content-Type")) headers.delete("Content-Type");
    }

    const url = path.startsWith("http")
      ? path
      : (baseUrl ? baseUrl.replace(/\/+$/, "") : BASE_URL) + (path.startsWith("/") ? path : `/${path}`);

    const res = await fetch(url, { ...rest, headers, body });

    // 204 No Content
    if (res.status === 204) {
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return null;
    }

    const ct = res.headers.get("content-type") || "";
    const raw = await res.text();
    let data = null;

    try {
      if (parse === "text") {
        data = raw;
      } else if (parse === "json" || ct.includes("application/json")) {
        data = raw ? JSON.parse(raw) : null;
      } else if (parse === "blob") {
        // jika eksplisit blob, ambil ulang sebagai blob
        const res2 = await fetch(url, { ...rest, headers, body });
        data = await res2.blob();
      } else {
        // auto
        data = ct.includes("application/json") ? (raw ? JSON.parse(raw) : null) : raw;
      }
    } catch {
      // jika parsing JSON gagal, kembalikan raw text
      data = raw;
    }

    if (!res.ok) {
      const msg =
        (data && (data.detail || data.message || data.error || data.msg)) ||
        `${res.status} ${res.statusText}`;
      throw new Error(msg);
    }

    return data;
  }

  /**
   * Helper POST form (untuk OAuth2 password flow, register, dsb.)
   * Otomatis tidak menyetel Content-Type agar boundary ditangani browser.
   * Gunakan { auth:false } saat login/register publik.
   */
  function postForm(path, formLike, opts = {}) {
    if (!isFormLike(formLike)) {
      throw new Error("postForm: body harus FormData atau URLSearchParams");
    }
    return fetchJSON(path, { method: "POST", body: formLike, ...opts });
  }

  // Shorthand helpers
  const get  = (path, opts) => fetchJSON(path, { method: "GET",  ...opts });
  const post = (path, body, opts) => fetchJSON(path, { method: "POST", body, ...opts });
  const put  = (path, body, opts) => fetchJSON(path, { method: "PUT",  body, ...opts });
  const del  = (path, opts) => fetchJSON(path, { method: "DELETE", ...opts });

  // Optional: ganti base URL saat runtime
  function setBaseUrl(url) {
    BASE_URL = (url || "").replace(/\/+$/, "");
  }

  window.API = { fetchJSON, postForm, get, post, put, del, setBaseUrl, BASE_URL };
})();