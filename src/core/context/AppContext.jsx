import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (role, userData) => {
    setUserRole(role);
    setUser(userData);
    localStorage.setItem('userRole', role);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUserRole(null);
    setUser(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
  };

  return (
    <AppContext.Provider value={{ userRole, user, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
