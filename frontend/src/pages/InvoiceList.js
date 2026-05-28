import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Table, TableHead, TableBody, TableRow,
  TableCell, TableContainer, TablePagination, IconButton, Tooltip,
  Alert, Skeleton, InputAdornment, Stack, Typography,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';

import { ConfirmDialog } from '../components/common';
import { useInvoices } from '../hooks/useInvoices';
import { deleteInvoice, updateStatus } from '../utils/api';
import { fmtCurrency, fmtDate } from '../utils/helpers';

export default function InvoiceList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
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

      {/* ===== Header ===== */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            All Invoices
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pagination.total || 0} total invoices
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/invoices/new"
          variant="contained"
          startIcon={<AddIcon />}
          fullWidth
          sx={{ maxWidth: { sm: 200 } }}
        >
          New Invoice
        </Button>
      </Box>

      {(error || actionError) && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setActionError('')}>
          {error || actionError}
        </Alert>
      )}

      <Card>
        <CardContent>

          {/* ===== Filters ===== */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mb: 2.5 }}
          >
            <TextField
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth sx={{ maxWidth: { sm: 200 } }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="unpaid">Unpaid</MenuItem>
                <MenuItem value="partial">Partial</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {/* ===== Desktop Table ===== */}
          <TableContainer
            sx={{
              display: { xs: 'none', md: 'block' },
              overflowX: 'auto',
            }}
          >
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice #</TableCell>
                  <TableCell>Party</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Event</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(8)].map((__, j) => (
                        <TableCell key={j}><Skeleton /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>{inv.invoiceNumber}</TableCell>
                      <TableCell>{inv.client?.name}</TableCell>
                      <TableCell>{inv.client?.phone || '—'}</TableCell>
                      <TableCell>{inv.eventType}</TableCell>
                      <TableCell>{fmtDate(inv.invoiceDate)}</TableCell>
                      <TableCell align="right">
                        {fmtCurrency(inv.grandTotal)}
                      </TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          value={inv.status}
                          onChange={(e) =>
                            handleStatusChange(inv.id, e.target.value)
                          }
                        >
                          <MenuItem value="paid">Paid</MenuItem>
                          <MenuItem value="unpaid">Unpaid</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => navigate(`/invoices/${inv.id}`)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => navigate(`/invoices/${inv.id}/edit`)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => setDeleteTarget(inv)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ===== Mobile Cards ===== */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <Skeleton key={i} height={100} sx={{ mb: 1 }} />
              ))
            ) : invoices.map((inv) => (
              <Card key={inv.id} sx={{ mb: 1.5, p: 1 }}>
                <Typography fontWeight={700}>{inv.invoiceNumber}</Typography>
                <Typography>{inv.client?.name}</Typography>
                <Typography>{fmtDate(inv.invoiceDate)}</Typography>
                <Typography fontWeight={700}>
                  {fmtCurrency(inv.grandTotal)}
                </Typography>

                <Stack direction="row" spacing={1} mt={1}>
                  <Button size="small" onClick={() => navigate(`/invoices/${inv.id}`)}>
                    View
                  </Button>
                  <Button size="small" onClick={() => navigate(`/invoices/${inv.id}/edit`)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => setDeleteTarget(inv)}>
                    Delete
                  </Button>
                </Stack>
              </Card>
            ))}
          </Box>

          {/* ===== Pagination ===== */}
          <TablePagination
            component="div"
            count={pagination.total || 0}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Invoice"
        message={`Delete invoice ${deleteTarget?.invoiceNumber}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}