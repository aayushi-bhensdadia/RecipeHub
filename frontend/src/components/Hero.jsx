import { Link } from 'react-router-dom';
import { paths } from '../routes.js';
import { btnPrimary, eyebrow } from '../styles.js';

export default function Hero() {
  return (
    <section className="relative mb-11 overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_85%_20%,#fffaf3_0,transparent_28%),linear-gradient(120deg,#ffe4ce,#fff3e6)] px-[22px] py-8 sm:px-[clamp(24px,5vw,64px)] sm:py-[46px]">
      <span className={eyebrow}>GOOD FOOD, SHARED</span>

      <h1 className="my-3.5 font-serif font-bold leading-[1.03] text-[length:clamp(2.6rem,6vw,4.6rem)]">
        Find your next
        <br />
        <em className="text-brand">favourite dish.</em>
      </h1>

      <p className="mt-4 mb-6 max-w-[470px] leading-[1.7] text-[#6d5e52]">
        Explore recipes, compare community versions,
        and share the meals you love.
      </p>

      <Link to={paths.add} className={`${btnPrimary} inline-block`}>
        Share your recipe ↗
      </Link>
    </section>
  );
}
