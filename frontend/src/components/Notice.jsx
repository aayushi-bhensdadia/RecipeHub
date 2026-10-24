import { useApp } from '../context/AppContext.jsx';
import { muted } from '../styles.js';

// Shows the toast message and the global "loading" text.
export default function Notice() {
  const { notice, busy } = useApp();

  return (
    <>
      {notice && (
        <div className="mb-[18px] rounded-[10px] bg-[#2f6f48] px-4 py-3 text-white">{notice}</div>
      )}
      {busy && <p className={muted}>Loading recipes...</p>}
    </>
  );
}
