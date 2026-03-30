export default function Hero({ movie }) {
  if (!movie) return null;

  const imgSrc = movie.imageUrl
    ? `${process.env.REACT_APP_BASE_URL || ""}${movie.imageUrl}`
    : null;

  return (
    <section className="hero">
      {imgSrc ? (
        <img className="hero-poster" src={imgSrc} alt={movie.title} />
      ) : (
        <div className="hero-poster-fallback" />
      )}

      <div className="hero-bg" />

      <div className="hero-content">
        <div className="hero-badge">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <polygon points="5,0 6.2,3.8 10,3.8 6.9,6.2 8.1,10 5,7.6 1.9,10 3.1,6.2 0,3.8 3.8,3.8" />
          </svg>
          Öne Çıkan Film
        </div>

        <h1 className="hero-title">{movie.title}</h1>

        <div className="hero-meta">
          {movie.imdbRating && (
            <span className="hero-rating">⭐ {movie.imdbRating} / 10</span>
          )}
          {movie.imdbRating && movie.releaseYear && (
            <span className="hero-dot">·</span>
          )}
          {movie.releaseYear && (
            <span className="hero-year">{movie.releaseYear}</span>
          )}
        </div>

        {movie.description && (
          <p className="hero-desc">{movie.description}</p>
        )}
      </div>
    </section>
  );
}