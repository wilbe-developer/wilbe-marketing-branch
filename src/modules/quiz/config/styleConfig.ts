
export const themeConfig = {
  colors: {
    primary: '#ff0052',
    primaryHover: '#cc0042',
    secondary: '#ff6b8b',
    secondaryLight: '#fff5f7',
    background: '#ffffff',
    backgroundFaded: '#ffffcc',
    text: '#333333',
    textLight: '#ffffff',
    border: '#000000',
    borderLight: '#ff6b8b',
    gray: {
      100: '#F1F1F1',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
  },
  
  fonts: {
    heading: "'Comic Sans MS', cursive",
    body: "'Comic Sans MS', sans-serif",
  },
  
  shadows: {
    button: '2px 2px 0 #cc0042',
    card: '4px 4px 0 #000000',
    option: '2px 2px 0 #ff0052',
  },
  
  animations: {
    blink: 'blink 1s step-end infinite',
    rainbowText: 'rainbow-text 2s linear infinite',
    rainbowBg: 'rainbow-bg 4s linear infinite',
    fadeIn: 'fade-in 0.5s ease-out',
    slideUp: 'slide-up 0.5s ease-out',
  },
  
  borderStyles: {
    pixel: 'border-2 border-black image-rendering-pixelated',
    pixelSm: 'border border-black image-rendering-pixelated',
  }
};

export default themeConfig;
