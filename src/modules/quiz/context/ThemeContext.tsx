
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { themeConfig } from '../config/styleConfig';

// Theme context type
interface ThemeContextType {
  theme: typeof themeConfig;
  setTheme: (theme: typeof themeConfig) => void;
}

// Create the context
export const ThemeContext = createContext<ThemeContextType>({
  theme: themeConfig,
  setTheme: () => {}
});

// Provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(themeConfig);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for accessing the theme
export const useTheme = () => useContext(ThemeContext);
