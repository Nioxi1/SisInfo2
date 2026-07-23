import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/inicio');
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Top Header Logo */}
        <div className="brand-header">
          <div className="brand-icon-box">
            <svg className="brand-shield-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(255, 255, 255, 0.25)" stroke="white" />
              <path d="M12 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" fill="white" stroke="none" />
              <path d="M12 13c-2.67 0-5 1.33-5 3.5V17h10v-.5c0-2.17-2.33-3.5-5-3.5z" fill="white" stroke="none" />
            </svg>
          </div>
          <h1 className="brand-title">Club Elite</h1>
          <p className="brand-subtitle">SOCIOGESTIÓN PRO</p>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div className="card-header">
            <h2 className="card-title">Bienvenido al Sistema de<br />Gestión</h2>
            <p className="card-subtitle">Ingresa tus credenciales para continuar</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email / Username Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Correo Electrónico o Usuario</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@clubelite.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <a href="#forgot-password" className="forgot-link">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="field-hint">La contraseña debe tener al menos 8 caracteres.</p>
            </div>

            {/* Checkbox Recordarme */}
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Recordarme en este equipo</label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-submit">
              <span>Iniciar Sesión</span>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </button>
          </form>

          {/* Card Support Footer */}
          <div className="card-footer-support">
            <p className="support-text">¿Problemas para acceder?</p>
            <a href="#support" className="support-link">Contactar a Soporte IT</a>
          </div>
        </div>

        {/* Security Badges */}
        <div className="security-badges">
          <div className="badge-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <span>Conexión Segura</span>
          </div>
          <div className="badge-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
            <span>Encriptación AES-256</span>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <footer className="login-page-footer">
        <div className="footer-content">
          <p className="copyright-text">© 2023 Club Elite - Gestión Administrativa</p>
          <div className="footer-links">
            <a href="#terms">Términos de Servicio</a>
            <a href="#privacy">Política de Privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Login;
