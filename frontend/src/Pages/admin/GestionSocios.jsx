import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { sociosService } from '../../services/sociosService';
import { 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  ClipboardList, 
  SlidersHorizontal, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  Loader2
} from 'lucide-react';
import './GestionSocios.css';

export default function GestionSocios() {
  const navigate = useNavigate();
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const defaultAvatarColors = [
    { bg: '#BFDBFE', color: '#1D4ED8' },
    { bg: '#1E293B', color: '#FFFFFF' },
    { bg: '#86EFAC', color: '#14532D' },
    { bg: '#DDD6FE', color: '#581C87' },
    { bg: '#FDE68A', color: '#92400E' }
  ];

  const fetchSocios = async (busqueda = '') => {
    try {
      setLoading(true);
      const res = await sociosService.listar(busqueda);
      if (res.data && res.data.data) {
        setSocios(res.data.data);
      }
    } catch (err) {
      console.error('Error al obtener lista de socios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocios(searchQuery);
  }, [searchQuery]);

  const getInitials = (nombre, apellidos) => {
    const n = nombre ? nombre[0] : '';
    const a = apellidos ? apellidos[0] : '';
    return (n + a).toUpperCase() || 'SO';
  };

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
            <div className="summary-card-value">
              {socios.length > 0 ? socios.filter(s => s.activo).length : '1,248'}
            </div>
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
            {loading ? (
              <div className="loading-state-box" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                <Loader2 size={24} className="spinner-icon" style={{ marginBottom: '8px' }} />
                <p>Cargando lista de socios...</p>
              </div>
            ) : (
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
                  {socios.map((socio, idx) => {
                    const style = defaultAvatarColors[idx % defaultAvatarColors.length];
                    const nombreCompleto = `${socio.nombre} ${socio.apellidos || ''}`.trim();
                    const isActivo = socio.activo ?? true;

                    return (
                      <tr key={socio.id || socio.codigo}>
                        <td className="font-bold-code">{socio.codigo}</td>
                        <td>
                          <div className="user-cell">
                            <div 
                              className="user-avatar"
                              style={{ backgroundColor: style.bg, color: style.color }}
                            >
                              {getInitials(socio.nombre, socio.apellidos)}
                            </div>
                            <span className="user-name">{nombreCompleto}</span>
                          </div>
                        </td>
                        <td>
                          <div className="contact-cell">
                            <span className="contact-email">{socio.email}</span>
                            <span className="contact-phone">{socio.telefono || '-'}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${isActivo ? 'badge-activo' : 'badge-inactivo'}`}>
                            {isActivo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>{/* Actions */}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Footer / Pagination */}
          <div className="table-footer">
            <div className="footer-count">Mostrando {socios.length} socios</div>
            <div className="pagination">
              <button className="page-nav-btn" disabled><ChevronLeft size={16} /></button>
              <button className="page-number-btn active">1</button>
              <button className="page-nav-btn" disabled><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
