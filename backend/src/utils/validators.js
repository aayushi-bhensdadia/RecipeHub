import { fail } from './httpError.js';
import { lines } from './text.js';

// Review/collection ids look like "u_12" (user recipe) or "s_345" (Spoonacular).
export const validRid = (rid) => /^[us]_\d+$/.test(String(rid));

// Validates and normalizes the body of create/update recipe requests.
export function parseRecipeBody(b) {
  const dish = String(b.dish || '').trim();
  const title = String(b.title || '').trim() || dish;
  const ing = lines(b.ing);
  const steps = lines(b.steps);
  const img = String(b.img || '');

  if (!dish || !ing.length || !steps.length) {
    throw fail(400, 'Dish name, ingredients and steps are required');
  }
  if (img.length > 3e6) throw fail(413, 'Image too large');

  return {
    dish,
    title,
    ing,
    steps,
    img,
    time: Number(b.time) || null,
    servings: Number(b.servings) || null,
  };
}
