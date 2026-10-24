import { useCallback, useEffect, useState } from 'react';
import { getMyRecipes } from '../api/recipes.js';
import RecipeGrid from '../components/RecipeGrid.jsx';
import { useApp } from '../context/AppContext.jsx';
import { paths } from '../routes.js';
import { btnSecondary, muted, pageTitle } from '../styles.js';

export default function MyRecipesPage() {
  const { say, withBusy } = useApp();
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
      <h2 className={pageTitle}>My recipes</h2>

      <button className={`${btnSecondary} mb-5`} onClick={load}>
        Refresh my recipes
      </button>

      {recipes.length > 0 ? (
        <RecipeGrid recipes={recipes} getPath={(recipe) => paths.recipe(recipe.id)} />
      ) : (
        <p className={muted}>Use Share recipe to publish your first dish.</p>
      )}
    </section>
  );
}
