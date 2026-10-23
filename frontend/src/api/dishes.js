import { request } from './client.js';

export const getDishes = (q = '') =>
  request('/dishes?q=' + encodeURIComponent(q));

export const getDish = (key) =>
  request('/dishes/' + encodeURIComponent(key));
