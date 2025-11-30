
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ClipboardList, Target, Activity, Ruler, Weight, User, ThumbsUp, CheckCircle, Utensils, TrendingUp, Coffee, Sun, Moon, Sunrise } from 'lucide-react';
import { motion } from 'framer-motion';
import { SECTIONS } from '../constants';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding, userState } = useGame();
  
  // Security Check: If user already completed onboarding, redirect to Home immediately
  useEffect(() => {
    if (userState.onboardingCompleted) {
        navigate('/', { replace: true });
    }
  }, [userState.onboardingCompleted, navigate]);

  // Ref for scrolling container
  const scrollRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'female', // Default
    goal: '',
    frequency: '',
    commitment: ''
  });

  const [results, setResults] = useState<{
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      msg: string;
      menu: {
          breakfast: string;
          lunch: string;
          tea: string;
          dinner: string;
      };
  } | null>(null);

  // Scroll to top whenever step changes
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
    }
  }, [step]);

  const calculatePlan = () => {
      const w = parseFloat(formData.weight);
      const h = parseFloat(formData.height);
      const a = parseFloat(formData.age);
      
      // 1. TMB (Mifflin-St Jeor)
      let bmr = (10 * w) + (6.25 * h) - (5 * a);
      bmr += formData.gender === 'male' ? 5 : -161;

      // 2. Nível de Atividade (Estimado pelas respostas)
      let activityFactor = 1.2; // Base (Nunca)
      if (formData.frequency === '1 a 10 vezes por mês') activityFactor = 1.3;
      if (formData.frequency === '1 a 3 vezes por semana') activityFactor = 1.375;

      const tdee = bmr * activityFactor;

      // 3. Ajuste pelo Objetivo
      let targetCalories = tdee;
      let msg = "Manter peso atual";
      let menu = {
          breakfast: 'Brasileiro Fit (Tapioca)',
          lunch: 'Arroz Integral com Legumes',
          tea: 'Chá de Hibisco',
          dinner: 'Salada de Frango com Manga'
      };

      if (formData.goal === 'Perder peso') {
          targetCalories = tdee - 500;
          msg = "Déficit calórico moderado.";
          menu = {
              breakfast: 'Light e Rápido (Smoothie)',
              lunch: 'Salada de Frango Grelhado',
              tea: 'Chá Verde com Limão',
              dinner: 'Omelete de Espinafre (Low Carb)'
          };
      } else if (formData.goal === 'Definir') {
          targetCalories = tdee - 250;
          msg = "Leve déficit para definição.";
          menu = {
              breakfast: 'Proteico Power (Omelete)',
              lunch: 'Arroz Integral + Frango + Legumes',
              tea: 'Suco de Beterraba (Pré-treino)',
              dinner: 'Salada de Quinoa Completa'
          };
      } else {
          // Manter
          menu = {
            breakfast: 'Energético Completo (Ovos + Pão)',
            lunch: 'Coxinha Fit de Batata Doce + Salada',
            tea: 'Chá de Hibisco com Canela',
            dinner: 'Salada de Frango com Manga'
        };
      }

      // 4. Macros (Estimativa Balanceada 30/40/30)
      const protein = Math.round((targetCalories * 0.30) / 4);
      const carbs = Math.round((targetCalories * 0.40) / 4);
      const fat = Math.round((targetCalories * 0.30) / 9);

      setResults({
          calories: Math.round(targetCalories),
          protein,
          carbs,
          fat,
          msg,
          menu
      });
  };

  const handleNext = () => {
    if (step === 1) {
        if (!formData.weight || !formData.height || !formData.age) return;
        setStep(2);
    } else if (step === 2) {
        if (!formData.goal) return;
        setStep(3);
    } else if (step === 3) {
        if (!formData.frequency) return;
        setStep(4);
    } else if (step === 4) {
        if (!formData.commitment) return;
        calculatePlan(); // Calcular antes de mostrar o resultado
        setStep(5); // Ir para tela de resultado
    } else {
        handleSubmit();
    }
  };

  const handleSubmit = () => {
    const statsData = {
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        age: parseFloat(formData.age),
        goal: formData.goal,
        frequency: formData.frequency,
        commitment: formData.commitment,
        gender: formData.gender as 'male' | 'female',
        // Save calculated stats
        bmr: 0, // Will be recalculated in calculator if needed
        tdee: results?.calories || 0 
    };
    completeOnboarding(statsData);
    navigate('/');
  };

  // If already completed, don't render content to avoid flash
  if (userState.onboardingCompleted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-aqua to-brand-darkGreen flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
            <motion.div 
                className="h-full bg-brand-yellow"
                animate={{ width: `${(step / 5) * 100}%` }}
            />
        </div>

        {step < 5 && (
            <div className="text-center mb-6 mt-4">
                <h1 className="text-2xl font-black text-brand-darkGreen">Vamos nos conhecer?</h1>
                <p className="text-gray-400 text-sm font-medium">Precisamos de alguns dados para personalizar sua experiência.</p>
            </div>
        )}

        <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar">
            {/* STEP 1: DADOS BÁSICOS */}
            {step === 1 && (
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Peso (kg)</label>
                        <div className="relative">
                            <Weight className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            <input 
                                type="number" 
                                value={formData.weight}
                                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-aqua font-bold text-gray-700"
                                placeholder="Ex: 68"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Altura (cm)</label>
                        <div className="relative">
                            <Ruler className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            <input 
                                type="number" 
                                value={formData.height}
                                onChange={(e) => setFormData({...formData, height: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-aqua font-bold text-gray-700"
                                placeholder="Ex: 165"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Idade</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            <input 
                                type="number" 
                                value={formData.age}
                                onChange={(e) => setFormData({...formData, age: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-aqua font-bold text-gray-700"
                                placeholder="Ex: 30"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Gênero</label>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setFormData({...formData, gender: 'female'})}
                                className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${formData.gender === 'female' ? 'border-pink-400 bg-pink-50 text-pink-600' : 'border-gray-100 text-gray-400'}`}
                            >
                                Feminino
                            </button>
                            <button 
                                onClick={() => setFormData({...formData, gender: 'male'})}
                                className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${formData.gender === 'male' ? 'border-blue-400 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400'}`}
                            >
                                Masculino
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* STEP 2: OBJETIVO */}
            {step === 2 && (
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4 pt-2">
                    <label className="text-center block text-sm font-bold text-gray-500 uppercase">Qual seu objetivo principal?</label>
                    <div className="space-y-3">
                        {['Perder peso', 'Definir', 'Manter'].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => setFormData({...formData, goal: opt})}
                                className={`w-full py-4 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${formData.goal === opt ? 'border-brand-aqua bg-cyan-50 text-brand-darkGreen' : 'border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                            >
                                <Target size={20} />
                                {opt}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* STEP 3: PRÁTICA DE EXERCÍCIOS */}
            {step === 3 && (
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4 pt-2">
                    <label className="text-center block text-sm font-bold text-gray-500 uppercase">Prática de Exercícios</label>
                    <div className="space-y-3">
                        {['1 a 3 vezes por semana', '1 a 10 vezes por mês', 'Nunca'].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => setFormData({...formData, frequency: opt})}
                                className={`w-full py-4 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 text-sm ${formData.frequency === opt ? 'border-brand-aqua bg-cyan-50 text-brand-darkGreen' : 'border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                            >
                                <Activity size={20} />
                                {opt}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* STEP 4: COMPROMETIMENTO */}
            {step === 4 && (
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4 pt-2">
                    <label className="text-center block text-sm font-bold text-gray-500 uppercase leading-snug">Conseguirá fazer nossos exercícios todo dia?</label>
                    <div className="space-y-3">
                        {['Sim', 'Não', 'Vou tentar'].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => setFormData({...formData, commitment: opt})}
                                className={`w-full py-4 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 text-sm ${formData.commitment === opt ? 'border-brand-aqua bg-cyan-50 text-brand-darkGreen' : 'border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                            >
                                <ThumbsUp size={20} />
                                {opt}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* STEP 5: RESULTADO (CONCLUSÃO) */}
            {step === 5 && results && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pt-4 pb-2">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg text-yellow-900">
                            <TrendingUp size={32} />
                        </div>
                        <h2 className="text-xl font-black text-brand-darkGreen">Seu Plano Personalizado</h2>
                        <p className="text-xs text-gray-500 font-medium mt-1">Baseado no objetivo: <span className="text-brand-aqua">{formData.goal}</span></p>
                    </div>

                    {/* Calories Card */}
                    <div className="bg-gradient-to-r from-brand-aqua to-brand-darkGreen rounded-2xl p-5 text-white text-center shadow-lg mb-4">
                        <p className="text-xs font-bold uppercase opacity-80 mb-1">Meta Diária Estimada</p>
                        <div className="text-4xl font-black">{results.calories} <span className="text-lg font-medium">kcal</span></div>
                        <p className="text-[10px] mt-2 bg-white/20 inline-block px-2 py-1 rounded-lg">{results.msg}</p>
                    </div>

                    {/* Macros */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="bg-red-50 p-2 rounded-xl border border-red-100 text-center">
                            <div className="text-lg font-black text-red-500">{results.protein}g</div>
                            <div className="text-[10px] font-bold text-red-300 uppercase">Proteína</div>
                        </div>
                        <div className="bg-orange-50 p-2 rounded-xl border border-orange-100 text-center">
                            <div className="text-lg font-black text-orange-500">{results.carbs}g</div>
                            <div className="text-[10px] font-bold text-orange-300 uppercase">Carbo</div>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded-xl border border-yellow-100 text-center">
                            <div className="text-lg font-black text-yellow-600">{results.fat}g</div>
                            <div className="text-[10px] font-bold text-yellow-400 uppercase">Gordura</div>
                        </div>
                    </div>

                    {/* Sugestão de Cardápio (Linha do Tempo) */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                        <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                            <Utensils size={16} className="text-brand-aqua" /> Sugestão de Cardápio Diário:
                        </h3>
                        
                        <div className="space-y-4 relative">
                             {/* Linha vertical conectora */}
                             <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-gray-100 z-0"></div>

                             {/* Café */}
                             <div className="flex gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shadow-sm border border-white">
                                    <Sunrise size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Café da Manhã</p>
                                    <p className="text-sm font-bold text-gray-800 leading-tight">{results.menu.breakfast}</p>
                                </div>
                             </div>

                             {/* Almoço */}
                             <div className="flex gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm border border-white">
                                    <Sun size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Almoço</p>
                                    <p className="text-sm font-bold text-gray-800 leading-tight">{results.menu.lunch}</p>
                                </div>
                             </div>

                             {/* Chá da Tarde */}
                             <div className="flex gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm border border-white">
                                    <Coffee size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Chá da Tarde</p>
                                    <p className="text-sm font-bold text-gray-800 leading-tight">{results.menu.tea}</p>
                                </div>
                             </div>

                             {/* Jantar */}
                             <div className="flex gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm border border-white">
                                    <Moon size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Jantar</p>
                                    <p className="text-sm font-bold text-gray-800 leading-tight">{results.menu.dinner}</p>
                                </div>
                             </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>

        <button 
            onClick={handleNext}
            className="w-full bg-brand-yellow text-yellow-900 font-extrabold py-4 rounded-xl shadow-lg mt-4 hover:bg-yellow-400 active:scale-95 transition-all flex-shrink-0"
        >
            {step === 5 ? 'COMEÇAR JORNADA' : 'PRÓXIMO'}
        </button>

      </div>
    </div>
  );
};

export default Onboarding;
