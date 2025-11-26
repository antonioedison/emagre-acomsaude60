
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

export const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useGame();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
