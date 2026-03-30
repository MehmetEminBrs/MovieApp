import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function getRole() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  } catch {
    return null;
  }
}

export default function Navbar() {
  const role = getRole();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <a className="navbar-logo" href="/">
        CINE<span>VAULT</span>
      </a>

      <nav>
        <ul className="navbar-links">
          <li><a href="/movies">Filmler</a></li>
          <li><a href="/actors">Aktörler</a></li>
          {role === "admin" && (
            <li><a href="/admin">Admin Panel</a></li>
          )}
        </ul>
      </nav>

      <div className="navbar-actions">
        {role ? (
          <button className="navbar-logout-btn" onClick={handleLogout}>
            Çıkış
          </button>
        ) : (
          <a href="/login" className="navbar-login-btn">Giriş Yap</a>
        )}
      </div>
    </header>
  );
}