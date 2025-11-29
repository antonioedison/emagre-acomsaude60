
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ContentPage from './pages/ContentPage';
import Calculator from './pages/Calculator';
import Tabata from './pages/Tabata';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import { GameProvider, useGame } from './context/GameContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Wrapper to enforce onboarding completion
const RequireOnboarding: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { userState } = useGame();
  
  if (!userState.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Route for Onboarding (No Layout) */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
                <Onboarding />
            </ProtectedRoute>
          } />

          {/* Main App Routes (Protected + Onboarding Required) */}
          <Route path="/" element={
            <ProtectedRoute>
                <RequireOnboarding>
                    <Layout />
                </RequireOnboarding>
            </ProtectedRoute>
          }>
            <Route index element={<Home />} />
            <Route path="content/:id" element={<ContentPage />} />
            <Route path="calculator" element={<Calculator />} />
            <Route path="tabata" element={<Tabata />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </GameProvider>
  );
};

export default App;
