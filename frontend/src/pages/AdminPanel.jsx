import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const BASE_URL = process.env.REACT_APP_BASE_URL || "";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

  .ap-root {
    min-height: 100vh;
    background: #0a0a0b;
    color: #f0ede8;
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 4rem;
  }

  .ap-header {
    background: rgba(255,255,255,0.02);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 1.2rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ap-header-left {
    display: flex;
    align-items: center;
    gap: 1.2rem;
  }
  .ap-back-btn {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #f0ede8;
    padding: 0.4rem 1rem;
    border-radius: 100px;
    font-size: 0.78rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.2s;
  }
  .ap-back-btn:hover { background: rgba(255,255,255,0.12); }
  .ap-header-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem;
    letter-spacing: 0.1em;
    color: #f0ede8;
  }
  .ap-header-title span { color: #d4af37; }
  .ap-header-badge {
    background: rgba(212,175,55,0.12);
    border: 1px solid rgba(212,175,55,0.3);
    color: #d4af37;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.25rem 0.7rem;
    border-radius: 100px;
  }

  .ap-body {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem;
  }

  .ap-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }
  .ap-tab {
    padding: 0.6rem 1.6rem;
    border-radius: 100px;
    border: 1px solid rgba(255,255,255,0.08);
    background: transparent;
    color: #666;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }
  .ap-tab.active {
    background: #d4af37;
    border-color: #d4af37;
    color: #0a0a0b;
    font-weight: 500;
  }
  .ap-tab:not(.active):hover {
    border-color: rgba(255,255,255,0.2);
    color: #f0ede8;
  }

  .ap-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  .ap-section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.3rem;
    letter-spacing: 0.08em;
    color: #f0ede8;
  }
  .ap-add-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: #d4af37;
    color: #0a0a0b;
    border: none;
    padding: 0.55rem 1.2rem;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background 0.2s;
  }
  .ap-add-btn:hover { background: #c9a430; }

  .ap-table-wrap {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    overflow: hidden;
  }
  .ap-table {
    width: 100%;
    border-collapse: collapse;
  }
  .ap-table th {
    background: rgba(255,255,255,0.04);
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #666;
    font-weight: 400;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .ap-table td {
    padding: 0.85rem 1rem;
    font-size: 0.88rem;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    vertical-align: middle;
  }
  .ap-table tr:last-child td { border-bottom: none; }
  .ap-table tr:hover td { background: rgba(255,255,255,0.02); }

  .ap-thumb {
    width: 40px;
    height: 55px;
    border-radius: 6px;
    object-fit: cover;
    background: #1a1a1a;
    display: block;
  }
  .ap-thumb-fallback {
    width: 40px;
    height: 55px;
    border-radius: 6px;
    background: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    color: #333;
  }
  .ap-actor-thumb {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    background: #1a1a1a;
    display: block;
  }
  .ap-actor-thumb-fallback {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: #333;
  }

  .ap-rating-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: rgba(212,175,55,0.1);
    color: #d4af37;
    font-size: 0.78rem;
    padding: 0.2rem 0.6rem;
    border-radius: 100px;
  }

  .ap-actors-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
  }
  .ap-chip {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    color: #aaa;
    font-size: 0.72rem;
    padding: 0.15rem 0.55rem;
    border-radius: 100px;
  }

  .ap-action-btns {
    display: flex;
    gap: 0.5rem;
  }
  .ap-edit-btn {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #f0ede8;
    padding: 0.35rem 0.8rem;
    border-radius: 6px;
    font-size: 0.78rem;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.2s;
  }
  .ap-edit-btn:hover { background: rgba(255,255,255,0.12); }
  .ap-del-btn {
    background: rgba(220,60,60,0.1);
    border: 1px solid rgba(220,60,60,0.2);
    color: #e07070;
    padding: 0.35rem 0.8rem;
    border-radius: 6px;
    font-size: 0.78rem;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.2s;
  }
  .ap-del-btn:hover { background: rgba(220,60,60,0.2); }

  .ap-empty {
    text-align: center;
    padding: 3rem;
    color: #444;
    font-size: 0.88rem;
  }

  .ap-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(6px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    animation: apOverlayIn 0.2s ease;
  }
  @keyframes apOverlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .ap-modal {
    background: #111;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 2rem;
    width: 100%;
    max-width: 560px;
    max-height: 90vh;
    overflow-y: auto;
    animation: apModalIn 0.25s ease;
  }
  @keyframes apModalIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ap-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  .ap-modal-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.3rem;
    letter-spacing: 0.08em;
  }
  .ap-modal-close {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #f0ede8;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: inherit;
    transition: background 0.2s;
  }
  .ap-modal-close:hover { background: rgba(255,255,255,0.14); }

  .ap-form { display: flex; flex-direction: column; gap: 1rem; }
  .ap-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .ap-field { display: flex; flex-direction: column; gap: 0.4rem; }
  .ap-label {
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #666;
  }
  .ap-input, .ap-textarea, .ap-select {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 0.65rem 0.9rem;
    color: #f0ede8;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
    box-sizing: border-box;
  }
  .ap-input:focus, .ap-textarea:focus, .ap-select:focus {
    border-color: rgba(212,175,55,0.5);
  }
  .ap-input::placeholder, .ap-textarea::placeholder { color: #444; }
  .ap-textarea { resize: vertical; min-height: 80px; }
  .ap-select option { background: #111; }

  .ap-img-upload {
    border: 1px dashed rgba(255,255,255,0.15);
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  .ap-img-upload:hover { border-color: rgba(212,175,55,0.4); }
  .ap-img-upload input { display: none; }
  .ap-img-preview {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-align: left;
  }
  .ap-img-preview img {
    width: 48px;
    height: 64px;
    object-fit: cover;
    border-radius: 6px;
  }
  .ap-img-preview-name { font-size: 0.82rem; color: #888; }
  .ap-img-placeholder { color: #555; font-size: 0.82rem; }
  .ap-img-placeholder span { color: #d4af37; }

  .ap-actor-assign {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .ap-actor-assign-row {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 0.5rem;
    align-items: center;
  }
  .ap-actor-remove {
    background: rgba(220,60,60,0.1);
    border: 1px solid rgba(220,60,60,0.2);
    color: #e07070;
    width: 30px;
    height: 30px;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: inherit;
    flex-shrink: 0;
    transition: background 0.2s;
  }
  .ap-actor-remove:hover { background: rgba(220,60,60,0.2); }
  .ap-actor-add-row {
    display: flex;
    justify-content: flex-end;
  }
  .ap-actor-add-btn {
    background: rgba(212,175,55,0.1);
    border: 1px solid rgba(212,175,55,0.25);
    color: #d4af37;
    padding: 0.35rem 0.9rem;
    border-radius: 6px;
    font-size: 0.78rem;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.2s;
  }
  .ap-actor-add-btn:hover { background: rgba(212,175,55,0.18); }

  .ap-msg {
    font-size: 0.82rem;
    padding: 0.6rem 0.9rem;
    border-radius: 8px;
    text-align: center;
  }
  .ap-msg.error {
    background: rgba(220,60,60,0.1);
    border: 1px solid rgba(220,60,60,0.2);
    color: #e07070;
  }
  .ap-msg.success {
    background: rgba(60,180,60,0.1);
    border: 1px solid rgba(60,180,60,0.2);
    color: #70c070;
  }

  .ap-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }
  .ap-cancel-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: #888;
    padding: 0.6rem 1.4rem;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  .ap-cancel-btn:hover { background: rgba(255,255,255,0.1); }
  .ap-save-btn {
    background: #d4af37;
    border: none;
    color: #0a0a0b;
    padding: 0.6rem 1.6rem;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }
  .ap-save-btn:hover { background: #c9a430; }
  .ap-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .ap-confirm {
    background: #111;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 1.8rem;
    width: 100%;
    max-width: 360px;
    text-align: center;
    animation: apModalIn 0.25s ease;
  }
  .ap-confirm-icon { font-size: 2rem; margin-bottom: 0.75rem; }
  .ap-confirm-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.2rem;
    letter-spacing: 0.06em;
    margin-bottom: 0.5rem;
  }
  .ap-confirm-text { font-size: 0.85rem; color: #888; margin-bottom: 1.5rem; }
  .ap-confirm-btns { display: flex; gap: 0.75rem; justify-content: center; }
  .ap-confirm-del {
    background: rgba(220,60,60,0.15);
    border: 1px solid rgba(220,60,60,0.3);
    color: #e07070;
    padding: 0.55rem 1.4rem;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  .ap-confirm-del:hover { background: rgba(220,60,60,0.25); }
`;


function getToken() { return localStorage.getItem("token"); }

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}


function MovieModal({ movie, actors, onClose, onSaved }) {
  const isEdit = !!movie;
  const fileRef = useRef();

  const [title, setTitle] = useState(movie?.title || "");
  const [description, setDescription] = useState(movie?.description || "");
  const [releaseYear, setReleaseYear] = useState(movie?.releaseYear || "");
  const [imdbRating, setImdbRating] = useState(movie?.imdbRating || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(movie?.imageUrl ? `${BASE_URL}${movie.imageUrl}` : null);
  const [assignedActors, setAssignedActors] = useState(
    movie?.actors?.map(a => ({ actorId: a.actorId, characterName: a.characterName })) || []
  );
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const addActorRow = () =>
    setAssignedActors(prev => [...prev, { actorId: "", characterName: "" }]);

  const removeActorRow = (i) =>
    setAssignedActors(prev => prev.filter((_, idx) => idx !== i));

  const updateActorRow = (i, field, val) =>
    setAssignedActors(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: val } : a));

  const handleSave = async () => {
    if (!title.trim()) { setMsg({ type: "error", text: "Başlık zorunlu." }); return; }
    setLoading(true);
    setMsg(null);

    try {
      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Description", description);
      formData.append("ReleaseYear", releaseYear || 0);
      formData.append("ImdbRating", imdbRating || 0);
      if (imageFile) formData.append("Image", imageFile);

      const validActors = assignedActors.filter(a => a.actorId);
      formData.append("actorsJson", JSON.stringify(
        validActors.map(a => ({ ActorId: parseInt(a.actorId), CharacterName: a.characterName }))
      ));

      if (isEdit) {
        await api.put(`/movie/${movie.id}`, formData);
      } else {
        await api.post("/movie", formData);
      }

      onSaved();
    } catch (err) {
      const errData = err.response?.data;
      const errText = typeof errData === "string"
        ? errData
        : errData?.title || errData?.message || "Bir hata oluştu.";
      setMsg({ type: "error", text: errText });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ap-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ap-modal">
        <div className="ap-modal-header">
          <span className="ap-modal-title">{isEdit ? "Filmi Düzenle" : "Yeni Film Ekle"}</span>
          <button className="ap-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="ap-form">
          <div className="ap-field">
            <label className="ap-label">Başlık</label>
            <input className="ap-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Film adı" />
          </div>

          <div className="ap-field">
            <label className="ap-label">Açıklama</label>
            <textarea className="ap-textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder="Film hakkında kısa bir açıklama..." />
          </div>

          <div className="ap-form-row">
            <div className="ap-field">
              <label className="ap-label">Yıl</label>
              <input className="ap-input" type="number" value={releaseYear} onChange={e => setReleaseYear(e.target.value)} placeholder="2024" />
            </div>
            <div className="ap-field">
              <label className="ap-label">IMDb Puanı</label>
              <input className="ap-input" type="number" step="0.1" min="0" max="10" value={imdbRating} onChange={e => setImdbRating(e.target.value)} placeholder="8.5" />
            </div>
          </div>

          <div className="ap-field">
            <label className="ap-label">Afiş</label>
            <div className="ap-img-upload" onClick={() => fileRef.current.click()}>
              <input type="file" accept="image/*" ref={fileRef} onChange={handleImageChange} />
              {imagePreview ? (
                <div className="ap-img-preview">
                  <img src={imagePreview} alt="preview" />
                  <span className="ap-img-preview-name">{imageFile?.name || "Mevcut afiş"}</span>
                </div>
              ) : (
                <div className="ap-img-placeholder">
                  📷 <span>Afiş seçmek için tıklayın</span>
                </div>
              )}
            </div>
          </div>

          <div className="ap-field">
            <label className="ap-label">Filmde Oynayan Aktörler</label>
            <div className="ap-actor-assign">
              {assignedActors.map((row, i) => (
                <div key={i} className="ap-actor-assign-row">
                  <select
                    className="ap-select"
                    value={row.actorId}
                    onChange={e => updateActorRow(i, "actorId", e.target.value)}
                  >
                    <option value="">Aktör seç</option>
                    {actors.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <input
                    className="ap-input"
                    value={row.characterName}
                    onChange={e => updateActorRow(i, "characterName", e.target.value)}
                    placeholder="Karakter adı"
                  />
                  <button className="ap-actor-remove" onClick={() => removeActorRow(i)}>×</button>
                </div>
              ))}
              <div className="ap-actor-add-row">
                <button className="ap-actor-add-btn" onClick={addActorRow}>+ Aktör Ekle</button>
              </div>
            </div>
          </div>

          {msg && <div className={`ap-msg ${msg.type}`}>{msg.text}</div>}
        </div>

        <div className="ap-modal-footer">
          <button className="ap-cancel-btn" onClick={onClose}>İptal</button>
          <button className="ap-save-btn" onClick={handleSave} disabled={loading}>
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}


function ActorModal({ actor, onClose, onSaved }) {
  const isEdit = !!actor;
  const fileRef = useRef();

  const [name, setName] = useState(actor?.name || "");
  const [description, setDescription] = useState(actor?.description || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(actor?.imageUrl ? `${BASE_URL}${actor.imageUrl}` : null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!name.trim()) { setMsg({ type: "error", text: "Ad zorunlu." }); return; }
    setLoading(true);
    setMsg(null);

    try {
      const formData = new FormData();
      formData.append("Name", name);
      formData.append("Description", description);
      if (imageFile) formData.append("Image", imageFile);

      if (isEdit) {
        await api.put(`/actor/${actor.id}`, formData);
      } else {
        await api.post("/actor", formData);
      }

      onSaved();
    } catch (err) {
      const errData = err.response?.data;
      const errText = typeof errData === "string"
        ? errData
        : errData?.title || errData?.message || "Bir hata oluştu.";
      setMsg({ type: "error", text: errText });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ap-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ap-modal">
        <div className="ap-modal-header">
          <span className="ap-modal-title">{isEdit ? "Aktörü Düzenle" : "Yeni Aktör Ekle"}</span>
          <button className="ap-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="ap-form">
          <div className="ap-field">
            <label className="ap-label">Ad Soyad</label>
            <input className="ap-input" value={name} onChange={e => setName(e.target.value)} placeholder="Aktör adı" />
          </div>

          <div className="ap-field">
            <label className="ap-label">Biyografi</label>
            <textarea className="ap-textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder="Aktör hakkında kısa bir açıklama..." />
          </div>

          <div className="ap-field">
            <label className="ap-label">Fotoğraf</label>
            <div className="ap-img-upload" onClick={() => fileRef.current.click()}>
              <input type="file" accept="image/*" ref={fileRef} onChange={handleImageChange} />
              {imagePreview ? (
                <div className="ap-img-preview">
                  <img src={imagePreview} alt="preview" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
                  <span className="ap-img-preview-name">{imageFile?.name || "Mevcut fotoğraf"}</span>
                </div>
              ) : (
                <div className="ap-img-placeholder">
                  📷 <span>Fotoğraf seçmek için tıklayın</span>
                </div>
              )}
            </div>
          </div>

          {msg && <div className={`ap-msg ${msg.type}`}>{msg.text}</div>}
        </div>

        <div className="ap-modal-footer">
          <button className="ap-cancel-btn" onClick={onClose}>İptal</button>
          <button className="ap-save-btn" onClick={handleSave} disabled={loading}>
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}


function ConfirmDialog({ text, onConfirm, onCancel }) {
  return (
    <div className="ap-modal-overlay">
      <div className="ap-confirm">
        <div className="ap-confirm-icon">🗑️</div>
        <div className="ap-confirm-title">Emin misiniz?</div>
        <div className="ap-confirm-text">{text}</div>
        <div className="ap-confirm-btns">
          <button className="ap-cancel-btn" onClick={onCancel}>İptal</button>
          <button className="ap-confirm-del" onClick={onConfirm}>Sil</button>
        </div>
      </div>
    </div>
  );
}


export default function AdminPanel() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("movies");

  const [movies, setMovies] = useState([]);
  const [actors, setActors] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingActors, setLoadingActors] = useState(true);

  
  const [movieModal, setMovieModal] = useState(null); 
  const [actorModal, setActorModal] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const fetchMovies = () => {
    setLoadingMovies(true);
    api.get("/movie")
      .then(r => setMovies(r.data))
      .finally(() => setLoadingMovies(false));
  };

  const fetchActors = () => {
    setLoadingActors(true);
    api.get("/actor")
      .then(r => setActors(r.data))
      .finally(() => setLoadingActors(false));
  };

  useEffect(() => { fetchMovies(); fetchActors(); }, []);

  const deleteMovie = (id) => {
    setConfirmDialog({
      text: "Bu film kalıcı olarak silinecek.",
      onConfirm: async () => {
        setConfirmDialog(null);
        await api.delete(`/movie/${id}`);
        fetchMovies();
      }
    });
  };

  const deleteActor = (id) => {
    setConfirmDialog({
      text: "Bu aktör kalıcı olarak silinecek.",
      onConfirm: async () => {
        setConfirmDialog(null);
        await api.delete(`/actor/${id}`);
        fetchActors();
      }
    });
  };

  const getActorName = (actorId) => {
    const a = actors.find(a => a.id === actorId);
    return a ? a.name : `#${actorId}`;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ap-root">

        <div className="ap-header">
          <div className="ap-header-left">
            <button className="ap-back-btn" onClick={() => navigate("/")}>← Ana Sayfa</button>
            <span className="ap-header-title">CINE<span>VAULT</span></span>
            <span className="ap-header-badge">Admin Panel</span>
          </div>
        </div>

        <div className="ap-body">

          <div className="ap-tabs">
            <button className={`ap-tab ${tab === "movies" ? "active" : ""}`} onClick={() => setTab("movies")}>
              🎬 Filmler ({movies.length})
            </button>
            <button className={`ap-tab ${tab === "actors" ? "active" : ""}`} onClick={() => setTab("actors")}>
              🎭 Aktörler ({actors.length})
            </button>
          </div>

          {tab === "movies" && (
            <>
              <div className="ap-section-header">
                <span className="ap-section-title">Film Listesi</span>
                <button className="ap-add-btn" onClick={() => setMovieModal("add")}>
                  + Yeni Film
                </button>
              </div>

              <div className="ap-table-wrap">
                <table className="ap-table">
                  <thead>
                    <tr>
                      <th>Afiş</th>
                      <th>Başlık</th>
                      <th>Yıl</th>
                      <th>IMDb</th>
                      <th>Aktörler</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingMovies ? (
                      <tr><td colSpan={6} className="ap-empty">Yükleniyor...</td></tr>
                    ) : movies.length === 0 ? (
                      <tr><td colSpan={6} className="ap-empty">Henüz film yok.</td></tr>
                    ) : movies.map(m => (
                      <tr key={m.id}>
                        <td>
                          {m.imageUrl
                            ? <img className="ap-thumb" src={`${BASE_URL}${m.imageUrl}`} alt={m.title} />
                            : <div className="ap-thumb-fallback">🎬</div>
                          }
                        </td>
                        <td style={{ fontWeight: 500 }}>{m.title}</td>
                        <td style={{ color: "#888" }}>{m.releaseYear}</td>
                        <td>
                          {m.imdbRating
                            ? <span className="ap-rating-badge">⭐ {m.imdbRating}</span>
                            : <span style={{ color: "#555" }}>—</span>
                          }
                        </td>
                        <td>
                          <div className="ap-actors-chips">
                            {m.actors?.length > 0
                              ? m.actors.map((a, i) => (
                                  <span key={i} className="ap-chip">
                                    {a.characterName || getActorName(a.actorId)}
                                  </span>
                                ))
                              : <span style={{ color: "#555", fontSize: "0.8rem" }}>—</span>
                            }
                          </div>
                        </td>
                        <td>
                          <div className="ap-action-btns">
                            <button className="ap-edit-btn" onClick={() => setMovieModal(m)}>Düzenle</button>
                            <button className="ap-del-btn" onClick={() => deleteMovie(m.id)}>Sil</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === "actors" && (
            <>
              <div className="ap-section-header">
                <span className="ap-section-title">Aktör Listesi</span>
                <button className="ap-add-btn" onClick={() => setActorModal("add")}>
                  + Yeni Aktör
                </button>
              </div>

              <div className="ap-table-wrap">
                <table className="ap-table">
                  <thead>
                    <tr>
                      <th>Foto</th>
                      <th>Ad</th>
                      <th>Biyografi</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingActors ? (
                      <tr><td colSpan={4} className="ap-empty">Yükleniyor...</td></tr>
                    ) : actors.length === 0 ? (
                      <tr><td colSpan={4} className="ap-empty">Henüz aktör yok.</td></tr>
                    ) : actors.map(a => (
                      <tr key={a.id}>
                        <td>
                          {a.imageUrl
                            ? <img className="ap-actor-thumb" src={`${BASE_URL}${a.imageUrl}`} alt={a.name} />
                            : <div className="ap-actor-thumb-fallback">👤</div>
                          }
                        </td>
                        <td style={{ fontWeight: 500 }}>{a.name}</td>
                        <td style={{ color: "#888", fontSize: "0.82rem", maxWidth: 280 }}>
                          {a.description
                            ? a.description.length > 80 ? a.description.slice(0, 80) + "..." : a.description
                            : "—"
                          }
                        </td>
                        <td>
                          <div className="ap-action-btns">
                            <button className="ap-edit-btn" onClick={() => setActorModal(a)}>Düzenle</button>
                            <button className="ap-del-btn" onClick={() => deleteActor(a.id)}>Sil</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {movieModal && (
          <MovieModal
            movie={movieModal === "add" ? null : movieModal}
            actors={actors}
            onClose={() => setMovieModal(null)}
            onSaved={() => { setMovieModal(null); fetchMovies(); }}
          />
        )}

        {actorModal && (
          <ActorModal
            actor={actorModal === "add" ? null : actorModal}
            onClose={() => setActorModal(null)}
            onSaved={() => { setActorModal(null); fetchActors(); }}
          />
        )}

        {confirmDialog && (
          <ConfirmDialog
            text={confirmDialog.text}
            onConfirm={confirmDialog.onConfirm}
            onCancel={() => setConfirmDialog(null)}
          />
        )}
      </div>
    </>
  );
}