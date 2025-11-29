
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Droplet, Plus, Minus, Zap, Clock, AlertTriangle, Check, Moon, Sun, Utensils, GlassWater, Star, Timer, Apple } from 'lucide-react';
import { SECTIONS } from '../constants';
import { useGame } from '../context/GameContext';
import { Recipe } from '../types';
import * as Icons from 'lucide-react';

const ContentPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { completeSection, userState, updateWater, triggerConfetti, addXp } = useGame();
  const [waterWeight, setWaterWeight] = useState('');
  
  const section = SECTIONS.find(s => s.id === id);

  if (!section) return <div className="p-10 text-center">Seção não encontrada.</div>;

  const isCompleted = userState.completedSections.includes(section.id);

  const handleComplete = () => {
    if (!isCompleted) {
      completeSection(section.id, section.xpReward);
    }
  };

  // Hydration Specific Handlers
  const handleCalculateWater = () => {
    const w = parseFloat(waterWeight);
    if (!w) return;
    const ml = w * 35;
    const cups = Math.ceil(ml / 250); // Assumindo copo de 250ml
    updateWater(userState.water.current, cups);
    triggerConfetti();
  };

  const handleAddCup = () => {
    const next = userState.water.current + 1;
    updateWater(next);
    if (next === userState.water.goal) {
        triggerConfetti();
        addXp(50);
        alert("Parabéns! Meta de hidratação atingida! +50 XP");
    }
  };

  const handleRemoveCup = () => {
    if (userState.water.current > 0) {
        updateWater(userState.water.current - 1);
    }
  };

  const renderContent = () => {
    // Specific Layout for Hydration Section
    if (section.id === 'hydration') {
        const percentage = Math.min(100, (userState.water.current / userState.water.goal) * 100);
        return (
            <div className="space-y-6">
                {/* Calculator Card */}
                <div className="bg-gradient-to-r from-[#00B4D8] to-[#0077B6] rounded-3xl p-6 text-white shadow-lg text-center">
                    <Droplet className="mx-auto mb-2 opacity-80" size={40} fill="currentColor" />
                    <h2 className="text-xl font-bold mb-4">Calcule sua Meta Diária</h2>
                    
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            value={waterWeight}
                            onChange={(e) => setWaterWeight(e.target.value)}
                            placeholder="Seu peso (kg)"
                            className="flex-1 rounded-xl px-4 py-3 text-gray-800 font-bold text-center outline-none focus:ring-2 focus:ring-white/50"
                        />
                        <button 
                            onClick={handleCalculateWater}
                            className="bg-white text-brand-darkGreen font-bold px-6 py-3 rounded-xl hover:bg-gray-50 active:scale-95 transition-transform"
                        >
                            Calcular
                        </button>
                    </div>
                    <p className="text-xs mt-3 opacity-75">Base: 35ml por kg corporal</p>
                </div>

                {/* Tracker Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-end mb-2">
                        <h3 className="font-bold text-gray-800 text-lg">Copos de Água Hoje</h3>
                        <span className="text-xs text-gray-400 font-medium">Meta: {userState.water.goal} copos</span>
                    </div>
                    
                    <div className="mb-1 text-sm text-gray-500 font-medium">
                        {userState.water.current} copos ({userState.water.current * 250}ml)
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className="bg-brand-aqua h-full rounded-full"
                        />
                    </div>

                    {/* Cups Grid */}
                    <div className="grid grid-cols-5 gap-3 mb-6">
                        {Array.from({ length: Math.max(userState.water.goal, userState.water.current + 1) }).slice(0, 15).map((_, i) => (
                            <motion.div 
                                key={i}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className={`aspect-square rounded-xl flex items-center justify-center transition-colors ${i < userState.water.current ? 'bg-brand-light' : 'bg-gray-50'}`}
                            >
                                <Droplet 
                                    size={20} 
                                    className={i < userState.water.current ? 'text-brand-aqua' : 'text-gray-200'} 
                                    fill={i < userState.water.current ? 'currentColor' : 'none'}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="flex gap-4">
                        <button 
                            onClick={handleRemoveCup}
                            disabled={userState.water.current === 0}
                            className="flex-1 py-3 rounded-xl border-2 border-gray-100 text-gray-400 font-bold flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <Minus size={18} /> Remover
                        </button>
                        <button 
                            onClick={handleAddCup}
                            className="flex-[1.5] py-3 rounded-xl bg-brand-aqua text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-aqua/30 active:scale-95 transition-transform"
                        >
                            <Plus size={18} /> Adicionar Copo
                        </button>
                    </div>
                </div>

                {/* Section: Benefícios da Água */}
                <div className="mt-8">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                        <span className="text-brand-aqua"><Zap size={20} fill="currentColor" /></span>
                        Benefícios da Água
                    </h3>
                    <div className="space-y-3">
                        {[
                            { emoji: '🔥', text: 'Acelera o metabolismo em até 30% por 1 hora' },
                            { emoji: '😋', text: 'Reduz apetite e evita comer sem fome' },
                            { emoji: '💪', text: 'Melhora performance em exercícios' },
                            { emoji: '✨', text: 'Elimina toxinas e reduz retenção de líquidos' },
                            { emoji: '🧠', text: 'Melhora concentração e energia' },
                            { emoji: '🌟', text: 'Deixa pele mais bonita e hidratada' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-cyan-50 p-4 rounded-xl border border-cyan-100">
                                <span className="text-2xl">{item.emoji}</span>
                                <span className="text-gray-700 font-medium text-sm">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section: Quando Beber */}
                <div className="mt-8">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                        <span className="text-blue-500"><Clock size={20} /></span>
                        Quando Beber
                    </h3>
                    <div className="space-y-4">
                        {[
                            { emoji: '☀️', title: 'Ao acordar', desc: '2 copos em jejum - ativa metabolismo' },
                            { emoji: '🍽️', title: 'Antes das refeições', desc: '1 copo 30min antes - reduz apetite' },
                            { emoji: '🏃', title: 'Durante exercício', desc: 'A cada 15-20min - mantém hidratação' },
                            { emoji: '🕑', title: 'À tarde', desc: '2 copos - evita fadiga e fome falsa' },
                            { emoji: '🌙', title: 'Antes de dormir', desc: '1 copo 1h antes - não muito tarde' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500 shadow-sm">
                                <div className="text-2xl pt-1">{item.emoji}</div>
                                <div>
                                    <h4 className="font-bold text-blue-900">{item.title}</h4>
                                    <p className="text-xs text-blue-600 font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section: Truques */}
                <div className="mt-8 mb-8 bg-brand-aqua text-white p-6 rounded-3xl shadow-lg">
                    <h3 className="flex items-center gap-2 text-xl font-bold mb-4">
                        <span>💡</span> Truques para Beber Mais Água
                    </h3>
                    <ul className="space-y-3">
                        {[
                            'Use garrafinha marcada com horários',
                            'Adicione limão, hortelã ou frutas',
                            'Configure alarmes no celular',
                            'Beba sempre que ir ao banheiro',
                            'Mantenha garrafa sempre visível',
                            'Use apps de lembrete de água'
                        ].map((trick, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm font-medium">
                                <span className="mt-0.5">✓</span>
                                {trick}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    // Specific Layout for Sleep Section
    if (section.id === 'sleep') {
        return (
            <div className="space-y-6">
                {/* Header Card */}
                <div className="bg-gradient-to-br from-[#6366f1] to-[#4338ca] rounded-3xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Moon size={32} fill="currentColor" className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Sono = Emagrecimento</h2>
                    <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
                        Dormir bem não é luxo, é essencial! Durante o sono, seu corpo produz hormônios que
                        controlam fome, queimam gordura e recuperam músculos.
                    </p>
                    <div className="bg-white/20 p-3 rounded-xl flex items-center gap-2 backdrop-blur-sm">
                        <Clock size={20} />
                        <span className="font-bold text-sm">Meta: 7 a 9 horas por noite</span>
                    </div>
                </div>

                {/* Benefícios */}
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                        <span className="text-indigo-500"><Zap size={20} fill="currentColor" /></span>
                        Benefícios para Emagrecer
                    </h3>
                    <div className="space-y-3">
                        {[
                           { emoji: '🔥', text: 'Regula hormônios da fome (leptina e grelina)' },
                           { emoji: '💪', text: 'Aumenta recuperação muscular e queima de gordura' },
                           { emoji: '⚡', text: 'Melhora metabolismo e controle de glicemia' },
                           { emoji: '🧠', text: 'Reduz desejo por doces e comida calórica' },
                           { emoji: '✨', text: 'Diminui cortisol (hormônio do estresse)' },
                           { emoji: '😴', text: 'Previne compulsão alimentar noturna' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                <span className="text-2xl">{item.emoji}</span>
                                <span className="text-gray-700 font-medium text-sm">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Riscos */}
                <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-red-600 mb-4">
                        <AlertTriangle size={20} />
                        Dormir Mal Causa:
                    </h3>
                     <div className="space-y-3">
                        {[
                           'Aumento de 55% no risco de obesidade',
                           'Metabolismo até 20% mais lento',
                           'Maior resistência à insulina',
                           'Aumento de apetite em até 25%',
                           'Preferência por alimentos calóricos'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-red-100/50 p-3 rounded-xl">
                                <span className="text-red-500 text-xl">⚠️</span>
                                <span className="text-red-800 font-medium text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rotina Perfeita */}
                <div>
                     <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                        <span className="text-yellow-500"><Moon size={20} fill="currentColor" /></span>
                        Rotina Perfeita
                    </h3>
                    <div className="space-y-3">
                        {[
                            { time: '21:00', text: 'Diminua luzes e telas', icon: '📱' },
                            { time: '21:30', text: 'Chá calmante (camomila, melissa)', icon: '🍵' },
                            { time: '22:00', text: 'Banho morno relaxante', icon: '🚿' },
                            { time: '22:30', text: 'Ambiente fresco e escuro', icon: '🌡️' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="text-2xl">{item.icon}</div>
                                <div>
                                    <div className="text-indigo-600 font-bold text-sm">{item.time}</div>
                                    <div className="text-gray-700 font-medium text-sm">{item.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dicas Extras */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-lg">
                     <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
                        <span>💡</span>
                        Dicas Extras
                    </h3>
                    <ul className="space-y-3">
                         {[
                            'Evite cafeína após 16h',
                            'Não coma pesado 3h antes de dormir',
                            'Quarto escuro, silencioso e fresco (18-22°C)',
                            'Mesma hora para dormir e acordar todo dia',
                            'Exercícios pela manhã ou tarde (não à noite)',
                            'Meditação ou respiração profunda antes'
                        ].map((trick, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm font-medium">
                                <span className="mt-0.5">✓</span>
                                {trick}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    // Specific Layout for Breakfast Section
    if (section.id === 'breakfast') {
        return (
            <div className="space-y-6">
                {/* Header Card */}
                <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Sun size={32} fill="currentColor" className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Por que é tão importante?</h2>
                    <p className="text-orange-50 text-sm mb-4 leading-relaxed">
                        O café da manhã ativa seu metabolismo após o jejum noturno, fornece energia para o dia e evita compulsões alimentares.
                    </p>
                    <div className="bg-white/20 p-3 rounded-xl flex items-center gap-2 backdrop-blur-sm text-xs font-bold">
                        <Zap size={16} fill="currentColor" />
                        <span>Pessoas que tomam café da manhã saudável perdem até 30% mais peso!</span>
                    </div>
                </div>

                <h3 className="font-bold text-lg text-gray-800">4 Opções Deliciosas:</h3>

                <div className="space-y-4">
                    {/* Option 1 */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">⚡</span>
                                <h4 className="font-bold text-gray-800">Energético Completo</h4>
                            </div>
                            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-lg">~350 kcal</span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1 ml-1">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> 2 ovos mexidos</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Pão integral com abacate</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Frutas vermelhas</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Chá verde</li>
                        </ul>
                    </div>

                    {/* Option 2 */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">🥤</span>
                                <h4 className="font-bold text-gray-800">Light e Rápido</h4>
                            </div>
                            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-lg">~300 kcal</span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1 ml-1">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Smoothie (banana, aveia, espinafre)</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Iogurte grego</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> 1 colher de pasta de amendoim</li>
                        </ul>
                    </div>

                    {/* Option 3 */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">💪</span>
                                <h4 className="font-bold text-gray-800">Proteico Power</h4>
                            </div>
                            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-lg">~280 kcal</span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1 ml-1">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Omelete (3 claras + 1 gema)</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Queijo cottage</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Tomate e rúcula</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Café preto</li>
                        </ul>
                    </div>

                     {/* Option 4 */}
                     <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-gray-800 tracking-tighter">BR</span>
                                <h4 className="font-bold text-gray-800">Brasileiro Fit</h4>
                            </div>
                            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-lg">~320 kcal</span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1 ml-1">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Tapioca com frango desfiado</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Suco verde</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Mamão com granola</li>
                        </ul>
                    </div>
                </div>

                {/* Dicas de Ouro */}
                <div className="space-y-3 pt-2">
                     <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                        <span>💡</span> Dicas de Ouro
                    </h3>
                    <div className="space-y-2">
                         <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 flex items-center gap-3">
                            <span className="text-xl">⏰</span>
                            <span className="text-gray-700 text-sm font-medium">Tome café 30-60min após acordar</span>
                         </div>
                         <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-3">
                            <span className="text-xl">🚫</span>
                            <span className="text-gray-700 text-sm font-medium">Nunca pule o café da manhã</span>
                         </div>
                         <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex items-center gap-3">
                            <span className="text-xl">🥚</span>
                            <span className="text-gray-700 text-sm font-medium">Inclua sempre uma fonte de proteína</span>
                         </div>
                         <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex items-center gap-3">
                            <span className="text-xl">🍎</span>
                            <span className="text-gray-700 text-sm font-medium">Adicione frutas frescas</span>
                         </div>
                         <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                            <span className="text-xl">☕</span>
                            <span className="text-gray-700 text-sm font-medium">Evite sucos industrializados e açúcar</span>
                         </div>
                    </div>
                </div>
            </div>
        );
    }

    if (section.contentType === 'daily-guidelines') {
        const data = section.data as any;
        return (
            <div className="space-y-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm text-gray-700 leading-relaxed font-medium text-sm">
                    {data.intro}
                </div>

                <div className="space-y-4">
                     {data.meals.map((meal: any, idx: number) => {
                         const Icon = (Icons as any)[meal.icon];
                         let bg = '', border = '', text = '';
                         if (meal.color === 'orange') { bg = 'bg-orange-50'; border = 'border-orange-100'; text = 'text-orange-800'; }
                         if (meal.color === 'blue') { bg = 'bg-blue-50'; border = 'border-blue-100'; text = 'text-blue-800'; }
                         if (meal.color === 'green') { bg = 'bg-green-50'; border = 'border-green-100'; text = 'text-green-800'; }
                         if (meal.color === 'indigo') { bg = 'bg-indigo-50'; border = 'border-indigo-100'; text = 'text-indigo-800'; }

                         return (
                            <div key={idx} className={`${bg} p-4 rounded-2xl border ${border}`}>
                                <h4 className={`${text} font-bold mb-2 flex items-center gap-2`}>
                                   {Icon && <Icon size={18} />} {meal.title}
                                </h4>
                                <ul className="text-sm text-gray-700 space-y-1 pl-1">
                                    {meal.items.map((item: string, i: number) => (
                                        <li key={i} dangerouslySetInnerHTML={{ __html: `• ${item}` }}></li>
                                    ))}
                                </ul>
                            </div>
                         );
                     })}
                </div>

                <div className="mt-6 space-y-3">
                     {data.tips.map((tip: any, idx: number) => {
                         const TipIcon = (Icons as any)[tip.icon];
                         return (
                             <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex gap-3 text-sm text-gray-600">
                                {TipIcon && <TipIcon className={`flex-shrink-0 ${tip.icon === 'Apple' ? 'text-red-400' : 'text-gray-400'}`} size={20} />}
                                <p>{tip.text}</p>
                             </div>
                         );
                     })}

                     <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-4 rounded-xl border border-purple-100 flex gap-3 items-center cursor-pointer" onClick={() => navigate('/tabata')}>
                        <div className="bg-purple-500 text-white p-2 rounded-lg">
                            <Timer size={20} />
                        </div>
                        <div>
                            <h5 className="font-bold text-purple-900 text-sm">Exercício Diário</h5>
                            <p className="text-xs text-purple-700 leading-tight mt-1">
                                Encontre 4 minutos para realizar o <strong>Protocolo Tabata</strong>. No início faça de forma lenta.
                            </p>
                        </div>
                     </div>
                </div>
            </div>
        );
    }

    if (section.contentType === 'valuable-tips') {
        const data = section.data as any;
        return (
            <div className="space-y-8">
                {/* Intro */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-2">Dicas para turbinar seus resultados</h3>
                    <p className="text-sm text-gray-600">Conteúdo Extra! Sucos poderosos, cardápios prontos e dicas de ouro para acelerar ainda mais seus resultados.</p>
                </div>

                {/* Sucos Poderosos */}
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                        <span className="text-pink-500 text-2xl">🥤</span> Sucos Poderosos
                    </h3>
                    <div className="space-y-4">
                        {data.juices.map((juice: any, idx: number) => (
                            <div key={idx} className={`${juice.bgColor} p-5 rounded-2xl border border-opacity-50 border-gray-200 shadow-sm`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="text-3xl bg-white p-2 rounded-full shadow-sm">{juice.icon}</div>
                                    <h4 className={`font-bold text-lg ${juice.textColor}`}>{juice.name}</h4>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="font-bold opacity-70 uppercase text-xs">Ingredientes:</span>
                                        <p className="text-gray-700 font-medium leading-relaxed">{juice.ingredients.join(' • ')}</p>
                                    </div>
                                    <div>
                                        <span className="font-bold opacity-70 uppercase text-xs">Benefícios:</span>
                                        <p className="text-gray-700">{juice.benefits}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cardápios */}
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                        <span className="text-2xl">📅</span> Sugestões de Cardápio
                    </h3>
                    <div className="grid gap-4">
                        {Object.entries(data.menus).map(([meal, items]: [string, any], idx) => (
                            <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                <h4 className="font-bold text-brand-darkGreen mb-3 border-b border-gray-100 pb-2">{meal}</h4>
                                <ul className="space-y-2">
                                    {items.map((option: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="font-bold text-brand-aqua min-w-[15px]">{i + 1}.</span>
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dicas de Ouro */}
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6 text-white shadow-lg">
                    <h3 className="flex items-center gap-2 text-xl font-bold mb-4">
                        <span className="text-2xl">⭐</span> 10 Dicas de Ouro
                    </h3>
                    <div className="space-y-3">
                        {(data.goldenTips as any[]).map((tip, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                                <span className="text-xl">{tip.icon}</span>
                                <span className="font-bold text-sm text-white">{tip.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (section.contentType === 'recipe-list') {
      return (section.data as Recipe[]).map((recipe, idx) => (
        <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4">
          <h3 className="font-bold text-lg text-brand-darkGreen mb-2">{recipe.name}</h3>
          <div className="mb-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Ingredientes</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          </div>
          <div className="mb-3">
             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Preparo</h4>
             <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1">
              {recipe.preparation.map((step, i) => <li key={i}>{step}</li>)}
             </ol>
          </div>
          {recipe.benefits && (
            <div className="bg-brand-light p-3 rounded-lg text-xs text-brand-darkGreen">
                <strong>Benefício:</strong> {recipe.benefits}
            </div>
          )}
        </div>
      ));
    }

    if (section.contentType === 'avoid-list') {
        const data = section.data as { intro: string, items: any[] };
        return (
            <div className="space-y-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm text-gray-700 leading-relaxed">
                    {data.intro}
                </div>
                {data.items.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-md overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                            <span className="text-3xl">{item.icon}</span>
                            <h3 className="font-bold text-xl text-gray-800">{item.name}</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-red-400 uppercase mb-1">Por que evitar</p>
                                        <p className="text-sm text-red-900 font-medium">{item.why}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                                <div className="flex items-start gap-2">
                                    <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-green-400 uppercase mb-1">Substitua por</p>
                                        <p className="text-sm text-green-900 font-medium">{item.sub}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (section.contentType === 'text-list') {
        return (section.data as any[]).map((item, idx) => (
            <div key={idx} className="flex items-start bg-white p-4 rounded-xl shadow-sm mb-3">
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mr-3 font-bold text-white ${section.color}`}>
                    {idx + 1}
                </div>
                <div>
                    <h4 className="font-bold text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.text}</p>
                </div>
            </div>
        ));
    }

    if (section.contentType === 'guide') {
        return (section.data as any).sections.map((item: any, idx: number) => (
            <div key={idx} className="mb-6">
                <h3 className="text-xl font-bold text-brand-darkGreen mb-2">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-xl shadow-sm">{item.text}</p>
            </div>
        ));
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className={`p-6 pb-10 text-white relative rounded-b-[3rem] shadow-lg ${section.color}`}>
            <button onClick={() => navigate(-1)} className="absolute top-6 left-6 bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <ArrowLeft size={24} />
            </button>
            <div className="mt-8 text-center">
                <h1 className="text-3xl font-bold mb-2">{section.title}</h1>
                <p className="text-white/90 text-sm max-w-xs mx-auto">{section.description}</p>
            </div>
        </div>

        {/* Content Body */}
        <div className="p-5 -mt-6 relative z-10">
            {renderContent()}
        </div>

        {/* Floating Action Button for Completion (Hide on hydration page as it has its own logic) */}
        {section.id !== 'hydration' && (
            <div className="p-6 pt-0">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    disabled={isCompleted}
                    onClick={handleComplete}
                    className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all
                        ${isCompleted 
                            ? 'bg-gray-300 text-gray-500 cursor-default' 
                            : 'bg-brand-yellow text-yellow-900 animate-bounce-short'
                        }`}
                >
                    {isCompleted ? (
                        <>
                            <CheckCircle size={24} /> Concluído
                        </>
                    ) : (
                        `Concluir Leitura (+${section.xpReward} XP)`
                    )}
                </motion.button>
            </div>
        )}
    </div>
  );
};

export default ContentPage;
