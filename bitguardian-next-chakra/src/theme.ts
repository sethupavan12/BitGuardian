import { extendTheme, ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const colors = {
  brand: { // Existing brand colors, can be kept or migrated
    50: '#f5fee5',
    100: '#e1fbb2',
    200: '#cdf781',
    300: '#b8ee56',
    400: '#a2e032',
    500: '#8ac919', // Primary-ish green
    600: '#71ab09',
    700: '#578602',
    800: '#3c5e00',
    900: '#203300',
  },
  // Semantic colors for light mode
  light: {
    primary: '#8ac919', // Green from brand
    secondary: '#3498db', // A complementary blue
    background: '#ffffff',
    surface: '#f7fafc', // Slightly off-white for cards/containers
    text: '#1A202C', // Chakra default dark gray
    textSecondary: '#4A5568', // Chakra default medium gray
    border: '#E2E8F0', // Chakra default light gray
    accent: '#f56565', // An accent color (e.g., for errors or important actions)
  },
  // Semantic colors for dark mode
  dark: {
    primary: '#8ac919', // Green from brand (can be adjusted for dark mode contrast)
    secondary: '#2b6cb0', // Darker blue for dark mode
    background: '#1A202C', // Chakra default dark gray
    surface: '#2D3748', // Slightly lighter dark for cards/containers
    text: '#f7fafc', // Chakra default light gray (almost white)
    textSecondary: '#A0AEC0', // Chakra default medium-light gray
    border: '#4A5568', // Chakra default medium gray
    accent: '#e53e3e', // Darker accent
  },
}

const theme = extendTheme({
  config,
  colors,
  // Add other theme customizations here (fonts, components, etc.)
  // Example:
  // styles: {
  //   global: (props: any) => ({
  //     body: {
  //       bg: props.colorMode === 'dark' ? 'dark.background' : 'light.background',
  //       color: props.colorMode === 'dark' ? 'dark.text' : 'light.text',
  //     },
  //   }),
  // },
})

export default theme 