import { useState } from 'react';
import { authenticate } from '../api/auth.js';
import AuthForm from '../components/AuthForm.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { signIn } = useAuth();
  const { go, say, busy, withBusy } = useApp();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();

    await withBusy(async () => {
      try {
        const data = await authenticate(mode, form);
        signIn(data.token, data.user);
        say('Welcome, ' + data.user.name + '!');
        go('home');
      } catch (error) {
        say(error.message);
      }
    });
  };

  return (
    <section className="panel narrow">
      <span className="eyebrow">YOUR KITCHEN AWAITS</span>

      <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>

      <AuthForm
        mode={mode}
        form={form}
        onChange={setForm}
        onSubmit={handleSubmit}
        busy={busy}
      />

      <p className="muted">
        {mode === 'login' ? 'New to RecipeHub?' : 'Already have an account?'}{' '}
        <button
          type="button"
          className="text-button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Register' : 'Login'}
        </button>
      </p>
    </section>
  );
}
