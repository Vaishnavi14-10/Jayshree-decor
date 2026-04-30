import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong';
    const enhanced = new Error(message);
    enhanced.status  = error.response?.status;
    enhanced.errors  = error.response?.data?.errors;
    return Promise.reject(enhanced);
  }
);

// Invoices
export const getInvoices   = (params = {})   => api.get('/invoices', { params });
export const getInvoice    = (id)             => api.get(`/invoices/${id}`);
export const getNextNumber = ()               => api.get('/invoices/meta/next-number');
export const getStats      = ()               => api.get('/invoices/meta/stats');
export const createInvoice = (data)           => api.post('/invoices', data);
export const updateInvoice = (id, data)       => api.put(`/invoices/${id}`, data);
export const updateStatus  = (id, status)     => api.patch(`/invoices/${id}/status`, { status });
export const deleteInvoice = (id)             => api.delete(`/invoices/${id}`);

// Clients
export const getClients = (search = '') => api.get('/clients', { params: { search } });

export default api;
