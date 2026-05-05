import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// ── Lazy-loaded pages (code-split per route) ──────────────────────────
const Landing = lazy(() => import('../../pages/Landing'));
const Register = lazy(() => import('../../pages/auth/Register'));
const Login = lazy(() => import('../../pages/auth/Login'));

const DoctorDashboard = lazy(() => import('../../pages/doctor/DoctorDashboard'));
const DoctorAppointments = lazy(() => import('../../pages/doctor/DoctorAppointments'));
const Patients = lazy(() => import('../../pages/doctor/Patients'));
const PetOwners = lazy(() => import('../../pages/doctor/PetOwners'));
const Vaccinations = lazy(() => import('../../pages/doctor/Vaccinations'));
const MedicalRecords = lazy(() => import('../../pages/doctor/MedicalRecords'));
const Analytics = lazy(() => import('../../pages/doctor/Analytics'));
const DoctorProfile = lazy(() => import('../../pages/doctor/DoctorProfile'));

const UserDashboard = lazy(() => import('../../pages/user/UserDashboard'));
const MyPets = lazy(() => import('../../pages/user/MyPets'));
const Appointments = lazy(() => import('../../pages/user/Appointments'));
const DoctorsList = lazy(() => import('../../pages/user/DoctorsList'));

const DashboardLayout = lazy(() => import('../../layouts/DashboardLayout'));

// ── Spinner shown while a lazy chunk loads ──────────────────────────
const PageSpinner = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', width: '100%',
    background: 'var(--background, #f8fafc)',
  }}>
    <div style={{
      width: 36, height: 36,
      border: '3px solid #e2e8f0',
      borderTopColor: '#10b981',
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ── Helpers ──────────────────────────────────────────────────────────
const getDashboardPath = (role) =>
  role === 'doctor' ? '/doctor-dashboard' : '/dashboard';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return <PageSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRole && profile?.role && profile.role !== allowedRole) {
    return <Navigate to={getDashboardPath(profile.role)} replace />;
  }

  return (
    <Suspense fallback={<PageSpinner />}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </Suspense>
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

const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth-redirect" element={<CatchAll />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Doctor routes */}
        <Route path="/doctor-dashboard" element={<ProtectedRoute allowedRole="doctor"><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/doctor-dashboard/appointments" element={<ProtectedRoute allowedRole="doctor"><DoctorAppointments /></ProtectedRoute>} />
        <Route path="/doctor-dashboard/patients" element={<ProtectedRoute allowedRole="doctor"><Patients /></ProtectedRoute>} />
        <Route path="/doctor-dashboard/owners" element={<ProtectedRoute allowedRole="doctor"><PetOwners /></ProtectedRoute>} />
        <Route path="/doctor-dashboard/vaccinations" element={<ProtectedRoute allowedRole="doctor"><Vaccinations /></ProtectedRoute>} />
        <Route path="/doctor-dashboard/records" element={<ProtectedRoute allowedRole="doctor"><MedicalRecords /></ProtectedRoute>} />
        <Route path="/doctor-dashboard/analytics" element={<ProtectedRoute allowedRole="doctor"><Analytics /></ProtectedRoute>} />
        <Route path="/doctor-dashboard/profile" element={<ProtectedRoute allowedRole="doctor"><DoctorProfile /></ProtectedRoute>} />

        {/* User routes */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRole="user"><UserDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/pets" element={<ProtectedRoute allowedRole="user"><MyPets /></ProtectedRoute>} />
        <Route path="/dashboard/appointments" element={<ProtectedRoute allowedRole="user"><Appointments /></ProtectedRoute>} />
        <Route path="/dashboard/doctors" element={<ProtectedRoute allowedRole="user"><DoctorsList /></ProtectedRoute>} />

        <Route path="*" element={<CatchAll />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
