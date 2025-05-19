import { extendTheme, ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

// Iron Fish inspired color scheme
const colors = {
  brand: {
    50: '#e6f7ff',
    100: '#b3e6ff',
    200: '#80d4ff',
    300: '#4dc2ff',
    400: '#26b1ff',
    500: '#009fe6', // Primary turquoise/blue
    600: '#0080cc',
    700: '#0060b3',
    800: '#004099',
    900: '#002966',
  },
  accent: {
    50: '#e6fbff',
    100: '#b3f1fb',
    200: '#80e7f7',
    300: '#4dddf3',
    400: '#26d3ef',
    500: '#00c9eb', // Secondary accent
    600: '#00a0bc',
    700: '#00788d',
    800: '#00505e',
    900: '#00282f',
  },
  // Semantic colors for light mode
  light: {
    primary: '#009fe6', // Main turquoise/blue
    secondary: '#00c9eb', // Secondary accent
    background: '#ffffff',
    surface: '#f7fafc', // Slightly off-white for cards/containers
    text: '#1A202C', // Almost black for text
    textSecondary: '#4A5568', // Dark gray for secondary text
    border: '#E2E8F0', // Light gray border
    accent: '#00c9eb', // Accent for highlights
    success: '#38B2AC', // Teal
    warning: '#DD6B20', // Orange
    error: '#E53E3E', // Red
    info: '#3182CE', // Blue
  },
  // Semantic colors for dark mode
  dark: {
    primary: '#009fe6', // Main turquoise/blue
    secondary: '#00c9eb', // Secondary accent
    background: '#1A202C', // Dark background
    surface: '#2D3748', // Slightly lighter dark for cards/containers
    text: '#f7fafc', // Almost white for text
    textSecondary: '#A0AEC0', // Light gray for secondary text
    border: '#4A5568', // Medium gray border
    accent: '#00c9eb', // Accent for highlights
    success: '#38B2AC', // Teal
    warning: '#DD6B20', // Orange
    error: '#E53E3E', // Red
    info: '#3182CE', // Blue
  },
}

// Iron Fish uses clean sans-serif fonts
const fonts = {
  heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
}

// Component style overrides
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'medium',
      borderRadius: 'md',
    },
    variants: {
      solid: (props: any) => ({
        bg: props.colorMode === 'dark' ? 'dark.primary' : 'light.primary',
        color: 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.600',
          _disabled: {
            bg: props.colorMode === 'dark' ? 'dark.primary' : 'light.primary',
          },
        },
      }),
      outline: (props: any) => ({
        borderColor: props.colorMode === 'dark' ? 'dark.primary' : 'light.primary',
        color: props.colorMode === 'dark' ? 'dark.primary' : 'light.primary',
      }),
      secondary: (props: any) => ({
        bg: props.colorMode === 'dark' ? 'dark.secondary' : 'light.secondary',
        color: 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'accent.600' : 'accent.600',
        },
      }),
    },
  },
  Card: {
    baseStyle: (props: any) => ({
      container: {
        borderRadius: 'xl',
        boxShadow: 'sm',
        overflow: 'hidden',
      },
      header: {
        py: 4,
        px: 6,
      },
      body: {
        py: 4,
        px: 6,
      },
      footer: {
        py: 4,
        px: 6,
      },
    }),
  },
  Heading: {
    baseStyle: {
      fontWeight: 'bold',
    },
  },
}

// Global style overrides
const styles = {
  global: (props: any) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'dark.background' : 'light.background',
      color: props.colorMode === 'dark' ? 'dark.text' : 'light.text',
    },
  }),
}

const theme = extendTheme({
  config,
  colors,
  fonts,
  components,
  styles,
})

export default theme 