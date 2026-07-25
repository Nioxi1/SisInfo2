import client from '../api/client';

export const inasistenciasService = {
  pendientes: () => client.get('/inasistencias/pendientes'),

  evaluacion: (reservaId) =>
    client.get(`/inasistencias/reserva/${reservaId}/evaluacion`),

  registrar: (reservaId, datos) =>
    client.post(`/inasistencias/reserva/${reservaId}`, datos),

  historial: (socioId) =>
    client.get(`/inasistencias/socio/${socioId}`),
};