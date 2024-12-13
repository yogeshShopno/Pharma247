import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#3f6212',
              },
              '&:hover fieldset': {
                borderColor: '#3f6212',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3f6212',
              },
            },
            '& .MuiFilledInput-root': {
              backgroundColor: '#3f6212', 
              '&:hover': {
                backgroundColor: '#3f6212',
              },
              '&.Mui-focused': {
                backgroundColor: '#3f6212',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#3f6212',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#3f6212',
            },
          },
        },
      },
    },
  });
  

export default theme;
