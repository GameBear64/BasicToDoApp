import { useStore } from '@nanostores/react';
import { $preferences } from '@store/preferences';

const ThemeProvider = ({ children }) => {
  const preferences = useStore($preferences);

  return <div className={`theme-${preferences.theme} theme-${preferences.accent}`}>{children}</div>;
};

export default ThemeProvider;
