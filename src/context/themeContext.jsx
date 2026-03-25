import { createContext, useState } from 'react';

// Step 1: Create the Context
// This is like creating the "broadcast channel"
export const ThemeContext = createContext();

// Step 2: Create the Provider component
// This is like the "broadcast station" - it provides the data to all children
export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle function to switch themes
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // The value that will be available to all consumers
  const value = {
    isDarkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}