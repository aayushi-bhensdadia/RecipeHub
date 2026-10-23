import { useApp } from '../context/AppContext.jsx';

export default function BackButton({ label = '← Back' }) {
  const { go } = useApp();

  return (
    <button className="back" onClick={() => go('home')}>
      {label}
    </button>
  );
}
