import { MD3LightTheme as DefaultTheme } from 'react-native-paper'; // Using MD3
// Or for MD2: import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme, // Spread the default theme
  // Specify custom colors
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF', // A shade of blue
    accent: '#4CAF50',   // A shade of green (often 'accent' is 'secondary' in MD3)
    secondary: '#4CAF50', // For MD3, 'secondary' is more common than 'accent'
    // You can override other colors too, e.g.:
    // background: '#f6f6f6',
    // surface: '#ffffff',
    // error: '#B00020',
    // text: '#000000',
    // onSurface: '#000000',
    // primaryContainer: '#cfe4ff' // example for MD3
  },
  // You can also customize fonts, roundness, etc.
  // roundness: 2,
  // fonts: configureFonts({ /* your font config */ }),
};

export default theme;
