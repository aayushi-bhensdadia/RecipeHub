import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { clearSession, getStoredUser, saveSession } from '../utils/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const signIn = useCallback((token, userData) => {
    saveSession(token, userData);
    setUser(userData);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
