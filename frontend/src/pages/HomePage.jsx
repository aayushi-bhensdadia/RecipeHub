import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getDishes } from '../api/dishes.js';
import { getPopularOnlineRecipes, searchOnlineRecipes } from '../api/spoon.js';
import Hero from '../components/Hero.jsx';
import RecipeGrid from '../components/RecipeGrid.jsx';
import { useApp } from '../context/AppContext.jsx';
import { paths } from '../routes.js';
import { btnPrimary, eyebrow, muted, pageTitle } from '../styles.js';

const sectionHead =
  'mb-5 flex flex-col items-start justify-between gap-[15px] sm:flex-row sm:items-end';
const emptyBox =
  'rounded-[18px] border border-dashed border-line bg-white px-4 py-12 text-center';

export default function HomePage() {
  const { say, withBusy } = useApp();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('q') || ''; // from the URL: /?q=pasta
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
      <Hero />

      <section className="mb-11">
        <div className={sectionHead}>
          <div>
            <span className={eyebrow}>FROM OUR COMMUNITY</span>
            <h2 className={pageTitle}>
              {search
                ? `Community results for "${search}"`
                : 'Recipes shared by home cooks'}
            </h2>
          </div>
          <span className={muted}>{recipes.length} dishes</span>
        </div>

        {recipes.length > 0 ? (
          <RecipeGrid recipes={recipes} getPath={(recipe) => paths.dish(recipe.key)} />
        ) : (
          <div className={emptyBox}>
            <h3 className="mb-2 text-[1.12rem] font-bold">No community dishes found</h3>
            <p className="mb-4">Try another search or be the first to share a recipe.</p>
            <Link to={paths.add} className={`${btnPrimary} inline-block`}>
              Add a recipe
            </Link>
          </div>
        )}
      </section>

      <section>
        <div className={sectionHead}>
          <div>
            <span className={eyebrow}>DISCOVER SOMETHING NEW</span>
            <h2 className={pageTitle}>
              {search
                ? `Online recipes for "${search}"`
                : 'Online recipe inspiration'}
            </h2>
          </div>
          <span className={muted}>{onlineRecipes.length} recipes</span>
        </div>

        {onlineRecipes.length > 0 ? (
          <RecipeGrid recipes={onlineRecipes} getPath={(recipe) => paths.online(recipe.rid)} />
        ) : (
          <div className={emptyBox}>
            <h3 className="mb-2 text-[1.12rem] font-bold">No online recipes found</h3>
            <p>Check your internet connection or try another search.</p>
          </div>
        )}
      </section>
    </>
  );
}
