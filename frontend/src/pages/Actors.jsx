import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import ActorCard from "../components/ActorCard";
import SkeletonCard from "../components/SkeletonCard";

export default function Actors() {
  const navigate = useNavigate();
  const [actors, setActors]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [sortBy, setSortBy]   = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    api.get("/actor")
      .then(res => setActors(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = actors
    .filter(a =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.characterName?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const toggleDir = () => setSortDir(d => d === "asc" ? "desc" : "asc");

  return (
    <div className="list-page">
      <div className="list-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f0ede8",
              padding: "0.45rem 1rem",
              borderRadius: "100px",
              fontSize: "0.8rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer",
              backdropFilter: "blur(12px)",
              fontFamily: "inherit",
            }}
          >
            ← Ana Sayfa
          </button>
          <h1 className="list-title">Tüm <span>Aktörler</span></h1>
        </div>
        <p className="list-count">{loading ? "—" : `${filtered.length} aktör`}</p>
      </div>

      <div className="list-toolbar">
        <div className="toolbar-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="toolbar-input"
            placeholder="Aktör veya karakter ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="toolbar-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        <div className="toolbar-sort">
          <span className="toolbar-label">Sırala</span>
          <select
            className="toolbar-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="name">İsim</option>
            <option value="characterName">Karakter</option>
          </select>
          <button className="toolbar-dir-btn" onClick={toggleDir} title={sortDir === "asc" ? "Artan" : "Azalan"}>
            {sortDir === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="actor-grid">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="list-empty">
          <span>🎭</span>
          <p>Aktör bulunamadı.</p>
        </div>
      ) : (
        <div className="actor-grid">
          {filtered.map((actor, i) => (
            <div key={actor.id} style={{ animationDelay: `${i * 40}ms` }}>
              <ActorCard actor={actor} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}