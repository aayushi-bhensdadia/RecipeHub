import { request } from './client.js';

export const getCollections = () => request('/collections');

export const toggleCollection = (kind, rid, title, img) =>
  request('/collections/' + kind, {
    method: 'POST',
    body: JSON.stringify({ rid, title, img }),
  });
