import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { paths } from '../routes.js';
import { btnPrimary, input } from '../styles.js';

// NavLink gives the current page's link an "active" look automatically.
const navClass = ({ isActive }) =>
  `rounded-lg p-[9px] hover:text-brand ${isActive ? 'font-bold text-brand' : 'text-[#54483f]'}`;

export default function Header() {
  const { user, signOut } = useAuth();
  const { say } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');

  // Keep the search box in sync with the URL (/?q=pasta)
  useEffect(() => {
    setQuery(params.get('q') || '');
  }, [params]);

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(paths.search(query.trim()));
  };

  const handleLogout = () => {
    signOut();
    say('Logged out');
    navigate(paths.home);
  };

  return (
    <header className="z-10 flex flex-wrap items-center gap-[18px] border-b border-line bg-[#fffdfb] px-5 py-[13px] md:sticky md:top-0 md:px-[max(20px,calc((100vw_-_1200px)/2))]">
      <Link to={paths.home} className="text-xl font-extrabold whitespace-nowrap text-brand">
        🍲 RecipeHub
      </Link>

      {/* On phones (below sm) the search bar drops to its own full-width row */}
      <form
        onSubmit={handleSearch}
        className="flex min-w-[230px] flex-1 gap-2 max-sm:order-3 max-sm:basis-full"
      >
        <input
          className={input}
          placeholder="Search dishes, e.g. pasta or paneer..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button className={btnPrimary} type="submit">Search</button>
      </form>

      <nav className="flex flex-wrap gap-[5px] max-md:w-full">
        <NavLink to={paths.home} end className={navClass}>Explore</NavLink>
        <NavLink to={paths.add} className={navClass}>＋ Share recipe</NavLink>

        {user ? (
          <>
            <NavLink to={paths.saved} className={navClass}>Saved</NavLink>
            <NavLink to={paths.mine} className={navClass}>My recipes</NavLink>
            <button className="rounded-lg p-[9px] text-[#54483f] hover:text-brand" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <NavLink to={paths.login} className={navClass}>Login</NavLink>
        )}
      </nav>
    </header>
  );
}
