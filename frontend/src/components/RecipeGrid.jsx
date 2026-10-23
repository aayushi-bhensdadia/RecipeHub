import RecipeCard from './RecipeCard.jsx';

// Renders a grid of RecipeCards. onSelect(recipe) is called on click.
export default function RecipeGrid({ recipes, onSelect }) {
  return (
    <div className="grid">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.key || recipe.rid || recipe.id}
          recipe={recipe}
          onClick={() => onSelect(recipe)}
        />
      ))}
    </div>
  );
}
