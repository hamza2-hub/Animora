import React from 'react';
import AppRouter from './core/router/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
