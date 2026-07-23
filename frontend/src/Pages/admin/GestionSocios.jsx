import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  ClipboardList, 
  SlidersHorizontal, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import './GestionSocios.css';

export default function GestionSocios() {
  const navigate = useNavigate();

  const sociosData = [
    {
      codigo: 'SOC-001',
      nombre: 'Alejandro Mendoza',
      initials: 'AM',
      avatarBg: '#BFDBFE',
      avatarColor: '#1D4ED8',
      email: 'a.mendoza@email.com',
      telefono: '+54 11 4567 8910',
      estado: 'Activo'
    },
    {
      codigo: 'SOC-002',
      nombre: 'Beatriz Peña',
      initials: 'BP',
      avatarBg: '#1E293B',
      avatarColor: '#FFFFFF',
      email: 'b.pena@email.com',
      telefono: '+54 11 5678 1234',
      estado: 'Inactivo'
    },
    {
      codigo: 'SOC-003',
      nombre: 'Carlos Rodríguez',
      initials: 'CR',
      avatarBg: '#86EFAC',
      avatarColor: '#14532D',
      email: 'c.rod@email.com',
      telefono: '+54 11 9876 5432',
      estado: 'Activo'
    },
    {
      codigo: 'SOC-004',
      nombre: 'Diana Villalba',
      initials: 'DV',
      avatarBg: '#DDD6FE',
      avatarColor: '#581C87',
      email: 'dvillalba@email.com',
      telefono: '+54 11 2233 4455',
      estado: 'Activo'
    }
  ];

  return (
    <AdminLayout 
      activeTab="socios"
      searchPlaceholder="Buscar por nombre o código..."
      sidebarBottomType="profile"
      headerRightContent={
        <div className="user-header-text-only">
          Sistema de Gestión de Socios
        </div>
      }
    >
      <div className="gestion-socios-container">
        {/* Page Header */}
        <div className="page-header-row">
          <div>
            <h1 className="page-main-title">Gestión de Socios</h1>
            <p className="page-sub-title">Visualiza, filtra y administra la base de datos de socios del club.</p>
          </div>
          <button 
            className="btn-green-primary"
            onClick={() => navigate('/registroSocios')}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Nuevo Socio</span>
          </button>
        </div>

        {/* 3 Summary Cards */}
        <div className="summary-cards-grid">
          {/* Card 1 */}
          <div className="summary-card">
            <div className="summary-card-header">
              <span className="summary-card-title">SOCIOS ACTIVOS</span>
              <TrendingUp size={18} color="#22C55E" />
            </div>
            <div className="summary-card-value">1,248</div>
            <div className="summary-card-sub text-muted">+12% vs mes anterior</div>
          </div>

          {/* Card 2 */}
          <div className="summary-card">
            <div className="summary-card-header">
              <span className="summary-card-title">SOCIOS MOROSOS</span>
              <AlertTriangle size={18} color="#DC2626" />
            </div>
            <div className="summary-card-value">42</div>
            <div className="summary-card-sub text-muted">2.1% del padrón total</div>
          </div>

          {/* Card 3 */}
          <div className="summary-card card-with-watermark">
            <div className="summary-card-header">
              <span className="summary-card-title">SOLICITUDES PENDIENTES</span>
            </div>
            <div className="summary-card-value">15</div>
            <a href="#pendientes" className="summary-card-link">
              <span>Ver pendientes</span>
              <ArrowRight size={14} />
            </a>
            <ClipboardList size={80} className="watermark-icon" />
          </div>
        </div>

        {/* Listado de Socios Section */}
        <div className="table-card-container">
          <div className="table-card-header">
            <h2 className="table-title">Listado de Socios</h2>
            <div className="table-actions">
              <button className="table-action-btn" title="Filtrar">
                <SlidersHorizontal size={16} />
              </button>
              <button className="table-action-btn" title="Exportar">
                <Download size={16} />
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="socios-table">
              <thead>
                <tr>
                  <th>CÓDIGO</th>
                  <th>NOMBRE</th>
                  <th>CONTACTO</th>
                  <th>ESTADO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {sociosData.map((socio) => (
                  <tr key={socio.codigo}>
                    <td className="font-bold-code">{socio.codigo}</td>
                    <td>
                      <div className="user-cell">
                        <div 
                          className="user-avatar"
                          style={{ backgroundColor: socio.avatarBg, color: socio.avatarColor }}
                        >
                          {socio.initials}
                        </div>
                        <span className="user-name">{socio.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <span className="contact-email">{socio.email}</span>
                        <span className="contact-phone">{socio.telefono}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${socio.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'}`}>
                        {socio.estado}
                      </span>
                    </td>
                    <td>{/* Actions */}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="table-footer">
            <div className="footer-count">Mostrando 4 de 1,248 socios</div>
            <div className="pagination">
              <button className="page-nav-btn" disabled><ChevronLeft size={16} /></button>
              <button className="page-number-btn active">1</button>
              <button className="page-number-btn">2</button>
              <button className="page-number-btn">3</button>
              <button className="page-nav-btn"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
