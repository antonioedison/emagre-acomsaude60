
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { SECTIONS, LEVEL_THRESHOLDS, CHALLENGE_QUOTES } from '../constants';
import * as Icons from 'lucide-react';
import { Calendar, AlertTriangle, RefreshCw, Sparkles, Star, Zap, Flame, Quote, Save, Scale, ClipboardList, Clock, Apple, Timer } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { userState, startChallenge, resetChallenge, logChallengeWeight } = useGame();
  
  // Progress Calculation
  const nextLevelXp = LEVEL_THRESHOLDS[userState.level] || 10000;
  const currentLevelXp = LEVEL_THRESHOLDS[userState.level - 1] || 0;
  const progress = Math.min(100, Math.max(0, ((userState.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));

  // Challenge Form State
  const [challengeWeight, setChallengeWeight] = useState('');
  const [challengeLoss, setChallengeLoss] = useState('');
  const [challengeError, setChallengeError] = useState('');
  const [daysPassed, setDaysPassed] = useState(0);

  // Log Progress State
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logWeight, setLogWeight] = useState('');

  useEffect(() => {
    if (userState.challenge.isActive && userState.challenge.startDate) {
        const start = new Date(userState.challenge.startDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        setDaysPassed(Math.min(60, diffDays)); // Cap at 60
    }
  }, [userState.challenge]);

  const handleStartChallenge = () => {
    const w = parseFloat(challengeWeight);
    const l = parseFloat(challengeLoss);

    if (!w || !l) {
        setChallengeError('Preencha todos os campos.');
        return;
    }

    if (l > 10) {
        setChallengeError('Acima de 10 quilos em 60 dias prejudicará sua saúde.');
        return;
    }

    setChallengeError('');
    startChallenge(w, l);
  };

  const handleLogWeight = () => {
      const w = parseFloat(logWeight);
      if (!w || !logDate) return;
      logChallengeWeight(w, logDate);
      setLogWeight('');
      alert('Peso registrado com sucesso! Confira no seu perfil.');
  };

  // Helper to dynamically get icon component
  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon size={28} className="text-white" /> : null;
  };

  // Determine current motivational quote
  const quoteIndex = Math.min(Math.floor(daysPassed / 5), CHALLENGE_QUOTES.length - 1);
  const currentQuote = userState.challenge.isActive 
      ? CHALLENGE_QUOTES[quoteIndex] 
      : "Inicie o desafio para transformar sua vida!";

  // Filter out the 'valuable-tips' section from the grid because it has a special button
  const gridSections = SECTIONS.filter(s => s.id !== 'valuable-tips');

  return (
    <div className="p-4 space-y-6 pb-24">
      
      {/* --- NEW HEADER STATS SECTION (Scrolls with page) --- */}
      <div className="space-y-4 pt-2">
         {/* Level Card */}
         <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-end mb-3">
                 <div className="flex items-center gap-3">
                     <div className="bg-brand-yellow w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shadow-yellow-200">
                         <Zap fill="currentColor" size={20} />
                     </div>
                     <div>
                         <h2 className="font-bold text-gray-800 text-lg leading-none">Nível {userState.level}</h2>
                         <p className="text-xs text-gray-400 font-bold mt-1">{userState.xp}/{nextLevelXp} XP</p>
                     </div>
                 </div>
                 <div className="text-right">
                     <span className="text-brand-aqua font-black text-xl">{userState.xp}</span>
                     <p className="text-[10px] text-gray-400 font-bold uppercase">XP Total</p>
                 </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-brand-aqua rounded-full shadow-[0_0_10px_rgba(72,202,228,0.5)]" 
                />
            </div>
         </div>

         {/* Motivational Quote Card - Replaces Streak */}
         <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-5 text-white relative overflow-hidden shadow-lg shadow-orange-200 flex items-center justify-between min-h-[100px]">
            <div className="relative z-10 max-w-[85%]">
               <div className="flex items-center gap-2 mb-1 opacity-75">
                    <Quote size={16} fill="currentColor" />
                    <span className="text-xs font-bold uppercase tracking-wider">Motivação Diária</span>
               </div>
               <p className="text-lg font-bold leading-tight italic">
                   "{currentQuote}"
               </p>
            </div>
            <div className="relative z-10">
                <Flame fill="currentColor" size={24} className="opacity-80" />
            </div>
            {/* Decoration */}
            <Flame className="absolute right-[-15px] bottom-[-20px] opacity-10 w-32 h-32 rotate-12" />
         </div>
      </div>

      {/* Title Header */}
      <div className="text-center py-2">
        <h1 className="text-3xl font-extrabold text-green-600">
          Emagreça com <span className="text-brand-yellow drop-shadow-sm stroke-black">Saúde</span>
        </h1>
        <p className="text-gray-500 mt-1 text-sm font-medium">Seu guia diário para uma vida leve e saudável</p>
      </div>

      {/* 60-Day Challenge Section */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        {!userState.challenge.isActive ? (
            // Inactive State: Form
            <div className="p-5 bg-gradient-to-br from-brand-darkGreen to-brand-aqua text-white">
                <div className="flex items-center gap-2 mb-3">
                    <Calendar className="text-brand-yellow" />
                    <h3 className="font-bold text-lg">Desafio 60 Dias</h3>
                </div>
                <p className="text-sm mb-4 opacity-90">Defina sua meta e acompanhe sua evolução diária!</p>
                
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-bold uppercase opacity-80 ml-1">Peso Atual (kg)</label>
                        <input 
                            type="number" 
                            value={challengeWeight}
                            onChange={(e) => setChallengeWeight(e.target.value)}
                            className="w-full p-2 rounded-xl text-gray-800 font-bold outline-none border-2 border-transparent focus:border-brand-yellow"
                            placeholder="Ex: 80"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase opacity-80 ml-1">Quero perder (Máx 10kg)</label>
                        <input 
                            type="number" 
                            value={challengeLoss}
                            onChange={(e) => setChallengeLoss(e.target.value)}
                            className="w-full p-2 rounded-xl text-gray-800 font-bold outline-none border-2 border-transparent focus:border-brand-yellow"
                            placeholder="Ex: 5"
                        />
                    </div>
                    
                    {challengeError && (
                        <div className="bg-red-500/20 border border-red-500/50 p-2 rounded-lg text-xs font-bold flex items-center gap-2">
                            <AlertTriangle size={14} />
                            {challengeError}
                        </div>
                    )}

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStartChallenge}
                        className="w-full bg-brand-yellow text-brand-darkGreen font-extrabold py-3 rounded-xl shadow-md mt-2"
                    >
                        ACEITAR DESAFIO
                    </motion.button>
                </div>
            </div>
        ) : (
            // Active State: Tracker
            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-brand-darkGreen text-lg flex items-center gap-2">
                            <Calendar size={20} className="text-brand-aqua" /> 
                            Desafio 60 Dias
                        </h3>
                        <p className="text-xs text-gray-400 font-medium">Foco total no objetivo!</p>
                    </div>
                    <button onClick={resetChallenge} className="text-gray-300 hover:text-red-400 transition-colors">
                        <RefreshCw size={16} />
                    </button>
                </div>

                <div className="flex items-end justify-between mb-2">
                    <div className="text-4xl font-black text-brand-yellow">{daysPassed}</div>
                    <div className="text-sm font-bold text-gray-400 pb-1">/ 60 dias</div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-4 shadow-inner">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(daysPassed / 60) * 100}%` }}
                        className="h-full bg-gradient-to-r from-brand-aqua to-brand-green"
                    />
                </div>

                <div className="flex justify-between text-sm bg-gray-50 p-3 rounded-xl mb-4">
                    <div className="flex flex-col items-center w-1/2 border-r border-gray-200">
                        <span className="text-gray-400 text-xs font-bold uppercase">Início</span>
                        <span className="font-bold text-gray-700">{userState.challenge.startWeight} kg</span>
                    </div>
                    <div className="flex flex-col items-center w-1/2">
                        <span className="text-brand-aqua text-xs font-bold uppercase">Meta</span>
                        <span className="font-bold text-brand-darkGreen">
                            {(userState.challenge.startWeight - userState.challenge.targetLoss).toFixed(1)} kg
                        </span>
                    </div>
                </div>

                {/* Weight Log Section */}
                <div className="border-t border-gray-100 pt-4 mt-2">
                     <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Scale size={16} className="text-brand-aqua" /> Registrar peso obtido
                     </h4>
                     <div className="flex gap-2">
                         <input 
                            type="date" 
                            value={logDate}
                            onChange={(e) => setLogDate(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold p-2 text-gray-600 outline-none w-[110px]"
                         />
                         <input 
                            type="number" 
                            placeholder="Kg"
                            value={logWeight}
                            onChange={(e) => setLogWeight(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold p-2 text-gray-800 outline-none w-[60px]"
                         />
                         <button 
                            onClick={handleLogWeight}
                            className="bg-brand-aqua text-white rounded-lg p-2 flex-1 flex items-center justify-center font-bold text-xs hover:bg-brand-darkGreen transition-colors"
                         >
                            <Save size={14} className="mr-1" /> Salvar
                         </button>
                     </div>
                </div>
            </div>
        )}
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-2 gap-4">
        {gridSections.map((section) => {
            const isCompleted = userState.completedSections.includes(section.id);
            
            return (
                <motion.button
                    key={section.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        if (section.id === 'tabata') {
                            navigate('/tabata');
                        } else {
                            navigate(`/content/${section.id}`);
                        }
                    }}
                    className={`relative p-4 rounded-2xl shadow-lg flex flex-col items-center justify-between text-center min-h-[140px] overflow-hidden ${isCompleted ? 'bg-gray-100 opacity-90' : 'bg-white'}`}
                >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-md ${section.color}`}>
                        {getIcon(section.icon)}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 leading-tight">{section.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">+{section.xpReward} XP</p>
                    </div>
                    
                    {isCompleted && (
                        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                            <Icons.Check size={12} className="text-white" />
                        </div>
                    )}
                </motion.button>
            );
        })}
      </div>

      {/* Dicas Valiosas Button */}
      <div className="pb-10">
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/content/valuable-tips')}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 p-5 rounded-3xl shadow-lg border border-pink-400/50 text-white relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-4 opacity-20 transform group-hover:scale-110 transition-transform">
                <Sparkles size={80} />
            </div>
            
            <div className="relative z-10 flex flex-col items-start text-left">
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-2 flex items-center gap-1 backdrop-blur-sm">
                    <Star size={12} fill="currentColor" /> Conteúdo Extra!
                </div>
                <h3 className="text-2xl font-extrabold mb-1">Dicas Valiosas</h3>
                <h4 className="font-bold opacity-90 text-sm mb-3">Dicas para turbinar seus resultados</h4>
                <p className="text-xs text-pink-100 max-w-[85%] leading-relaxed">
                    Sucos poderosos, cardápios prontos e dicas de ouro para acelerar ainda mais seus resultados.
                </p>
            </div>
        </motion.button>
      </div>
    </div>
  );
};

export default Home;
