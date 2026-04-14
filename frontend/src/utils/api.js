import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getInvoices = () => api.get('/invoices');
export const getInvoice = (id) => api.get(`/invoices/${id}`);
export const getNextNumber = () => api.get('/invoices/meta/next-number');
export const getStats = () => api.get('/invoices/meta/stats');
export const createInvoice = (data) => api.post('/invoices', data);
export const updateStatus = (id, status) => api.patch(`/invoices/${id}/status`, { status });
export const deleteInvoice = (id) => api.delete(`/invoices/${id}`);

export default api;
