import { useNavigate } from 'react-router-dom';
import './Inicio.css';

function Inicio() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="inicio-container">
      <header className="inicio-header">
        <div className="header-logo">
          <span className="logo-icon">🎾</span>
          <h1>Club Elite</h1>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </header>

      <main className="inicio-main">
        <div className="welcome-section">
          <h2>Bienvenido al Sistema de Gestión</h2>
          <p>Club de Tenis - Gestión de Socios y Reservas</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3>Socios</h3>
            <p>Gestión de altas, bajas y modificaciones de socios del club</p>
            <button className="btn-card" onClick={() => navigate('/socios')}>
              Gestionar Socios
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🎾</div>
            <h3>Pistas</h3>
            <p>Reserva y gestión de las 5 pistas de tenis disponibles</p>
            <button className="btn-card" onClick={() => navigate('/pistas')}>
              Gestionar Pistas
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📅</div>
            <h3>Reservas</h3>
            <p>Visualización y gestión de reservas por bloques de 1 hora</p>
            <button className="btn-card" onClick={() => navigate('/reservas')}>
              Ver Reservas
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📄</div>
            <h3>Facturación</h3>
            <p>Generación mensual de facturas por uso de pistas</p>
            <button className="btn-card" onClick={() => navigate('/facturacion')}>
              Ver Facturación
            </button>
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h4>📢 Información del Sistema</h4>
            <ul>
              <li>5 pistas de tenis disponibles</li>
              <li>Reservas por bloques de 1 hora</li>
              <li>Máximo 1 mes de anticipación en reservas</li>
              <li>Cancelación permitida si no es el mismo día</li>
              <li>Primera no ocupación anual sin cargo</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Inicio;
