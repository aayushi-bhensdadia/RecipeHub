export default function RecipeForm({ form, onChange, onSubmit, busy }) {
  const set = (key) => (event) => onChange({ ...form, [key]: event.target.value });

  return (
    <form onSubmit={onSubmit} className="recipe-form">
      <label>
        Dish name *
        <input required value={form.dish} onChange={set('dish')} />
      </label>

      <label>
        Recipe title
        <input value={form.title} onChange={set('title')} placeholder="Optional" />
      </label>

      <label>
        Image URL
        <input value={form.img} onChange={set('img')} placeholder="https://..." />
      </label>

      <div className="two">
        <label>
          Prep time (minutes)
          <input type="number" min="1" value={form.time} onChange={set('time')} />
        </label>

        <label>
          Servings
          <input type="number" min="1" value={form.servings} onChange={set('servings')} />
        </label>
      </div>

      <label>
        Ingredients *
        <textarea
          required
          rows="5"
          value={form.ing}
          onChange={set('ing')}
          placeholder={'2 tomatoes\n1 onion\n1 tsp spices'}
        />
      </label>

      <label>
        Steps *
        <textarea
          required
          rows="5"
          value={form.steps}
          onChange={set('steps')}
          placeholder={'Chop vegetables\nCook until tender'}
        />
      </label>

      <button className="primary" disabled={busy}>
        Publish recipe
      </button>
    </form>
  );
}
