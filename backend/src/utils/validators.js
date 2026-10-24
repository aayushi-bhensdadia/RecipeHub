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

// Validates the body of a PATCH (partial update) request.
// Only the fields that were sent are checked and returned, as { column: value }.
export function parseRecipePatch(b = {}) {
  const changes = {};

  if ('dish' in b) {
    const dish = String(b.dish || '').trim();
    if (!dish) throw fail(400, 'Dish name cannot be empty');
    changes.dish = dish;
  }
  if ('title' in b) {
    changes.title = String(b.title || '').trim();
  }
  if ('img' in b) {
    const img = String(b.img || '');
    if (img.length > 3e6) throw fail(413, 'Image too large');
    changes.img = img;
  }
  if ('time' in b) changes.time = Number(b.time) || null;
  if ('servings' in b) changes.servings = Number(b.servings) || null;
  if ('ing' in b) {
    changes.ing = lines(b.ing);
    if (!changes.ing.length) throw fail(400, 'Ingredients cannot be empty');
  }
  if ('steps' in b) {
    changes.steps = lines(b.steps);
    if (!changes.steps.length) throw fail(400, 'Steps cannot be empty');
  }

  if (!Object.keys(changes).length) throw fail(400, 'Nothing to update');
  return changes;
}
