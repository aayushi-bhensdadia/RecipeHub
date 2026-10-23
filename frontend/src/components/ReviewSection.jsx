import { useState } from 'react';
import { getReviews, saveReview } from '../api/reviews.js';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

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
    <div className="panel">
      <h3>Community reviews</h3>

      {isOnline ? (
        <p className="muted">
          Community reviews are available for recipes shared on RecipeHub.
        </p>
      ) : (
        <>
          {reviews.list.map((review) => (
            <div className="review" key={review.id}>
              <b>{review.name}</b>{' '}
              <span className="stars">
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </span>
              <p>{review.text}</p>
            </div>
          ))}

          {user ? (
            <form onSubmit={handleSubmit} className="review-form">
              <label>
                Your rating
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                  {[5, 4, 3, 2, 1].map((number) => (
                    <option key={number} value={number}>
                      {number} star{number > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Your review
                <textarea rows="3" value={text} onChange={(e) => setText(e.target.value)} />
              </label>

              <button className="primary">Submit review</button>
            </form>
          ) : (
            <p className="muted">Login to leave a review.</p>
          )}
        </>
      )}
    </div>
  );
}
