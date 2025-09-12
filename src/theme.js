import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#3f6212' },
    secondary: { main: '#F31C1C' },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3f6212',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3f6212',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3f6212',
            borderWidth: 2,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#3f6212',
          '&.Mui-focused': {
            color: '#3f6212',
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottom: '2px solid #3f6212',
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: '2px solid #3f6212',
          },
          '&:after': {
            borderBottom: '2px solid #3f6212',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: 'var(--color1) !important',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: 'var(--COLOR_UI_PHARMACY) !important',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#3f6212',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: 'var(--color2) !important',
        },
      },
    },
  },
});

export default theme;
