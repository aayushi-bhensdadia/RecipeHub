import { useApp } from '../context/AppContext.jsx';

export default function Hero() {
  const { go } = useApp();

  return (
    <section className="hero">
      <span className="eyebrow">GOOD FOOD, SHARED</span>

      <h1>
        Find your next
        <br />
        <em>favourite dish.</em>
      </h1>

      <p>
        Explore recipes, compare community versions,
        and share the meals you love.
      </p>

      <button className="primary" onClick={() => go('add')}>
        Share your recipe ↗
      </button>
    </section>
  );
}
