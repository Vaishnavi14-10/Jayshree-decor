import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Alert, Stack } from '@mui/material';
import SaveIcon  from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import { PageHeader, LoadingScreen }  from '../components/common';
import InvoiceForm                    from './InvoiceForm';
import { updateInvoice }              from '../utils/api';
import { calcTotals, fmtDateInput }   from '../utils/helpers';
import { useInvoice }                 from '../hooks/useInvoices';

let _id = 9000;

export default function EditInvoice() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { invoice, loading, error: loadError } = useInvoice(id);

  const [form, setForm]     = useState(null);
  const [items, setItems]   = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    if (!invoice) return;
    setForm({
      invoice_number:   invoice.invoiceNumber,
      invoice_date:     fmtDateInput(invoice.invoiceDate),
      event_date:       fmtDateInput(invoice.eventDate),
      client_name:      invoice.client?.name    || '',
      client_phone:     invoice.client?.phone   || '',
      client_address:   invoice.client?.address || '',
      event_type:       invoice.eventType   || 'Wedding',
      discount_percent: invoice.discountPercent || 0,
      tax_percent:      invoice.taxPercent      || 0,
      notes:            invoice.notes  || '',
      status:           invoice.status || 'unpaid',
    });
    setItems(
      (invoice.items || []).map((i) => ({
        _id:         _id++,
        category:    i.category,
        description: i.description || '',
        quantity:    i.quantity,
        rate:        i.rate,
      }))
    );
  }, [invoice]);

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.client_name.trim()) return setError('Party / client name is required.');
    if (!items.length)            return setError('Add at least one item.');
    setError('');
    setSaving(true);
    try {
      const totals = calcTotals(items, form.discount_percent, form.tax_percent);
      const payload = {
        ...form,
        ...totals,
        items: items.map(({ _id: _localId, ...i }) => ({
          ...i,
          quantity: parseFloat(i.quantity) || 0,
          rate:     parseFloat(i.rate)     || 0,
          amount:   (parseFloat(i.quantity) || 0) * (parseFloat(i.rate) || 0),
        })),
      };
      await updateInvoice(id, payload);
      navigate(`/invoices/${id}`);
    } catch (e) {
      const msg = e.errors ? e.errors.map((er) => er.message).join(', ') : e.message;
      setError(msg || 'Failed to update invoice.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen message="Loading invoice..." />;
  if (loadError) return <Alert severity="error">{loadError}</Alert>;
  if (!form)    return null;

  return (
    <Box>
      <PageHeader title="Edit Invoice" subtitle={form.invoice_number} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <InvoiceForm form={form} setField={setField} items={items} setItems={setItems} />

      <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 2.5 }}>
        <Button variant="outlined" startIcon={<CloseIcon />} onClick={() => navigate(`/invoices/${id}`)}>
          Cancel
        </Button>
        <Button
          variant="contained" color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Update Invoice'}
        </Button>
      </Stack>
    </Box>
  );
}
