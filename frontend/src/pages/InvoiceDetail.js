import React, { useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import {
  Box, Card, CardContent, Button, Select, MenuItem,
  Typography, Chip, Grid, Divider, Alert, Stack,
  Breadcrumbs,
} from '@mui/material';
import PrintIcon  from '@mui/icons-material/Print';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { LoadingScreen, ConfirmDialog, StatusChip } from '../components/common';
import { PrintableInvoice }                         from '../components/invoice';
import { useInvoice }                               from '../hooks/useInvoices';
import { updateStatus, deleteInvoice }              from '../utils/api';
import { fmtCurrency, fmtDate }                    from '../utils/helpers';

export default function InvoiceDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const printRef  = useRef();
  const [showDelete, setShowDelete] = React.useState(false);
  const [actionError, setActionError] = React.useState('');

  const { invoice, setInvoice, loading, error } = useInvoice(id);

  const handlePrint = useReactToPrint({ content: () => printRef.current });

  const handleStatusChange = async (status) => {
    try {
      await updateStatus(id, status);
      setInvoice((inv) => ({ ...inv, status }));
    } catch (e) { setActionError(e.message); }
  };

  const handleDelete = async () => {
    try {
      await deleteInvoice(id);
      navigate('/invoices');
    } catch (e) { setActionError(e.message); setShowDelete(false); }
  };

  if (loading) return <LoadingScreen message="Loading invoice..." />;
  if (error)   return <Alert severity="error">{error}</Alert>;
  if (!invoice) return null;

  return (
    <Box>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 1.5 }}>
        <Link to="/invoices" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 13 }}>Invoices</Link>
        <Typography sx={{ fontSize: 13, color: 'text.primary' }}>{invoice.invoiceNumber}</Typography>
      </Breadcrumbs>

      {/* Toolbar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              startIcon={<ArrowBackIcon />} variant="outlined" size="small"
              onClick={() => navigate('/invoices')}
            >
              Back
            </Button>
            <Typography variant="h2" sx={{ fontWeight: 700 }}>{invoice.invoiceNumber}</Typography>
            <StatusChip status={invoice.status} />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, ml: '110px' }}>
            {invoice.client?.name} · {invoice.eventType} · {fmtDate(invoice.invoiceDate)}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Select
            value={invoice.status} size="small"
            onChange={(e) => handleStatusChange(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="unpaid">Unpaid</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="partial">Partial</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
          <Button variant="outlined" startIcon={<EditIcon />} component={Link} to={`/invoices/${id}/edit`}>
            Edit
          </Button>
          <Button variant="contained" color="primary" startIcon={<PrintIcon />} onClick={handlePrint}>
            Print
          </Button>
          <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setShowDelete(true)}>
            Delete
          </Button>
        </Stack>
      </Box>

      {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        {[
          { label: 'Subtotal',   value: fmtCurrency(invoice.subtotal) },
          { label: `Discount (${invoice.discountPercent}%)`, value: `− ${fmtCurrency(invoice.discountAmount)}` },
          { label: `Tax / GST (${invoice.taxPercent}%)`,    value: `+ ${fmtCurrency(invoice.taxAmount)}` },
          { label: 'Grand Total', value: fmtCurrency(invoice.grandTotal), highlight: true },
        ].map((s) => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Card sx={s.highlight ? { border: '1.5px solid', borderColor: 'primary.main' } : {}}>
              <CardContent sx={{ py: '14px !important', px: '16px !important' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {s.label}
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.5, color: s.highlight ? 'primary.main' : 'text.primary' }}>
                  {s.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Printable Invoice Preview */}
      <Card>
        <CardContent>
          <div ref={printRef}>
            <PrintableInvoice invoice={invoice} />
          </div>
        </CardContent>
      </Card>

      {invoice.notes && (
        <Card sx={{ mt: 2, background: '#fffbeb', border: '1px solid #fde68a' }}>
          <CardContent>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>Notes</Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: '#78350f' }}>{invoice.notes}</Typography>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={showDelete}
        title="Delete Invoice"
        message={`Permanently delete invoice ${invoice.invoiceNumber}? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </Box>
  );
}
