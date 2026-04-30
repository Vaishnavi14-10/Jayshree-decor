import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Table, TableHead, TableBody, TableRow,
  TableCell, TableContainer, TablePagination, IconButton, Tooltip,
  Alert, Skeleton, InputAdornment, Stack, Typography,
} from '@mui/material';
import SearchIcon       from '@mui/icons-material/Search';
import VisibilityIcon   from '@mui/icons-material/Visibility';
import EditIcon         from '@mui/icons-material/Edit';
import DeleteIcon       from '@mui/icons-material/DeleteOutline';
import AddIcon          from '@mui/icons-material/Add';

import { PageHeader, StatusChip, ConfirmDialog } from '../components/common';
import { useInvoices }                           from '../hooks/useInvoices';
import { deleteInvoice, updateStatus }           from '../utils/api';
import { fmtCurrency, fmtDate }                 from '../utils/helpers';

export default function InvoiceList() {
  const navigate = useNavigate();
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionError, setActionError] = useState('');

  const params = useCallback(() => {
    const p = { page: page + 1, limit: rowsPerPage, sort: 'createdAt', order: 'DESC' };
    if (statusFilter !== 'all') p.status = statusFilter;
    if (search.trim()) p.search = search.trim();
    return p;
  }, [page, rowsPerPage, statusFilter, search]);

  const { data, loading, error, reload } = useInvoices(params());
  const { invoices = [], pagination = {} } = data;

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus(id, status);
      reload();
    } catch (e) {
      setActionError(e.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteInvoice(deleteTarget.id);
      setDeleteTarget(null);
      reload();
    } catch (e) {
      setActionError(e.message);
      setDeleteTarget(null);
    }
  };

  return (
    <Box>
      <PageHeader
        title="All Invoices"
        subtitle={`${pagination.total || 0} total invoices`}
        action={
          <Button component={Link} to="/invoices/new" variant="contained" color="primary" startIcon={<AddIcon />}>
            New Invoice
          </Button>
        }
      />

      {(error || actionError) && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setActionError('')}>
          {error || actionError}
        </Alert>
      )}

      <Card>
        <CardContent>
          {/* Filters */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2.5 }}>
            <TextField
              placeholder="Search party name, invoice #, event..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 160 }} size="small">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="unpaid">Unpaid</MenuItem>
                <MenuItem value="partial">Partial</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice #</TableCell>
                  <TableCell>Party Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Event</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? [...Array(6)].map((_, i) => (
                      <TableRow key={i}>
                        {[...Array(8)].map((__, j) => (
                          <TableCell key={j}><Skeleton /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  : invoices.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                        <Typography color="text.secondary">No invoices found.</Typography>
                      </TableCell>
                    </TableRow>
                  )
                  : invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700}>{inv.invoiceNumber}</Typography>
                      </TableCell>
                      <TableCell>{inv.client?.name}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{inv.client?.phone || '—'}</TableCell>
                      <TableCell>{inv.eventType}</TableCell>
                      <TableCell>{fmtDate(inv.invoiceDate)}</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={700}>{fmtCurrency(inv.grandTotal)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={inv.status}
                          size="small"
                          onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                          sx={{ fontSize: 12, fontWeight: 600, minWidth: 110 }}
                        >
                          <MenuItem value="unpaid">Unpaid</MenuItem>
                          <MenuItem value="paid">Paid</MenuItem>
                          <MenuItem value="partial">Partial</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="View">
                            <IconButton size="small" onClick={() => navigate(`/invoices/${inv.id}`)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => navigate(`/invoices/${inv.id}/edit`)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => setDeleteTarget(inv)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={pagination.total || 0}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
            rowsPerPageOptions={[10, 15, 25, 50]}
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice ${deleteTarget?.invoiceNumber}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
