import { createRoot } from 'react-dom/client';

import './index.css';
import ThemeProvider from '@tools/ThemeProvider.jsx';
import Router from './routers/Router';

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <Router />
  </ThemeProvider>
);
