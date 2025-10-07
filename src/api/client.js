import { API_BASE_URL, API_KEY } from '@env';

export const BASE_URL = API_BASE_URL || 'https://cis.kku.ac.th/api/classroom';

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch (_) {
      data = null;
    }
  } else {
    data = await res.text().catch(() => null);
  }
  if (!res.ok) {
    const message = (data && (data.error || data.message)) || `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export function makeHeaders(token) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (API_KEY) headers['x-api-key'] = API_KEY;
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function apiFetch(path, { method = 'GET', token, body } = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: makeHeaders(token),
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse(res);
}

export const AuthAPI = {
  async signIn({ email, password }) {
    return apiFetch('/signin', {
      method: 'POST',
      body: { email, password },
    });
  },
};

export const ProfileAPI = {
  async me(token) {
    return apiFetch('/profile', { token });
  },
};

export const StatusAPI = {
  async list(token) {
    return apiFetch('/status', { token });
  },
  async create(token, { content }) {
    return apiFetch('/status', { method: 'POST', token, body: { content } });
  },
  async like(token, statusId) {
    return apiFetch('/like', { method: 'POST', token, body: { statusId } });
  },
  async unlike(token, statusId) {
    // Try DELETE /like (observed on server); fallback to /unlike
    try {
      return await apiFetch('/like', { method: 'DELETE', token, body: { statusId } });
    } catch (e) {
      return apiFetch('/unlike', { method: 'DELETE', token, body: { statusId } });
    }
  },
  async addComment(token, { statusId, content }) {
    return apiFetch('/comment', { method: 'POST', token, body: { statusId, content } });
  },
};

export const ClassAPI = {
  async listByYear(token, year) {
    const y = String(year).trim();
    return apiFetch(`/class/${encodeURIComponent(y)}`, { token });
  },
};
