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
    // Aquí iría la lógica de autenticación
    // Por ahora, redirigimos a inicio
    navigate('/inicio');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="logo-icon">🎾</div>
          <h1 className="logo-title">Club Elite</h1>
          <p className="logo-subtitle">SOCIO GESTIÓN PRO</p>
        </div>

        {/* Título */}
        <h2 className="login-title">Bienvenido al Sistema de Gestión</h2>

        {/* Formulario */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Campo Email/Usuario */}
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico o Usuario</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingrese su correo o usuario"
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Checkbox Recordarme */}
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember">Recordarme en este equipo</label>
          </div>

          {/* Botón Iniciar Sesión */}
          <button type="submit" className="btn-login">
            Iniciar Sesión
          </button>

          {/* Enlaces de ayuda */}
          <div className="login-links">
            <a href="#forgot-password" className="link">¿Olvidaste tu contraseña?</a>
            <a href="#support" className="link">Contactar a Soporte IT</a>
          </div>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <div className="security-badges">
            <div className="badge">
              <span className="badge-icon">🔒</span>
              <span className="badge-text">Conexión Segura</span>
            </div>
            <div className="badge">
              <span className="badge-icon">🛡️</span>
              <span className="badge-text">Encriptación AES-256</span>
            </div>
          </div>
          <div className="copyright">
            <p>© 2026 Club Elite. Todos los derechos reservados.</p>
            <div className="legal-links">
              <a href="#terms" className="legal-link">Términos de Servicio</a>
              <span className="separator">|</span>
              <a href="#privacy" className="legal-link">Política de Privacidad</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
