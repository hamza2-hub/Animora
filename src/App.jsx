import React from 'react';
import AppRouter from './core/router/AppRouter';
import { AppProvider } from './core/context/AppContext';

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
