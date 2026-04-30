import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, TextField, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, Typography, InputAdornment,
  Skeleton, Alert, Chip,
} from '@mui/material';
import SearchIcon   from '@mui/icons-material/Search';
import PeopleIcon   from '@mui/icons-material/People';
import { PageHeader } from '../components/common';
import { getClients } from '../utils/api';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

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
          <TextField
            fullWidth
            placeholder="Search clients by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 2.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

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
                {loading
                  ? [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        {[...Array(5)].map((__, j) => (
                          <TableCell key={j}><Skeleton /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  : clients.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <PeopleIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                        <Typography color="text.secondary">
                          {search ? 'No clients match your search.' : 'No clients yet. They appear automatically when you create invoices.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                  : clients.map((c, i) => (
                    <TableRow key={c.id}>
                      <TableCell sx={{ color: 'text.disabled' }}>{i + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{
                            width: 34, height: 34, borderRadius: '50%',
                            background: '#1a1a2e', color: '#f7c948',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, fontWeight: 700, flexShrink: 0,
                          }}>
                            {c.name?.charAt(0)?.toUpperCase()}
                          </Box>
                          <Typography variant="body2" fontWeight={600}>{c.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{c.phone || '—'}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', maxWidth: 200 }}>
                        <Typography variant="body2" noWrap>{c.address || '—'}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>
                        {new Date(c.createdAt).toLocaleDateString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
