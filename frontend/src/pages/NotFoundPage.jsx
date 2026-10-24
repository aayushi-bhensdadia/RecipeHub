import { Link } from 'react-router-dom';
import { paths } from '../routes.js';
import { btnPrimary } from '../styles.js';

export default function NotFoundPage() {
  return (
    <section className="rounded-[18px] border border-dashed border-line bg-white px-4 py-12 text-center">
      <h2 className="mb-2 font-serif text-3xl font-bold">404 – Page not found</h2>
      <p className="mb-5 text-muted">The page you are looking for does not exist.</p>
      <Link to={paths.home} className={`${btnPrimary} inline-block`}>
        Go to home
      </Link>
    </section>
  );
}
