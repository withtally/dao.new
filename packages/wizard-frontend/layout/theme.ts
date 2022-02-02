import { extendTheme } from '@chakra-ui/react'

const Button = {
  baseStyle: {
    borderRadius: '2px',
    fontSize: 'md',
    fontWeight: 600,
  },
  variants: {
    solid: {
      bg: 'brand.300',
      color: 'white',
      _hover: {
        color: '#fff',
        bg: 'brand.400',
      },
      _active: {
        color: '#fff',
        bg: 'brand.400',
      },
    },
  },
  sizes: {
    md: {
      px: '18px',
      py: '8px',
    },
  },
  defaultProps: {
    size: 'md',
    variant: 'solid',
  },
}

export const theme = extendTheme({
  colors: {
    brand: {
      100: '#2A21A3',
      200: '#00E6CD',
      300: '#725BFF',
      400: '#5243d9',
    },
  },
  fonts: {
    body: 'Open Sans',
    heading: 'Open Sans',
  },
  components: {
    Button,
  },
})
