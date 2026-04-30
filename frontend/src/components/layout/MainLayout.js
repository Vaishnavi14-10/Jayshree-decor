import React from 'react';
import { Box } from '@mui/material';
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar';

export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // ml: `${SIDEBAR_WIDTH}px`,
          p: { xs: 2, md: 3.5 },
          minHeight: '100vh',
          background: 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
