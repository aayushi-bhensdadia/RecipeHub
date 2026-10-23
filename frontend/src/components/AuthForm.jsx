export default function AuthForm({ mode, form, onChange, onSubmit, busy }) {
  const field = (key, label, type = 'text') => (
    <label key={key}>
      {label}
      <input
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

      <button className="primary full" disabled={busy}>
        {mode === 'register' ? 'Create account' : 'Login'}
      </button>
    </form>
  );
}
