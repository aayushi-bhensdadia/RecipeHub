import { useEffect, useState } from 'react';
import { toggleCollection } from '../api/collections.js';
import { getRecipe } from '../api/recipes.js';
import { getReviews } from '../api/reviews.js';
import { getOnlineRecipe } from '../api/spoon.js';
import BackButton from '../components/BackButton.jsx';
import ReviewSection from '../components/ReviewSection.jsx';
import { PLACEHOLDER_IMG } from '../constants.js';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const NO_REVIEWS = { list: [], avg: 0, n: 0 };

// Detail page for a community recipe (source="community") or an
// online Spoonacular recipe (source="online").
export default function RecipePage({ source, id }) {
  const { user } = useAuth();
  const { go, say, withBusy } = useApp();
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
      go('login');
      return;
    }

    try {
      const data = await toggleCollection(kind, recipe.rid, recipe.title, recipe.img);
      say(data.on ? 'Saved!' : 'Removed from saved list');
    } catch (error) {
      say(error.message);
    }
  };

  if (!recipe) {
    return (
      <section>
        <BackButton label="← Back to explore" />
      </section>
    );
  }

  const isOnline = recipe.rid?.startsWith('s_');

  return (
    <section>
      <BackButton label="← Back to explore" />

      <div className="detail">
        <img
          className="detail-img"
          src={recipe.img || PLACEHOLDER_IMG}
          alt={recipe.title}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = PLACEHOLDER_IMG;
          }}
        />

        <div>
          <span className="eyebrow">
            {isOnline
              ? 'ONLINE RECIPE'
              : `SHARED BY ${recipe.author || 'COMMUNITY MEMBER'}`}
          </span>

          <h2>{recipe.title}</h2>

          <p className="muted">
            {recipe.time ? `${recipe.time} minutes · ` : ''}
            {recipe.servings ? `${recipe.servings} servings · ` : ''}
            {Number(reviews.avg || 0).toFixed(1)} ★ ({reviews.n} reviews)
          </p>

          <div className="actions">
            <button className="primary" onClick={() => handleSave('fav')}>
              ♥ Favourite
            </button>
            <button className="secondary" onClick={() => handleSave('bookmark')}>
              ▣ Bookmark
            </button>
          </div>
        </div>
      </div>

      <div className="two detail-columns">
        <div className="panel">
          <h3>Ingredients</h3>
          <ul>
            {(recipe.ing || []).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h3>Method</h3>
          <ol>
            {(recipe.steps || []).map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <ReviewSection recipe={recipe} reviews={reviews} onReviewsChange={setReviews} />
    </section>
  );
}
