import { useEffect, useState } from "react";
import { api } from "../api";

import "../styles/global.css";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import Footer from "../components/Footer";

export default function Home() {
  const [movies, setMovies]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    api.get("/movie")
      .then(res => {
        setMovies(res.data);
        setFeatured(res.data[0] ?? null);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="cinema-wrap">
      <Navbar />

      {!loading && featured && <Hero movie={featured} />}

      <div className="divider" />

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Tüm <span>Filmler</span></h2>
        </div>

        {loading ? (
          <div className="loading-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="movie-grid">
            {movies.map((movie, i) => (
              <div key={movie.id} style={{ animationDelay: `${i * 60}ms` }}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}