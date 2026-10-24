import { btnPrimary, fieldLabel, input } from '../styles.js';

// Used by both "Share a recipe" (POST) and "Edit recipe" (PATCH).
export default function RecipeForm({
  form, onChange, onSubmit, busy, submitLabel = 'Publish recipe',
}) {
  const set = (key) => (event) => onChange({ ...form, [key]: event.target.value });
  const field = `${input} mt-1.5`;

  return (
    <form onSubmit={onSubmit} className="max-w-[760px]">
      <label className={fieldLabel}>
        Dish name *
        <input className={field} required value={form.dish} onChange={set('dish')} />
      </label>

      <label className={fieldLabel}>
        Recipe title
        <input className={field} value={form.title} onChange={set('title')} placeholder="Optional" />
      </label>

      <label className={fieldLabel}>
        Image URL
        <input className={field} value={form.img} onChange={set('img')} placeholder="https://..." />
      </label>

      {/* 1 column on phones, 2 columns from sm (640px) upwards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={fieldLabel}>
          Prep time (minutes)
          <input className={field} type="number" min="1" value={form.time} onChange={set('time')} />
        </label>

        <label className={fieldLabel}>
          Servings
          <input className={field} type="number" min="1" value={form.servings} onChange={set('servings')} />
        </label>
      </div>

      <label className={fieldLabel}>
        Ingredients *
        <textarea
          className={field}
          required
          rows="5"
          value={form.ing}
          onChange={set('ing')}
          placeholder={'2 tomatoes\n1 onion\n1 tsp spices'}
        />
      </label>

      <label className={fieldLabel}>
        Steps *
        <textarea
          className={field}
          required
          rows="5"
          value={form.steps}
          onChange={set('steps')}
          placeholder={'Chop vegetables\nCook until tender'}
        />
      </label>

      <button className={`${btnPrimary} w-full sm:w-auto`} disabled={busy}>
        {submitLabel}
      </button>
    </form>
  );
}
