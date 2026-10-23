import { request } from './client.js';

export const getReviews = (rid) => request('/reviews/' + rid);

export const saveReview = (rid, rating, text) =>
  request('/reviews/' + rid, {
    method: 'POST',
    body: JSON.stringify({ rating, text }),
  });
