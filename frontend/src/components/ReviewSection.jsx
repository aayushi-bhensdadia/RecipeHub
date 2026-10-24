import { useState } from 'react';
import { getReviews, saveReview } from '../api/reviews.js';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { btnPrimary, fieldLabel, input, muted, panel } from '../styles.js';

// Long reviews are shortened to the first 200 characters with a "Read more" link.
function ReviewText({ text }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 200;

  // text.slice(0, 200)
  //   -> start at index 0 (first character) and stop BEFORE index 200,
  //      so we get the first 200 characters of the string.
  //   -> the original `text` is not changed; slice() returns a new string.
  const shown = isLong && !expanded ? text.slice(0, 200) + '...' : text;

  return (
    <p className="my-2">
      {shown}{' '}
      {isLong && (
        <button
          type="button"
          className="font-bold text-brand hover:underline"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </p>
  );
}

export default function ReviewSection({ recipe, reviews, onReviewsChange }) {
  const { user } = useAuth();
  const { say } = useApp();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  const isOnline = recipe.rid?.startsWith('s_');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isOnline) {
      say('Reviews are currently available for community recipes only.');
      return;
    }

    try {
      await saveReview(recipe.rid, rating, text);
      setText('');
      onReviewsChange(await getReviews(recipe.rid));
      say('Review saved');
    } catch (error) {
      say(error.message);
    }
  };

  return (
    <div className={panel}>
      <h3 className="mb-2 text-[1.12rem] font-bold">Community reviews</h3>

      {isOnline ? (
        <p className={muted}>
          Community reviews are available for recipes shared on RecipeHub.
        </p>
      ) : (
        <>
          {reviews.list.map((review) => (
            <div className="border-b border-line py-3.5" key={review.id}>
              <b>{review.name}</b>{' '}
              <span className="ml-2 text-[#e59a00]">
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </span>
              <ReviewText text={review.text || ''} />
            </div>
          ))}

          {user ? (
            <form onSubmit={handleSubmit} className="max-w-[650px]">
              <label className={fieldLabel}>
                Your rating
                <select
                  className={`${input} mt-1.5`}
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((number) => (
                    <option key={number} value={number}>
                      {number} star{number > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </label>

              <label className={fieldLabel}>
                Your review
                <textarea
                  className={`${input} mt-1.5`}
                  rows="3"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </label>

              <button className={btnPrimary}>Submit review</button>
            </form>
          ) : (
            <p className={muted}>Login to leave a review.</p>
          )}
        </>
      )}
    </div>
  );
}
