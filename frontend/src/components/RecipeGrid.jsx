import RecipeCard from './RecipeCard.jsx';

// Renders a responsive grid of RecipeCards.
// getPath(recipe) returns the URL each card should link to.
// The grid fits as many columns as the screen allows: 1 on phones, 2-4 on laptops.
export default function RecipeGrid({ recipes, getPath }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(235px,100%),1fr))] gap-5">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.key || recipe.rid || recipe.id}
          recipe={recipe}
          to={getPath(recipe)}
        />
      ))}
    </div>
  );
}
