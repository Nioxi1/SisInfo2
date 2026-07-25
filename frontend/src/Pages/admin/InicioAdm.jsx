import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import {
  Users,
  Activity,
  DollarSign,
  FileText,
  UserPlus,
  CalendarPlus,
  Calendar,
  CreditCard,
  ChevronRight,
  Download
} from 'lucide-react';
import clubhouseImg from '../../assets/clubhouse.png';
import './InicioAdm.css';

export default function InicioAdm() {
  const navigate = useNavigate();

  return (
    <AdminLayout
      activeTab="inicio"
      searchPlaceholder="Buscar socios, pagos o reservas..."
      sidebarBottomType="button"
    >
      <div className="inicio-adm-container">
        {/* Header Section */}
        <div className="page-header-row">
          <div>
            <h1 className="page-main-title">Bienvenido de nuevo, Administrador</h1>
            <p className="page-sub-title">Hoy es Jueves, 23 de julio de 2026</p>
          </div>
          <button className="btn-secondary-action">
            <Download size={16} />
            <span>Descargar Reporte Diario</span>
          </button>
        </div>

        {/* 4 Metric Cards */}
        <div className="metrics-grid">
          {/* Metric 1 */}
          <div className="metric-card">
            <div className="metric-card-top">
              <div className="metric-icon-box bg-blue-light">
                <Users size={20} color="#2563EB" />
              </div>
              <span className="metric-badge green-badge">+4%</span>
            </div>
            <div className="metric-label">TOTAL SOCIOS ACTIVOS</div>
            <div className="metric-value">1,248</div>
          </div>

          {/* Metric 2 */}
          <div className="metric-card">
            <div className="metric-card-top">
              <div className="metric-icon-box bg-green-light">
                <Activity size={20} color="#16A34A" />
              </div>
              <span className="metric-cap-text">Cap: 85%</span>
            </div>
            <div className="metric-label">OCUPACIÓN PISTAS HOY</div>
            <div className="metric-value">42 / 50</div>
          </div>

          {/* Metric 3 */}
          <div className="metric-card">
            <div className="metric-card-top">
              <div className="metric-icon-box bg-indigo-light">
                <DollarSign size={20} color="#3B82F6" />
              </div>
              <span className="metric-badge green-badge-text">+12%</span>
            </div>
            <div className="metric-label">INGRESOS DEL MES</div>
            <div className="metric-value">Bs.14.25</div>
          </div>

          {/* Metric 4 */}
          <div className="metric-card">
            <div className="metric-card-top">
              <div className="metric-icon-box bg-red-light">
                <FileText size={20} color="#DC2626" />
              </div>
              <span className="metric-badge red-badge-text">8 pendientes</span>
            </div>
            <div className="metric-label">PENDIENTES FACTURACIÓN</div>
            <div className="metric-value">Bs840,00</div>
          </div>
        </div>

        {/* Middle Row: Estado de las Pistas & Acciones Rápidas */}
        <div className="middle-dashboard-grid">
          {/* Pistas State Card */}
          <div className="dashboard-section-card pistas-section">
            <div className="section-card-header">
              <h2 className="section-title">Estado de las Pistas</h2>
              <div className="pistas-legend">
                <span className="legend-item"><span className="dot dot-green"></span> Disponible</span>
                <span className="legend-item"><span className="dot dot-red"></span> Ocupada</span>
              </div>
            </div>

            <div className="pistas-cards-row">
              {/* Pista 1 */}
              <div className="pista-mini-card">
                <div className="pista-title">PISTA 1</div>
                <div className="pista-bar bar-red"></div>
                <div className="pista-main-info red-text">16:00 - 17:00</div>
                <div className="pista-sub-info">Socio: R. Nadal</div>
              </div>

              {/* Pista 2 */}
              <div className="pista-mini-card">
                <div className="pista-title">PISTA 2</div>
                <div className="pista-bar bar-green"></div>
                <div className="pista-main-info green-text">Disponible</div>
                <div className="pista-sub-info">Sin reservas</div>
              </div>

              {/* Pista 3 */}
              <div className="pista-mini-card">
                <div className="pista-title">PISTA 3</div>
                <div className="pista-bar bar-red"></div>
                <div className="pista-main-info red-text">16:00 - 17:30</div>
                <div className="pista-sub-info">Socio: C. Alcaraz</div>
              </div>

              {/* Pista 4 */}
              <div className="pista-mini-card">
                <div className="pista-title">PISTA 4</div>
                <div className="pista-bar bar-green"></div>
                <div className="pista-main-info green-text">Disponible</div>
                <div className="pista-sub-info">Siguiente a las 18h</div>
              </div>

              {/* Pista 5 */}
              <div className="pista-mini-card">
                <div className="pista-title">PISTA 5</div>
                <div className="pista-bar bar-red"></div>
                <div className="pista-main-info red-text">16:30 - 18:00</div>
                <div className="pista-sub-info">Escuela Infantil</div>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas Card */}
          <div className="dashboard-section-card acciones-section">
            <div className="section-card-header">
              <h2 className="section-title">Acciones Rápidas</h2>
            </div>

            <div className="acciones-list">
              <button
                className="accion-item-btn"
                onClick={() => navigate('/registroSocios')}
              >
                <div className="accion-icon-box bg-blue-light">
                  <UserPlus size={20} color="#2563EB" />
                </div>
                <div className="accion-text">
                  <span className="accion-title">Nuevo Socio</span>
                  <span className="accion-sub">Alta rápida en el sistema</span>
                </div>
              </button>

              <button className="accion-item-btn">
                <div className="accion-icon-box bg-green-light">
                  <CalendarPlus size={20} color="#16A34A" />
                </div>
                <div className="accion-text">
                  <span className="accion-title">Nueva Reserva</span>
                  <span className="accion-sub">Reservar pista o actividad</span>
                </div>
              </button>

              <button className="accion-item-btn">
                <div className="accion-icon-box bg-indigo-light">
                  <FileText size={20} color="#3B82F6" />
                </div>
                <div className="accion-text">
                  <span className="accion-title">Generar Facturas</span>
                  <span className="accion-sub">Procesar remesas del mes</span>
                  onClick={() => navigate('/admin/facturas')}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Lower Row: Actividad Reciente & Club House Banner */}
        <div className="lower-dashboard-grid">
          {/* Actividad Reciente Card */}
          <div className="dashboard-section-card actividad-section">
            <div className="section-card-header">
              <h2 className="section-title">Actividad Reciente</h2>
              <button className="btn-link">Ver todo</button>
            </div>

            <div className="actividad-list">
              <div className="actividad-item">
                <div className="actividad-icon-box">
                  <UserPlus size={18} color="#2563EB" />
                </div>
                <div className="actividad-info">
                  <div className="actividad-title">Nuevo socio registrado: Miguel Ferrero</div>
                  <div className="actividad-sub">Hoy, 14:23 • Plan Premium Anual</div>
                </div>
                <ChevronRight size={18} className="chevron-icon" />
              </div>

              <div className="actividad-item">
                <div className="actividad-icon-box">
                  <Calendar size={18} color="#2563EB" />
                </div>
                <div className="actividad-info">
                  <div className="actividad-title">Reserva confirmada: Pista 3</div>
                  <div className="actividad-sub">Hoy, 13:10 • Socio: Ana María López</div>
                </div>
                <ChevronRight size={18} className="chevron-icon" />
              </div>

              <div className="actividad-item">
                <div className="actividad-icon-box">
                  <CreditCard size={18} color="#2563EB" />
                </div>
                <div className="actividad-info">
                  <div className="actividad-title">Pago recibido: Cuota Mayo</div>
                  <div className="actividad-sub">Hoy, 09:45 • Importe: Bs.65,00</div>
                </div>
                <ChevronRight size={18} className="chevron-icon" />
              </div>
            </div>
          </div>

          {/* Club House Image Banner Card */}
          <div
            className="club-banner-card"
            style={{ backgroundImage: `url(${clubhouseImg})` }}
          >
            <div className="club-banner-overlay">
              <h3 className="club-banner-title">Club Elite Club House</h3>
              <p className="club-banner-sub">
                Mantenimiento programado: Mañana 08:00 - 10:00 (Pistas 1 y 2)
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
