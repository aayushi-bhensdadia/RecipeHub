import { request } from './client.js';

export const getRecipe = (id) => request('/recipes/' + id);

export const getMyRecipes = () => request('/my/recipes');

export const createRecipe = (payload) =>
  request('/recipes', { method: 'POST', body: JSON.stringify(payload) });

// PATCH = partial update: only the fields inside `changes` are sent and saved.
export const patchRecipe = (id, changes) =>
  request('/recipes/' + id, { method: 'PATCH', body: JSON.stringify(changes) });
