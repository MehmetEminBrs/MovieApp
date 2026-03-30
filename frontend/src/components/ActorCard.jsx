import { useNavigate } from "react-router-dom";

export default function ActorCard({ actor }) {
  const navigate = useNavigate();

  const imgSrc = actor.imageUrl
    ? `${process.env.REACT_APP_BASE_URL || ""}${actor.imageUrl}`
    : null;

  return (
    <div className="actor-card" onClick={() => navigate(`/actors/${actor.id}`)}>
      <div className="actor-poster">
        {imgSrc ? (
          <img src={imgSrc} alt={actor.name} loading="lazy" />
        ) : (
          <div className="card-no-img">
            <span className="card-film-icon">🎭</span>
            <span>Fotoğraf Yok</span>
          </div>
        )}
      </div>
      <div className="card-info">
        <div className="card-title">{actor.name}</div>
        {actor.description && (
          <p className="card-desc">{actor.description}</p>
        )}
      </div>
    </div>
  );
}