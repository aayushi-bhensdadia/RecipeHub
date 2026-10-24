import { useEffect, useState } from 'react';
import { getCollections } from '../api/collections.js';
import RecipeGrid from '../components/RecipeGrid.jsx';
import { useApp } from '../context/AppContext.jsx';
import { pathForRid } from '../routes.js';
import { muted, pageTitle } from '../styles.js';

export default function CollectionsPage() {
  const { say, withBusy } = useApp();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;

    withBusy(async () => {
      try {
        const data = await getCollections();
        if (!cancelled) setItems(data);
      } catch (error) {
        say(error.message);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [withBusy, say]);

  return (
    <section>
      <h2 className={pageTitle}>Your saved recipes</h2>

      {items.length > 0 ? (
        <RecipeGrid recipes={items} getPath={(recipe) => pathForRid(recipe.rid) || '/'} />
      ) : (
        <p className={muted}>
          Nothing saved yet. Open a recipe and favourite or bookmark it.
        </p>
      )}
    </section>
  );
}
