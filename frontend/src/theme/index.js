import { createTheme, alpha } from '@mui/material/styles';

const BRAND = {
  navy:   '#1a1a2e',
  gold:   '#f7c948',
  goldDark: '#d4a72c',
  cream:  '#fdf8f0',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main:        BRAND.navy,
      light:       '#2d2d4e',
      dark:        '#0f0f1a',
      contrastText: BRAND.gold,
    },
    secondary: {
      main:        BRAND.gold,
      light:       '#fde68a',
      dark:        BRAND.goldDark,
      contrastText: BRAND.navy,
    },
    background: {
      default: '#f4f6fb',
      paper:   '#ffffff',
    },
    success: { main: '#16a34a', light: '#dcfce7', dark: '#14532d' },
    warning: { main: '#d97706', light: '#fef3c7', dark: '#92400e' },
    error:   { main: '#dc2626', light: '#fef2f2', dark: '#7f1d1d' },
    info:    { main: '#2563eb', light: '#eff6ff', dark: '#1e3a8a' },
    text: {
      primary:   '#1a1a2e',
      secondary: '#6b7280',
      disabled:  '#9ca3af',
    },
    divider: '#e8ecf0',
  },

  typography: {
    fontFamily: '"DM Sans", "Segoe UI", system-ui, sans-serif',
    h1: { fontSize: '2rem',    fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '1.5rem',  fontWeight: 700, lineHeight: 1.3 },
    h3: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
    h4: { fontSize: '1rem',    fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: '0.875rem',fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.4, textTransform: 'uppercase', letterSpacing: '0.05em' },
    body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem',  lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', color: '#6b7280' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
  },

  shape: { borderRadius: 10 },

  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.05)',
    '0 1px 4px rgba(0,0,0,0.08)',
    '0 2px 8px rgba(0,0,0,0.08)',
    '0 4px 16px rgba(0,0,0,0.08)',
    '0 8px 24px rgba(0,0,0,0.1)',
    '0 12px 32px rgba(0,0,0,0.1)',
    '0 16px 40px rgba(0,0,0,0.12)',
    '0 20px 48px rgba(0,0,0,0.12)',
    '0 24px 56px rgba(0,0,0,0.14)',
    '0 28px 64px rgba(0,0,0,0.14)',
    ...Array(14).fill('none'),
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { background: #f4f6fb; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
      `,
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, padding: '8px 20px', fontSize: '0.875rem' },
        contained: {
          '&:hover': { opacity: 0.92 },
        },
        outlined: {
          borderColor: '#e0e0e0',
          '&:hover': { borderColor: '#1a1a2e', background: alpha('#1a1a2e', 0.04) },
        },
        sizeSmall: { padding: '5px 14px', fontSize: '0.8125rem' },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid #e8ecf0',
          borderRadius: 12,
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '20px 24px',
          '&:last-child': { paddingBottom: '20px' },
        },
      },
    },

    MuiTextField: {
      defaultProps: { size: 'small', variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            background: '#fff',
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1a1a2e' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1a1a2e', borderWidth: 1.5 },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#1a1a2e' },
        },
      },
    },

    MuiSelect: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          borderRadius: 8,
          background: '#fff',
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            background: '#f9fafb',
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#6b7280',
            borderBottom: '1px solid #e8ecf0',
          },
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { background: '#fafafa' },
          '&:last-child td': { borderBottom: 0 },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid #f0f0f0', padding: '12px 16px', fontSize: '0.875rem' },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 600, fontSize: '0.75rem' },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 14, border: '1px solid #e8ecf0' },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: { borderRadius: 6, fontSize: '0.75rem', background: '#1a1a2e' },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, height: 6 },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#e8ecf0' },
      },
    },

    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});

export default theme;
export { BRAND };
