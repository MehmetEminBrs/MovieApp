export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">
        CINE<span>VAULT</span>
      </div>
      <p className="footer-copy">© {new Date().getFullYear()} CineVault</p>
    </footer>
  );
}