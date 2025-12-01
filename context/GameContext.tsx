import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { UserState, ShopItem } from '../types';
import { LEVEL_THRESHOLDS, SHOP_ITEMS } from '../constants';

interface GameContextType {
  userState: UserState;
  daysInApp: number;
  isAuthenticated: boolean;
  isLoading: boolean;
  addXp: (amount: number) => void;
  completeSection: (sectionId: string, xp: number) => void;
  updateStats: (stats: UserState['stats']) => void;
  completeOnboarding: (data: any) => void;
  updateWater: (current: number, goal?: number) => void;
  triggerConfetti: () => void;
  startChallenge: (weight: number, loss: number) => void;
  logChallengeWeight: (weight: number, date: string) => void;
  deleteChallengeLog: (index: number) => void;
  resetChallenge: () => void;
  updateProfile: (name: string, avatar: string) => void;
  buyItem: (item: ShopItem) => void;
  equipItem: (item: ShopItem) => void;
  themeConfig: any;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const defaultState: UserState = {
  xp: 0,
  coins: 0,
  level: 1,
  completedSections: [],
  streak: 1,
  lastLoginDate: new Date().toISOString().split('T')[0],
  installDate: new Date().toISOString().split('T')[0],
  name: 'Motivado',
  avatar: 'woman_blonde',
  onboardingCompleted: false, // Default false
  inventory: ['theme_default', 'confetti_default', 'frame_none'],
  activeCosmetics: {
    theme: 'theme_default',
    confetti: 'confetti_default',
    frame: 'frame_none'
  },
  water: { current: 0, goal: 8 },
  challenge: {
    isActive: false,
    startDate: null,
    startWeight: 0,
    targetLoss: 0,
    logs: []
  }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(localStorage.getItem('app_current_session'));
  const [userState, setUserState] = useState<UserState>(defaultState);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load User Data when Session Changes
  useEffect(() => {
    const loadData = async () => {
        // Only trigger loading if we don't have auth yet or email changed significantly
        if (!isAuthenticated || (currentUserEmail && userState.name === 'Motivado' && userState.xp === 0)) {
            setIsLoading(true);
        }
        
        if (currentUserEmail) {
          // Simulate small network delay for realism/consistency only on initial load
          if (!isAuthenticated) await new Promise(resolve => setTimeout(resolve, 100));
          
          const savedData = localStorage.getItem(`app_data_${currentUserEmail}`);
          if (savedData) {
            setUserState(JSON.parse(savedData));
          } else {
             // Keep default if nothing saved yet
          }
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUserState(defaultState);
        }
        setIsLoading(false);
    };
    
    loadData();
  }, [currentUserEmail]);

  // Save User Data whenever state changes (if logged in)
  useEffect(() => {
    if (currentUserEmail && isAuthenticated && !isLoading) {
      localStorage.setItem(`app_data_${currentUserEmail}`, JSON.stringify(userState));
    }
  }, [userState, currentUserEmail, isAuthenticated, isLoading]);

  // AUTH ACTIONS
  const login = async (email: string, pass: string): Promise<boolean> => {
    const usersStr = localStorage.getItem('app_users');
    const users = usersStr ? JSON.parse(usersStr) : {};
    
    if (users[email] && users[email].password === pass) {
      localStorage.setItem('app_current_session', email);
      
      // CRITICAL FIX: Manually load state and set Auth TRUE immediately.
      // This prevents the race condition where the router checks Auth before the useEffect runs.
      const savedData = localStorage.getItem(`app_data_${email}`);
      if (savedData) {
        setUserState(JSON.parse(savedData));
      } else {
         setUserState({ ...defaultState, name: users[email].name });
      }

      setCurrentUserEmail(email);
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    const usersStr = localStorage.getItem('app_users');
    const users = usersStr ? JSON.parse(usersStr) : {};

    if (users[email]) {
      return false; // User exists
    }

    // Save Creds
    users[email] = { password: pass, name: name };
    localStorage.setItem('app_users', JSON.stringify(users));

    // Initialize Data
    const newState = { ...defaultState, name: name, installDate: new Date().toISOString().split('T')[0] };
    localStorage.setItem(`app_data_${email}`, JSON.stringify(newState));

    // Auto Login
    localStorage.setItem('app_current_session', email);
    setCurrentUserEmail(email);
    setUserState(newState);
    setIsAuthenticated(true);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('app_current_session');
    setCurrentUserEmail(null);
    setIsAuthenticated(false);
    setUserState(defaultState);
  };

  // --- GAME LOGIC ---

  const calculateDaysInApp = () => {
    const start = new Date(userState.installDate);
    const now = new Date();
    start.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    const diffTime = now.getTime() - start.getTime();
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const safeDays = Math.max(0, totalDays);
    return (safeDays % 365) + 1;
  };

  const daysInApp = calculateDaysInApp();

  // Daily Streak Logic
  useEffect(() => {
    if (!isAuthenticated || isLoading) return;
    
    const today = new Date().toISOString().split('T')[0];
    if (userState.lastLoginDate !== today) {
      const lastDate = new Date(userState.lastLoginDate);
      const diffTime = Math.abs(new Date().getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      let newStreak = userState.streak;
      if (diffDays === 1) {
        newStreak += 1; // Consecutive day
      } else if (diffDays > 1) {
        newStreak = 1; // Streak broken
      }

      setUserState(prev => ({ 
          ...prev, 
          lastLoginDate: today, 
          streak: newStreak,
          water: { ...prev.water, current: 0 } 
      }));
    }
  }, [isAuthenticated, userState.lastLoginDate, isLoading]);

  const getThemeConfig = () => {
    const themeId = userState.activeCosmetics.theme;
    const item = SHOP_ITEMS.find(i => i.id === themeId);
    return item ? item.value : SHOP_ITEMS[0].value;
  };

  const getConfettiConfig = () => {
      const confettiId = userState.activeCosmetics.confetti;
      const item = SHOP_ITEMS.find(i => i.id === confettiId);
      return item ? item.value : undefined;
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: getConfettiConfig() || ['#00B4D8', '#FFD60A', '#48CAE4']
    });
  };

  const calculateLevel = (xp: number) => {
    let level = 1;
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    }
    return level;
  };

  const addXp = (amount: number) => {
    setUserState(prev => {
      const newXp = prev.xp + amount;
      const newLevel = calculateLevel(newXp);
      
      if (newLevel > prev.level) {
        setTimeout(() => {
            triggerConfetti();
            alert(`PARABÉNS! VOCÊ SUBIU PARA O NÍVEL ${newLevel}!`);
        }, 500);
      }
      const newCoins = (prev.coins || 0) + amount;
      return { ...prev, xp: newXp, coins: newCoins, level: newLevel };
    });
  };

  const completeSection = (sectionId: string, xp: number) => {
    if (!userState.completedSections.includes(sectionId)) {
      triggerConfetti();
      addXp(xp);
      setUserState(prev => ({
        ...prev,
        completedSections: [...prev.completedSections, sectionId]
      }));
    }
  };

  const updateStats = (stats: UserState['stats']) => {
    setUserState(prev => ({ ...prev, stats }));
    triggerConfetti();
    addXp(50);
  };

  const completeOnboarding = (data: any) => {
    // Force immediate save to prevent race conditions or closing app before sync
    const updatedState: UserState = {
        ...userState,
        stats: { ...userState.stats, ...data, activityLevel: 1.2, bmr: 0, tdee: 0 },
        onboardingCompleted: true
    };
    
    setUserState(updatedState);
    if (currentUserEmail) {
        localStorage.setItem(`app_data_${currentUserEmail}`, JSON.stringify(updatedState));
    }
    
    triggerConfetti();
    addXp(100);
  };

  const updateWater = (current: number, goal?: number) => {
    setUserState(prev => ({
        ...prev,
        water: { current: current, goal: goal !== undefined ? goal : prev.water.goal }
    }));
  };

  const startChallenge = (weight: number, loss: number) => {
    setUserState(prev => ({
        ...prev,
        challenge: {
            isActive: true,
            startDate: new Date().toISOString(),
            startWeight: weight,
            targetLoss: loss,
            logs: []
        }
    }));
    triggerConfetti();
  };

  const logChallengeWeight = (weight: number, date: string) => {
    setUserState(prev => ({
        ...prev,
        challenge: {
            ...prev.challenge,
            logs: [...(prev.challenge.logs || []), { date, weight }]
        }
    }));
    triggerConfetti();
  };

  const deleteChallengeLog = (index: number) => {
    // No confirmation needed, immediate deletion
    setUserState(prev => {
        const newLogs = [...(prev.challenge.logs || [])];
        newLogs.splice(index, 1);
        return {
            ...prev,
            challenge: {
                ...prev.challenge,
                logs: newLogs
            }
        };
    });
  };

  const resetChallenge = () => {
    if (window.confirm("Tem certeza que deseja reiniciar o desafio dos 60 dias? Todo o progresso será perdido.")) {
        setUserState(prev => ({
            ...prev,
            challenge: { isActive: false, startDate: null, startWeight: 0, targetLoss: 0, logs: [] }
        }));
    }
  };

  const updateProfile = (name: string, avatar: string) => {
      setUserState(prev => ({ ...prev, name, avatar }));
  };

  const buyItem = (item: ShopItem) => {
    if (userState.coins >= item.price) {
        if (!userState.inventory.includes(item.id)) {
            setUserState(prev => ({
                ...prev,
                coins: prev.coins - item.price,
                inventory: [...prev.inventory, item.id]
            }));
            triggerConfetti();
        }
    } else {
        alert("Moedas insuficientes!");
    }
  };

  const equipItem = (item: ShopItem) => {
    if (userState.inventory.includes(item.id)) {
        setUserState(prev => ({
            ...prev,
            activeCosmetics: { ...prev.activeCosmetics, [item.type]: item.id }
        }));
    }
  };

  return (
    <GameContext.Provider value={{ 
        userState, daysInApp, isAuthenticated, isLoading, addXp, completeSection, updateStats, updateWater, triggerConfetti, 
        startChallenge, resetChallenge, logChallengeWeight, deleteChallengeLog, updateProfile, buyItem, equipItem, login, register, logout, completeOnboarding,
        themeConfig: getThemeConfig()
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};