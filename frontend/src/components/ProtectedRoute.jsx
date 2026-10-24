import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { paths } from '../routes.js';

// Wrap a page in this to make it login-only.
// Not logged in -> redirected to /login, and sent back here after logging in.
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={paths.login} replace state={{ from: location }} />;
  }
  return children;
}
