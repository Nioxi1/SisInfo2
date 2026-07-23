export default function SocioList({
  socios,
  selectedSocio,
  onSelect,
  onEdit,
  onDelete,
  loading,
}) {
  if (loading) {
    return <p className="loading">Cargando socios...</p>;
  }

  if (socios.length === 0) {
    return <p className="empty">No se encontraron socios.</p>;
  }

  return (
    <div className="socio-list">
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Fecha alta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {socios.map((socio) => (
            <tr
              key={socio.id}
              className={selectedSocio?.id === socio.id ? 'selected' : ''}
              onClick={() => onSelect(socio)}
            >
              <td>{socio.codigo}</td>
              <td>
                {socio.nombre} {socio.apellidos}
              </td>
              <td>{socio.email}</td>
              <td>{socio.telefono || '—'}</td>
              <td>{socio.fecha_alta?.split('T')[0]}</td>
              <td className="actions">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(socio);
                  }}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(socio);
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
