import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { pistasService } from '../../services/pistasService';
import { 
  Plus, 
  CheckCircle2, 
  Wrench, 
  Users2, 
  Pencil, 
  Trash2, 
  Lightbulb,
  Loader2
} from 'lucide-react';
import './GestionPistas.css';

const ESTADO_LABEL = {
  disponible: 'Disponible',
  reservada: 'Reservada',
  mantenimiento: 'Mantenimiento',
};

export default function GestionPistas() {
  const navigate = useNavigate();
  const [pistas, setPistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pistaAEliminar, setPistaAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const fetchPistas = async (busqueda = '') => {
    try {
      setLoading(true);
      const res = await pistasService.listar(busqueda);
      if (res.data && res.data.data) {
        setPistas(res.data.data);
      }
    } catch (err) {
      console.error('Error al obtener lista de pistas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPistas(searchQuery);
  }, [searchQuery]);

  const disponibles = pistas.filter((p) => p.estado === 'disponible').length;
  const mantenimiento = pistas.filter((p) => p.estado === 'mantenimiento').length;
  const reservadas = pistas.filter((p) => p.estado === 'reservada').length;

  const confirmarEliminar = async () => {
    if (!pistaAEliminar) return;
    try {
      setEliminando(true);
      await pistasService.eliminar(pistaAEliminar.id);
      setPistaAEliminar(null);
      fetchPistas(searchQuery);
    } catch (err) {
      console.error('Error al eliminar la pista:', err);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <AdminLayout 
      activeTab="pistas"
      searchPlaceholder="Buscar pista..."
      sidebarBottomType="profile"
      headerRightContent={
        <div className="user-header-text-only">
          Sistema de Gestión de Pistas
        </div>
      }
    >
      <div className="gestion-socios-container">
        {/* Page Header */}
        <div className="page-header-row">
          <div>
            <h1 className="page-main-title">Pistas de Tenis</h1>
            <p className="page-sub-title">Administre el estado, tipo y disponibilidad de las instalaciones.</p>
          </div>
          <button 
            className="btn-green-primary"
            onClick={() => navigate('/pistas/nueva')}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Crear nueva pista</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards-grid summary-cards-grid-3">
          <div className="summary-card">
            <div className="summary-card-header">
              <span className="summary-card-title">DISPONIBLES</span>
              <CheckCircle2 size={18} color="#22C55E" />
            </div>
            <div className="summary-card-value">{disponibles}</div>
          </div>

          <div className="summary-card">
            <div className="summary-card-header">
              <span className="summary-card-title">EN MANTENIMIENTO</span>
              <Wrench size={18} color="#DC2626" />
            </div>
            <div className="summary-card-value">{mantenimiento}</div>
          </div>

          <div className="summary-card">
            <div className="summary-card-header">
              <span className="summary-card-title">RESERVADAS</span>
              <Users2 size={18} color="#2563EB" />
            </div>
            <div className="summary-card-value">{reservadas}</div>
          </div>
        </div>

        {/* Tabla de Pistas */}
        <div className="table-card-container">
          <div className="table-wrapper">
            {loading ? (
              <div className="loading-state-box" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                <Loader2 size={24} className="spinner-icon" style={{ marginBottom: '8px' }} />
                <p>Cargando lista de pistas...</p>
              </div>
            ) : (
              <table className="socios-table">
                <thead>
                  <tr>
                    <th>PISTA</th>
                    <th>ESTADO</th>
                    <th>SUPERFICIE</th>
                    <th>ILUMINACIÓN</th>
                    <th>PRECIO/HORA (BS.)</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {pistas.map((pista) => (
                    <tr key={pista.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar pista-avatar">
                            <Users2 size={16} />
                          </div>
                          <div>
                            <div className="user-name">{pista.nombre}</div>
                            <div className="contact-phone">ID: {pista.codigo}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge badge-${pista.estado}`}>
                          {ESTADO_LABEL[pista.estado]}
                        </span>
                      </td>
                      <td>{pista.superficie}</td>
                      <td>
                        <Lightbulb size={16} color={pista.iluminacion ? '#F59E0B' : '#CBD5E1'} />
                      </td>
                      <td>{Number(pista.precio_hora).toFixed(2)}</td>
                      <td>
                        <div className="table-actions-row">
                          <button
                            className="table-action-btn"
                            title="Editar"
                            onClick={() => navigate(`/pistas/editar/${pista.id}`)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="table-action-btn table-action-btn-danger"
                            title="Eliminar"
                            onClick={() => setPistaAEliminar(pista)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="table-footer">
            <div className="footer-count">Mostrando {pistas.length} pistas</div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {pistaAEliminar && (
        <div className="modal-overlay" onClick={() => setPistaAEliminar(null)}>
          <div className="modal-confirm" onClick={(e) => e.stopPropagation()}>
            <h3>¿Eliminar pista?</h3>
            <p>
              Vas a eliminar la pista <strong>{pistaAEliminar.nombre}</strong> ({pistaAEliminar.codigo}).
              Esta acción no se puede deshacer.
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setPistaAEliminar(null)}>
                Cancelar
              </button>
              <button className="btn-danger" onClick={confirmarEliminar} disabled={eliminando}>
                {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}