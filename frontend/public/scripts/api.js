// /js/api.js
;(() => {
  // Ganti kalau perlu (tanpa trailing slash)
  let BASE_URL = "https://exquisite-clarity-duplicate.up.railway.app";

  // --- helpers --------------------------------------------------------------
  const isFormLike = (b) => b instanceof FormData || b instanceof URLSearchParams;
  const isPlainObj = (b) =>
    b && typeof b === "object" && !isFormLike(b) && !(b instanceof Blob) && !(b instanceof ArrayBuffer);

  const joinUrl = (base, path) => {
    if (!path) return base;
    if (path.startsWith("http")) return path;
    const b = base.replace(/\/+$/, "");
    const p = path.startsWith("/") ? path : `/${path}`;
    return b + p;
  };

  /**
   * fetchJSON(path, opts)
   *  opts:
   *   - method: default GET
   *   - headers, body
   *   - auth: boolean (default true) -> sertakan Bearer <token> bila ada
   *   - parse: 'auto' | 'json' | 'text' | 'blob' (default 'auto')
   *   - baseUrl: override BASE_URL
   */
  async function fetchJSON(path, opts = {}) {
    const { auth = true, parse = "auto", baseUrl, ...rest } = opts;

    const headers = new Headers(rest.headers || {});
    const token = localStorage.getItem("auth_token");

    // Authorization (kecuali dimatikan)
    if (auth && token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // Body & content-type
    let body = rest.body;
    if (isPlainObj(body)) {
      if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
      body = JSON.stringify(body);
    } else if (isFormLike(body)) {
      // biarkan browser set boundary; jangan set Content-Type manual
      if (headers.has("Content-Type")) headers.delete("Content-Type");
    }

    const url = joinUrl(baseUrl || BASE_URL, path);
    const res = await fetch(url, { ...rest, headers, body });

    // No Content
    if (res.status === 204) {
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return null;
    }

    // Parse
    const ct = res.headers.get("content-type") || "";
    const text = await res.text();
    let data;
    try {
      if (parse === "text") data = text;
      else if (parse === "json" || ct.includes("application/json")) data = text ? JSON.parse(text) : null;
      else if (parse === "blob") {
        // fetch ulang sebagai blob (jarang, tapi disediakan)
        const res2 = await fetch(url, { ...rest, headers, body });
        data = await res2.blob();
      } else {
        data = ct.includes("application/json") ? (text ? JSON.parse(text) : null) : text;
      }
    } catch {
      data = text;
    }

    if (!res.ok) {
      const msg =
        (data && (data.detail || data.message || data.error || data.msg)) ||
        `${res.status} ${res.statusText}`;
      throw new Error(msg);
    }

    return data;
  }

  // Shorthands
  const get  = (path, opts) => fetchJSON(path, { method: "GET",  ...opts });
  const post = (path, body, opts) => fetchJSON(path, { method: "POST", body, ...opts });
  const put  = (path, body, opts) => fetchJSON(path, { method: "PUT",  body, ...opts });
  const del  = (path, opts) => fetchJSON(path, { method: "DELETE", ...opts });

  // Khusus form POST (OAuth2/Multipart)
  function postForm(path, formLike, opts = {}) {
    if (!isFormLike(formLike)) throw new Error("postForm: body harus FormData/URLSearchParams");
    return fetchJSON(path, { method: "POST", body: formLike, ...opts });
  }

  function setBaseUrl(url) {
    BASE_URL = (url || "").replace(/\/+$/, "");
  }

  window.API = { BASE_URL, setBaseUrl, fetchJSON, postForm, get, post, put, del };
})();