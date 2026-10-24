import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRecipe, patchRecipe } from '../api/recipes.js';
import RecipeForm from '../components/RecipeForm.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { paths } from '../routes.js';
import { eyebrow, muted, pageTitle, panel } from '../styles.js';

// "a\n  b\n\n c" -> "a\nb\nc" (so we can compare textarea text fairly)
const cleanLines = (text) =>
  text.split('\n').map((line) => line.trim()).filter(Boolean).join('\n');

// Converts a recipe from the API into the text values used by the form.
const toForm = (recipe) => ({
  dish: recipe.dish || '',
  title: recipe.title || '',
  img: recipe.img || '',
  time: recipe.time ? String(recipe.time) : '',
  servings: recipe.servings ? String(recipe.servings) : '',
  ing: (recipe.ing || []).join('\n'),
  steps: (recipe.steps || []).join('\n'),
});

// Edit page: /recipe/:id/edit
// Saves with the HTTP PATCH method - only the fields the user actually changed
// are sent to the server (a PUT would have to send the whole recipe again).
export default function EditRecipePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { say, busy, withBusy } = useApp();
  const navigate = useNavigate();

  const [original, setOriginal] = useState(null); // what the server has now
  const [form, setForm] = useState(null); // what the user is typing

  useEffect(() => {
    let cancelled = false;

    withBusy(async () => {
      try {
        const recipe = await getRecipe(id);
        if (cancelled) return;

        if (Number(recipe.uid) !== Number(user.id)) {
          say('Only the author can edit this recipe.');
          navigate(paths.recipe(id), { replace: true });
          return;
        }
        const values = toForm(recipe);
        setOriginal(values);
        setForm(values);
      } catch (error) {
        say(error.message);
        navigate(paths.home, { replace: true });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [id, user.id, withBusy, say, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Work out which fields changed -> these go into the PATCH body.
    const changes = {};
    if (form.dish.trim() !== original.dish) changes.dish = form.dish.trim();
    if (form.title.trim() !== original.title) changes.title = form.title.trim();
    if (form.img.trim() !== original.img) changes.img = form.img.trim();
    if (form.time !== original.time) changes.time = Number(form.time) || null;
    if (form.servings !== original.servings) changes.servings = Number(form.servings) || null;
    if (cleanLines(form.ing) !== cleanLines(original.ing)) {
      changes.ing = cleanLines(form.ing).split('\n');
    }
    if (cleanLines(form.steps) !== cleanLines(original.steps)) {
      changes.steps = cleanLines(form.steps).split('\n');
    }

    if (Object.keys(changes).length === 0) {
      say('Nothing changed yet.');
      return;
    }

    await withBusy(async () => {
      try {
        await patchRecipe(id, changes);
        say('Recipe updated!');
        navigate(paths.recipe(id));
      } catch (error) {
        say(error.message);
      }
    });
  };

  if (!form) return null; // still loading (Notice shows "Loading recipes...")

  return (
    <section className={panel}>
      <span className={eyebrow}>MAKE IT BETTER</span>
      <h2 className={pageTitle}>Edit recipe</h2>

      <p className={muted}>
        Change only what you need – untouched fields stay exactly as they are.
      </p>

      <RecipeForm
        form={form}
        onChange={setForm}
        onSubmit={handleSubmit}
        busy={busy}
        submitLabel="Save changes"
      />
    </section>
  );
}
