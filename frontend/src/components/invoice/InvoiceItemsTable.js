import React from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, TextField, Select, MenuItem,
  IconButton, Button, Box, Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon           from '@mui/icons-material/Add';
import { CATEGORIES, fmtCurrency } from '../../utils/helpers';

export default function InvoiceItemsTable({ items, onChange }) {
  const update = (id, field, val) =>
    onChange(items.map((item) => (item._id !== id ? item : { ...item, [field]: val })));

  const remove = (id) => onChange(items.filter((i) => i._id !== id));

  const add = () =>
    onChange([...items, { _id: Date.now(), category: 'Props', description: '', quantity: 1, rate: 0 }]);

  return (
    <Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '22%' }}>Category</TableCell>
              <TableCell sx={{ width: '30%' }}>Description</TableCell>
              <TableCell sx={{ width: '12%' }}>Qty</TableCell>
              <TableCell sx={{ width: '16%' }}>Rate (₹)</TableCell>
              <TableCell sx={{ width: '16%' }}>Amount (₹)</TableCell>
              <TableCell sx={{ width: '4%' }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">No items yet. Click "+ Add Item" below.</Typography>
                </TableCell>
              </TableRow>
            )}
            {items.map((item) => {
              const amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
              return (
                <TableRow key={item._id}>
                  <TableCell>
                    <Select
                      size="small" fullWidth value={item.category}
                      onChange={(e) => update(item._id, 'category', e.target.value)}
                    >
                      {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small" fullWidth placeholder="Description"
                      value={item.description}
                      onChange={(e) => update(item._id, 'description', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small" fullWidth type="number" inputProps={{ min: 0.01, step: 0.01 }}
                      value={item.quantity}
                      onChange={(e) => update(item._id, 'quantity', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small" fullWidth type="number" inputProps={{ min: 0, step: 1 }}
                      value={item.rate}
                      onChange={(e) => update(item._id, 'rate', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small" fullWidth value={amount.toFixed(2)}
                      InputProps={{ readOnly: true, sx: { background: '#f9fafb', color: 'text.secondary' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="error" onClick={() => remove(item._id)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        startIcon={<AddIcon />}
        onClick={add}
        sx={{ mt: 1.5, borderStyle: 'dashed', borderColor: 'divider', color: 'text.secondary' }}
        variant="outlined"
        size="small"
      >
        Add Item
      </Button>

      {/* Totals row */}
      {items.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {items.length} item{items.length !== 1 ? 's' : ''} &nbsp;·&nbsp; Subtotal:&nbsp;
            <strong style={{ color: '#1a1a2e' }}>
              {fmtCurrency(items.reduce((s, i) => s + (parseFloat(i.quantity) || 0) * (parseFloat(i.rate) || 0), 0))}
            </strong>
          </Typography>
        </Box>
      )}
    </Box>
  );
}
