import { request } from './client.js';

export const searchOnlineRecipes = (q) =>
  request('/spoon/search?q=' + encodeURIComponent(q));

export const getPopularOnlineRecipes = () => request('/spoon/popular');

export const getOnlineRecipe = (id) =>
  request('/spoon/recipe/' + encodeURIComponent(id));
