import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: '#319795',
    secondary: '#2D3748',
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'md',
        fontWeight: 'bold',
      },
      sizes: {
        lg: {
          h: '56px',
          fontSize: 'lg',
        },
      },
      variants: {
        solid: {
          bg: 'primary',
          color: 'white',
        },
        outline: {
          borderColor: 'primary',
          color: 'primary',
        },
      },
    },
  },
});

export default theme;
