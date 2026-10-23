import { useCallback, useEffect, useState } from 'react';
import { getMyRecipes } from '../api/recipes.js';
import BackButton from '../components/BackButton.jsx';
import RecipeGrid from '../components/RecipeGrid.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function MyRecipesPage() {
  const { say, withBusy, openRecipe } = useApp();
  const [recipes, setRecipes] = useState([]);

  const load = useCallback(
    () =>
      withBusy(async () => {
        try {
          setRecipes(await getMyRecipes());
        } catch (error) {
          say(error.message);
        }
      }),
    [withBusy, say]
  );

  // Load automatically when the page opens
  useEffect(() => {
    load();
  }, [load]);

  return (
    <section>
      <BackButton />

      <h2>My recipes</h2>

      <button className="secondary" onClick={load}>
        Refresh my recipes
      </button>

      {recipes.length > 0 ? (
        <RecipeGrid recipes={recipes} onSelect={(recipe) => openRecipe(recipe.id)} />
      ) : (
        <p className="muted">Use Share recipe to publish your first dish.</p>
      )}
    </section>
  );
}
