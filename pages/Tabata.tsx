
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Tabata: React.FC = () => {
  const { addXp, triggerConfetti } = useGame();
  
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true); // true = work (20s), false = rest (10s)
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(20);
  
  const totalRounds = 8;
  const workTime = 20;
  const restTime = 10;
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handlePhaseChange();
    }

    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handlePhaseChange = () => {
    // Play sound? (Browser limitation requires user interaction first, usually fine here)
    
    if (isWork) {
      // Finished Work, start Rest
      if (round === totalRounds) {
        finishWorkout();
        return;
      }
      setIsWork(false);
      setTimeLeft(restTime);
    } else {
      // Finished Rest, start Work next round
      setRound((prev) => prev + 1);
      setIsWork(true);
      setTimeLeft(workTime);
    }
  };

  const finishWorkout = () => {
    setIsActive(false);
    setIsWork(true);
    setRound(1);
    setTimeLeft(workTime);
    triggerConfetti();
    addXp(200);
    alert("TREINO CONCLUÍDO! +200 XP");
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setIsWork(true);
    setRound(1);
    setTimeLeft(workTime);
  };

  const maxTime = isWork ? workTime : restTime;
  const percentage = (timeLeft / maxTime) * 100;
  
  // SVG Config
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-brand-darkGreen tracking-tight">TREINO TABATA</h1>
        <p className="text-gray-500">Queime gordura em 4 minutos</p>
      </div>

      {/* Timer Display */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-60 h-60 flex items-center justify-center mb-10">
            
            {/* SVG Progress Circle */}
            <svg className="absolute w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 256 256">
                {/* Background Track */}
                <circle
                    cx="128"
                    cy="128"
                    r={radius}
                    stroke="#F3F4F6"
                    strokeWidth="18"
                    fill="transparent"
                />
                
                {/* Progress Indicator */}
                <circle
                    cx="128"
                    cy="128"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="18"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    className={`transition-all duration-1000 ease-linear ${isWork ? 'text-brand-aqua' : 'text-brand-yellow'}`}
                    strokeLinecap="round"
                />
            </svg>

            <div className="text-center z-10">
                <div className={`text-7xl font-black ${isWork ? 'text-brand-darkGreen' : 'text-yellow-600'}`}>
                    {timeLeft}
                </div>
                <div className="text-lg font-bold text-gray-400 uppercase tracking-widest mt-2">
                    {isWork ? 'Exercício' : 'Descanso'}
                </div>
            </div>
        </div>

        {/* Rounds */}
        <div className="flex space-x-2 mb-6">
            {Array.from({ length: totalRounds }).map((_, i) => (
                <div 
                    key={i} 
                    className={`h-3 w-8 rounded-full transition-colors ${i < round ? 'bg-brand-aqua' : i === round - 1 && isActive ? 'bg-brand-yellow animate-pulse' : 'bg-gray-200'}`}
                />
            ))}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={toggleTimer}
            className={`flex items-center justify-center py-5 rounded-3xl shadow-xl text-white font-bold text-xl transition-colors ${isActive ? 'bg-red-500' : 'bg-brand-green'}`}
        >
            {isActive ? <><Pause className="mr-2" /> PAUSAR</> : <><Play className="mr-2" /> INICIAR</>}
        </motion.button>

        <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={resetTimer}
            className="flex items-center justify-center py-5 rounded-3xl shadow-lg bg-white text-gray-500 font-bold text-xl border border-gray-200"
        >
            <RefreshCw className="mr-2" /> RESET
        </motion.button>
      </div>
      
      {/* Informational Content Sections */}
      <div className="space-y-6 pt-4">
          
          {/* O que é Tabata? */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-orange-500 text-xl">🔥</span>
                <h3 className="text-lg font-bold text-gray-800">O que é Tabata?</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Protocolo de treino de alta intensidade: <strong className="text-gray-800">20 segundos de exercício intenso</strong> seguidos de <strong className="text-gray-800">10 segundos de descanso</strong>, repetido por <strong className="text-gray-800">8 rounds (4 minutos)</strong>.
            </p>

            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-red-50 p-2 rounded-xl border border-red-100">
                    <div className="text-xl font-black text-red-500">20s</div>
                    <div className="text-[10px] uppercase font-bold text-red-300">Trabalho</div>
                </div>
                <div className="bg-green-50 p-2 rounded-xl border border-green-100">
                    <div className="text-xl font-black text-green-500">10s</div>
                    <div className="text-[10px] uppercase font-bold text-green-300">Descanso</div>
                </div>
                 <div className="bg-orange-50 p-2 rounded-xl border border-orange-100">
                    <div className="text-xl font-black text-orange-400">8x</div>
                    <div className="text-[10px] uppercase font-bold text-orange-300">Rounds</div>
                </div>
            </div>
          </div>

          {/* Exercícios do Treino (New Section) */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-500 text-xl">💪</span>
                <h3 className="text-lg font-bold text-gray-800">Exercícios do Treino</h3>
            </div>
            <ul className="space-y-2">
                {[
                    "Jumping Jack (polichinelo)",
                    "Standing cross-body abdominal exercise",
                    "Alternating Jump",
                    "Squat jump",
                    "Cross Jump",
                    "Butt kick",
                    "Split Jump",
                    "Burpee"
                ].map((ex, i) => (
                    <li key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="bg-brand-aqua text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">
                            {i + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-700">{ex}</span>
                    </li>
                ))}
            </ul>
          </div>

          {/* Benefícios */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-3xl shadow-lg text-white">
             <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🚀</span>
                <h3 className="text-xl font-bold">Benefícios</h3>
            </div>
            <ul className="space-y-3">
                {[
                    "Queima até 15 calorias por minuto",
                    "Aumenta metabolismo por 24-48 horas",
                    "Melhora condicionamento cardiovascular",
                    "Pode ser feito em qualquer lugar",
                    "Resultado em apenas 4 minutos",
                    "Preserva massa muscular"
                ].map((item, i) => (
                    <li key={i} className="flex items-start text-sm font-medium opacity-95">
                        <span className="mr-2 font-bold mt-0.5">✓</span>
                        {item}
                    </li>
                ))}
            </ul>
          </div>

      </div>
    </div>
  );
};

export default Tabata;
