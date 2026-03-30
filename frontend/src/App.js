import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home   from "./pages/Home";
import Movies from "./pages/Movies";
import Actors from "./pages/Actors";
import ActorDetail from "./pages/Actordetail";
import MovieDetail from "./pages/MovieDetail";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<Home />}   />
        <Route path="/movies" element={<Movies />} />
        <Route path="/actors" element={<Actors />} />
        <Route path="/actors/:id" element={<ActorDetail />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />




      </Routes>
    </BrowserRouter>
  );
}