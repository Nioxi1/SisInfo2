import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle, History, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { inasistenciasService } from '../../services/inasistenciasService';
import './ControlInasistencias.css';

export default function ControlInasistencias() {
  const [reservas, setReservas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [modal, setModal] = useState(null);
  const [observaciones, setObservaciones] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargarPendientes = async () => {
    try {
      setCargando(true);
      setError('');

      const response = await inasistenciasService.pendientes();
      setReservas(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'No fue posible cargar las reservas pendientes.'
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPendientes();
  }, []);

  const filtradas = useMemo(() => {
    const termino = busqueda.toLowerCase().trim();

    if (!termino) return reservas;

    return reservas.filter((reserva) => {
      const socio = `${reserva.socio?.nombre ?? ''} ${
        reserva.socio?.apellidos ?? ''
      }`.toLowerCase();

      const pista = `${reserva.pista?.nombre ?? ''} ${
        reserva.pista?.numero ?? ''
      }`.toLowerCase();

      return socio.includes(termino) || pista.includes(termino);
    });
  }, [reservas, busqueda]);

  const abrirModal = async (reserva) => {
    try {
      setError('');
      const response = await inasistenciasService.evaluacion(reserva.id);
      setModal(response.data);
      setObservaciones('');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.reserva?.[0] ||
          'No fue posible evaluar la reserva.'
      );
    }
  };

  const confirmar = async () => {
    if (!modal?.reserva?.id) return;

    try {
      setGuardando(true);
      setError('');

      const response = await inasistenciasService.registrar(
        modal.reserva.id,
        { observaciones }
      );

      setMensaje(response.data.message);
      setModal(null);
      await cargarPendientes();

      window.setTimeout(() => setMensaje(''), 4000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.reserva?.[0] ||
          'No fue posible registrar la inasistencia.'
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <AdminLayout activeTab="actividades">
      <main className="inasistencias-page">
        {mensaje && (
          <div className="inasistencia-success">
            <CheckCircle size={20} />
            {mensaje}
          </div>
        )}

        <header className="inasistencias-header">
          <div>
            <h1>Control de Inasistencias</h1>
            <p>Reservas finalizadas que no registraron ocupación.</p>
          </div>
        </header>

        {error && <div className="inasistencia-error">{error}</div>}

        <section className="inasistencias-card">
          <div className="inasistencias-toolbar">
            <input
              type="search"
              placeholder="Buscar por socio o pista..."
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />

            <button type="button" onClick={cargarPendientes}>
              Actualizar
            </button>
          </div>

          {cargando ? (
            <p className="inasistencias-empty">Cargando reservas...</p>
          ) : filtradas.length === 0 ? (
            <p className="inasistencias-empty">
              No existen reservas pendientes de control.
            </p>
          ) : (
            <div className="inasistencias-table-wrapper">
              <table className="inasistencias-table">
                <thead>
                  <tr>
                    <th>Socio</th>
                    <th>Pista</th>
                    <th>Fecha</th>
                    <th>Horario</th>
                    <th>Estado</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {filtradas.map((reserva) => (
                    <tr key={reserva.id}>
                      <td>
                        <strong>
                          {reserva.socio?.nombre} {reserva.socio?.apellidos}
                        </strong>
                        <span>{reserva.socio?.codigo}</span>
                      </td>

                      <td>
                        {reserva.pista?.nombre ||
                          `Pista ${reserva.pista?.numero}`}
                      </td>

                      <td>{String(reserva.fecha).slice(0, 10)}</td>

                      <td>
                        {reserva.hora_inicio} — {reserva.hora_fin}
                      </td>

                      <td>
                        <span className="estado-pendiente">
                          Pendiente de ocupación
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn-inasistencia"
                          onClick={() => abrirModal(reserva)}
                        >
                          Registrar inasistencia
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {modal && (
          <div className="inasistencia-overlay">
            <section className="inasistencia-modal">
              <header className="inasistencia-modal-header">
                <div>
                  <h2>Registrar Inasistencia</h2>
                  <p>
                    {modal.reserva.socio?.nombre}{' '}
                    {modal.reserva.socio?.apellidos}
                  </p>
                </div>

                <button type="button" onClick={() => setModal(null)}>
                  <X size={22} />
                </button>
              </header>

              <div className="inasistencia-modal-body">
                <div className="historial-title">
                  <History size={18} />
                  Historial del año
                </div>

                {modal.historial.length === 0 ? (
                  <p className="historial-empty">
                    No existen inasistencias anteriores este año.
                  </p>
                ) : (
                  modal.historial.map((item) => (
                    <div className="historial-item" key={item.id}>
                      <span>
                        Inasistencia #{item.numero_inasistencia}
                      </span>
                      <strong>
                        {item.exenta
                          ? 'Exenta de cobro'
                          : `Bs ${Number(item.monto).toFixed(2)}`}
                      </strong>
                    </div>
                  ))
                )}

                <div className="evaluacion-box">
                  <div>
                    <span>Tipo de penalización</span>
                    <strong>
                      {modal.exenta
                        ? 'Primera inasistencia anual'
                        : `${modal.numero_inasistencia}ª inasistencia - Multa base`}
                    </strong>
                  </div>

                  <div>
                    <span>Monto a facturar</span>
                    <strong>Bs {Number(modal.monto).toFixed(2)}</strong>
                  </div>
                </div>

                {modal.exenta && (
                  <div className="exenta-box">
                    <AlertTriangle size={18} />
                    La primera inasistencia anual está exenta de cobro.
                  </div>
                )}

                <label className="observaciones-label">
                  Observaciones internas
                  <textarea
                    rows="4"
                    placeholder="Añadir notas sobre la inasistencia..."
                    value={observaciones}
                    onChange={(event) => setObservaciones(event.target.value)}
                  />
                </label>

                <div className="multa-total">
                  <span>Multa calculada</span>
                  <strong>Bs {Number(modal.monto).toFixed(2)}</strong>
                </div>
              </div>

              <footer className="inasistencia-modal-footer">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setModal(null)}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn-confirmar-multa"
                  disabled={guardando}
                  onClick={confirmar}
                >
                  {guardando
                    ? 'Guardando...'
                    : modal.exenta
                      ? 'Confirmar inasistencia'
                      : 'Confirmar y generar multa'}
                </button>
              </footer>
            </section>
          </div>
        )}
      </main>
    </AdminLayout>
  );
}