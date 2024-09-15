import { createContext, useEffect, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const theme = createContext();

const ThemeProvider = ({ children }) => {
  // light or dark
  const [mode, setMode] = useState(localStorage.getItem('theme-mode') || 'light');

  const toggleMode = () => {
    setMode(prev => (prev == 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  return (
    <theme.Provider value={{ mode, setMode, toggleMode }}>
      <div className={`theme-${mode}`}>{children}</div>
    </theme.Provider>
  );
};

export default ThemeProvider;
