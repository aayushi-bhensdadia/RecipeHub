import { btnPrimary, fieldLabel, input } from '../styles.js';

export default function AuthForm({ mode, form, onChange, onSubmit, busy }) {
  const field = (key, label, type = 'text') => (
    <label key={key} className={fieldLabel}>
      {label}
      <input
        className={`${input} mt-1.5`}
        type={type}
        value={form[key]}
        required
        onChange={(event) => onChange({ ...form, [key]: event.target.value })}
      />
    </label>
  );

  return (
    <form onSubmit={onSubmit}>
      {mode === 'register' && field('name', 'Name')}
      {field('email', 'Email', 'email')}
      {field('password', 'Password', 'password')}

      <button className={`${btnPrimary} mt-3 w-full`} disabled={busy}>
        {mode === 'register' ? 'Create account' : 'Login'}
      </button>
    </form>
  );
}
