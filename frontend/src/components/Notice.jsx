import { useApp } from '../context/AppContext.jsx';

// Shows the toast message and the global "loading" text.
export default function Notice() {
  const { notice, busy } = useApp();

  return (
    <>
      {notice && <div className="notice">{notice}</div>}
      {busy && <p className="muted">Loading recipes...</p>}
    </>
  );
}
