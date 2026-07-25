import client from '../api/client';

export const facturacionService = {
  preview: (params) => client.get('/facturacion/preview', { params }),

  generar: (datos) => client.post('/facturacion/generar', datos),

  mostrar: (id) => client.get(`/facturas/${id}`),

  emitir: (id) => client.post(`/facturas/${id}/emitir`),
};