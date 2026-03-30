import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Crimson+Pro:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400;500&display=swap');

  .auth-root {
    min-height: 100vh;
    background: #0a0a0b;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .auth-bg-circle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  .auth-bg-circle-1 {
    width: 600px;
    height: 600px;
    top: -200px;
    right: -150px;
    background: radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%);
  }
  .auth-bg-circle-2 {
    width: 400px;
    height: 400px;
    bottom: -100px;
    left: -100px;
    background: radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%);
  }
  .auth-bg-lines {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .auth-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 420px;
    margin: 1.5rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    padding: 2.5rem;
    backdrop-filter: blur(20px);
    box-shadow: 0 32px 80px rgba(0,0,0,0.6);
    animation: authFadeIn 0.5s ease;
  }
  @keyframes authFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .auth-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
    letter-spacing: 0.1em;
    color: #f0ede8;
    text-align: center;
    margin-bottom: 0.25rem;
    text-decoration: none;
    display: block;
  }
  .auth-logo span { color: #d4af37; }

  .auth-tagline {
    font-family: 'Crimson Pro', serif;
    font-style: italic;
    font-size: 0.85rem;
    color: #555;
    text-align: center;
    margin-bottom: 2rem;
  }

  .auth-tabs {
    display: flex;
    background: rgba(255,255,255,0.04);
    border-radius: 100px;
    padding: 4px;
    margin-bottom: 2rem;
  }
  .auth-tab {
    flex: 1;
    padding: 0.55rem;
    border: none;
    background: transparent;
    color: #666;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border-radius: 100px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .auth-tab.active {
    background: #d4af37;
    color: #0a0a0b;
    font-weight: 500;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .auth-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .auth-label {
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #666;
  }
  .auth-input {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    color: #f0ede8;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .auth-input:focus {
    border-color: rgba(212,175,55,0.5);
    background: rgba(255,255,255,0.07);
  }
  .auth-input::placeholder { color: #444; }

  .auth-message {
    font-size: 0.82rem;
    padding: 0.65rem 1rem;
    border-radius: 8px;
    text-align: center;
  }
  .auth-message.error {
    background: rgba(220,60,60,0.1);
    border: 1px solid rgba(220,60,60,0.25);
    color: #e07070;
  }
  .auth-message.success {
    background: rgba(60,180,60,0.1);
    border: 1px solid rgba(60,180,60,0.25);
    color: #70c070;
  }

  .auth-btn {
    margin-top: 0.5rem;
    padding: 0.85rem;
    background: #d4af37;
    color: #0a0a0b;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .auth-btn:hover { background: #c9a430; }
  .auth-btn:active { transform: scale(0.98); }
  .auth-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .auth-footer {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.8rem;
    color: #555;
  }
  .auth-footer button {
    background: none;
    border: none;
    color: #d4af37;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    padding: 0;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const reset = () => {
    setUsername("");
    setPassword("");
    setMessage(null);
  };

  const switchTab = (t) => {
    setTab(t);
    reset();
  };

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setMessage({ type: "error", text: "Kullanıcı adı ve şifre boş bırakılamaz." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      if (tab === "login") {
        const res = await api.post("/auth/login", { username, password });
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        await api.post("/auth/register", { username, password });
        setMessage({ type: "success", text: "Kayıt başarılı! Giriş yapabilirsiniz." });
        setTab("login");
        setUsername("");
        setPassword("");
      }
    } catch (err) {
      const text =
        err.response?.data?.message ||
        err.response?.data ||
        (tab === "login" ? "Kullanıcı adı veya şifre hatalı." : "Kayıt başarısız.");
      setMessage({ type: "error", text: typeof text === "string" ? text : "Bir hata oluştu." });
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        <div className="auth-bg-lines" />
        <div className="auth-bg-circle auth-bg-circle-1" />
        <div className="auth-bg-circle auth-bg-circle-2" />

        <div className="auth-card">
          <a className="auth-logo" href="/">CINE<span>VAULT</span></a>
          <p className="auth-tagline">Sinema dünyanıza hoş geldiniz</p>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => switchTab("login")}
            >
              Giriş Yap
            </button>
            <button
              className={`auth-tab ${tab === "register" ? "active" : ""}`}
              onClick={() => switchTab("register")}
            >
              Kayıt Ol
            </button>
          </div>

          <div className="auth-form">
            <div className="auth-field">
              <label className="auth-label">Kullanıcı Adı</label>
              <input
                className="auth-input"
                type="text"
                placeholder="kullaniciadi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKey}
                autoComplete="username"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Şifre</label>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKey}
                autoComplete={tab === "login" ? "current-password" : "new-password"}
              />
            </div>

            {message && (
              <div className={`auth-message ${message.type}`}>{message.text}</div>
            )}

            <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Lütfen bekleyin..." : tab === "login" ? "Giriş Yap" : "Kayıt Ol"}
            </button>
          </div>

          <div className="auth-footer">
            {tab === "login" ? (
              <>Hesabın yok mu?{" "}
                <button onClick={() => switchTab("register")}>Kayıt ol</button>
              </>
            ) : (
              <>Zaten hesabın var mı?{" "}
                <button onClick={() => switchTab("login")}>Giriş yap</button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}