import React from 'react';
import {
  Grid, Card, CardContent, TextField, Select, MenuItem,
  FormControl, InputLabel, Typography, Box, Divider,
} from '@mui/material';
import { InvoiceItemsTable, TotalsSummary } from '../components/invoice';
import { EVENT_TYPES }                      from '../utils/helpers';

export default function InvoiceForm({ form, setField, items, setItems }) {
  return (
    <Grid container spacing={2.5}>

      {/* Invoice Details */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Invoice Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Invoice Number" fullWidth
                  value={form.invoice_number}
                  onChange={(e) => setField('invoice_number', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Invoice Date" type="date" fullWidth
                  value={form.invoice_date}
                  onChange={(e) => setField('invoice_date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Event Date" type="date" fullWidth
                  value={form.event_date}
                  onChange={(e) => setField('event_date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Client Info */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Party / Client Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Party / Client Name *" fullWidth
                  value={form.client_name}
                  onChange={(e) => setField('client_name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Contact Number" fullWidth
                  value={form.client_phone}
                  onChange={(e) => setField('client_phone', e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  label="Venue / Address" fullWidth
                  value={form.client_address}
                  onChange={(e) => setField('client_address', e.target.value)}
                  placeholder="Wedding hall or address"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Event Type</InputLabel>
                  <Select
                    label="Event Type"
                    value={form.event_type}
                    onChange={(e) => setField('event_type', e.target.value)}
                  >
                    {EVENT_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Items */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Items / Services</Typography>
            <InvoiceItemsTable items={items} onChange={setItems} />
            <Divider sx={{ my: 2 }} />
            <TotalsSummary
              items={items}
              discountPercent={form.discount_percent}
              taxPercent={form.tax_percent}
              onDiscountChange={(v) => setField('discount_percent', v)}
              onTaxChange={(v) => setField('tax_percent', v)}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Notes & Status */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Additional Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  label="Notes" fullWidth multiline rows={3}
                  value={form.notes}
                  onChange={(e) => setField('notes', e.target.value)}
                  placeholder="Advance paid, return date for props, special instructions..."
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Payment Status</InputLabel>
                  <Select
                    label="Payment Status"
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
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
}
