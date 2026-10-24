import { useEffect, useState } from 'react';
import { getDish } from '../api/dishes.js';
import RecipeGrid from '../components/RecipeGrid.jsx';
import { useApp } from '../context/AppContext.jsx';
import { paths } from '../routes.js';
import { eyebrow, muted, pageTitle } from '../styles.js';

// Shows every community version of one dish.  URL: /dish/:key
export default function DishPage({ dishKey }) {
  const { say, withBusy } = useApp();
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
      {dish && (
        <>
          <span className={eyebrow}>COMMUNITY COLLECTION</span>
          <h2 className={pageTitle}>{dish.name}</h2>
          <p className={`${muted} mb-5`}>Compare different versions from home cooks.</p>

          <RecipeGrid recipes={dish.versions} getPath={(recipe) => paths.recipe(recipe.id)} />
        </>
      )}
    </section>
  );
}
