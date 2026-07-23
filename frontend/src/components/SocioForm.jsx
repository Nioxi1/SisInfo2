import { useEffect, useState } from 'react';

const initialForm = {
  codigo: '',
  nombre: '',
  apellidos: '',
  email: '',
  telefono: '',
  dni: '',
  fecha_alta: new Date().toISOString().split('T')[0],
};

export default function SocioForm({ socio, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(socio ? { ...socio } : initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (socio) {
      setForm({
        ...socio,
        fecha_alta: socio.fecha_alta?.split('T')[0] || socio.fecha_alta,
      });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [socio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form, setErrors);
  };

  return (
    <form className="socio-form" onSubmit={handleSubmit}>
      <h2>{socio ? 'Editar Socio' : 'Registrar Nuevo Socio'}</h2>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="codigo">Código *</label>
          <input
            id="codigo"
            name="codigo"
            value={form.codigo}
            onChange={handleChange}
            placeholder="Ej: SOC001"
            required
          />
          {errors.codigo && <span className="error">{errors.codigo[0]}</span>}
        </div>

        <div className="field">
          <label htmlFor="dni">DNI *</label>
          <input
            id="dni"
            name="dni"
            value={form.dni}
            onChange={handleChange}
            placeholder="12345678A"
            required
          />
          {errors.dni && <span className="error">{errors.dni[0]}</span>}
        </div>

        <div className="field">
          <label htmlFor="nombre">Nombre *</label>
          <input
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          {errors.nombre && <span className="error">{errors.nombre[0]}</span>}
        </div>

        <div className="field">
          <label htmlFor="apellidos">Apellidos *</label>
          <input
            id="apellidos"
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            required
          />
          {errors.apellidos && <span className="error">{errors.apellidos[0]}</span>}
        </div>

        <div className="field">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error">{errors.email[0]}</span>}
        </div>

        <div className="field">
          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            name="telefono"
            value={form.telefono || ''}
            onChange={handleChange}
            placeholder="Opcional"
          />
          {errors.telefono && <span className="error">{errors.telefono[0]}</span>}
        </div>

        <div className="field">
          <label htmlFor="fecha_alta">Fecha de alta *</label>
          <input
            id="fecha_alta"
            name="fecha_alta"
            type="date"
            value={form.fecha_alta}
            onChange={handleChange}
            required
          />
          {errors.fecha_alta && <span className="error">{errors.fecha_alta[0]}</span>}
        </div>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : socio ? 'Actualizar Socio' : 'Registrar Socio'}
        </button>
      </div>
    </form>
  );
}
