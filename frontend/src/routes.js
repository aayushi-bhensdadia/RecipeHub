// One place that defines every URL of the website.
// Use these helpers instead of typing paths by hand.
export const paths = {
  home: '/',
  login: '/login',
  register: '/register',
  add: '/add',
  saved: '/saved',
  mine: '/my-recipes',

  // /?q=pasta
  search: (q) => (q ? `/?q=${encodeURIComponent(q)}` : '/'),
  // /dish/paneer%20butter%20masala
  dish: (key) => `/dish/${encodeURIComponent(key)}`,
  // /recipe/12  (community recipe)
  recipe: (id) => `/recipe/${id}`,
  // /recipe/12/edit
  editRecipe: (id) => `/recipe/${id}/edit`,
  // /online/716429  (Spoonacular recipe)
  online: (id) => `/online/${String(id).replace(/^s_/, '')}`,
};

// Where does a saved / listed item go? "u_12" -> /recipe/12, "s_99" -> /online/99
export function pathForRid(rid) {
  if (rid?.startsWith('u_')) return paths.recipe(rid.slice(2));
  if (rid?.startsWith('s_')) return paths.online(rid);
  return null;
}
