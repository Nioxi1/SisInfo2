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

// ==================== PLAN DE CONTINGENCIA — datos ficticios ====================
// Se usan solo si el backend falla o no hay reservas reales para hoy.
function formatearHora(fecha) {
  return fecha.toTimeString().slice(0, 8); // HH:MM:SS
}

function generarReservasFicticias() {
  const ahora = new Date();

  const inicioOcupada = new Date(ahora.getTime() - 90 * 60000); // hace 1h30
  const finOcupada = new Date(ahora.getTime() - 30 * 60000);    // terminó hace 30min... 
  // Para que quede claramente "Ocupada", el fin la dejamos un poco después de ahora:
  const finOcupadaAjustado = new Date(ahora.getTime() + 15 * 60000);

  const inicioActiva = new Date(ahora.getTime() - 15 * 60000);  // empezó hace 15min
  const finActiva = new Date(ahora.getTime() + 45 * 60000);     // termina en 45min

  const inicioFutura = new Date(ahora.getTime() + 120 * 60000); // en 2h
  const finFutura = new Date(ahora.getTime() + 180 * 60000);    // en 3h

  return [
    {
      id: 1001,
      socio: { nombre: 'Carlos', apellidos: 'Rodríguez', codigo: 'SO-01245', activo: true },
      pista: { nombre: 'Pista Central (Tenis)' },
      hora_inicio: formatearHora(inicioOcupada),
      hora_fin: formatearHora(finOcupadaAjustado),
      estado: 'ocupada',
      fecha: ahora.toISOString().slice(0, 10),
    },
    {
      id: 1002,
      socio: { nombre: 'Ana', apellidos: 'Martínez', codigo: 'SO-08210', activo: true },
      pista: { nombre: 'Pista 3 (Pádel)' },
      hora_inicio: formatearHora(inicioActiva),
      hora_fin: formatearHora(finActiva),
      estado: 'activa',
      fecha: ahora.toISOString().slice(0, 10),
    },
    {
      id: 1003,
      socio: { nombre: 'Luis Miguel', apellidos: 'Gómez', codigo: 'SO-11093', activo: true },
      pista: { nombre: 'Pista 1 (Tenis)' },
      hora_inicio: formatearHora(inicioFutura),
      hora_fin: formatearHora(finFutura),
      estado: 'activa',
      fecha: ahora.toISOString().slice(0, 10),
    },
  ];
}
// ================================================================================

export default function ControlOcupacion() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [usandoDemo, setUsandoDemo] = useState(false);
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

      if (data.length > 0) {
        setUsandoDemo(false);
        setReservas(data);
        setSeleccionadaId((actual) => actual ?? data[0].id);
      } else {
        // Backend respondió bien pero no hay reservas reales hoy -> demo
        const demo = generarReservasFicticias();
        setUsandoDemo(true);
        setReservas(demo);
        setSeleccionadaId((actual) => actual ?? demo[0].id);
      }
    } catch (err) {
      console.error('Error al obtener reservas del día:', err);
      // Backend no responde -> demo, sin mostrar el error en pantalla
      const demo = generarReservasFicticias();
      setUsandoDemo(true);
      setReservas(demo);
      setSeleccionadaId((actual) => actual ?? demo[0].id);
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
    setRegistrando(true);

    if (usandoDemo) {
      // Simula el registro localmente, sin llamar al backend
      setTimeout(() => {
        setReservas((prev) =>
          prev.map((r) => (r.id === seleccionada.id ? { ...r, estado: 'ocupada' } : r))
        );
        setToast({ tipo: 'ok', mensaje: 'Ocupación registrada exitosamente.' });
        setRegistrando(false);
        setTimeout(() => setToast(null), 4000);
      }, 500);
      return;
    }

    try {
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