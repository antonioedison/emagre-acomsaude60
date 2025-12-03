
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RefreshCw, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useGame } from '../context/GameContext';

// Atualizado para incluir referência a arquivos de vídeo
// Nota: O usuário deve adicionar os arquivos .mp4 na pasta public/videos/ com estes nomes
const EXERCISES_DATA = [
  { name: "Jumping Jack", emoji: "🤸", animation: "animate-jumping-jack", video: "polichinelo.mp4" },
  { name: "Standing Cross Crunches", emoji: "🧘", animation: "animate-twist", video: "abdominais.mp4" },
  { name: "Alternating Jump", emoji: "🏃", animation: "animate-alt-jump", video: "salto_alternado.mp4" },
  { name: "Squat jump", emoji: "🦵", animation: "animate-squat-jump", video: "agachamento_salto.mp4" },
  { name: "Cross Jump", emoji: "🙅", animation: "animate-cross-jump", video: "salto_cruzado.mp4" },
  { name: "Butt kick", emoji: "🦶", animation: "animate-butt-kick", video: "chute_gluteo.mp4" },
  { name: "Split Jump", emoji: "🕴️", animation: "animate-split-jump", video: "salto_abertura.mp4" },
  { name: "Burpee", emoji: "🐸", animation: "animate-burpee", video: "burpee.mp4" }
];

const Tabata: React.FC = () => {
  const { addXp, triggerConfetti } = useGame();
  
  const [isActive, setIsActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // Tracks if session is in progress
  const [isWork, setIsWork] = useState(true); // true = work (20s), false = rest (10s)
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(20);
  const [showWarning, setShowWarning] = useState(false);
  
  const totalRounds = 8;
  const workTime = 20;
  const restTime = 10;
  const timerRef = useRef<number | null>(null);
  
  // Reference for the Wake Lock Sentinel
  const wakeLockRef = useRef<any>(null);

  // Screen Wake Lock Logic
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
          console.log('Screen Wake Lock active');
        }
      } catch (err) {
        console.error(`${err} - Screen Wake Lock not supported or rejected`);
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
          console.log('Screen Wake Lock released');
        } catch (err) {
          console.error(err);
        }
      }
    };

    if (isActive) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    // Cleanup on unmount
    return () => {
      releaseWakeLock();
    };
  }, [isActive]);

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
    setHasStarted(false);
    setIsWork(true);
    setRound(1);
    setTimeLeft(workTime);
    triggerConfetti();
    addXp(200);
    alert("TREINO CONCLUÍDO! +200 XP");
  };

  const toggleTimer = () => {
      if (!isActive) setHasStarted(true);
      setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setHasStarted(false);
    setIsWork(true);
    setRound(1);
    setTimeLeft(workTime);
  };

  const maxTime = isWork ? workTime : restTime;
  const percentage = (timeLeft / maxTime) * 100;
  
  // SVG Config
  const radius = 90; // Reduced size slightly
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="p-4 space-y-3 pb-24">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-brand-darkGreen tracking-tight">TREINO TABATA</h1>
        <p className="text-gray-500 text-xs">Queime gordura em 4 minutos</p>
      </div>

      {/* O que é Tabata? (Compactado) */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-500 text-lg">🔥</span>
            <h3 className="text-base font-bold text-gray-800">O que é Treino Tabata?</h3>
        </div>
        
        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
            Protocolo de treino de alta intensidade: <strong className="text-gray-800">20 segundos de exercício intenso</strong> seguidos de <strong className="text-gray-800">10 segundos de descanso</strong>, repetido por <strong className="text-gray-800">8 rounds (4 minutos)</strong>.
        </p>

        <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-red-50 p-1.5 rounded-xl border border-red-100">
                <div className="text-lg font-black text-red-500">20s</div>
                <div className="text-[9px] uppercase font-bold text-red-300">Trabalho</div>
            </div>
            <div className="bg-green-50 p-1.5 rounded-xl border border-green-100">
                <div className="text-lg font-black text-green-500">10s</div>
                <div className="text-[9px] uppercase font-bold text-green-300">Descanso</div>
            </div>
             <div className="bg-orange-50 p-1.5 rounded-xl border border-orange-100">
                <div className="text-lg font-black text-orange-400">8x</div>
                <div className="text-[9px] uppercase font-bold text-orange-300">Rounds</div>
            </div>
        </div>
      </div>

      {/* Timer Display (More Compact) */}
      <div className="flex flex-col items-center justify-center -mt-2">
        <div className="relative w-52 h-52 flex items-center justify-center mb-4">
            
            {/* SVG Progress Circle */}
            <svg className="absolute w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 256 256">
                {/* Background Track */}
                <circle
                    cx="128"
                    cy="128"
                    r={radius}
                    stroke="#F3F4F6"
                    strokeWidth="16"
                    fill="transparent"
                />
                
                {/* Progress Indicator */}
                <circle
                    cx="128"
                    cy="128"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    className={`transition-all duration-1000 ease-linear ${isWork ? 'text-brand-aqua' : 'text-brand-yellow'}`}
                    strokeLinecap="round"
                />
            </svg>

            <div className="text-center z-10">
                <div className={`text-6xl font-black ${isWork ? 'text-brand-darkGreen' : 'text-yellow-600'}`}>
                    {timeLeft}
                </div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {isWork ? 'Exercício' : 'Descanso'}
                </div>
            </div>
        </div>

        {/* Rounds */}
        <div className="flex space-x-2 mb-2">
            {Array.from({ length: totalRounds }).map((_, i) => (
                <div 
                    key={i} 
                    className={`h-2 w-6 rounded-full transition-colors ${i < round ? 'bg-brand-aqua' : i === round - 1 && hasStarted ? 'bg-brand-yellow animate-pulse' : 'bg-gray-200'}`}
                />
            ))}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={toggleTimer}
            className={`flex items-center justify-center py-4 rounded-2xl shadow-xl text-white font-bold text-lg transition-colors ${isActive ? 'bg-red-500' : 'bg-brand-green'}`}
        >
            {isActive ? <><Pause className="mr-2" size={20} /> PAUSAR</> : <><Play className="mr-2" size={20} /> INICIAR</>}
        </motion.button>

        <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={resetTimer}
            className="flex items-center justify-center py-4 rounded-2xl shadow-lg bg-white text-gray-500 font-bold text-lg border border-gray-200"
        >
            <RefreshCw className="mr-2" size={20} /> RESET
        </motion.button>
      </div>
      
      {/* Informational Content Sections */}
      <div className="space-y-3 pt-2">
          
          {/* Exercícios do Treino (Lista Compacta) */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <ul className="space-y-1">
                {EXERCISES_DATA.map((ex, i) => (
                    <li key={i} className={`flex items-center gap-2 p-2 rounded-xl border transition-colors ${hasStarted && round === i + 1 ? 'bg-brand-aqua/10 border-brand-aqua ring-1 ring-brand-aqua' : 'bg-gray-50 border-gray-100'}`}>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm ${hasStarted && round === i + 1 ? 'bg-brand-aqua text-white' : 'bg-white text-gray-400'}`}>
                            {hasStarted && round === i + 1 ? ex.emoji : i + 1}
                        </span>
                        <span className={`text-xs font-medium ${hasStarted && round === i + 1 ? 'text-brand-darkGreen font-bold' : 'text-gray-700'}`}>
                            {ex.name}
                        </span>
                    </li>
                ))}
            </ul>
          </div>

          {/* WARNING BUTTON */}
          <div className="pt-2">
            <button
                onClick={() => setShowWarning(!showWarning)}
                className="w-full bg-red-50 text-red-600 font-bold py-3 px-4 rounded-2xl border border-red-200 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors shadow-sm"
            >
                <AlertTriangle size={20} />
                Atenção clique aqui
                {showWarning ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            <AnimatePresence>
                {showWarning && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-red-50 p-4 rounded-3xl border border-red-100 mt-2 text-sm text-gray-700 space-y-4 shadow-inner">
                            <div>
                                <h4 className="font-bold text-red-700 text-lg mb-1 flex items-center gap-2">
                                    <AlertTriangle size={18} /> Atenção
                                </h4>
                                <p className="leading-relaxed">
                                    Antes de fazer os exercícios do treino Tabata, é importante você tomar algumas precauções para evitar possíveis lesões, tonturas e vertigem em caso de estar sendo executado com a técnica inadequada, especialmente por ser um treino de alta intensidade o risco aumenta devido à rapidez e à fadiga muscular que o método Tabata impõe.
                                </p>
                            </div>

                            <div className="bg-white p-3 rounded-2xl border border-red-100">
                                <h5 className="font-bold text-red-600 mb-2 uppercase text-xs tracking-wider">Como Minimizar os Riscos</h5>
                                <ul className="space-y-3">
                                    <li>
                                        <strong className="text-gray-900 block mb-1">Aprenda a técnica correta:</strong>
                                        Priorize uma forma confortável sem muita velocidade, especialmente no início. Mantenha o abdômen contraído e a coluna reta durante todo o movimento.
                                    </li>
                                    <li>
                                        <strong className="text-gray-900 block mb-1">Progrida gradualmente:</strong>
                                        Se você é iniciante, comece com o primeiro exercício de forma lenta e controlada, repita só ele nos 8 rounds, e vá subindo de nível aos poucos fazendo cada exercício por vez, até aprender fazer corretamente, mais não tenha pressa, se sentir muita dificuldade faça no seu tempo e depois vá aumentando a intensidade conforme seu condicionamento físico e a técnica melhorar.
                                    </li>
                                    <li>
                                        <strong className="text-gray-900 block mb-1">Aquecimento:</strong>
                                        Nunca pule o aquecimento. Ele prepara os músculos e articulações para a intensidade do exercício.
                                    </li>
                                    <li>
                                        <strong className="text-gray-900 block mb-1">Ouça seu corpo:</strong>
                                        Em um treino Tabata, o objetivo é o esforço máximo, mas a dor é um sinal de alerta. Se sentir dor aguda, pare imediatamente.
                                    </li>
                                    <li>
                                        <strong className="text-gray-900 block mb-1">Consulte um profissional:</strong>
                                        Um educador físico pode orientar sobre a técnica correta e adaptar o exercício às suas necessidades e limitações.
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-red-100 p-3 rounded-2xl border border-red-200">
                                <p className="text-red-800 font-medium italic">
                                    "O exercício Burpee é o mais difícil de se executar, ainda mais fazendo várias repetições, faça de forma lenta, você pode só caminhar com os pés para trás em vez de saltar, a princípio faça poucas repetições priorizando sua energia evitando extremo cansaço."
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* Benefícios */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-3xl shadow-lg text-white">
             <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🚀</span>
                <h3 className="text-base font-bold">Benefícios</h3>
            </div>
            <ul className="space-y-2">
                {[
                    "Queima até 15 calorias por minuto",
                    "Aumenta metabolismo por 24-48h",
                    "Melhora cardio e massa muscular",
                    "Apenas 4 minutos do seu dia"
                ].map((item, i) => (
                    <li key={i} className="flex items-start text-xs font-medium opacity-95">
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
