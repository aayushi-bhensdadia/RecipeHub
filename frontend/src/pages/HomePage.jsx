import { useEffect, useState } from 'react';
import { getDishes } from '../api/dishes.js';
import { getPopularOnlineRecipes, searchOnlineRecipes } from '../api/spoon.js';
import RecipeGrid from '../components/RecipeGrid.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function HomePage() {
  const { search, go, say, withBusy, openDish, openOnlineRecipe } = useApp();
  const [recipes, setRecipes] = useState([]);
  const [onlineRecipes, setOnlineRecipes] = useState([]);

  // Load community dishes and online recipes together.
  useEffect(() => {
    let cancelled = false;

    withBusy(async () => {
      const [community, online] = await Promise.allSettled([
        getDishes(search),
        search ? searchOnlineRecipes(search) : getPopularOnlineRecipes(),
      ]);
      if (cancelled) return;

      if (community.status === 'fulfilled') {
        setRecipes(community.value);
      } else {
        setRecipes([]);
        say('Could not load community recipes.');
      }

      if (online.status === 'fulfilled') {
        setOnlineRecipes(online.value);
      } else {
        setOnlineRecipes([]);
        say(online.reason.message || 'Could not load online recipes.');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [search, withBusy, say]);

  return (
    <>
      <section>
        <div className="section-head">
          <div>
            <span className="eyebrow">FROM OUR COMMUNITY</span>
            <h2>
              {search
                ? `Community results for "${search}"`
                : 'Recipes shared by home cooks'}
            </h2>
          </div>
          <span className="muted">{recipes.length} dishes</span>
        </div>

        {recipes.length > 0 ? (
          <RecipeGrid recipes={recipes} onSelect={(recipe) => openDish(recipe.key)} />
        ) : (
          <div className="empty">
            <h3>No community dishes found</h3>
            <p>Try another search or be the first to share a recipe.</p>
            <button className="primary" onClick={() => go('add')}>
              Add a recipe
            </button>
          </div>
        )}
      </section>

      <section>
        <div className="section-head">
          <div>
            <span className="eyebrow">DISCOVER SOMETHING NEW</span>
            <h2>
              {search
                ? `Online recipes for "${search}"`
                : 'Online recipe inspiration'}
            </h2>
          </div>
          <span className="muted">{onlineRecipes.length} recipes</span>
        </div>

        {onlineRecipes.length > 0 ? (
          <RecipeGrid
            recipes={onlineRecipes}
            onSelect={(recipe) => openOnlineRecipe(recipe.rid)}
          />
        ) : (
          <div className="empty">
            <h3>No online recipes found</h3>
            <p>Check your internet connection or try another search.</p>
          </div>
        )}
      </section>
    </>
  );
}
