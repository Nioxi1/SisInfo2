import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { reservasService } from '../../services/reservasService';
import { CheckCircle2, Loader2, Users2, MapPin, Clock, UserCheck } from 'lucide-react';
import './ControlOcupacion.css';

const hoyTexto = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

function estaEnHorario(reserva) {
  const ahora = new Date().toTimeString().slice(0, 8);
  return ahora >= reserva.hora_inicio && ahora <= reserva.hora_fin;
}

export default function ControlOcupacion() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [seleccionadaId, setSeleccionadaId] = useState(null);
  const [registrando, setRegistrando] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchReservas = async (busqueda = '') => {
    try {
      setLoading(true);
      setErrorCarga(null);
      const res = await reservasService.listarPorFecha('', busqueda);
      const data = res.data?.data || [];
      setReservas(data);
      setSeleccionadaId((actual) => actual ?? (data[0]?.id ?? null));
    } catch (err) {
      console.error('Error al obtener reservas del día:', err);
      setErrorCarga(
        err.response
          ? `Error ${err.response.status}: ${JSON.stringify(err.response.data)}`
          : 'No se pudo conectar con el backend.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const seleccionada = useMemo(
    () => reservas.find((r) => r.id === seleccionadaId) || null,
    [reservas, seleccionadaId]
  );

  const handleRegistrarOcupacion = async () => {
    if (!seleccionada) return;
    try {
      setRegistrando(true);
      const res = await reservasService.registrarOcupacion(seleccionada.id);
      setToast({ tipo: 'ok', mensaje: res.data.message });
      fetchReservas(searchQuery);
    } catch (err) {
      const mensaje = err.response?.data?.message || 'No se pudo registrar la ocupación.';
      setToast({ tipo: 'error', mensaje });
    } finally {
      setRegistrando(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const getEstadoAccion = (reserva) => {
    if (reserva.estado === 'ocupada') return { tipo: 'badge', texto: 'Ocupada' };
    if (reserva.estado !== 'activa') return { tipo: 'badge-neutro', texto: reserva.estado };
    if (estaEnHorario(reserva)) return { tipo: 'boton' };
    return { tipo: 'no-valido' };
  };

  return (
    <AdminLayout
      activeTab="reservas"
      searchPlaceholder="Buscar por socio o pista..."
      sidebarBottomType="profile"
    >
      {toast && (
        <div className={`toast-notif ${toast.tipo === 'error' ? 'toast-error' : ''}`}>
          <CheckCircle2 size={16} />
          <span>{toast.mensaje}</span>
        </div>
      )}

      <div className="ocupacion-container">
        <div className="ocupacion-list-panel">
          <h1 className="page-main-title">Reservas de hoy</h1>
          <p className="page-sub-title">Control de ocupación para el {hoyTexto}</p>

          {errorCarga && (
            <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '12px 16px', borderRadius: '8px', margin: '16px 0' }}>
              {errorCarga}
            </div>
          )}

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
              <Loader2 size={24} className="spinner-icon" />
              <p>Cargando reservas...</p>
            </div>
          ) : (
            <div className="reserva-list">
              {reservas.map((reserva) => {
                const accion = getEstadoAccion(reserva);
                const nombreSocio = `${reserva.socio?.nombre || ''} ${reserva.socio?.apellidos || ''}`.trim();

                return (
                  <div
                    key={reserva.id}
                    className={`reserva-row ${seleccionadaId === reserva.id ? 'reserva-row-active' : ''}`}
                    onClick={() => setSeleccionadaId(reserva.id)}
                  >
                    <div className="reserva-row-socio">
                      <div className="user-avatar">{nombreSocio.slice(0, 2).toUpperCase() || 'SO'}</div>
                      <div>
                        <div className="user-name">{nombreSocio}</div>
                        <div className="contact-phone">ID: {reserva.socio?.codigo}</div>
                      </div>
                    </div>

                    <div className="reserva-row-pista">
                      <MapPin size={14} />
                      <span>{reserva.pista?.nombre}</span>
                    </div>

                    <div className="reserva-row-horario">
                      <Clock size={14} />
                      <span>{reserva.hora_inicio?.slice(0, 5)} - {reserva.hora_fin?.slice(0, 5)}</span>
                    </div>

                    <div className="reserva-row-estado">
                      {accion.tipo === 'badge' && (
                        <span className="status-badge badge-ocupada">Ocupada</span>
                      )}
                      {accion.tipo === 'badge-neutro' && (
                        <span className="status-badge badge-neutro">{accion.texto}</span>
                      )}
                      {accion.tipo === 'boton' && (
                        <button
                          className="btn-registrar-mini"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSeleccionadaId(reserva.id);
                          }}
                        >
                          Registrar
                        </button>
                      )}
                      {accion.tipo === 'no-valido' && (
                        <div className="no-valido-cell">
                          <button className="btn-registrar-mini" disabled>Registrar</button>
                          <span className="texto-no-valido">Horario no válido aún</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {reservas.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8' }}>
                  No hay reservas programadas para hoy.
                </div>
              )}
            </div>
          )}
        </div>

        {seleccionada && (
          <div className="ocupacion-detail-panel">
            <div className="detail-socio-card">
              <div className="detail-avatar">
                <Users2 size={28} />
              </div>
              <div className="detail-socio-name">
                {`${seleccionada.socio?.nombre || ''} ${seleccionada.socio?.apellidos || ''}`.trim()}
              </div>
              <div className="detail-socio-sub">
                {seleccionada.socio?.activo ? 'Socio Activo' : 'Socio Inactivo'} • ID: {seleccionada.socio?.codigo}
              </div>
            </div>

            <div className="detail-section-title">INFORMACIÓN DE PISTA</div>
            <div className="detail-info-grid">
              <div className="detail-info-box">
                <MapPin size={16} />
                <div>
                  <div className="detail-info-label">Instalación</div>
                  <div className="detail-info-value">{seleccionada.pista?.nombre}</div>
                </div>
              </div>
              <div className="detail-info-box">
                <Clock size={16} />
                <div>
                  <div className="detail-info-label">Horario Reservado</div>
                  <div className="detail-info-value">
                    {seleccionada.hora_inicio?.slice(0, 5)} - {seleccionada.hora_fin?.slice(0, 5)}
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-actions">
              <button
                className="btn-green-primary btn-full"
                disabled={
                  seleccionada.estado !== 'activa' ||
                  !estaEnHorario(seleccionada) ||
                  registrando
                }
                onClick={handleRegistrarOcupacion}
              >
                <UserCheck size={18} strokeWidth={2.5} />
                <span>{registrando ? 'Registrando...' : 'Registrar Ocupación'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}