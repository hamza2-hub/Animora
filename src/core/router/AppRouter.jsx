import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

import Landing from '../../pages/Landing';
import Register from '../../pages/auth/Register';
import Login from '../../pages/auth/Login';
import DoctorDashboard from '../../pages/doctor/DoctorDashboard';
import DoctorAppointments from '../../pages/doctor/DoctorAppointments';
import Patients from '../../pages/doctor/Patients';
import PetOwners from '../../pages/doctor/PetOwners';
import Vaccinations from '../../pages/doctor/Vaccinations';
import MedicalRecords from '../../pages/doctor/MedicalRecords';
import Analytics from '../../pages/doctor/Analytics';
import DoctorProfile from '../../pages/doctor/DoctorProfile';
import UserDashboard from '../../pages/user/UserDashboard';
import MyPets from '../../pages/user/MyPets';
import Appointments from '../../pages/user/Appointments';
import DoctorsList from '../../pages/user/DoctorsList';
import DashboardLayout from '../../layouts/DashboardLayout';

const getDashboardPath = (role) => {
  return role === 'doctor' ? '/doctor-dashboard' : '/dashboard';
};

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && profile?.role && profile.role !== allowedRole) {
    return <Navigate to={getDashboardPath(profile.role)} replace />;
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
  const { user, profile, loading } = useAuth();
  if (loading) return null;
  if (user && profile?.role) {
    return <Navigate to={getDashboardPath(profile.role)} replace />;
  }
  return <Navigate to="/login" replace />;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/auth-redirect" element={<CatchAll />} />
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
          path="/doctor-dashboard/profile" 
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorProfile />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/pets" 
          element={
            <ProtectedRoute allowedRole="user">
              <MyPets />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/appointments" 
          element={
            <ProtectedRoute allowedRole="user">
              <Appointments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/doctors" 
          element={
            <ProtectedRoute allowedRole="user">
              <DoctorsList />
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
