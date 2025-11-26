
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ContentPage from './pages/ContentPage';
import Calculator from './pages/Calculator';
import Tabata from './pages/Tabata';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { GameProvider } from './context/GameContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <GameProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
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
