import {
  createContext, useCallback, useContext, useMemo, useRef, useState,
} from 'react';
import { useAuth } from './AuthContext.jsx';

const AppContext = createContext(null);

// Pages that need a logged-in user
const PROTECTED = ['add', 'collections', 'mine'];

export function AppProvider({ children }) {
  const { user } = useAuth();

  // ----- navigation -----
  const [view, setView] = useState('home');
  const [params, setParams] = useState({});
  const [search, setSearch] = useState('');

  const navigate = useCallback(
    (nextView, nextParams = {}) => {
      if (PROTECTED.includes(nextView) && !user) {
        setView('login');
        setParams({});
        return;
      }
      setView(nextView);
      setParams(nextParams);
    },
    [user]
  );

  // Go to a page. Going "home" also clears the current search.
  const go = useCallback(
    (nextView) => {
      if (nextView === 'home') setSearch('');
      navigate(nextView);
    },
    [navigate]
  );

  const searchRecipes = useCallback((q) => {
    setSearch(q);
    setView('home');
    setParams({});
  }, []);

  const openDish = useCallback((key) => navigate('dish', { key }), [navigate]);
  const openRecipe = useCallback(
    (id) => navigate('recipe', { source: 'community', id }),
    [navigate]
  );
  const openOnlineRecipe = useCallback(
    (rid) =>
      navigate('recipe', { source: 'online', id: String(rid).replace(/^s_/, '') }),
    [navigate]
  );

  // ----- notice (toast message) -----
  const [notice, setNotice] = useState('');
  const timer = useRef(null);
  const say = useCallback((message) => {
    setNotice(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(''), 3500);
  }, []);

  // ----- global loading state -----
  const [pending, setPending] = useState(0);
  const withBusy = useCallback(async (fn) => {
    setPending((n) => n + 1);
    try {
      return await fn();
    } finally {
      setPending((n) => n - 1);
    }
  }, []);

  const value = useMemo(
    () => ({
      view, params, search,
      go, navigate, searchRecipes, openDish, openRecipe, openOnlineRecipe,
      notice, say,
      busy: pending > 0, withBusy,
    }),
    [view, params, search, go, navigate, searchRecipes, openDish, openRecipe,
     openOnlineRecipe, notice, say, pending, withBusy]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
