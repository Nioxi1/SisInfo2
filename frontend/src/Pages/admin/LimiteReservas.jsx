import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { reservasService } from '../../services/reservasService';
import './LimiteReservas.css';

function formatearFechaLocal(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
}

function obtenerMensajeError(error) {
  const errores = error?.response?.data?.errors;

  if (errores) {
    const primerError = Object.values(errores).flat()[0];

    if (primerError) {
      return primerError;
    }
  }

  return (
    error?.response?.data?.mensaje ||
    error?.response?.data?.message ||
    'No fue posible validar la fecha.'
  );
}

function LimiteReservas() {
  const navigate = useNavigate();

  const [fecha, setFecha] = useState(formatearFechaLocal(new Date()));
  const [resultado, setResultado] = useState(null);
  const [validando, setValidando] = useState(false);

  async function validarFecha() {
    setValidando(true);
    setResultado(null);

    try {
      const respuesta = await reservasService.validarLimite(fecha);

      setResultado({
        valida: true,
        mensaje: respuesta.data.mensaje,
        fechaActual: respuesta.data.fecha_actual,
        fechaSolicitada: respuesta.data.fecha_solicitada,
        fechaMaxima: respuesta.data.fecha_maxima_permitida,
        dias: respuesta.data.dias_de_anticipacion,
      });
    } catch (error) {
      setResultado({
        valida: false,
        mensaje: obtenerMensajeError(error),
        fechaSolicitada: fecha,
      });
    } finally {
      setValidando(false);
    }
  }

  function continuarReserva() {
    navigate(`/admin/reservas/nueva?fecha=${fecha}`);
  }

  return (
    <AdminLayout>
      <main className="limite-page">
        <header className="limite-header">
          <p>Sprint 2</p>
          <h1>Límite de reserva</h1>
          <span>
            El sistema permite realizar reservas con un máximo de un mes
            calendario de anticipación.
          </span>
        </header>

        <section className="limite-card">

          <label>
            Fecha solicitada
            <input
              type="date"
              value={fecha}
              onChange={(evento) => {
                setFecha(evento.target.value);
                setResultado(null);
              }}
            />
          </label>

          <button
            type="button"
            className="btn-simular"
            disabled={!fecha || validando}
            onClick={validarFecha}
          >
            {validando ? 'Validando...' : 'Validar fecha'}
          </button>

          {resultado && (
            <div
              className={`resultado-limite ${
                resultado.valida ? 'autorizado' : 'restringido'
              }`}
            >
              <h3>
                {resultado.valida
                  ? 'Validación autorizada'
                  : 'Validación rechazada'}
              </h3>

              <p>{resultado.mensaje}</p>

              <dl>
                {resultado.fechaActual && (
                  <div>
                    <dt>Fecha actual</dt>
                    <dd>{resultado.fechaActual}</dd>
                  </div>
                )}

                <div>
                  <dt>Fecha solicitada</dt>
                  <dd>{resultado.fechaSolicitada}</dd>
                </div>

                {resultado.fechaMaxima && (
                  <div>
                    <dt>Fecha máxima permitida</dt>
                    <dd>{resultado.fechaMaxima}</dd>
                  </div>
                )}

                {resultado.dias !== undefined && (
                  <div>
                    <dt>Días de anticipación</dt>
                    <dd>{resultado.dias}</dd>
                  </div>
                )}
              </dl>

              {resultado.valida && (
                <button
                  type="button"
                  className="btn-continuar"
                  onClick={continuarReserva}
                >
                  Continuar con la reserva
                </button>
              )}
            </div>
          )}
        </section>

        <aside className="politica-card">
          <h2>Política aplicada</h2>

          <ul>
            <li>No se permiten fechas anteriores al día actual.</li>
            <li>No se permiten reservas con más de un mes de anticipación.</li>
            <li>La validación se aplica por igual a todas las pistas.</li>
            <li>Una fecha válida permite continuar al formulario de reserva.</li>
          </ul>
        </aside>
      </main>
    </AdminLayout>
  );
}

export default LimiteReservas;