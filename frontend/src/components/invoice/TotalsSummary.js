import React from 'react';
import { Box, Grid, TextField, Divider, Typography } from '@mui/material';
import { fmtCurrency, calcTotals } from '../../utils/helpers';

export default function TotalsSummary({ items, discountPercent, taxPercent, onDiscountChange, onTaxChange }) {
  const { subtotal, discountAmount, taxAmount, grandTotal } = calcTotals(items, discountPercent, taxPercent);

  const Row = ({ label, value, bold }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.6 }}>
      <Typography variant="body2" color={bold ? 'text.primary' : 'text.secondary'} sx={{ fontWeight: bold ? 700 : 400 }}>{label}</Typography>
      <Typography variant="body2" color={bold ? 'text.primary' : 'text.secondary'} sx={{ fontWeight: bold ? 700 : 400 }}>{value}</Typography>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
      <Box sx={{ minWidth: 320 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="Discount (%)" type="number" size="small" fullWidth
              value={discountPercent} onChange={(e) => onDiscountChange(e.target.value)}
              inputProps={{ min: 0, max: 100, step: 0.5 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Tax / GST (%)" type="number" size="small" fullWidth
              value={taxPercent} onChange={(e) => onTaxChange(e.target.value)}
              inputProps={{ min: 0, step: 0.5 }}
            />
          </Grid>
        </Grid>

        <Box sx={{ background: '#f9fafb', borderRadius: 2, p: 2, border: '1px solid', borderColor: 'divider' }}>
          <Row label="Subtotal"                         value={fmtCurrency(subtotal)} />
          <Row label={`Discount (${discountPercent}%)`} value={`− ${fmtCurrency(discountAmount)}`} />
          <Row label={`Tax / GST (${taxPercent}%)`}     value={`+ ${fmtCurrency(taxAmount)}`} />
          <Divider sx={{ my: 1 }} />
          <Row label="Grand Total" value={fmtCurrency(grandTotal)} bold />
        </Box>
      </Box>
    </Box>
  );
}
