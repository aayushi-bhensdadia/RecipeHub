import { Link } from 'react-router-dom';
import { PLACEHOLDER_IMG } from '../constants.js';
import { eyebrow, muted } from '../styles.js';

// One card used for community dishes, online recipes and saved items.
// `to` is the URL the card links to.
export default function RecipeCard({ recipe, to }) {
  const online = recipe.rid?.startsWith('s_');

  let label = 'COMMUNITY RECIPE';
  if (online) {
    label = 'ONLINE RECIPE';
  } else if (recipe.versions) {
    label = `${recipe.versions} community version${recipe.versions === 1 ? '' : 's'}`;
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
    <Link
      to={to}
      className="block overflow-hidden rounded-[17px] border border-line bg-white transition duration-150 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_#573a2012]"
    >
      <img
        className="block h-[175px] w-full bg-[#f1e7dc] object-cover"
        src={recipe.img || PLACEHOLDER_IMG}
        alt={recipe.name || recipe.title || 'Recipe'}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = PLACEHOLDER_IMG;
        }}
      />

      <div className="p-4">
        <div className={eyebrow}>{label}</div>
        <h3 className="mt-0 mb-2 font-serif text-[1.2rem] font-bold">
          {recipe.name || recipe.title || recipe.dish}
        </h3>
        <p className={`${muted} mb-0`}>{subtitle}</p>
      </div>
    </Link>
  );
}
