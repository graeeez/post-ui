// Client API for /api/posts
// This is explicitly pointed to your backend at http://localhost:8080/api/posts
const API_BASE = '/api/posts';

async function parseErrorBody(res) {
  try {
    const json = await res.json().catch(() => null);
    if (json) return json.message || json.error || JSON.stringify(json);
  } catch {}
  try {
    const txt = await res.text().catch(() => '');
    if (txt) return txt;
  } catch {}
  return `HTTP ${res.status}`;
}

async function handleResponse(res, action) {
  if (res.ok) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  const body = await parseErrorBody(res);
  const err = new Error(body || `Failed to ${action} post (status ${res.status})`);
  err.status = res.status;
  throw err;
}

async function safeFetch(url, options) {
  try {
    return await fetch(url, { credentials: 'same-origin', ...options });
  } catch (err) {
    throw new Error(`Network error: ${err.message}`);
  }
}

export async function getPosts() {
  const res = await safeFetch(API_BASE, { method: 'GET' });
  return handleResponse(res, 'load');
}

export async function createPost(post) {
  const payload = {
    author: post.author ?? null,
    title: post.title ?? null,
    content: post.content ?? null,
    imageUrl: post.imageUrl ?? null
  };
  const res = await safeFetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res, 'create');
}

export async function updatePost(id, post) {
  const payload = {
    author: post.author ?? null,
    title: post.title ?? null,
    content: post.content ?? null,
    imageUrl: post.imageUrl ?? null
  };
  const res = await safeFetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res, 'update');
}

export async function deletePost(id) {
  const res = await safeFetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
  return handleResponse(res, 'delete');
}