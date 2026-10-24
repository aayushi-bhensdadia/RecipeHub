import {
  createContext, useCallback, useContext, useMemo, useRef, useState,
} from 'react';

// Navigation is handled by React Router (see App.jsx) – the address bar is the
// source of truth. This context only keeps the toast message + loading state.
const AppContext = createContext(null);

export function AppProvider({ children }) {
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
    () => ({ notice, say, busy: pending > 0, withBusy }),
    [notice, say, pending, withBusy]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
