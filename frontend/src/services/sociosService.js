import client from '../api/client';

export const sociosService = {
  listar: (busqueda = '') =>
    client.get('/socios', { params: busqueda ? { busqueda } : {} }),

  obtener: (id) => client.get(`/socios/${id}`),

  crear: (datos) => client.post('/socios', datos),

  actualizar: (id, datos) => client.put(`/socios/${id}`, datos),

  eliminar: (id) => client.delete(`/socios/${id}`),
};
