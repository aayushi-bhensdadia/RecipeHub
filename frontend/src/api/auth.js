import { request } from './client.js';

export const authenticate = (mode, form) =>
  request('/auth/' + (mode === 'register' ? 'register' : 'login'), {
    method: 'POST',
    body: JSON.stringify(form),
  });
