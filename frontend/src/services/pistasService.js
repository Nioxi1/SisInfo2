import client from '../api/client';

export const pistasService = {
  listar: (busqueda = '') =>
    client.get('/pistas', { params: busqueda ? { busqueda } : {} }),

  obtener: (id) => client.get(`/pistas/${id}`),

  crear: (datos) => client.post('/pistas', datos),

  actualizar: (id, datos) => client.put(`/pistas/${id}`, datos),

  eliminar: (id) => client.delete(`/pistas/${id}`),
};