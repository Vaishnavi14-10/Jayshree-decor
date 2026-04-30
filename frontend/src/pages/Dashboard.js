import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid, Card, CardContent, Box, Typography, Button,
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Alert, Skeleton,
} from '@mui/material';
import AddIcon              from '@mui/icons-material/Add';
import ReceiptIcon          from '@mui/icons-material/ReceiptLong';
import TrendingUpIcon       from '@mui/icons-material/TrendingUp';
import CheckCircleIcon      from '@mui/icons-material/CheckCircle';
import WarningAmberIcon     from '@mui/icons-material/WarningAmber';

import { PageHeader, StatCard, StatusChip } from '../components/common';
import { useStats, useInvoices }            from '../hooks/useInvoices';
import { fmtCurrency, fmtDate }             from '../utils/helpers';

function RevenueChart({ monthly }) {
  const max = Math.max(...monthly.map((m) => parseFloat(m.revenue) || 0), 1);
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 120, px: 1 }}>
      {monthly.map((m, i) => (
        <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" sx={{ fontSize: 10, color: 'text.secondary', textAlign: 'center', lineHeight: 1.2 }}>
            {fmtCurrency(m.revenue).replace('₹', '₹')}
          </Typography>
          <Box sx={{
            width: '100%', background: 'primary.main', bgcolor: '#1a1a2e',
            borderRadius: '3px 3px 0 0',
            height: `${Math.max(6, (parseFloat(m.revenue) / max) * 80)}px`,
            minHeight: 6, transition: 'height 0.4s ease',
          }} />
          <Typography variant="caption" sx={{ fontSize: 10, color: 'text.secondary', whiteSpace: 'nowrap' }}>{m.month}</Typography>
        </Box>
      ))}
    </Box>
  );
}

export default function Dashboard() {
  const { stats, monthly, loading: sLoading, error: sError } = useStats();
  const { data, loading: iLoading } = useInvoices({ limit: 5, sort: 'createdAt', order: 'DESC' });
  const recent = data.invoices || [];

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back — Jayshree Decor"
        action={
          <Button component={Link} to="/invoices/new" variant="contained" color="primary" startIcon={<AddIcon />}>
            New Invoice
          </Button>
        }
      />

      {sError && <Alert severity="error" sx={{ mb: 3 }}>{sError}</Alert>}

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Invoices',  value: sLoading ? '—' : stats?.total_invoices || 0,           sub: `${stats?.paid_count||0} paid · ${stats?.unpaid_count||0} unpaid`, icon: <ReceiptIcon />,      color: '#2563eb' },
          { label: 'Total Revenue',   value: sLoading ? '—' : fmtCurrency(stats?.total_revenue),    icon: <TrendingUpIcon />,  color: '#d97706' },
          { label: 'Collected',       value: sLoading ? '—' : fmtCurrency(stats?.paid_amount),      icon: <CheckCircleIcon />, color: '#16a34a' },
          { label: 'Outstanding',     value: sLoading ? '—' : fmtCurrency(stats?.unpaid_amount),    icon: <WarningAmberIcon />,color: '#dc2626' },
        ].map((s) => (
          <Grid item xs={12} sm={6} lg={3} key={s.label}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Revenue Chart */}
        {monthly.length > 0 && (
          <Grid item xs={12} md={5}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Revenue — Last 6 Months</Typography>
                <RevenueChart monthly={monthly} />
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Recent Invoices */}
        <Grid item xs={12} md={monthly.length > 0 ? 7 : 12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Recent Invoices</Typography>
                <Button component={Link} to="/invoices" size="small" variant="text">View all →</Button>
              </Box>

              {iLoading ? (
                [...Array(4)].map((_, i) => <Skeleton key={i} height={48} sx={{ mb: 0.5 }} />)
              ) : recent.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No invoices yet.{' '}
                  <Link to="/invoices/new" style={{ color: '#2563eb' }}>Create your first invoice</Link>
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
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
                        <TableRow key={inv.id} component={Link} to={`/invoices/${inv.id}`} sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                          <TableCell sx={{ fontWeight: 600 }}>{inv.invoiceNumber}</TableCell>
                          <TableCell>{inv.client?.name}</TableCell>
                          <TableCell>{fmtDate(inv.invoiceDate)}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>{fmtCurrency(inv.grandTotal)}</TableCell>
                          <TableCell><StatusChip status={inv.status} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
