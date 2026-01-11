import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('filmdb-theme');
    if (saved) {
      setTheme(saved);
      applyTheme(saved);
    } else {
      applyTheme('dark');
    }
  }, []);

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    if (themeName === 'light') {
      root.style.setProperty('--bg-primary', '#f8f9fa');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--text-primary', '#0b0c10');
      root.style.setProperty('--text-secondary', 'rgba(11, 12, 16, 0.72)');
      root.style.setProperty('--border-color', 'rgba(11, 12, 16, 0.12)');
      root.style.setProperty('--accent', '#44e4b1');
      root.style.setProperty('--accent-muted', 'rgba(68, 228, 177, 0.2)');
    } else {
      root.style.setProperty('--bg-primary', '#0b0c10');
      root.style.setProperty('--bg-secondary', '#151620');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.72)');
      root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--accent', '#44e4b1');
      root.style.setProperty('--accent-muted', 'rgba(68, 228, 177, 0.2)');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('filmdb-theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeContext;
