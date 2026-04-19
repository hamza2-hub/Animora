import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null); // 'doctor' or 'user'
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const login = (role, userData) => {
    setUserRole(role);
    setUser(userData);
    setActiveTab('dashboard');
  };

  const logout = () => {
    setUserRole(null);
    setUser(null);
    setActiveTab('dashboard');
  };

  return (
    <AppContext.Provider value={{ userRole, user, login, logout, activeTab, setActiveTab }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
