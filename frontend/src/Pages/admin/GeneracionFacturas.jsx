import { useEffect, useState } from 'react';
import { CheckCircle, FileText, Printer } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import client from '../../api/client';
import { facturacionService } from '../../services/facturacionService';
import './GeneracionFacturas.css';

export default function GeneracionFacturas() {
  const fechaActual = new Date();

  const [socios, setSocios] = useState([]);
  const [socioId, setSocioId] = useState('');
  const [anio, setAnio] = useState(fechaActual.getFullYear());
  const [mes, setMes] = useState(fechaActual.getMonth() + 1);
  const [detalle, setDetalle] = useState(null);
  const [factura, setFactura] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    client
      .get('/socios')
      .then((response) => {
        const datos = Array.isArray(response.data)
          ? response.data
          : response.data.data ?? [];

        setSocios(datos);
      })
      .catch(() => setError('No fue posible cargar los socios.'));
  }, []);

  const parametros = {
    socio_id: socioId,
    anio: Number(anio),
    mes: Number(mes),
  };

  const calcular = async () => {
    if (!socioId) {
      setError('Seleccione un socio.');
      return;
    }

    try {
      setCargando(true);
      setError('');
      setMensaje('');
      setFactura(null);

      const response = await facturacionService.preview(parametros);
      setDetalle(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          Object.values(err.response?.data?.errors ?? {})?.[0]?.[0] ||
          'No fue posible calcular la factura.'
      );
    } finally {
      setCargando(false);
    }
  };

  const generar = async () => {
    try {
      setCargando(true);
      setError('');

      const response = await facturacionService.generar(parametros);

      setFactura(response.data.factura);
      setDetalle(response.data.detalle);
      setMensaje(response.data.message);
    } catch (err) {
      if (err.response?.status === 409 && err.response.data.factura) {
        setFactura(err.response.data.factura);
      }

      setError(
        err.response?.data?.message ||
          'No fue posible generar la factura.'
      );
    } finally {
      setCargando(false);
    }
  };

  const emitir = async () => {
    if (!factura?.id) return;

    try {
      setCargando(true);
      setError('');

      const response = await facturacionService.emitir(factura.id);

      setFactura(response.data.factura);
      setMensaje(response.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'No fue posible emitir la factura.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <AdminLayout activeTab="pagos">
      <main className="facturacion-page">
        <header className="facturacion-header">
          <h1>Generación de Factura</h1>
          <p>Calcule y emita la factura mensual de cada socio.</p>
        </header>

        {mensaje && (
          <div className="facturacion-success">
            <CheckCircle size={20} />
            {mensaje}
          </div>
        )}

        {error && <div className="facturacion-error">{error}</div>}

        <section className="facturacion-filtros">
          <label>
            Socio
            <select
              value={socioId}
              onChange={(event) => setSocioId(event.target.value)}
            >
              <option value="">Seleccione un socio</option>

              {socios.map((socio) => (
                <option key={socio.id} value={socio.id}>
                  {socio.codigo} - {socio.nombre} {socio.apellidos}
                </option>
              ))}
            </select>
          </label>

          <label>
            Mes
            <select
              value={mes}
              onChange={(event) => setMes(event.target.value)}
            >
              {[
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre',
              ].map((nombre, index) => (
                <option key={nombre} value={index + 1}>
                  {nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Año
            <input
              type="number"
              value={anio}
              onChange={(event) => setAnio(event.target.value)}
            />
          </label>

          <button type="button" onClick={calcular} disabled={cargando}>
            Calcular factura
          </button>
        </section>

        {detalle && (
          <section className="factura-card">
            <header className="factura-card-header">
              <div>
                <h2>Factura Mensual</h2>
                <p>
                  Período: {String(detalle.mes).padStart(2, '0')}/
                  {detalle.anio}
                </p>
              </div>

              <div>
                <strong>
                  {detalle.socio.nombre} {detalle.socio.apellidos}
                </strong>
                <span>{detalle.socio.codigo}</span>
              </div>
            </header>

            <div className="factura-detalle">
              <div>
                <span>Importe por horas utilizadas</span>
                <strong>
                  Bs {Number(detalle.importe_reservas).toFixed(2)}
                </strong>
              </div>

              <div>
                <span>Cargos por reservas canceladas</span>
                <strong>
                  Bs {Number(detalle.importe_cancelaciones).toFixed(2)}
                </strong>
              </div>

              <div>
                <span>Multas por inasistencias</span>
                <strong>
                  Bs {Number(detalle.importe_multas).toFixed(2)}
                </strong>
              </div>
            </div>

            <div className="factura-total">
              <span>Monto total</span>
              <strong>
                Bs {Number(detalle.importe_total).toFixed(2)}
              </strong>
            </div>

            <footer className="factura-actions">
              <button
                type="button"
                className="btn-borrador"
                onClick={() => window.print()}
              >
                <Printer size={18} />
                Imprimir borrador
              </button>

              {!factura ? (
                <button
                  type="button"
                  className="btn-emitir"
                  onClick={generar}
                  disabled={cargando}
                >
                  <FileText size={18} />
                  Generar factura
                </button>
              ) : factura.estado === 'pendiente' ? (
                <button
                  type="button"
                  className="btn-emitir"
                  onClick={emitir}
                  disabled={cargando}
                >
                  <FileText size={18} />
                  Emitir factura
                </button>
              ) : (
                <span className="factura-emitida">
                  Factura emitida
                </span>
              )}
            </footer>
          </section>
        )}
      </main>
    </AdminLayout>
  );
}