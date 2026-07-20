const API_BASE = import.meta.env.VITE_BACKEND_URL || "";
const TOKEN_KEY = "portfolio_admin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  getContent: () => request("/api/content"),
  login: (email, password) =>
    request("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  verify: () => request("/api/admin/verify"),
  create: (collection, item) =>
    request(`/api/admin/${collection}`, {
      method: "POST",
      body: JSON.stringify(item),
    }),
  update: (collection, id, patch) =>
    request(`/api/admin/${collection}/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    }),
  remove: (collection, id) =>
    request(`/api/admin/${collection}/${id}`, { method: "DELETE" }),
  updateSingleton: (key, patch) =>
    request(`/api/admin/singleton/${key}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    }),
  listMedia: async (folder) => {
    const token = getToken();
    const res = await fetch(
      `${API_BASE}/api/admin/media?folder=${encodeURIComponent(folder)}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Could not list media");
    return data;
  },
  deleteMedia: async (folder, name) => {
    const token = getToken();
    const res = await fetch(
      `${API_BASE}/api/admin/media?folder=${encodeURIComponent(folder)}&name=${encodeURIComponent(name)}`,
      {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Could not delete file");
    return data;
  },
  uploadFile: async (file, folder) => {
    const token = getToken();
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    const res = await fetch(`${API_BASE}/api/admin/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data;
  },
};
