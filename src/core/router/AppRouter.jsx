import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';
import DoctorDashboard from '../../pages/doctor/DoctorDashboard';
import DoctorAppointments from '../../pages/doctor/DoctorAppointments';
import Patients from '../../pages/doctor/Patients';
import PetOwners from '../../pages/doctor/PetOwners';
import Vaccinations from '../../pages/doctor/Vaccinations';
import MedicalRecords from '../../pages/doctor/MedicalRecords';
import Analytics from '../../pages/doctor/Analytics';
import UserDashboard from '../../pages/user/UserDashboard';
import MyPets from '../../pages/user/MyPets';
import Appointments from '../../pages/user/Appointments';
import DashboardLayout from '../../components/layout/DashboardLayout';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { userRole } = useAppContext();
  
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={`/${userRole}-dashboard`} replace />;
  }
  
  return (
    <DashboardLayout>
      <PageTransition>
        {children}
      </PageTransition>
    </DashboardLayout>
  );
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

const CatchAll = () => {
  const { userRole } = useAppContext();
  if (userRole) {
    return <Navigate to={`/${userRole}-dashboard`} replace />;
  }
  return <Navigate to="/login" replace />;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
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
          path="/doctor-dashboard/appointments" 
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorAppointments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor-dashboard/patients" 
          element={
            <ProtectedRoute allowedRole="doctor">
              <Patients />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor-dashboard/owners" 
          element={
            <ProtectedRoute allowedRole="doctor">
              <PetOwners />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor-dashboard/vaccinations" 
          element={
            <ProtectedRoute allowedRole="doctor">
              <Vaccinations />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor-dashboard/records" 
          element={
            <ProtectedRoute allowedRole="doctor">
              <MedicalRecords />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor-dashboard/analytics" 
          element={
            <ProtectedRoute allowedRole="doctor">
              <Analytics />
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
        <Route 
          path="/user-dashboard/pets" 
          element={
            <ProtectedRoute allowedRole="user">
              <MyPets />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user-dashboard/appointments" 
          element={
            <ProtectedRoute allowedRole="user">
              <Appointments />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<CatchAll />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default AppRouter;
