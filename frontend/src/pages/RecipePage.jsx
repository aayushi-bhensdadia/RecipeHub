import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toggleCollection } from '../api/collections.js';
import { getRecipe } from '../api/recipes.js';
import { getReviews } from '../api/reviews.js';
import { getOnlineRecipe } from '../api/spoon.js';
import ReviewSection from '../components/ReviewSection.jsx';
import { PLACEHOLDER_IMG } from '../constants.js';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { paths } from '../routes.js';
import { btnPrimary, btnSecondary, eyebrow, muted, pageTitle, panel } from '../styles.js';

const NO_REVIEWS = { list: [], avg: 0, n: 0 };

// Detail page for a community recipe  (/recipe/:id, source="community")
// or an online Spoonacular recipe     (/online/:id, source="online").
export default function RecipePage({ source, id }) {
  const { user } = useAuth();
  const { say, withBusy } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState(NO_REVIEWS);

  useEffect(() => {
    let cancelled = false;

    withBusy(async () => {
      try {
        const data =
          source === 'online' ? await getOnlineRecipe(id) : await getRecipe(id);

        let rv = NO_REVIEWS;
        try {
          rv = await getReviews(data.rid);
        } catch {
          // Still show the recipe even if reviews fail to load.
        }

        if (cancelled) return;
        setRecipe(data);
        setReviews(rv);
      } catch (error) {
        say(error.message);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [source, id, withBusy, say]);

  const handleSave = async (kind) => {
    if (!user) {
      navigate(paths.login, { state: { from: location } });
      return;
    }

    try {
      const data = await toggleCollection(kind, recipe.rid, recipe.title, recipe.img);
      say(data.on ? 'Saved!' : 'Removed from saved list');
    } catch (error) {
      say(error.message);
    }
  };

  if (!recipe) return null;

  const isOnline = recipe.rid?.startsWith('s_');
  const isAuthor = !isOnline && user && Number(recipe.uid) === Number(user.id);

  return (
    <section>
      {/* 1 column on phones, image + text side by side from md (768px) */}
      <div className="mt-5 mb-7 grid items-center gap-7 md:grid-cols-[minmax(250px,1fr)_1fr]">
        <img
          className="h-[260px] w-full rounded-[20px] bg-[#f1e7dc] object-cover md:h-[340px]"
          src={recipe.img || PLACEHOLDER_IMG}
          alt={recipe.title}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = PLACEHOLDER_IMG;
          }}
        />

        <div>
          <span className={eyebrow}>
            {isOnline
              ? 'ONLINE RECIPE'
              : `SHARED BY ${recipe.author || 'COMMUNITY MEMBER'}`}
          </span>

          <h2 className={pageTitle}>{recipe.title}</h2>

          <p className={muted}>
            {recipe.time ? `${recipe.time} minutes · ` : ''}
            {recipe.servings ? `${recipe.servings} servings · ` : ''}
            {Number(reviews.avg || 0).toFixed(1)} ★ ({reviews.n} reviews)
          </p>

          <div className="flex flex-wrap gap-2.5">
            <button className={btnPrimary} onClick={() => handleSave('fav')}>
              ♥ Favourite
            </button>
            <button className={btnSecondary} onClick={() => handleSave('bookmark')}>
              ▣ Bookmark
            </button>
            {isAuthor && (
              <Link to={paths.editRecipe(id)} className={btnSecondary}>
                ✎ Edit recipe
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid items-start gap-4 sm:grid-cols-2">
        <div className={panel}>
          <h3 className="mb-2 text-[1.12rem] font-bold">Ingredients</h3>
          <ul className="list-disc pl-6">
            {(recipe.ing || []).map((item, index) => (
              <li className="my-[9px] leading-[1.55]" key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={panel}>
          <h3 className="mb-2 text-[1.12rem] font-bold">Method</h3>
          <ol className="list-decimal pl-6">
            {(recipe.steps || []).map((step, index) => (
              <li className="my-[9px] leading-[1.55]" key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <ReviewSection recipe={recipe} reviews={reviews} onReviewsChange={setReviews} />
    </section>
  );
}
