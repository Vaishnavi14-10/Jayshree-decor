import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 2 }}>
      <CircularProgress size={36} sx={{ color: 'primary.main' }} />
      <Typography variant="body2" color="text.secondary">{message}</Typography>
    </Box>
  );
}
