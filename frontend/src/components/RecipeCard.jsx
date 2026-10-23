import { PLACEHOLDER_IMG } from '../constants.js';

// One card used for community dishes, online recipes and saved items.
export default function RecipeCard({ recipe, onClick }) {
  const online = recipe.rid?.startsWith('s_');

  let eyebrow = 'COMMUNITY RECIPE';
  if (online) {
    eyebrow = 'ONLINE RECIPE';
  } else if (recipe.versions) {
    eyebrow = `${recipe.versions} community version${recipe.versions === 1 ? '' : 's'}`;
  }

  let subtitle;
  if (online) {
    subtitle = recipe.time ? `${recipe.time} minutes · Spoonacular` : 'Spoonacular';
  } else {
    subtitle = `${Number(recipe.avg || 0).toFixed(1)} ★ · ${
      recipe.author || 'Shared by the community'
    }`;
  }

  return (
    <article className="recipe-card" onClick={onClick}>
      <img
        src={recipe.img || PLACEHOLDER_IMG}
        alt={recipe.name || recipe.title || 'Recipe'}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = PLACEHOLDER_IMG;
        }}
      />

      <div className="card-body">
        <div className="eyebrow">{eyebrow}</div>
        <h3>{recipe.name || recipe.title || recipe.dish}</h3>
        <p className="muted">{subtitle}</p>
      </div>
    </article>
  );
}
