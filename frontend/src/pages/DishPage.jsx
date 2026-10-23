import { useEffect, useState } from 'react';
import { getDish } from '../api/dishes.js';
import BackButton from '../components/BackButton.jsx';
import RecipeGrid from '../components/RecipeGrid.jsx';
import { useApp } from '../context/AppContext.jsx';

// Shows every community version of one dish.
export default function DishPage({ dishKey }) {
  const { say, withBusy, openRecipe } = useApp();
  const [dish, setDish] = useState(null);

  useEffect(() => {
    let cancelled = false;

    withBusy(async () => {
      try {
        const data = await getDish(dishKey);
        if (!cancelled) setDish(data);
      } catch (error) {
        say(error.message);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [dishKey, withBusy, say]);

  return (
    <section>
      <BackButton label="← Back to explore" />

      {dish && (
        <>
          <span className="eyebrow">COMMUNITY COLLECTION</span>
          <h2>{dish.name}</h2>
          <p className="muted">Compare different versions from home cooks.</p>

          <RecipeGrid recipes={dish.versions} onSelect={(recipe) => openRecipe(recipe.id)} />
        </>
      )}
    </section>
  );
}
