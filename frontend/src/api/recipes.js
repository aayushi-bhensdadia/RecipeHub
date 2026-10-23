import { request } from './client.js';

export const getRecipe = (id) => request('/recipes/' + id);

export const getMyRecipes = () => request('/my/recipes');

export const createRecipe = (payload) =>
  request('/recipes', { method: 'POST', body: JSON.stringify(payload) });
