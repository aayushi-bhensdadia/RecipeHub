import * as spoonacular from '../services/spoonacular.service.js';

export async function search(req, res) {
  res.json(await spoonacular.searchRecipes(req.query.q, req.query.n));
}

export async function popular(req, res) {
  res.json(await spoonacular.popularRecipes());
}

export async function getRecipe(req, res) {
  res.json(await spoonacular.getRecipeById(req.params.id));
}
