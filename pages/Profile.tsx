import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { LEVEL_THRESHOLDS, AVATARS, SHOP_ITEMS } from '../constants';
import { Edit2, TrendingUp, Sparkles, Check, Lock, Store, LogOut, Target, Activity, ThumbsUp, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile: React.FC = () => {
  const { userState, updateProfile, buyItem, equipItem, themeConfig, logout, deleteChallengeLog } = useGame();
  const nextLevelXp = LEVEL_THRESHOLDS[userState.level] || 10000;
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userState.name);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [selectedLogIndex, setSelectedLogIndex] = useState<number | null>(null);

  const handleSaveProfile = () => {
    updateProfile(tempName, userState.avatar);
    setIsEditing(false);
  };

  const handleAvatarSelect = (avatarId: string) => {
    updateProfile(userState.name, avatarId);
    setShowAvatarSelector(false);
  };

  const currentAvatar = AVATARS.find(a => a.id === userState.avatar) || AVATARS[0];
  
  // Get active frame style
  const activeFrameId = userState.activeCosmetics.frame;
  const activeFrame = SHOP_ITEMS.find(i => i.id === activeFrameId);
  const frameClass = activeFrame ? activeFrame.value : '';

  // --- Date Helpers for Calendars ---
  const getSafeDate = (dateString: string) => {
      // Append time to ensure local timezone parsing doesn't shift day back
      const parts = dateString.split('-');
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  };

  const formatDateParts = (date: Date) => {
      return {
          day: date.getDate(),
          month: date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase(),
          year: date.getFullYear()
      };
  };

  const installDateObj = getSafeDate(userState.installDate);
  const todayDateObj = new Date();

  const installParts = formatDateParts(installDateObj);
  const todayParts = formatDateParts(todayDateObj);

  // Helper para visuais dos itens
  const getItemVisual = (id: string) => {
    switch(id) {
        case 'theme_default': return { bg: 'bg-brand-aqua', icon: '💧' };
        case 'theme_coral': return { bg: 'bg-slate-500', icon: '🌅' };
        case 'theme_purple': return { bg: 'bg-blue-500', icon: '💜' };
        case 'confetti_default': return { bg: 'bg-blue-300', icon: '🎉' };
        case 'confetti_neon': return { bg: 'bg-slate-700', icon: '✨' };
        case 'confetti_rainbow': return { bg: 'bg-blue-500', icon: '🌈' };
        case 'frame_none': return { bg: 'bg-gray-200', icon: '🚫' };
        case 'frame_gold': return { bg: 'bg-purple-500', icon: '👑' };
        case 'frame_diamond': return { bg: 'bg-orange-400', icon: '💎' };
        default: return { bg: 'bg-gray-200', icon: '📦' };
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch(rarity) {
        case 'common': return 'bg-gray-500 text-white';
        case 'rare': return 'bg-blue-500 text-white';
        case 'epic': return 'bg-purple-500 text-white';
        case 'legendary': return 'bg-orange-500 text-white';
        default: return 'bg-gray-500 text-white';
    }
  };

  const getRarityLabel = (rarity: string) => {
      switch(rarity) {
          case 'common': return 'COMUM';
          case 'rare': return 'RARA';
          case 'epic': return 'EPICA';
          case 'legendary': return 'LENDARIA';
          default: return rarity;
      }
  };

  return (
    <div className="p-6 space-y-8 pb-24 bg-slate-50 min-h-screen">
      
      {/* --- PROFILE HEADER --- */}
      <div className={`relative bg-white rounded-3xl shadow-lg border border-gray-100 p-6 text-center overflow-visible`}>
         {/* Logout Button */}
         <button 
            onClick={logout}
            className="absolute top-4 left-4 text-gray-400 hover:text-red-500 transition-colors"
            title="Sair"
         >
            <LogOut size={18} />
         </button>

         {/* Edit Button */}
         <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-4 right-4 text-gray-400 hover:text-brand-aqua"
         >
            <Edit2 size={18} />
         </button>

         {/* Avatar */}
         <div className="relative inline-block mb-4">
            <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                className={`w-28 h-28 bg-gray-100 rounded-full flex items-end justify-center shadow-inner relative z-10 overflow-hidden ${frameClass}`}
            >
                {/* Body */}
                <div className={`w-24 h-12 rounded-t-3xl ${currentAvatar.shirtColor} absolute bottom-0`}></div>
                {/* Head */}
                <div className="text-5xl relative z-10 mb-4 drop-shadow-sm">{currentAvatar.icon}</div>

                <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md border border-gray-100 z-20">
                    <Edit2 size={12} className="text-gray-500" />
                </div>
            </motion.button>
         </div>

         {/* Avatar Selector */}
         {showAvatarSelector && (
             <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 mb-4 grid grid-cols-4 gap-2"
             >
                 {AVATARS.map(av => (
                     <button
                        key={av.id}
                        onClick={() => handleAvatarSelect(av.id)}
                        className={`relative aspect-square rounded-2xl overflow-hidden hover:bg-gray-100 transition-colors flex items-end justify-center bg-gray-50 ${userState.avatar === av.id ? 'ring-2 ring-brand-aqua' : ''}`}
                     >
                         <div className={`w-[80%] h-[45%] rounded-t-xl ${av.shirtColor} absolute bottom-0`}></div>
                         <div className="text-3xl relative z-10 mb-2">{av.icon}</div>
                     </button>
                 ))}
             </motion.div>
         )}

         {/* Name Editing */}
         {isEditing ? (
             <div className="flex flex-col gap-3 max-w-[240px] mx-auto">
                 <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full text-center font-bold text-lg bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-brand-aqua focus:ring-2 focus:ring-brand-aqua/20 text-gray-800 placeholder-gray-400 transition-all"
                    placeholder="Nome e Sobrenome"
                    autoFocus
                 />
                 <button 
                    onClick={handleSaveProfile}
                    className="bg-brand-aqua text-white text-xs font-bold py-2 px-4 rounded-full shadow-md hover:bg-brand-darkGreen transition-colors"
                 >
                    Salvar
                 </button>
             </div>
         ) : (
             <>
                <h2 className={`text-2xl font-bold ${themeConfig.text}`}>{userState.name}</h2>
                <p className="text-gray-500 font-medium text-sm">Nível {userState.level} • {userState.xp} XP</p>
             </>
         )}

         {/* XP Progress */}
         <div className="mt-6">
            <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                <span>Nível {userState.level}</span>
                <span>Nível {userState.level + 1}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ${themeConfig.bg}`}
                    style={{ width: `${Math.min(100, (userState.xp / nextLevelXp) * 100)}%` }}
                ></div>
            </div>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-2 gap-4">
        {/* Missions Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-full mb-3">
                <TrendingUp size={24} />
            </div>
            <div className="text-3xl font-black text-gray-800">{userState.completedSections.length}</div>
            <div className="text-xs text-gray-500 font-bold uppercase">Missões</div>
        </div>

        {/* Date Calendars (Replaces Streak) */}
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center gap-3">
            {/* Start Date */}
            <div className="flex items-center gap-3 border-b border-gray-50 pb-2">
                <div className="bg-blue-50 text-blue-600 rounded-lg p-1.5 min-w-[50px] text-center border border-blue-100 shadow-sm">
                    <div className="text-[9px] font-bold uppercase leading-none mb-0.5">{installParts.month}</div>
                    <div className="text-xl font-black leading-none">{installParts.day}</div>
                    <div className="text-[9px] font-bold opacity-80 leading-none mt-0.5">{installParts.year}</div>
                </div>
                <div className="text-left">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wide">Data inicio de uso app</span>
                </div>
            </div>

            {/* Current Date */}
            <div className="flex items-center gap-3 pt-0">
                <div className="bg-emerald-50 text-emerald-600 rounded-lg p-1.5 min-w-[50px] text-center border border-emerald-100 shadow-sm">
                    <div className="text-[9px] font-bold uppercase leading-none mb-0.5">{todayParts.month}</div>
                    <div className="text-xl font-black leading-none">{todayParts.day}</div>
                    <div className="text-[9px] font-bold opacity-80 leading-none mt-0.5">{todayParts.year}</div>
                </div>
                 <div className="text-left">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wide">Data Atual</span>
                </div>
            </div>
        </div>
      </div>

      {/* --- CHALLENGE LOG HISTORY --- */}
      {userState.challenge.logs && userState.challenge.logs.length > 0 && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-brand-aqua" />
                Histórico do Desafio
             </h3>
             <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 pt-2 px-1">
                 {[...userState.challenge.logs].reverse().map((log, i) => {
                     // Calculate the original index in the main logs array
                     const originalIndex = userState.challenge.logs.length - 1 - i;
                     const dateParts = formatDateParts(getSafeDate(log.date));
                     const isSelected = selectedLogIndex === i;
                     
                     return (
                         <div 
                            key={`${log.date}-${log.weight}-${i}`} 
                            onClick={() => setSelectedLogIndex(isSelected ? null : i)}
                            className={`flex-shrink-0 flex flex-col items-center gap-2 relative group cursor-pointer transition-all ${isSelected ? 'scale-105' : ''}`}
                         >
                             <div className={`bg-orange-50 text-orange-600 rounded-lg p-1.5 min-w-[50px] text-center border shadow-sm relative transition-all ${isSelected ? 'border-orange-300 ring-2 ring-orange-100' : 'border-orange-100'}`}>
                                <div className="text-[9px] font-bold uppercase leading-none mb-0.5">{dateParts.month}</div>
                                <div className="text-lg font-black leading-none">{dateParts.day}</div>
                             </div>
                             <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{log.weight}kg</span>
                             
                             {/* Delete Button - Only visible when selected */}
                             <AnimatePresence>
                                {isSelected && (
                                    <motion.button 
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteChallengeLog(originalIndex);
                                            setSelectedLogIndex(null);
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md z-10"
                                        title="Excluir Registro"
                                    >
                                        <X size={10} strokeWidth={3} />
                                    </motion.button>
                                )}
                             </AnimatePresence>
                         </div>
                     );
                 })}
             </div>
             <p className="text-[10px] text-gray-400 text-center italic mt-1">Toque na data para opções</p>
          </div>
      )}

      {/* --- USER GOALS & DATA (From Onboarding) --- */}
      {userState.stats && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 text-lg">Informações</h3>
            
            {userState.stats.goal && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-brand-aqua"><Target size={20} /></div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Objetivo</p>
                        <p className="font-bold text-gray-700">{userState.stats.goal}</p>
                    </div>
                </div>
            )}
            
            {userState.stats.frequency && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-brand-yellow"><Activity size={20} /></div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Prática de Exercícios</p>
                        <p className="font-bold text-gray-700">{userState.stats.frequency}</p>
                    </div>
                </div>
            )}

            {userState.stats.commitment && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-purple-500"><ThumbsUp size={20} /></div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Fará os exercícios todo dia?</p>
                        <p className="font-bold text-gray-700">{userState.stats.commitment}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase">Peso</p>
                    <p className="font-black text-gray-800">{userState.stats.weight} kg</p>
                </div>
                <div className="text-center border-l border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase">Altura</p>
                    <p className="font-black text-gray-800">{userState.stats.height} cm</p>
                </div>
                <div className="text-center border-l border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase">Idade</p>
                    <p className="font-black text-gray-800">{userState.stats.age}</p>
                </div>
            </div>
          </div>
      )}

      {/* --- SHOP --- */}
      <div className="pt-2">
        <div className="bg-[#FF7F50] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden flex items-center justify-between mb-8">
            <div className="relative z-10">
                <span className="text-orange-100 font-medium text-sm">Seu saldo</span>
                <div className="text-4xl font-extrabold flex items-center gap-2 mt-1">
                    <span className="opacity-70 text-2xl">©</span> {userState.coins}
                </div>
            </div>
            <div className="relative z-10">
                <Sparkles size={32} className="text-yellow-200 animate-pulse" />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full" />
            <div className="absolute top-10 left-10 w-10 h-10 bg-white opacity-10 rounded-full" />
        </div>

        {[
            { id: 'theme', label: 'Temas', icon: '🎨' },
            { id: 'confetti', label: 'Confetes', icon: '🎉' },
            { id: 'frame', label: 'Aros de Nível', icon: '⭐' }
        ].map((category) => (
            <div key={category.id} className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>{category.icon}</span> {category.label}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    {SHOP_ITEMS.filter(item => item.type === category.id && item.price > 0).map((item) => {
                        const visual = getItemVisual(item.id);
                        const isOwned = userState.inventory.includes(item.id);
                        const isEquipped = userState.activeCosmetics[item.type] === item.id;
                        const canAfford = userState.coins >= item.price;

                        return (
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                key={item.id}
                                onClick={() => isOwned ? equipItem(item) : buyItem(item)}
                                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col text-left group relative"
                            >
                                <div className={`h-28 ${visual.bg} flex items-center justify-center text-4xl relative`}>
                                    {visual.icon}
                                    {isEquipped && (
                                        <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                                            <Check size={14} className="text-green-500" strokeWidth={3} />
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 flex flex-col flex-1 justify-between">
                                    <div>
                                        <span className={`${getRarityBadge(item.rarity)} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase`}>
                                            {getRarityLabel(item.rarity)}
                                        </span>
                                        <h4 className="font-bold text-gray-800 text-sm mt-2 leading-tight">{item.name}</h4>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        {isOwned ? (
                                            <span className="text-xs font-bold text-green-500 uppercase tracking-wide">POSSUI</span>
                                        ) : (
                                            <div className="flex items-center gap-1 text-orange-500 font-bold text-sm">
                                                <span>©</span> {item.price}
                                            </div>
                                        )}
                                        
                                        {!isOwned && (
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${canAfford ? 'bg-orange-50 text-orange-500' : 'bg-gray-100 text-gray-300'}`}>
                                                <Lock size={14} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        ))}

        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl text-center shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
                <Store size={24} />
            </div>
            <h3 className="font-bold text-gray-800">Ganhe mais moedas!</h3>
            <p className="text-xs text-gray-500 mt-2 max-w-[200px] mx-auto">
                Complete missões, faça receitas e treine Tabata para ganhar moedas
            </p>
        </div>

      </div>
    </div>
  );
};

export default Profile;