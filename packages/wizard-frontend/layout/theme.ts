import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'

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
  breakpoints: {
    md: '840px',
    lg: '1040px',
  },
  colors: {
    brand: {
      100: '#2A21A3',
      200: '#00E6CD',
      300: '#725BFF',
      400: '#5243d9',
      500: '#937DFF',
    },
    brandGray: {
      100: '#E5F1F9',
      200: '#F7FAFC',
      300: '#718096',
    },
    darkText: {
      100: '#0E103C',
    },
  },
  fonts: {
    body: 'Open Sans',
    heading: 'Open Sans',
  },
  components: {
    Button,
    FormLabel: {
      baseStyle: {
        fontSize: '14px',
      },
    },
    Form: {
      baseStyle: {
        helperText: {
          fontSize: '10px',
        },
      },
    },
    Switch: {
      baseStyle: {
        thumb: {
          _checked: {
            bg: 'brand.100',
          },
        },
        track: {
          bg: 'brandGray.100',
          _checked: {
            bg: 'brand.500',
          },
        },
      },
      defaultProps: {
        size: 'lg',
      },
    },
  },
})
