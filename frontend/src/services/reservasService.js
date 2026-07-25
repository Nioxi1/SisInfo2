import client from '../api/client';

export const reservasService = {
  validarLimite: (fecha) =>
    client.post('/reservas/validar-limite', { fecha }),

  consultarDisponibilidad: ({ fecha, hora_inicio, duracion_minutos }) =>
    client.get('/reservas/disponibilidad', {
      params: {
        fecha,
        hora_inicio,
        duracion_minutos,
      },
    }),

  crear: (datos) =>
    client.post('/reservas', datos),

  obtenerCalendario: (mes) =>
    client.get('/reservas/calendario', {
      params: { mes },
    }),

  // NUEVO — HU5 "Control de ocupación"
  listarPorFecha: (fecha = '', busqueda = '') =>
    client.get('/reservas', {
      params: { ...(fecha && { fecha }), ...(busqueda && { busqueda }) },
    }),

  // NUEVO — HU5 "Control de ocupación"
  registrarOcupacion: (id) =>
    client.patch(`/reservas/${id}/ocupar`),
};