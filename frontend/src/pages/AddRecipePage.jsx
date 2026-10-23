import { useState } from 'react';
import { createRecipe } from '../api/recipes.js';
import RecipeForm from '../components/RecipeForm.jsx';
import { useApp } from '../context/AppContext.jsx';

const EMPTY_FORM = {
  dish: '',
  title: '',
  img: '',
  time: '',
  servings: '',
  ing: '',
  steps: '',
};

export default function AddRecipePage() {
  const { say, busy, withBusy, openDish } = useApp();
  const [form, setForm] = useState(EMPTY_FORM);

  const handleSubmit = async (event) => {
    event.preventDefault();

    await withBusy(async () => {
      try {
        const data = await createRecipe({
          ...form,
          time: Number(form.time) || null,
          servings: Number(form.servings) || null,
          ing: form.ing.split('\n'),
          steps: form.steps.split('\n'),
        });

        say('Recipe shared!');
        setForm(EMPTY_FORM);
        openDish(data.dishKey);
      } catch (error) {
        say(error.message);
      }
    });
  };

  return (
    <section className="panel">
      <span className="eyebrow">PASS IT AROUND</span>
      <h2>Share a recipe</h2>

      <p className="muted">
        Put each ingredient and each method step on a new line.
      </p>

      <RecipeForm
        form={form}
        onChange={setForm}
        onSubmit={handleSubmit}
        busy={busy}
      />
    </section>
  );
}
