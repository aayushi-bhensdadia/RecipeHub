import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { authenticate } from '../api/auth.js';
import AuthForm from '../components/AuthForm.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { paths } from '../routes.js';
import { eyebrow, muted, pageTitle, textButton } from '../styles.js';

// Used for both /login (mode="login") and /register (mode="register").
export default function LoginPage({ mode }) {
  const { user, signIn } = useAuth();
  const { say, busy, withBusy } = useApp();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  // If the visitor was sent here from a protected page, go back there afterwards.
  const from = location.state?.from;
  const backTo = from ? from.pathname + from.search : paths.home;

  // Already logged in (or just logged in) -> leave the login page.
  if (user) return <Navigate to={backTo} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();

    await withBusy(async () => {
      try {
        const data = await authenticate(mode, form);
        signIn(data.token, data.user);
        say('Welcome, ' + data.user.name + '!');
      } catch (error) {
        say(error.message);
      }
    });
  };

  const isLogin = mode === 'login';

  return (
    <section className="mx-auto my-[30px] max-w-[490px] rounded-[18px] border border-line bg-white p-[18px] sm:p-6">
      <span className={eyebrow}>YOUR KITCHEN AWAITS</span>

      <h2 className={pageTitle}>{isLogin ? 'Welcome back' : 'Create your account'}</h2>

      {from && isLogin && <p className={muted}>Please login to continue.</p>}

      <AuthForm mode={mode} form={form} onChange={setForm} onSubmit={handleSubmit} busy={busy} />

      <p className={`${muted} mt-4 mb-0`}>
        {isLogin ? 'New to RecipeHub?' : 'Already have an account?'}{' '}
        <Link
          to={isLogin ? paths.register : paths.login}
          state={location.state}
          className={textButton}
        >
          {isLogin ? 'Register' : 'Login'}
        </Link>
      </p>
    </section>
  );
}
