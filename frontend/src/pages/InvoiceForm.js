import React from 'react';
import Grid from '@mui/material/Grid2';
import {
  Card, CardContent, TextField, Select, MenuItem,
  FormControl, InputLabel, Typography, Box, Divider,
  Paper
} from '@mui/material';

import { InvoiceItemsTable, TotalsSummary } from '../components/invoice';
import { EVENT_TYPES } from '../utils/helpers';

export default function InvoiceForm({ form, setField, items, setItems }) {
  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>

      {/* ===== Invoice + Client (MERGED for better UX) ===== */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Invoice Information
        </Typography>

        <Grid container spacing={2}>
          <Grid xs={12} sm={4}>
            <TextField
              label="Invoice Number"
              fullWidth
              value={form.invoice_number}
              onChange={(e) => setField('invoice_number', e.target.value)}
            />
          </Grid>

          <Grid xs={6} sm={4}>
            <TextField
              label="Invoice Date"
              type="date"
              fullWidth
              value={form.invoice_date}
              onChange={(e) => setField('invoice_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid xs={6} sm={4}>
            <TextField
              label="Event Date"
              type="date"
              fullWidth
              value={form.event_date}
              onChange={(e) => setField('event_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField
              label="Client Name *"
              fullWidth
              value={form.client_name}
              onChange={(e) => setField('client_name', e.target.value)}
            />
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField
              label="Phone"
              fullWidth
              value={form.client_phone}
              onChange={(e) => setField('client_phone', e.target.value)}
            />
          </Grid>

          <Grid xs={12} sm={8}>
            <TextField
              label="Address"
              fullWidth
              value={form.client_address}
              onChange={(e) => setField('client_address', e.target.value)}
            />
          </Grid>

          <Grid xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                label="Event Type"
                value={form.event_type}
                onChange={(e) => setField('event_type', e.target.value)}
              >
                {EVENT_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* ===== Items Section ===== */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Items / Services
        </Typography>

        <Box sx={{ overflowX: 'auto' }}>
          <InvoiceItemsTable items={items} onChange={setItems} />
        </Box>

        <Divider sx={{ my: 2 }} />

        <TotalsSummary
          items={items}
          discountPercent={form.discount_percent}
          taxPercent={form.tax_percent}
          onDiscountChange={(v) => setField('discount_percent', v)}
          onTaxChange={(v) => setField('tax_percent', v)}
        />
      </Paper>

      {/* ===== Notes + Status ===== */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Additional Details
        </Typography>

        <Grid container spacing={2}>
          <Grid xs={12} sm={8}>
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={3}
              value={form.notes}
              onChange={(e) => setField('notes', e.target.value)}
            />
          </Grid>

          <Grid xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={form.status}
                onChange={(e) => setField('status', e.target.value)}
              >
                <MenuItem value="unpaid">Unpaid</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="partial">Partial</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

    </Box>
  );
}