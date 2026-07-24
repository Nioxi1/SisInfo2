import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { pistasService } from '../../services/pistasService';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import './GestionPistas.css';

const ESTADOS = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'reservada', label: 'Reservada' },
  { value: 'mantenimiento', label: 'En mantenimiento' },
];

export default function FormPista() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = Boolean(id);

  const [form, setForm] = useState({
    numero: '',
    nombre: '',
    superficie: 'Arcilla',
    iluminacion: true,
    precio_hora: '',
    estado: 'disponible',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!esEdicion) return;

    const cargarPista = async () => {
      try {
        const res = await pistasService.obtener(id);
        const p = res.data.data;
        setForm({
          numero: p.numero,
          nombre: p.nombre,
          superficie: p.superficie,
          iluminacion: p.iluminacion,
          precio_hora: p.precio_hora,
          estado: p.estado,
        });
      } catch (err) {
        console.error('Error al obtener la pista:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarPista();
  }, [id, esEdicion]);

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGuardando(true);

    try {
      if (esEdicion) {
        await pistasService.actualizar(id, form);
      } else {
        await pistasService.crear(form);
      }
      navigate('/pistas');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        console.error('Error al guardar la pista:', err);
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <AdminLayout activeTab="pistas" sidebarBottomType="profile">
      <div className="form-pista-container">
        <button className="btn-back-link" onClick={() => navigate('/pistas')}>
          <ArrowLeft size={16} />
          <span>Volver a Pistas</span>
        </button>

        <h1 className="page-main-title">{esEdicion ? 'Editar Pista' : 'Crear Nueva Pista'}</h1>
        <p className="page-sub-title">
          {esEdicion
            ? 'Modifica los datos de la pista seleccionada.'
            : 'Registra una nueva pista de tenis en el sistema.'}
        </p>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
            <Loader2 size={24} className="spinner-icon" />
            <p>Cargando datos de la pista...</p>
          </div>
        ) : (
          <form className="pista-form-card" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label>Número de pista</label>
                <input
                  type="number"
                  min="1"
                  value={form.numero}
                  onChange={(e) => handleChange('numero', e.target.value)}
                />
                {errors.numero && <span className="field-error">{errors.numero[0]}</span>}
              </div>

              <div className="form-field">
                <label>Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Ej: Pista Central"
                />
                {errors.nombre && <span className="field-error">{errors.nombre[0]}</span>}
              </div>

              <div className="form-field">
                <label>Superficie</label>
                <select
                  value={form.superficie}
                  onChange={(e) => handleChange('superficie', e.target.value)}
                >
                  <option value="Arcilla">Arcilla</option>
                  <option value="Dura">Dura</option>
                </select>
              </div>

              <div className="form-field">
                <label>Precio por hora (Bs.)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.precio_hora}
                  onChange={(e) => handleChange('precio_hora', e.target.value)}
                />
                {errors.precio_hora && <span className="field-error">{errors.precio_hora[0]}</span>}
              </div>

              <div className="form-field">
                <label>Estado de disponibilidad</label>
                <select
                  value={form.estado}
                  onChange={(e) => handleChange('estado', e.target.value)}
                >
                  {ESTADOS.map((op) => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-field form-field-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={form.iluminacion}
                    onChange={(e) => handleChange('iluminacion', e.target.checked)}
                  />
                  <span>Cuenta con iluminación</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate('/pistas')}>
                Cancelar
              </button>
              <button type="submit" className="btn-green-primary" disabled={guardando}>
                <Save size={18} strokeWidth={2.5} />
                <span>{guardando ? 'Guardando...' : 'Guardar Pista'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}