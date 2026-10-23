import { useEffect, useState } from 'react';
import { getCollections } from '../api/collections.js';
import BackButton from '../components/BackButton.jsx';
import RecipeGrid from '../components/RecipeGrid.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function CollectionsPage() {
  const { say, withBusy, openRecipe, openOnlineRecipe } = useApp();
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

  const handleSelect = (recipe) => {
    if (recipe.rid?.startsWith('u_')) openRecipe(recipe.rid.slice(2));
    else if (recipe.rid?.startsWith('s_')) openOnlineRecipe(recipe.rid);
    else say('Recipe details are unavailable.');
  };

  return (
    <section>
      <BackButton />

      <h2>Your saved recipes</h2>

      {items.length > 0 ? (
        <RecipeGrid recipes={items} onSelect={handleSelect} />
      ) : (
        <p className="muted">
          Nothing saved yet. Open a recipe and favourite or bookmark it.
        </p>
      )}
    </section>
  );
}
