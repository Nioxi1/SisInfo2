import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { sociosService } from '../../services/sociosService';
import { reservasService } from '../../services/reservasService';
import './NuevaReserva.css';

function formatearFechaLocal(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
}

function obtenerFechaMaxima() {
  const hoy = new Date();
  const diaOriginal = hoy.getDate();

  const maxima = new Date(hoy);
  maxima.setDate(1);
  maxima.setMonth(maxima.getMonth() + 1);

  const ultimoDiaMes = new Date(
    maxima.getFullYear(),
    maxima.getMonth() + 1,
    0
  ).getDate();

  maxima.setDate(Math.min(diaOriginal, ultimoDiaMes));

  return formatearFechaLocal(maxima);
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
    'No fue posible completar la operación.'
  );
}

function construirDiasDelMes(mes) {
  const [anio, numeroMes] = mes.split('-').map(Number);
  const indiceMes = numeroMes - 1;

  const primerDia = new Date(anio, indiceMes, 1);
  const ultimoDia = new Date(anio, indiceMes + 1, 0);

  // Conversión para que la semana comience en lunes.
  const espaciosIniciales = (primerDia.getDay() + 6) % 7;

  return [
    ...Array.from({ length: espaciosIniciales }, () => null),
    ...Array.from({ length: ultimoDia.getDate() }, (_, indice) => indice + 1),
  ];
}

function NuevaReserva() {
  const [searchParams] = useSearchParams();

  const hoy = formatearFechaLocal(new Date());
  const fechaMaxima = obtenerFechaMaxima();
  const fechaInicial = searchParams.get('fecha') || hoy;

  const [socios, setSocios] = useState([]);
  const [socioId, setSocioId] = useState('');
  const [fecha, setFecha] = useState(fechaInicial);
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [duracion, setDuracion] = useState(60);

  const [pistas, setPistas] = useState([]);
  const [pistaId, setPistaId] = useState('');

  const [mesVisible, setMesVisible] = useState(fechaInicial.slice(0, 7));
  const [reservasCalendario, setReservasCalendario] = useState([]);

  const [consultando, setConsultando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    cargarSocios();
  }, []);

  useEffect(() => {
    cargarCalendario(mesVisible);
  }, [mesVisible]);

  async function cargarSocios() {
    try {
      const respuesta = await sociosService.listar();
      const contenido = respuesta.data;

      const lista = Array.isArray(contenido)
        ? contenido
        : contenido?.data || [];

      setSocios(lista.filter((socio) => socio.activo));
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: obtenerMensajeError(error),
      });
    }
  }

  async function cargarCalendario(mes) {
    try {
      const respuesta = await reservasService.obtenerCalendario(mes);
      setReservasCalendario(respuesta.data);
    } catch (error) {
      setReservasCalendario([]);
    }
  }

  async function validarDisponibilidad() {
    if (!fecha || !horaInicio) {
      setMensaje({
        tipo: 'error',
        texto: 'Seleccione una fecha y un horario.',
      });
      return;
    }

    setConsultando(true);
    setMensaje(null);
    setPistaId('');

    try {
      const respuesta = await reservasService.consultarDisponibilidad({
        fecha,
        hora_inicio: horaInicio,
        duracion_minutos: Number(duracion),
      });

      setPistas(respuesta.data.pistas);

      const disponibles = respuesta.data.pistas.filter(
        (pista) => pista.disponible
      ).length;

      setMensaje({
        tipo: disponibles > 0 ? 'exito' : 'error',
        texto:
          disponibles > 0
            ? `Se encontraron ${disponibles} pista(s) disponible(s).`
            : 'No existen pistas disponibles para el horario seleccionado.',
      });
    } catch (error) {
      setPistas([]);
      setMensaje({
        tipo: 'error',
        texto: obtenerMensajeError(error),
      });
    } finally {
      setConsultando(false);
    }
  }

  async function confirmarReserva() {
    if (!socioId) {
      setMensaje({
        tipo: 'error',
        texto: 'Seleccione el socio que realizará la reserva.',
      });
      return;
    }

    if (!pistaId) {
      setMensaje({
        tipo: 'error',
        texto: 'Seleccione una pista disponible.',
      });
      return;
    }

    setGuardando(true);
    setMensaje(null);

    try {
      const respuesta = await reservasService.crear({
        socio_id: Number(socioId),
        pista_id: Number(pistaId),
        fecha,
        hora_inicio: horaInicio,
        duracion_minutos: Number(duracion),
      });

      setMensaje({
        tipo: 'exito',
        texto: respuesta.data.mensaje,
      });

      setPistaId('');

      const disponibilidadActualizada =
        await reservasService.consultarDisponibilidad({
          fecha,
          hora_inicio: horaInicio,
          duracion_minutos: Number(duracion),
        });

      setPistas(disponibilidadActualizada.data.pistas);
      await cargarCalendario(fecha.slice(0, 7));
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: obtenerMensajeError(error),
      });
    } finally {
      setGuardando(false);
    }
  }

  function seleccionarFecha(nuevaFecha) {
    setFecha(nuevaFecha);
    setMesVisible(nuevaFecha.slice(0, 7));
    setPistas([]);
    setPistaId('');
    setMensaje(null);
  }

  const pistaSeleccionada = pistas.find(
    (pista) => pista.id === Number(pistaId)
  );

  const socioSeleccionado = socios.find(
    (socio) => socio.id === Number(socioId)
  );

  const diasCalendario = useMemo(
    () => construirDiasDelMes(mesVisible),
    [mesVisible]
  );

  const reservasPorFecha = useMemo(() => {
    return reservasCalendario.reduce((acumulador, reserva) => {
      const clave = reserva.fecha.slice(0, 10);

      if (!acumulador[clave]) {
        acumulador[clave] = [];
      }

      acumulador[clave].push(reserva);
      return acumulador;
    }, {});
  }, [reservasCalendario]);

  const [anioVisible, mesNumeroVisible] = mesVisible.split('-').map(Number);

  const nombreMes = new Intl.DateTimeFormat('es-BO', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(anioVisible, mesNumeroVisible - 1, 1));

  return (
    <AdminLayout>
      <main className="nueva-reserva-page">
        <header className="reserva-header">
          <div>
            <p className="reserva-etiqueta">Sprint 2</p>
            <h1>Nueva reserva</h1>
            <p>Seleccione la fecha, horario, socio y pista.</p>
          </div>

          <div className="reserva-pasos">
            <span className="activo">1 Fecha</span>
            <span>2 Pista</span>
            <span>3 Confirmación</span>
          </div>
        </header>

        {mensaje && (
          <div className={`reserva-mensaje ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <section className="reserva-superior">
          <article className="reserva-card">
            <h2>Seleccionar fecha</h2>

            <input
              className="reserva-input"
              type="date"
              min={hoy}
              max={fechaMaxima}
              value={fecha}
              onChange={(evento) => seleccionarFecha(evento.target.value)}
            />

            <div className="calendario">
              <h3>{nombreMes}</h3>

              <div className="calendario-semana">
                {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map((dia) => (
                  <span key={dia}>{dia}</span>
                ))}
              </div>

              <div className="calendario-dias">
                {diasCalendario.map((dia, indice) => {
                  if (!dia) {
                    return <span key={`vacio-${indice}`} />;
                  }

                  const fechaDia = `${anioVisible}-${String(
                    mesNumeroVisible
                  ).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

                  const cantidadReservas =
                    reservasPorFecha[fechaDia]?.length || 0;

                  const habilitada =
                    fechaDia >= hoy && fechaDia <= fechaMaxima;

                  return (
                    <button
                      key={fechaDia}
                      type="button"
                      disabled={!habilitada}
                      className={[
                        fecha === fechaDia ? 'seleccionado' : '',
                        cantidadReservas > 0 ? 'con-reservas' : '',
                      ].join(' ')}
                      onClick={() => seleccionarFecha(fechaDia)}
                    >
                      <span>{dia}</span>

                      {cantidadReservas > 0 && (
                        <small>{cantidadReservas}</small>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </article>

          <article className="reserva-card">
            <h2>Horario y socio</h2>

            <label className="reserva-label">
              Socio
              <select
                className="reserva-input"
                value={socioId}
                onChange={(evento) => setSocioId(evento.target.value)}
              >
                <option value="">Seleccione un socio</option>

                {socios.map((socio) => (
                  <option key={socio.id} value={socio.id}>
                    {socio.codigo} — {socio.nombre} {socio.apellidos}
                  </option>
                ))}
              </select>
            </label>

            <div className="reserva-dos-columnas">
              <label className="reserva-label">
                Hora de inicio
                <input
                  className="reserva-input"
                  type="time"
                  value={horaInicio}
                  onChange={(evento) => {
                    setHoraInicio(evento.target.value);
                    setPistas([]);
                    setPistaId('');
                  }}
                />
              </label>

              <label className="reserva-label">
                Duración
                <select
                  className="reserva-input"
                  value={duracion}
                  onChange={(evento) => {
                    setDuracion(Number(evento.target.value));
                    setPistas([]);
                    setPistaId('');
                  }}
                >
                  <option value={60}>60 minutos</option>
                  <option value={90}>90 minutos</option>
                  <option value={120}>120 minutos</option>
                </select>
              </label>
            </div>

            <button
              className="btn-validar"
              type="button"
              onClick={validarDisponibilidad}
              disabled={consultando}
            >
              {consultando
                ? 'Consultando disponibilidad...'
                : 'Validar disponibilidad'}
            </button>
          </article>

          <article className="reserva-card resumen-card">
            <h2>Resumen de reserva</h2>

            <dl>
              <div>
                <dt>Fecha</dt>
                <dd>{fecha}</dd>
              </div>

              <div>
                <dt>Horario</dt>
                <dd>
                  {horaInicio} — {duracion} minutos
                </dd>
              </div>

              <div>
                <dt>Socio</dt>
                <dd>
                  {socioSeleccionado
                    ? `${socioSeleccionado.nombre} ${socioSeleccionado.apellidos}`
                    : 'Sin seleccionar'}
                </dd>
              </div>

              <div>
                <dt>Pista</dt>
                <dd>
                  {pistaSeleccionada
                    ? pistaSeleccionada.nombre
                    : 'Sin seleccionar'}
                </dd>
              </div>
            </dl>

            <button
              className="btn-confirmar"
              type="button"
              disabled={!pistaId || !socioId || guardando}
              onClick={confirmarReserva}
            >
              {guardando ? 'Registrando...' : 'Confirmar reserva'}
            </button>
          </article>
        </section>

        <section className="reserva-card pistas-section">
          <div className="pistas-cabecera">
            <h2>Pistas disponibles</h2>

            <div className="pistas-leyenda">
              <span><i className="libre" /> Libre</span>
              <span><i className="no-disponible" /> No disponible</span>
              <span><i className="elegida" /> Seleccionada</span>
            </div>
          </div>

          {pistas.length === 0 ? (
            <p className="estado-vacio">
              Seleccione fecha y horario, y luego valide la disponibilidad.
            </p>
          ) : (
            <div className="pistas-grid">
              {pistas.map((pista) => {
                const seleccionada = pista.id === Number(pistaId);

                return (
                  <button
                    key={pista.id}
                    type="button"
                    disabled={!pista.disponible}
                    onClick={() => setPistaId(String(pista.id))}
                    className={[
                      'pista-option',
                      !pista.disponible ? 'ocupada' : '',
                      seleccionada ? 'seleccionada' : '',
                    ].join(' ')}
                  >
                    <strong>{pista.nombre}</strong>
                    <span>Pista número {pista.numero}</span>

                    <small>
                      {pista.disponible
                        ? seleccionada
                          ? 'Seleccionada'
                          : 'Disponible'
                        : 'Reservada en este horario'}
                    </small>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </AdminLayout>
  );
}

export default NuevaReserva;