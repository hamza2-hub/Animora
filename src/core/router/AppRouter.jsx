import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';
import DoctorDashboard from '../../pages/doctor/DoctorDashboard';
import UserDashboard from '../../pages/user/UserDashboard';
import DashboardLayout from '../../components/layout/DashboardLayout';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { userRole } = useAppContext();
  
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={`/${userRole}-dashboard`} replace />;
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
};

const CatchAll = () => {
  const { userRole } = useAppContext();
  if (userRole) {
    return <Navigate to={`/${userRole}-dashboard`} replace />;
  }
  return <Navigate to="/login" replace />;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/doctor-dashboard" 
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/user-dashboard" 
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<CatchAll />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
