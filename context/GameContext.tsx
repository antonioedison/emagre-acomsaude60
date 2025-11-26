
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { UserState, ShopItem } from '../types';
import { LEVEL_THRESHOLDS, SHOP_ITEMS } from '../constants';

interface GameContextType {
  userState: UserState;
  daysInApp: number; // Calculated value
  addXp: (amount: number) => void;
  completeSection: (sectionId: string, xp: number) => void;
  updateStats: (stats: UserState['stats']) => void;
  updateWater: (current: number, goal?: number) => void;
  triggerConfetti: () => void;
  startChallenge: (weight: number, loss: number) => void;
  resetChallenge: () => void;
  updateProfile: (name: string, avatar: string) => void;
  buyItem: (item: ShopItem) => void;
  equipItem: (item: ShopItem) => void;
  themeConfig: any;
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
    targetLoss: 0
  }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('emagrecer-app-state');
    const parsed = saved ? JSON.parse(saved) : defaultState;
    
    // Migrations
    if (!parsed.challenge) parsed.challenge = defaultState.challenge;
    if (parsed.coins === undefined) parsed.coins = parsed.xp; 
    if (!parsed.inventory) parsed.inventory = defaultState.inventory;
    if (!parsed.activeCosmetics) parsed.activeCosmetics = defaultState.activeCosmetics;
    if (!parsed.avatar) parsed.avatar = defaultState.avatar;
    if (!parsed.installDate) parsed.installDate = defaultState.installDate; // Set install date for existing users
    
    // Ensure name defaults to Motivado if it was the old default or empty
    if (parsed.name === 'Viajante' || !parsed.name) parsed.name = 'Motivado';

    return parsed;
  });

  // Calculate Days in App (1-365 Cycle)
  const calculateDaysInApp = () => {
    const start = new Date(userState.installDate);
    const now = new Date();
    
    // Reset time part to ensure we count full days based on date, not exact time
    start.setHours(0,0,0,0);
    now.setHours(0,0,0,0);

    const diffTime = now.getTime() - start.getTime();
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Ensure non-negative (safeDays is 0 for first day, 1 for second, etc.)
    const safeDays = Math.max(0, totalDays);
    
    // Cycle 1-365 logic:
    // Day 0 (Install) -> (0 % 365) + 1 = 1
    // Day 364 -> (364 % 365) + 1 = 365
    // Day 365 -> (365 % 365) + 1 = 1 (Reset)
    return (safeDays % 365) + 1;
  };

  const daysInApp = calculateDaysInApp();

  useEffect(() => {
    localStorage.setItem('emagrecer-app-state', JSON.stringify(userState));
  }, [userState]);

  // Daily Streak Logic
  useEffect(() => {
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
          water: { ...prev.water, current: 0 } // Reset water daily
      }));
    }
  }, []);

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

      // Add coins equal to XP gained (1:1 ratio)
      const newCoins = (prev.coins || 0) + amount;

      return {
        ...prev,
        xp: newXp,
        coins: newCoins,
        level: newLevel
      };
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

  const updateWater = (current: number, goal?: number) => {
    setUserState(prev => ({
        ...prev,
        water: {
            current: current,
            goal: goal !== undefined ? goal : prev.water.goal
        }
    }));
  };

  const startChallenge = (weight: number, loss: number) => {
    setUserState(prev => ({
        ...prev,
        challenge: {
            isActive: true,
            startDate: new Date().toISOString(),
            startWeight: weight,
            targetLoss: loss
        }
    }));
    triggerConfetti();
  };

  const resetChallenge = () => {
    if (window.confirm("Tem certeza que deseja reiniciar o desafio dos 60 dias? Todo o progresso será perdido.")) {
        setUserState(prev => ({
            ...prev,
            challenge: {
                isActive: false,
                startDate: null,
                startWeight: 0,
                targetLoss: 0
            }
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
            activeCosmetics: {
                ...prev.activeCosmetics,
                [item.type]: item.id
            }
        }));
    }
  };

  return (
    <GameContext.Provider value={{ 
        userState, daysInApp, addXp, completeSection, updateStats, updateWater, triggerConfetti, 
        startChallenge, resetChallenge, updateProfile, buyItem, equipItem,
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
