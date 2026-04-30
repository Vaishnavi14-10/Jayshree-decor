import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function StatCard({ label, value, sub, icon, color = 'primary.main' }) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {label}
            </Typography>
            <Typography variant="h3" sx={{ mt: 0.5, fontWeight: 700, color }}>{value}</Typography>
            {sub && <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>{sub}</Typography>}
          </Box>
          {icon && (
            <Box sx={{ p: 1, borderRadius: 2, background: 'rgba(0,0,0,0.04)', color }}>
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
