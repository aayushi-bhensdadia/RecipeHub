import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, signOut } = useAuth();
  const { go, searchRecipes, say } = useApp();
  const [query, setQuery] = useState('');

  const goHome = () => {
    setQuery('');
    go('home');
  };

  const handleSearch = (event) => {
    event.preventDefault();
    searchRecipes(query);
  };

  const handleLogout = () => {
    signOut();
    say('Logged out');
    goHome();
  };

  return (
    <header>
      <button className="brand" onClick={goHome}>🍲 RecipeHub</button>

      <form className="search" onSubmit={handleSearch}>
        <input
          placeholder="Search dishes, e.g. pasta or paneer..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button className="primary" type="submit">Search</button>
      </form>

      <nav>
        <button onClick={goHome}>Explore</button>
        <button onClick={() => go('add')}>＋ Share recipe</button>

        {user ? (
          <>
            <button onClick={() => go('collections')}>Saved</button>
            <button onClick={() => go('mine')}>My recipes</button>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <button onClick={() => go('login')}>Login</button>
        )}
      </nav>
    </header>
  );
}
