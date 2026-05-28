import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Alert, Stack } from '@mui/material';
import SaveIcon   from '@mui/icons-material/Save';
import ClearIcon  from '@mui/icons-material/Clear';

import { PageHeader }        from '../components/common';
import InvoiceForm           from './InvoiceForm';
import { createInvoice }     from '../utils/api';
import { calcTotals }        from '../utils/helpers';
import { useNextNumber }     from '../hooks/useInvoices';

const BLANK_FORM = {
  invoice_number: '',
  invoice_date:   new Date().toISOString().split('T')[0],
  event_date:     '',
  client_name:    '',
  client_phone:   '',
  client_address: '',
  event_type:     'Wedding',
  discount_percent: 0,
  tax_percent:    0,
  notes:          '',
  status:         'unpaid',
};

const NEW_ITEM = () => ({ _id: Date.now(), category: 'Props', description: '', quantity: 1, rate: 0 });

export default function NewInvoice() {
  const navigate      = useNavigate();
  const nextNumber    = useNextNumber();
  const [form, setForm]   = useState({ ...BLANK_FORM });
  const [items, setItems] = useState([NEW_ITEM()]);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  // Auto-fill invoice number once loaded
  React.useEffect(() => {
    if (nextNumber) setForm((f) => ({ ...f, invoice_number: nextNumber }));
  }, [nextNumber]);

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
        items: items.map(({ _id, ...i }) => ({
          ...i,
          quantity: parseFloat(i.quantity) || 0,
          rate:     parseFloat(i.rate)     || 0,
          amount:   (parseFloat(i.quantity) || 0) * (parseFloat(i.rate) || 0),
        })),
      };
      const res = await createInvoice(payload);
      navigate(`/invoices/${res.data.data.id}`);
    } catch (e) {
      const msg = e.errors ? e.errors.map((er) => er.message).join(', ') : e.message;
      setError(msg || 'Failed to save invoice.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <PageHeader title="New Invoice" subtitle="Fill in the details to create an invoice" />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <InvoiceForm form={form} setField={setField} items={items} setItems={setItems} />

      <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 2.5 }}>
        <Button variant="outlined" startIcon={<ClearIcon />} onClick={() => navigate('/invoices')}>
          Cancel
        </Button>
        <Button
          variant="contained" color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Invoice'}
        </Button>
      </Stack>
    </Box>
  );
}
