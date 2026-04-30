import { useState, useEffect, useCallback } from 'react';
import { getInvoices, getStats, getInvoice, getNextNumber } from '../utils/api';

export const useInvoices = (params = {}) => {
  const [data, setData]       = useState({ invoices: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    getInvoices(params)
      .then((r) => setData(r.data.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
};

export const useStats = () => {
  const [stats, setStats]     = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getStats()
      .then((r) => {
        setStats(r.data.data.summary);
        setMonthly(r.data.data.monthly || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { stats, monthly, loading, error };
};

export const useInvoice = (id) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getInvoice(id)
      .then((r) => setInvoice(r.data.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { invoice, setInvoice, loading, error };
};

export const useNextNumber = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  useEffect(() => {
    getNextNumber().then((r) => setInvoiceNumber(r.data.data.invoice_number));
  }, []);
  return invoiceNumber;
};
