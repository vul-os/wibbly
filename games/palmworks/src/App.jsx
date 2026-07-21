import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

// Main App component.
//
// There is no auth provider and no session. A wibbly game has no accounts and
// no backend — the plant lives in the tab and nowhere else.
function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AppRoutes />
        <Toaster />
      </ThemeProvider>
    </Router>
  );
}

export default App;
