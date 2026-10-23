import { getToken } from '../utils/storage.js';

const API = '/api';

// Base fetch helper: adds JSON headers + auth token, throws on errors.
export async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(API + path, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}
