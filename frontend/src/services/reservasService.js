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
};