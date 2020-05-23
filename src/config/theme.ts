import { theme } from '@chakra-ui/core';

export default {
  ...theme,
  fonts: {
    body: 'Raleway, system-ui, sans-serif',
    heading: `Montserrat, Georgia, serif`,
    mono: 'Menlo, monospace',
  },
  colors: {
    ...theme.colors,
    gray: {
      50: '#e7f6f7',
      100: '#d1ddde',
      200: '#b8c6c7',
      300: '#9dadb0',
      400: '#829499',
      500: '#687a7f',
      600: '#515e64',
      700: '#384147',
      800: '#1f252c',
      900: '#000911',
    },
  },
};
