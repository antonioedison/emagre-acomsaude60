
export interface Recipe {
  name: string;
  ingredients: string[];
  preparation: string[];
  benefits?: string;
  image?: string;
}

export interface ContentSection {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  color: string;
  xpReward: number;
  contentType: 'recipe-list' | 'text-list' | 'guide' | 'avoid-list' | 'valuable-tips';
  data: any; 
}

export interface ChallengeState {
  isActive: boolean;
  startDate: string | null;
  startWeight: number;
  targetLoss: number;
}

export type ItemType = 'theme' | 'confetti' | 'frame';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ShopItem {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  price: number;
  rarity: Rarity;
  value: any; // Holds color codes, config objects, etc.
}

export interface UserState {
  xp: number;
  coins: number; // New currency
  level: number;
  completedSections: string[];
  streak: number;
  lastLoginDate: string;
  installDate: string; // Tracks when user started for the 365 day cycle
  name: string;
  avatar: string; // Emoji or ID
  stats?: {
    weight: number;
    height: number;
    age: number;
    gender: 'male' | 'female';
    activityLevel: number;
    bmr: number;
    tdee: number;
  };
  water: {
    current: number;
    goal: number;
  };
  challenge: ChallengeState;
  inventory: string[]; // List of owned item IDs
  activeCosmetics: {
    theme: string;
    confetti: string;
    frame: string;
  };
}

export interface TabataState {
  isActive: boolean;
  isWork: boolean;
  round: number;
  timeLeft: number;
}
