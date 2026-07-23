import { useCallback, useEffect, useState } from 'react';
import Alert from './components/Alert';
import ConfirmDialog from './components/ConfirmDialog';
import SocioForm from './components/SocioForm';
import SocioList from './components/SocioList';
import { sociosService } from './services/sociosService';
import './App.css';

function SociosPage() {
  const [socios, setSocios] = useState([]);
  const [selectedSocio, setSelectedSocio] = useState(null);
  const [editingSocio, setEditingSocio] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const cargarSocios = useCallback(async (termino = '') => {
    setLoading(true);
    try {
      const { data } = await sociosService.listar(termino);
      setSocios(data.data);
    } catch {
      setAlert({ type: 'error', message: 'Error al cargar los socios.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarSocios();
  }, [cargarSocios]);

  const handleBuscar = (e) => {
    e.preventDefault();
    cargarSocios(busqueda);
  };

  const handleSubmit = async (formData, setErrors) => {
    setSubmitting(true);
    try {
      if (editingSocio) {
        const { data } = await sociosService.actualizar(editingSocio.id, formData);
        setAlert({ type: 'success', message: data.message });
      } else {
        const { data } = await sociosService.crear(formData);
        setAlert({ type: 'success', message: data.message });
      }
      setShowForm(false);
      setEditingSocio(null);
      cargarSocios(busqueda);
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        setAlert({ type: 'error', message: 'Error al guardar el socio.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      const { data } = await sociosService.eliminar(deleteTarget.id);
      setAlert({ type: 'success', message: data.message });
      if (selectedSocio?.id === deleteTarget.id) {
        setSelectedSocio(null);
      }
      setDeleteTarget(null);
      cargarSocios(busqueda);
    } catch {
      setAlert({ type: 'error', message: 'Error al eliminar el socio.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Club de Tenis</h1>
          <p>Gestión de socios — Sprint 1</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditingSocio(null);
            setShowForm(true);
          }}
        >
          + Nuevo Socio
        </button>
      </header>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <section className="panel">
        <form className="search-bar" onSubmit={handleBuscar}>
          <input
            type="text"
            placeholder="Buscar por código o nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">
            Buscar
          </button>
        </form>

        <SocioList
          socios={socios}
          selectedSocio={selectedSocio}
          onSelect={setSelectedSocio}
          onEdit={(socio) => {
            setEditingSocio(socio);
            setShowForm(true);
          }}
          onDelete={setDeleteTarget}
          loading={loading}
        />

        {selectedSocio && !showForm && (
          <div className="socio-detail">
            <h3>Detalle del socio seleccionado</h3>
            <dl>
              <dt>Código</dt>
              <dd>{selectedSocio.codigo}</dd>
              <dt>DNI</dt>
              <dd>{selectedSocio.dni}</dd>
              <dt>Nombre completo</dt>
              <dd>
                {selectedSocio.nombre} {selectedSocio.apellidos}
              </dd>
              <dt>Email</dt>
              <dd>{selectedSocio.email}</dd>
              <dt>Teléfono</dt>
              <dd>{selectedSocio.telefono || '—'}</dd>
              <dt>Fecha de alta</dt>
              <dd>{selectedSocio.fecha_alta?.split('T')[0]}</dd>
            </dl>
          </div>
        )}
      </section>

      {showForm && (
        <section className="panel">
          <SocioForm
            socio={editingSocio}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingSocio(null);
            }}
            loading={submitting}
          />
        </section>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar socio"
        message={`¿Está seguro de eliminar al socio ${deleteTarget?.nombre} ${deleteTarget?.apellidos}? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={submitting}
      />
    </div>
  );
}

export default function App() {
  return <SociosPage />;
}
