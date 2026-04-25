import React from 'react';
import AppRouter from './core/router/AppRouter';
import { AppProvider } from './core/context/AppContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AppProvider>
      <Toaster position="top-right" />
      <AppRouter />
    </AppProvider>
  );
}

export default App;
