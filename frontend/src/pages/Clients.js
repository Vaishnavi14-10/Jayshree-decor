import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, TextField, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, Typography, InputAdornment,
  Skeleton, Alert, useMediaQuery, useTheme, Stack, Paper
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';

import { PageHeader } from '../components/common';
import { getClients } from '../utils/api';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      getClients(search)
        .then((r) => setClients(r.data.data || []))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <Box>
      <PageHeader
        title="Clients"
        subtitle={`${clients.length} clients found`}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>

          {/* Search */}
          <TextField
            fullWidth
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 2.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          {/* ================= MOBILE VIEW ================= */}
          {isMobile ? (
            <Stack spacing={1.5}>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <Paper key={i} sx={{ p: 2, borderRadius: 3 }}>
                    <Skeleton width="60%" height={20} />
                    <Skeleton width="40%" height={18} />
                    <Skeleton width="80%" height={18} />
                  </Paper>
                ))
              ) : clients.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <PeopleIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary">
                    {search
                      ? 'No clients found.'
                      : 'No clients yet.'}
                  </Typography>
                </Box>
              ) : (
                clients.map((c) => (
                  <Paper
                    key={c.id}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    }}
                  >
                    <Stack spacing={0.5}>
                      <Typography fontWeight={600}>
                        {c.name}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        📞 {c.phone || '—'}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" noWrap>
                        📍 {c.address || '—'}
                      </Typography>

                      <Typography variant="caption" color="text.disabled">
                        Added: {new Date(c.createdAt).toLocaleDateString('en-IN')}
                      </Typography>
                    </Stack>
                  </Paper>
                ))
              )}
            </Stack>
          ) : (
            /* ================= DESKTOP TABLE ================= */
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Client Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Added On</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        {[...Array(5)].map((__, j) => (
                          <TableCell key={j}><Skeleton /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : clients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <PeopleIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                        <Typography color="text.secondary">
                          {search
                            ? 'No clients match your search.'
                            : 'No clients yet.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    clients.map((c, i) => (
                      <TableRow key={c.id}>
                        <TableCell>{i + 1}</TableCell>

                        <TableCell>
                          <Typography fontWeight={600}>{c.name}</Typography>
                        </TableCell>

                        <TableCell>{c.phone || '—'}</TableCell>

                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography noWrap>{c.address || '—'}</Typography>
                        </TableCell>

                        <TableCell>
                          {new Date(c.createdAt).toLocaleDateString('en-IN')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

        </CardContent>
      </Card>
    </Box>
  );
}