import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  const imgSrc = movie.imageUrl
    ? `${process.env.REACT_APP_BASE_URL || ""}${movie.imageUrl}`
    : null;

  return (
    <Link to={`/movie/${movie.id}`} style={{ textDecoration: "none" }}>
      <div className="movie-card">
        <div className="card-poster">
          {imgSrc ? (
            <img src={imgSrc} alt={movie.title} loading="lazy" />
          ) : (
            <div className="card-no-img">
              <span className="card-film-icon">🎬</span>
              <span>Afiş Yok</span>
            </div>
          )}
          {movie.imdbRating && (
            <div className="card-rating">⭐ {movie.imdbRating}</div>
          )}
        </div>

        <div className="card-info">
          <div className="card-title">{movie.title}</div>
          <div className="card-meta">
            {movie.releaseYear && <span>{movie.releaseYear}</span>}
          </div>
          {movie.description && (
            <p className="card-desc">{movie.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}