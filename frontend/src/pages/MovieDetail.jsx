import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL || "";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .md-root {
    min-height: 100vh;
    background: #0a0a0b;
    color: #f0ede8;
    font-family: 'DM Sans', sans-serif;
  }

  .md-back {
    position: fixed;
    top: 1.5rem;
    left: 1.5rem;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #f0ede8;
    padding: 0.5rem 1.1rem;
    border-radius: 100px;
    font-size: 0.82rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    cursor: pointer;
    backdrop-filter: blur(12px);
    transition: background 0.2s, border-color 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .md-back:hover {
    background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.25);
  }

  .md-backdrop {
    position: relative;
    width: 100%;
    height: 520px;
    overflow: hidden;
  }
  .md-backdrop-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 20%;
    filter: blur(2px) brightness(0.35);
    transform: scale(1.05);
  }
  .md-backdrop-fallback {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
  }
  .md-backdrop-grad {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(10,10,11,0) 0%,
      rgba(10,10,11,0.4) 60%,
      rgba(10,10,11,1) 100%
    );
  }

  .md-body {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem 4rem;
  }

  .md-card {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 3rem;
    margin-top: -180px;
    position: relative;
    z-index: 10;
    align-items: start;
  }

  .md-poster {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06);
    aspect-ratio: 2/3;
    background: #1a1a1a;
  }
  .md-poster img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ease;
  }
  .md-poster:hover img { transform: scale(1.03); }
  .md-poster-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: #555;
    font-size: 3rem;
    background: #111;
  }

  .md-info {
    padding-top: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
  }

  .md-genre-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(212,175,55,0.12);
    border: 1px solid rgba(212,175,55,0.3);
    color: #d4af37;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.35rem 0.9rem;
    border-radius: 100px;
    width: fit-content;
  }

  .md-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.8rem, 6vw, 5rem);
    line-height: 0.95;
    letter-spacing: 0.02em;
    color: #f0ede8;
    margin: 0;
  }

  .md-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem 1.2rem;
  }
  .md-rating {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem;
    letter-spacing: 0.05em;
    color: #d4af37;
  }
  .md-rating-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    color: #666;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    align-self: flex-end;
    padding-bottom: 4px;
  }
  .md-sep {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #444;
  }
  .md-year {
    font-size: 0.95rem;
    color: #888;
    letter-spacing: 0.04em;
  }

  .md-divider {
    width: 48px;
    height: 2px;
    background: linear-gradient(90deg, #d4af37, transparent);
    border-radius: 2px;
  }

  .md-desc {
    font-family: 'Crimson Pro', serif;
    font-size: 1.15rem;
    line-height: 1.8;
    color: #b5b0a8;
    font-weight: 300;
    font-style: italic;
    max-width: 560px;
  }

  .md-actors {
    margin-top: 3.5rem;
    position: relative;
    z-index: 10;
  }

  .md-actors-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.8rem;
  }
  .md-actors-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem;
    letter-spacing: 0.1em;
    color: #f0ede8;
    margin: 0;
  }
  .md-actors-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(255,255,255,0.1), transparent);
  }
  .md-actors-count {
    font-size: 0.75rem;
    color: #555;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .md-actors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .md-actor-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
    cursor: default;
  }
  .md-actor-card:hover {
    transform: translateY(-3px);
    background: rgba(255,255,255,0.06);
    border-color: rgba(212,175,55,0.2);
  }

  .md-actor-photo {
    width: 56px;
    height: 56px;
    flex-shrink: 0;
    border-radius: 50%;
    overflow: hidden;
    background: #161616;
    border: 2px solid rgba(212,175,55,0.2);
  }
  .md-actor-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }
  .md-actor-card:hover .md-actor-photo img {
    transform: scale(1.08);
  }
  .md-actor-photo-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    background: linear-gradient(135deg, #161616, #1e1e1e);
    color: #333;
  }

  .md-actor-info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }
  .md-actor-character {
    display: block;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    color: #f0ede8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .md-actor-name {
    display: block;
    font-family: 'Crimson Pro', serif;
    font-size: 0.82rem;
    color: #d4af37;
    font-style: italic;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .md-loading {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background: #0a0a0b;
    color: #555;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .md-spinner {
    width: 32px;
    height: 32px;
    border: 2px solid #222;
    border-top-color: #d4af37;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 700px) {
    .md-card {
      grid-template-columns: 1fr;
      margin-top: -120px;
      gap: 1.5rem;
    }
    .md-poster {
      max-width: 200px;
      margin: 0 auto;
    }
    .md-info { padding-top: 0; }
    .md-actors-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    }
  }
`;

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [actorDetails, setActorDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/movie/${id}`)
      .then((r) => r.json())
      .then(async (m) => {
        setMovie(m);

        const actors = m.actors || m.Actors || [];
        if (actors.length > 0) {
          const details = await Promise.all(
            actors.map(async (a) => {
              const actorId = a.actorId ?? a.ActorId;
              const characterName = a.characterName ?? a.CharacterName;
              try {
                const res = await fetch(`${BASE_URL}/api/actor/${actorId}`);
                const actor = await res.json();
                return {
                  characterName,
                  actorName: actor.name ?? actor.Name,
                  imageUrl: actor.imageUrl ?? actor.ImageUrl,
                };
              } catch {
                return { characterName, actorName: "Bilinmiyor", imageUrl: null };
              }
            })
          );
          setActorDetails(details);
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <>
        <style>{styles}</style>
        <div className="md-loading">
          <div className="md-spinner" />
          <span>Yükleniyor</span>
        </div>
      </>
    );

  if (!movie)
    return (
      <>
        <style>{styles}</style>
        <div className="md-loading">Film bulunamadı.</div>
      </>
    );

  const title = movie.title ?? movie.Title;
  const description = movie.description ?? movie.Description;
  const imdbRating = movie.imdbRating ?? movie.ImdbRating;
  const releaseYear = movie.releaseYear ?? movie.ReleaseYear;
  const imageUrl = movie.imageUrl ?? movie.ImageUrl;
  const imgSrc = imageUrl ? `${BASE_URL}${imageUrl}` : null;

  return (
    <>
      <style>{styles}</style>
      <div className="md-root">

        <button className="md-back" onClick={() => navigate(-1)}>
          ← Geri
        </button>

        <div className="md-backdrop">
          {imgSrc ? (
            <img className="md-backdrop-img" src={imgSrc} alt="" aria-hidden />
          ) : (
            <div className="md-backdrop-fallback" />
          )}
          <div className="md-backdrop-grad" />
        </div>

        <div className="md-body">
          <div className="md-card">
            <div className="md-poster">
              {imgSrc ? (
                <img src={imgSrc} alt={title} />
              ) : (
                <div className="md-poster-fallback">🎬</div>
              )}
            </div>

            <div className="md-info">
              <span className="md-genre-tag">
                <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                  <polygon points="5,0 6.2,3.8 10,3.8 6.9,6.2 8.1,10 5,7.6 1.9,10 3.1,6.2 0,3.8 3.8,3.8" />
                </svg>
                Film
              </span>

              <h1 className="md-title">{title}</h1>

              <div className="md-meta">
                {imdbRating && (
                  <>
                    <div className="md-rating">
                      ⭐ {imdbRating}
                      <span className="md-rating-label">/ 10 IMDb</span>
                    </div>
                    {releaseYear && <div className="md-sep" />}
                  </>
                )}
                {releaseYear && <span className="md-year">{releaseYear}</span>}
              </div>

              {description && (
                <>
                  <div className="md-divider" />
                  <p className="md-desc">{description}</p>
                </>
              )}
            </div>
          </div>

          {actorDetails.length > 0 && (
            <div className="md-actors">
              <div className="md-actors-header">
                <h2 className="md-actors-title">Filmde Oynayan Aktörler</h2>
                <div className="md-actors-line" />
                <span className="md-actors-count">{actorDetails.length} kişi</span>
              </div>

              <div className="md-actors-grid">
                {actorDetails.map((a, i) => (
                  <div key={i} className="md-actor-card">
                    <div className="md-actor-photo">
                      {a.imageUrl ? (
                        <img
                          src={`${BASE_URL}${a.imageUrl}`}
                          alt={a.actorName}
                          loading="lazy"
                        />
                      ) : (
                        <div className="md-actor-photo-fallback">👤</div>
                      )}
                    </div>
                    <div className="md-actor-info">
                      <span className="md-actor-character">{a.characterName}</span>
                      <span className="md-actor-name">{a.actorName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}