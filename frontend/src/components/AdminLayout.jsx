import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Calendar, 
  Settings, 
  Search, 
  Bell, 
  HelpCircle, 
  User, 
  Plus
} from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout({ 
  children, 
  activeTab = 'inicio',
  searchPlaceholder = 'Buscar socios, pagos o reservas...',
  headerRightContent,
  sidebarBottomType = 'button' // 'button' | 'profile'
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const getIsActive = (pathKeywords, tabName) => {
    if (activeTab === tabName) return true;
    return pathKeywords.some(keyword => location.pathname.toLowerCase().includes(keyword.toLowerCase()));
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Left */}
      <aside className="admin-sidebar">
        <div className="sidebar-top">
          <div className="brand-title">Club Elite</div>
          <div className="brand-subtitle">GESTIÓN ADMINISTRATIVA</div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${getIsActive(['/inicio', '/inicioadm'], 'inicio') ? 'active' : ''}`}
            onClick={() => navigate('/inicioAdm')}
          >
            <LayoutDashboard className="nav-icon" size={18} />
            <span>Inicio</span>
          </button>

          <button 
            className={`nav-item ${getIsActive(['/socios', '/registrosocios', '/registro-socios'], 'socios') ? 'active' : ''}`}
            onClick={() => navigate('/socios')}
          >
            <Users className="nav-icon" size={18} />
            <span>Socios</span>
          </button>

          <button 
            className={`nav-item ${getIsActive(['/pagos'], 'pagos') ? 'active' : ''}`}
            onClick={() => navigate('/pagos')}
          >
            <CreditCard className="nav-icon" size={18} />
            <span>Pagos</span>
          </button>

          <button 
            className={`nav-item ${getIsActive(['/actividades'], 'actividades') ? 'active' : ''}`}
            onClick={() => navigate('/actividades')}
          >
            <Calendar className="nav-icon" size={18} />
            <span>Actividades</span>
          </button>

          <button 
            className={`nav-item ${getIsActive(['/configuracion'], 'configuracion') ? 'active' : ''}`}
            onClick={() => navigate('/configuracion')}
          >
            <Settings className="nav-icon" size={18} />
            <span>Configuración</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          {sidebarBottomType === 'profile' ? (
            <div className="sidebar-profile-card">
              <div className="profile-avatar-circle">
                <User size={20} color="#ffffff" />
              </div>
              <div className="profile-info">
                <span className="profile-name">Admin Pro</span>
                <button className="profile-logout" onClick={() => navigate('/')}>
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="btn-sidebar-new-socio" 
              onClick={() => navigate('/registroSocios')}
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Nuevo Socio</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Area */}
      <div className="admin-main-area">
        {/* Top Navbar */}
        <header className="admin-topbar">
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder={searchPlaceholder} 
              className="search-input"
            />
          </div>

          <div className="topbar-actions">
            <button className="icon-btn relative-btn" title="Notificaciones">
              <Bell size={20} />
              <span className="notification-badge-dot"></span>
            </button>

            <button className="icon-btn" title="Ayuda">
              <HelpCircle size={20} />
            </button>

            <div className="topbar-divider"></div>

            {headerRightContent || (
              <div className="user-profile-badge">
                <div className="user-text-stack">
                  <span className="user-role-title">Admin</span>
                  <span className="user-role-sub">SUPERUSER</span>
                </div>
                <div className="user-avatar-dark">
                  <User size={18} color="#ffffff" />
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content View */}
        <main className="admin-content-container">
          {children}
        </main>
      </div>
    </div>
  );
}
