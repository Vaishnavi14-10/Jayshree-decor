import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid, Card, CardContent, Box, Typography, Button,
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Alert, Skeleton,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import ReceiptIcon from '@mui/icons-material/ReceiptLong';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { PageHeader, StatCard, StatusChip } from '../components/common';
import { useStats, useInvoices } from '../hooks/useInvoices';
import { fmtCurrency, fmtDate } from '../utils/helpers';

/* ================= Revenue Chart ================= */
function RevenueChart({ monthly }) {
  const max = Math.max(...monthly.map((m) => parseFloat(m.revenue) || 0), 1);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: { xs: 0.8, sm: 1.5 },
        height: { xs: 100, sm: 120 },
        px: { xs: 0.5, sm: 1 },
      }}
    >
      {monthly.map((m, i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontSize: 10, color: 'text.secondary' }}
          >
            {fmtCurrency(m.revenue)}
          </Typography>

          <Box
            sx={{
              width: '100%',
              bgcolor: '#1a1a2e',
              borderRadius: '3px 3px 0 0',
              height: `${Math.max(
                6,
                (parseFloat(m.revenue) / max) * 80
              )}px`,
              minHeight: 6,
            }}
          />

          <Typography
            variant="caption"
            sx={{ fontSize: 10, color: 'text.secondary' }}
          >
            {m.month}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

/* ================= Dashboard ================= */
export default function Dashboard() {
  const { stats, monthly, loading: sLoading, error: sError } = useStats();
  const { data, loading: iLoading } = useInvoices({
    limit: 5,
    sort: 'createdAt',
    order: 'DESC',
  });

  const recent = data?.invoices || [];

  return (
    <Box>
      {/* ================= Header ================= */}
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
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back — Jayshree Decor
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

      {/* ================= Error ================= */}
      {sError && <Alert severity="error" sx={{ mb: 2 }}>{sError}</Alert>}

      {/* ================= Stats ================= */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>
        {[
          {
            label: 'Total Invoices',
            value: sLoading ? '—' : stats?.total_invoices || 0,
            sub: `${stats?.paid_count || 0} paid · ${stats?.unpaid_count || 0} unpaid`,
            icon: <ReceiptIcon />,
          },
          {
            label: 'Total Revenue',
            value: sLoading ? '—' : fmtCurrency(stats?.total_revenue),
            icon: <TrendingUpIcon />,
          },
          {
            label: 'Collected',
            value: sLoading ? '—' : fmtCurrency(stats?.paid_amount),
            icon: <CheckCircleIcon />,
          },
          {
            label: 'Outstanding',
            value: sLoading ? '—' : fmtCurrency(stats?.unpaid_amount),
            icon: <WarningAmberIcon />,
          },
        ].map((s) => (
          <Grid item xs={12} sm={6} lg={3} key={s.label}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      {/* ================= Content ================= */}
      <Grid container spacing={2}>
        {/* Chart */}
        {monthly?.length > 0 && (
          <Grid item xs={12} md={5}>
            <Card>
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Revenue — Last 6 Months
                </Typography>
                <RevenueChart monthly={monthly} />
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* ================= Invoices ================= */}
        <Grid item xs={12} md={monthly?.length > 0 ? 7 : 12}>
          <Card>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Recent Invoices</Typography>
                <Button component={Link} to="/invoices" size="small">
                  View all →
                </Button>
              </Box>

              {/* Loading */}
              {iLoading ? (
                [...Array(4)].map((_, i) => (
                  <Skeleton key={i} height={48} sx={{ mb: 1 }} />
                ))
              ) : recent.length === 0 ? (
                <Typography textAlign="center" py={3}>
                  No invoices yet.{' '}
                  <Link to="/invoices/new">Create one</Link>
                </Typography>
              ) : (
                <>
                  {/* ===== Desktop Table ===== */}
                  <TableContainer
                    sx={{
                      display: { xs: 'none', sm: 'block' },
                      overflowX: 'auto',
                    }}
                  >
                    <Table size="small" sx={{ minWidth: 500 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Invoice #</TableCell>
                          <TableCell>Party</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {recent.map((inv) => (
                          <TableRow
                            key={inv.id}
                            component={Link}
                            to={`/invoices/${inv.id}`}
                            sx={{
                              textDecoration: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <TableCell fontWeight={600}>
                              {inv.invoiceNumber}
                            </TableCell>
                            <TableCell>{inv.client?.name}</TableCell>
                            <TableCell>{fmtDate(inv.invoiceDate)}</TableCell>
                            <TableCell align="right" fontWeight={700}>
                              {fmtCurrency(inv.grandTotal)}
                            </TableCell>
                            <TableCell>
                              <StatusChip status={inv.status} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* ===== Mobile Card View ===== */}
                  <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                    {recent.map((inv) => (
                      <Card
                        key={inv.id}
                        component={Link}
                        to={`/invoices/${inv.id}`}
                        sx={{
                          mb: 1.5,
                          textDecoration: 'none',
                          p: 1,
                        }}
                      >
                        <Typography fontWeight={600}>
                          {inv.invoiceNumber}
                        </Typography>
                        <Typography variant="body2">
                          {inv.client?.name}
                        </Typography>
                        <Typography variant="body2">
                          {fmtDate(inv.invoiceDate)}
                        </Typography>
                        <Typography fontWeight={700}>
                          {fmtCurrency(inv.grandTotal)}
                        </Typography>
                        <Box mt={1}>
                          <StatusChip status={inv.status} />
                        </Box>
                      </Card>
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}