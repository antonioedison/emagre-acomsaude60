import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Calculator, Timer, User } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Layout: React.FC = () => {
  const { themeConfig } = useGame();

  return (
    <div className="flex flex-col h-screen bg-slate-50 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      
      {/* Top Bar Removed per request - Header is now specific to Home page and scrolls with content */}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 scroll-smooth bg-gray-50">
        <Outlet />
      </div>

      {/* Bottom Nav */}
      <nav className="bg-white border-t border-gray-200 p-2 flex justify-around items-center fixed bottom-0 w-full max-w-md z-20 pb-6 pt-3">
        <NavLink 
            to="/" 
            className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? `${themeConfig.text} scale-110` : 'text-gray-400'}`}
        >
            <Home size={24} />
            <span className="text-xs font-medium mt-1">Início</span>
        </NavLink>
        <NavLink 
            to="/calculator" 
            className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? `${themeConfig.text} scale-110` : 'text-gray-400'}`}
        >
            <Calculator size={24} />
            <span className="text-xs font-medium mt-1">Calc GET</span>
        </NavLink>
        <NavLink 
            to="/tabata" 
            className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? `${themeConfig.text} scale-110` : 'text-gray-400'}`}
        >
            <Timer size={24} />
            <span className="text-xs font-medium mt-1">Treino</span>
        </NavLink>
        <NavLink 
            to="/profile" 
            className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? `${themeConfig.text} scale-110` : 'text-gray-400'}`}
        >
            <User size={24} />
            <span className="text-xs font-medium mt-1">Perfil</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;