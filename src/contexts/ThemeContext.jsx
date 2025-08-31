import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Check for saved browser theme preference
  const [useBrowserTheme, setUseBrowserTheme] = useState(() => {
    const saved = localStorage.getItem('useBrowserTheme');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Check for saved theme preference or default to system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // If using browser theme, follow system preference
    const savedUseBrowserTheme = localStorage.getItem('useBrowserTheme');
    const shouldUseBrowserTheme = savedUseBrowserTheme !== null ? JSON.parse(savedUseBrowserTheme) : true;
    
    if (shouldUseBrowserTheme) {
      // Check system preference
      if (window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return false;
    }
    
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    
    // Check system preference
    if (window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    return false;
  });

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      // Only save theme to localStorage if not using browser theme
      if (!useBrowserTheme) {
        localStorage.setItem('theme', 'dark');
      }
      
      // Update iOS status bar style and theme color for dark mode
      const statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (statusBarMeta) {
        statusBarMeta.setAttribute('content', 'black-translucent');
      }
      
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', '#0c1117'); // Dark background color (hsl(222.2 84% 4.9%))
      }
    } else {
      document.documentElement.classList.remove('dark');
      // Only save theme to localStorage if not using browser theme
      if (!useBrowserTheme) {
        localStorage.setItem('theme', 'light');
      }
      
      // Update iOS status bar style and theme color for light mode
      const statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (statusBarMeta) {
        statusBarMeta.setAttribute('content', 'default');
      }
      
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', '#ffffff'); // Light background color
      }
    }
  }, [isDarkMode, useBrowserTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only update if using browser theme
      if (useBrowserTheme) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [useBrowserTheme]);

  const toggleDarkMode = () => {
    // When manually toggling, disable browser theme mode
    if (useBrowserTheme) {
      setUseBrowserTheme(false);
      localStorage.setItem('useBrowserTheme', JSON.stringify(false));
    }
    setIsDarkMode(prev => !prev);
  };

  const toggleBrowserTheme = () => {
    const newValue = !useBrowserTheme;
    setUseBrowserTheme(newValue);
    localStorage.setItem('useBrowserTheme', JSON.stringify(newValue));
    
    // When enabling browser theme, sync with system preference
    if (newValue && window.matchMedia) {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    useBrowserTheme,
    toggleBrowserTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};