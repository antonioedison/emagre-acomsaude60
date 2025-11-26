import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ContentPage from './pages/ContentPage';
import Calculator from './pages/Calculator';
import Tabata from './pages/Tabata';
import Profile from './pages/Profile';
import { GameProvider } from './context/GameContext';

const App: React.FC = () => {
  return (
    <GameProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="content/:id" element={<ContentPage />} />
            <Route path="calculator" element={<Calculator />} />
            <Route path="tabata" element={<Tabata />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </GameProvider>
  );
};

export default App;
