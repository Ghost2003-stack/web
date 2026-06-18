import React from 'react'

// Footer component (React)
// Semántico, accesible y responsive. Styles provided in styles/estiloPrueba.css
export default function Footer(){
  return (
    <footer role="contentinfo" className="site-footer">
      <div className="footer-inner">
        <div className="footer-col footer-col--left">
          <div className="footer-logo-wrap" aria-hidden="false">
            <svg className="logo-svg" viewBox="0 0 320 80" role="img" aria-labelledby="logoTitle logoDesc" preserveAspectRatio="xMidYMid meet">
              <title id="logoTitle">Suplementos Gym Pro</title>
              <desc id="logoDesc">Logo Suplementos Gym Pro</desc>
              <rect width="320" height="80" rx="10" fill="transparent" />
              <text x="16" y="42" fill="#FFFFFF" fontFamily="Segoe UI, Tahoma, Arial" fontWeight="800" fontSize="28">SUPLEMENTOS</text>
              <text x="16" y="64" fill="#0080FF" fontFamily="Segoe UI, Tahoma, Arial" fontSize="16">GYM PRO</text>
            </svg>
          </div>
          <p className="slogan">Calidad, rendimiento y asesoría profesional.</p>
        </div>

        <div className="footer-col footer-col--center">
          <div className="footer-block">
            <h4 className="footer-title">CONTACTO</h4>
            <ul className="contact-list">
              <li>
                <svg className="icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#FFFFFF" d="M2 6v12h20V6l-10 7L2 6z"/></svg>
                <a className="contact-link" href="mailto:info@supplementosgympro.com">info@supplementosgympro.com</a>
              </li>
              <li>
                <svg className="icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#FFFFFF" d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.1-2.1a1 1 0 011.1-.2c1.2.5 2.5.8 3.9.8a1 1 0 011 1V20a1 1 0 01-1 1C10.1 21 3 13.9 3 4a1 1 0 011-1h2.6a1 1 0 011 1c0 1.4.3 2.7.8 3.9.2.4 0 .9-.2 1.1L6.6 10.8z"/></svg>
                <a className="contact-link" href="tel:+5712345678">+57 1 234 5678</a>
              </li>
            </ul>
          </div>

          <div className="footer-block">
            <h4 className="footer-title">UBICACIÓN</h4>
            <p className="muted">Calle Principal 123, Bogotá, Colombia. Retiro en tienda disponible con coordinación previa.</p>
          </div>

          <div className="footer-block">
            <h4 className="footer-title">SOBRE NOSOTROS</h4>
            <p className="muted">Empresa especializada en suplementos deportivos y nutrición. Nuestra misión es apoyar tu rendimiento con productos de calidad.</p>
          </div>
        </div>

        <div className="footer-col footer-col--right">
          <div className="footer-block payments">
            <h4 className="footer-title">MEDIOS DE PAGO</h4>
            <div className="payment-wrap" aria-hidden="false">
              <svg className="payment-logo" width="120" height="32" viewBox="0 0 120 32" aria-hidden="true"><rect width="120" height="32" rx="4" fill="#0a0a0a" stroke="#222"/></svg>
              <div className="card-badges" role="list">
                <svg role="img" aria-label="Visa" width="48" height="28" viewBox="0 0 48 28"><rect width="48" height="28" rx="4" fill="#111"/><text x="6" y="19" fill="#fff" fontSize="10">VISA</text></svg>
                <svg role="img" aria-label="Mastercard" width="48" height="28" viewBox="0 0 48 28"><circle cx="20" cy="14" r="9" fill="#ff6b35"/><circle cx="28" cy="14" r="9" fill="#ffb077"/></svg>
                <svg role="img" aria-label="American Express" width="48" height="28" viewBox="0 0 48 28"><rect width="48" height="28" rx="4" fill="#111"/><text x="4" y="19" fill="#fff" fontSize="8">AMEX</text></svg>
                <svg role="img" aria-label="Diners Club" width="48" height="28" viewBox="0 0 48 28"><rect width="48" height="28" rx="4" fill="#111"/><text x="4" y="19" fill="#fff" fontSize="8">DINERS</text></svg>
                <svg role="img" aria-label="Redcompra" width="48" height="28" viewBox="0 0 48 28"><rect width="48" height="28" rx="4" fill="#111"/><text x="4" y="19" fill="#fff" fontSize="8">RED</text></svg>
              </div>
            </div>
          </div>

          <div className="footer-block social-block">
            <h4 className="footer-title">SÍGUENOS</h4>
            <div className="socials">
              <a className="social-btn whatsapp" href="#" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M20 3.7A11.9 11.9 0 0012 1C6 1 1 6 1 12c0 2.1.6 4.1 1.7 5.8L1 23l5.4-1.6A11.9 11.9 0 0012 23c6 0 11-5 11-11 0-1.8-.4-3.5-1-5.3z"/></svg>
              </a>
              <a className="social-btn instagram" href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.2A4.8 4.8 0 1016.8 13 4.8 4.8 0 0012 8.2z"/></svg>
              </a>
              <a className="social-btn facebook" href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M22 12a10 10 0 10-11.5 9.9v-7H8.9v-3h1.6V9.1c0-1.6 1-2.5 2.4-2.5.7 0 1.4.1 1.4.1v1.6h-.8c-.8 0-1 0-1 1v1.2h1.7l-.3 3h-1.4v7A10 10 0 0022 12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-academic" aria-label="Información académica del autor">
        <div className="academic-inner">
          <div className="academic-item"><span className="label">👤 Nombre:</span> <span className="value">Jorge Ortega</span></div>
          <div className="academic-item"><span className="label">📚 Asignatura:</span> <span className="value">Programación Front End</span></div>
          <div className="academic-item"><span className="label">👨‍🏫 Profesor:</span> <span className="value">Victor Vazquez</span></div>
          <div className="academic-item"><span className="label">🏷️ Sección:</span> <span className="value">IEI-N3-P2-C1</span></div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copyright">Copyright © 2026 Suplementos Gym Pro. Todos los derechos reservados.</div>
      </div>
    </footer>
  )
}
