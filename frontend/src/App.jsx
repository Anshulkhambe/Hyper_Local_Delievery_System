import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import RouteOptimization from './pages/RouteOptimization';
import LandingPage from './pages/LandingPage';
import MyDeliveries from './pages/MyDeliveries';
import RouteMap from './pages/RouteMap';
import DeliveryAgents from './pages/DeliveryAgents';
import Leaderboard from './pages/Leaderboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'DELIVERY_BOY' ? '/deliveries' : '/dashboard'} />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-mesh transition-colors duration-500">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/orders" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Orders />
              </ProtectedRoute>
            } />

            <Route path="/optimize" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <RouteOptimization />
              </ProtectedRoute>
            } />

            <Route path="/agents" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DeliveryAgents />
              </ProtectedRoute>
            } />

            <Route path="/deliveries" element={
              <ProtectedRoute allowedRoles={['DELIVERY_BOY']}>
                <MyDeliveries />
              </ProtectedRoute>
            } />

            <Route path="/route" element={
              <ProtectedRoute allowedRoles={['DELIVERY_BOY']}>
                <RouteMap />
              </ProtectedRoute>
            } />

            <Route path="/leaderboard" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'DELIVERY_BOY']}>
                <Leaderboard />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <ToastContainer position="bottom-right" theme="colored" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
