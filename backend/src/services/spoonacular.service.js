import { env } from '../config/env.js';
import { fail } from '../utils/httpError.js';

const cache = new Map();
const CACHE_MS = 3600000; // 1 hour

async function spoon(path, params = {}) {
  if (!env.spoonacularKey) {
    throw fail(503, 'Set SPOONACULAR_KEY in backend/.env to enable online recipe search');
  }

  const cacheKey = path + JSON.stringify(params);
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.time < CACHE_MS) return hit.data;

  const url = new URL('https://api.spoonacular.com' + path);
  Object.entries({ ...params, apiKey: env.spoonacularKey }).forEach(([k, v]) =>
    url.searchParams.set(k, String(v))
  );

  const response = await fetch(url);
  if (response.status === 402) throw fail(429, 'Spoonacular daily quota reached; try again later');
  if (!response.ok) throw fail(502, 'Spoonacular API error ' + response.status);

  const data = await response.json();
  cache.set(cacheKey, { time: Date.now(), data });
  return data;
}

const toCard = (r) => ({
  rid: 's_' + r.id,
  title: r.title,
  img: r.image || '',
  time: r.readyInMinutes,
});

export async function searchRecipes(query, number) {
  const data = await spoon('/recipes/complexSearch', {
    query: query || '',
    number: Math.min(Number(number) || 12, 30),
    addRecipeInformation: true,
  });
  return (data.results || []).map(toCard);
}

export async function popularRecipes() {
  const data = await spoon('/recipes/complexSearch', {
    sort: 'popularity',
    number: 12,
    addRecipeInformation: true,
  });
  return (data.results || []).map(toCard);
}

export async function getRecipeById(id) {
  const r = await spoon(`/recipes/${encodeURIComponent(id)}/information`);
  const steps = (r.analyzedInstructions?.[0]?.steps || []).map((x) => x.step);

  return {
    rid: 's_' + r.id,
    title: r.title,
    img: r.image || '',
    time: r.readyInMinutes,
    servings: r.servings,
    ing: (r.extendedIngredients || []).map((x) => x.original),
    steps: steps.length
      ? steps
      : [(r.instructions || 'See source').replace(/<[^>]+>/g, '')],
    credit: r.sourceName || '',
  };
}
