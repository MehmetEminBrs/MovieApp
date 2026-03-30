import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import MovieCard from "../components/MovieCard";

export default function ActorDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();

  const [actor,   setActor]   = useState(null);
  const [movies,  setMovies]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/actor/${id}`)
      .then(res => {
        const a = res.data;
        setActor(a);

        if (a.movieIds?.length) {
          return api.get("/movie").then(r => {
            const actorMovies = r.data.filter(m => a.movieIds.includes(m.id));
            setMovies(actorMovies);
          });
        }
      })
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true);
        else console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const imgSrc = actor?.imageUrl
    ? `${process.env.REACT_APP_BASE_URL || ""}${actor.imageUrl}`
    : null;

  if (loading) return (
    <div className="detail-loading">
      <div className="detail-skeleton-img" />
      <div className="detail-skeleton-lines">
        <div className="skeleton-line" style={{ width: "40%", height: 18 }} />
        <div className="skeleton-line" style={{ width: "60%", height: 32, marginTop: 8 }} />
        <div className="skeleton-line" style={{ width: "80%", height: 14, marginTop: 16 }} />
        <div className="skeleton-line" style={{ width: "70%", height: 14, marginTop: 8 }} />
      </div>
    </div>
  );

  if (notFound) return (
    <div className="detail-notfound">
      <span>🎭</span>
      <p>Aktör bulunamadı.</p>
      <button className="back-btn" onClick={() => navigate(-1)}>← Geri Dön</button>
    </div>
  );

  return (
    <div className="cinema-wrap">
      <div className="actor-detail-hero">
        {imgSrc && (
          <div
            className="actor-detail-bg"
            style={{ backgroundImage: `url(${imgSrc})` }}
          />
        )}
        <div className="actor-detail-bg-overlay" />

        <div className="actor-detail-inner">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Geri
          </button>

          <div className="actor-detail-profile">
            <div className="actor-detail-img-wrap">
              {imgSrc ? (
                <img src={imgSrc} alt={actor.name} className="actor-detail-img" />
              ) : (
                <div className="actor-detail-img-fallback">🎭</div>
              )}
            </div>

            <div className="actor-detail-info">
             
              <h1 className="actor-detail-name">{actor.name}</h1>
              {actor.movieIds?.length > 0 && (
                <div className="actor-detail-meta">
                  <span className="actor-detail-badge">
                    🎬 {actor.movieIds.length} Film
                  </span>
                </div>
              )}
            </div>
          </div>

          {actor.description && (
            <p className="actor-detail-desc">{actor.description}</p>
          )}
        </div>
      </div>

      {movies.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Oynadığı <span>Filmler</span></h2>
          </div>
          <div className="movie-grid">
            {movies.map((movie, i) => (
              <div key={movie.id} style={{ animationDelay: `${i * 60}ms` }}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}