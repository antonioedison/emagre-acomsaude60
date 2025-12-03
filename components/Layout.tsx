
import React, { useEffect, useRef } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Calculator, Timer, User } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Layout: React.FC = () => {
  const { themeConfig } = useGame();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when route changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 max-w-md mx-auto shadow-2xl overflow-hidden relative transition-colors duration-300">
      
      {/* Top Bar Removed per request - Header is now specific to Home page and scrolls with content */}

      {/* Main Content Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar pb-24 scroll-smooth bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        <Outlet />
      </div>

      {/* Bottom Nav */}
      <nav className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 p-2 flex justify-around items-center fixed bottom-0 w-full max-w-md z-20 pb-6 pt-3 transition-colors duration-300">
        <NavLink 
            to="/" 
            className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? `${themeConfig.text} scale-110` : 'text-gray-400 dark:text-gray-500'}`}
        >
            <Home size={24} />
            <span className="text-xs font-medium mt-1">Início</span>
        </NavLink>
        <NavLink 
            to="/calculator" 
            className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? `${themeConfig.text} scale-110` : 'text-gray-400 dark:text-gray-500'}`}
        >
            <Calculator size={24} />
            <span className="text-xs font-medium mt-1">Calc GET</span>
        </NavLink>
        <NavLink 
            to="/tabata" 
            className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? `${themeConfig.text} scale-110` : 'text-gray-400 dark:text-gray-500'}`}
        >
            <Timer size={24} />
            <span className="text-xs font-medium mt-1">Treino</span>
        </NavLink>
        <NavLink 
            to="/profile" 
            className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? `${themeConfig.text} scale-110` : 'text-gray-400 dark:text-gray-500'}`}
        >
            <User size={24} />
            <span className="text-xs font-medium mt-1">Perfil</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;