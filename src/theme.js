import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInput-underline': {
            '&:before': {
              borderBottom: '2px solid #3f6212', // Default bottom border
            },
            '&:hover:before': {
              borderBottom: '2px solid #3f6212', // Hover bottom border
            },
            '&:after': {
              borderBottom: '2px solid #3f6212', // Focused bottom border
            },
          },
          '& .MuiInputLabel-root': {
            color: '#3f6212',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#3f6212', // Label color when focused
          },
        },
      },
    },
  },
});

  

export default theme;
