
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator as CalcIcon, Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Calculator: React.FC = () => {
  const { updateStats } = useGame();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'female',
    activity: '1.2'
  });

  const [results, setResults] = useState<{bmr: number, tdee: number} | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(formData.weight);
    const h = parseFloat(formData.height);
    const a = parseFloat(formData.age);
    
    // Mifflin-St Jeor
    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    bmr += formData.gender === 'male' ? 5 : -161;

    const tdee = bmr * parseFloat(formData.activity);

    setResults({ bmr: Math.round(bmr), tdee: Math.round(tdee) });
    
    updateStats({
        weight: w,
        height: h,
        age: a,
        gender: formData.gender as 'male'|'female',
        activityLevel: parseFloat(formData.activity),
        bmr: Math.round(bmr),
        tdee: Math.round(tdee)
    });

    setStep(2);
  };

  if (step === 2 && results) {
    const healthyCals = Math.round(results.tdee - 500);
    const aggressiveCals = Math.round(results.tdee - 1100);

    return (
        <div className="p-4 space-y-4 pb-24">
            {/* TMB Card */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-[#00B4D8] to-[#0077B6] rounded-2xl p-5 text-white shadow-lg"
            >
                <div className="flex items-center gap-3 mb-1">
                    <div className="bg-white/20 p-2 rounded-lg"><CalcIcon size={20} /></div>
                    <span className="font-bold text-sm opacity-90">TMB - Taxa Metabólica Basal</span>
                </div>
                <div className="text-4xl font-black mb-1">{results.bmr} kcal</div>
                <p className="text-xs opacity-80 leading-tight">Calorias que seu corpo gasta em repouso absoluto (dormindo o dia todo)</p>
            </motion.div>

            {/* GET Card */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl p-5 text-white shadow-lg"
            >
                <div className="flex items-center gap-3 mb-1">
                    <div className="bg-white/20 p-2 rounded-lg"><Activity size={20} /></div>
                    <span className="font-bold text-sm opacity-90">GET - Gasto Energético Total</span>
                </div>
                <div className="text-4xl font-black mb-1">{results.tdee} kcal</div>
                <p className="text-xs opacity-80 leading-tight">Total de calorias que você gasta por dia com suas atividades</p>
            </motion.div>

             {/* Healthy Goal Card */}
             <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 text-white shadow-lg"
            >
                <div className="flex items-center gap-3 mb-1">
                    <div className="bg-white/20 p-2 rounded-lg"><TrendingUp size={20} /></div>
                    <span className="font-bold text-sm opacity-90">Meta para Emagrecer (Saudável)</span>
                </div>
                <div className="text-4xl font-black mb-1">{healthyCals} kcal/dia</div>
                <p className="text-xs opacity-80 leading-tight">Déficit de 500 kcal = Perda de ~0.5 kg por semana (ritmo saudável)</p>
            </motion.div>

            {/* Aggressive Goal Card */}
             <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-purple-500 to-fuchsia-600 rounded-2xl p-5 text-white shadow-lg"
            >
                <div className="flex items-center gap-3 mb-1">
                    <div className="bg-white/20 p-2 rounded-lg"><TrendingUp size={20} className="rotate-180" /></div>
                    <span className="font-bold text-sm opacity-90">Meta Agressiva (1kg/semana)</span>
                </div>
                <div className="text-4xl font-black mb-1">{aggressiveCals > 1200 ? aggressiveCals : 1200} kcal/dia</div>
                <p className="text-xs opacity-80 leading-tight">Déficit de ~1100 kcal = Perda de 1 kg por semana (apenas com acompanhamento)</p>
            </motion.div>

            {/* Tips Section */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                    <span>💡</span> Dicas Importantes
                </h3>
                
                <div className="space-y-3">
                    <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 flex gap-3 items-start">
                        <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={18} />
                        <p className="text-xs font-medium text-yellow-800">
                            <strong>Nunca coma menos que sua TMB!</strong> Isso desacelera seu metabolismo.
                        </p>
                    </div>

                    <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex gap-3 items-start">
                         <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={18} />
                         <p className="text-xs font-medium text-green-800">
                            <strong>Recomendado:</strong> Déficit de 300-500 kcal para perda sustentável.
                        </p>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex gap-3 items-start">
                         <span className="text-lg">💪</span>
                         <p className="text-xs font-medium text-blue-800">
                            <strong>Combine:</strong> Alimentação saudável + exercícios = resultados duradouros.
                        </p>
                    </div>

                     <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 flex gap-3 items-start">
                         <span className="text-lg">📊</span>
                         <p className="text-xs font-medium text-purple-800">
                            <strong>Monitore:</strong> Ajuste sua dieta conforme vai perdendo peso.
                        </p>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => setStep(1)}
                className="w-full mt-4 py-4 bg-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-300 transition-colors"
            >
                Recalcular
            </button>
        </div>
    );
  }

  // Input Form
  return (
    <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-fuchsia-600 to-purple-700 p-6 pt-8 pb-10 rounded-b-[2.5rem] shadow-xl text-white text-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                <CalcIcon size={24} />
            </div>
            <h1 className="text-xl font-bold mb-2">Gasto Energético Total (GET)</h1>
            <p className="text-white/80 text-xs px-4 leading-relaxed">
                Calcule quantas calorias seu corpo gasta por dia e descubra exatamente quanto deve comer para emagrecer com saúde!
            </p>
        </div>

        {/* Form Body */}
        <div className="px-4 -mt-6 pb-24 relative z-10">
            <form onSubmit={calculate} className="bg-white p-6 rounded-3xl shadow-lg space-y-5">
                <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-2">Seus Dados</h3>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 ml-1">Peso (kg)</label>
                    <input 
                        type="number" required 
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 transition-all font-bold text-gray-700"
                        value={formData.weight}
                        onChange={e => setFormData({...formData, weight: e.target.value})}
                        placeholder="Ex: 68"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 ml-1">Altura (cm)</label>
                    <input 
                        type="number" required 
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 transition-all font-bold text-gray-700"
                        value={formData.height}
                        onChange={e => setFormData({...formData, height: e.target.value})}
                        placeholder="Ex: 165"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 ml-1">Idade (anos)</label>
                    <input 
                        type="number" required 
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 transition-all font-bold text-gray-700"
                        value={formData.age}
                        onChange={e => setFormData({...formData, age: e.target.value})}
                        placeholder="Ex: 38"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 ml-1">Sexo</label>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, gender: 'male'})}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${formData.gender === 'male' ? 'bg-[#00B4D8] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}
                        >
                            <span>👨</span> Masculino
                        </button>
                        <button
                             type="button"
                             onClick={() => setFormData({...formData, gender: 'female'})}
                             className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${formData.gender === 'female' ? 'bg-fuchsia-500 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}
                        >
                             <span>👩</span> Feminino
                        </button>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 ml-1">Nível de Atividade Física</label>
                    <div className="relative">
                        <select 
                            value={formData.activity}
                            onChange={e => setFormData({...formData, activity: e.target.value})}
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 transition-all font-medium text-gray-700 appearance-none"
                        >
                             <option value="1.2">Sedentário - Pouco ou nenhum exercício</option>
                             <option value="1.375">Leve - Exercício 1-3 dias/sem</option>
                             <option value="1.55">Moderado - Exercício 3-5 dias/sem</option>
                             <option value="1.725">Intenso - Exercício 6-7 dias/sem</option>
                             <option value="1.9">Muito Intenso - Exercício pesado todo dia</option>
                        </select>
                        <div className="absolute right-4 top-4 pointer-events-none text-gray-400">
                            ▼
                        </div>
                    </div>
                </div>

                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-extrabold text-lg py-4 rounded-xl shadow-lg mt-4 flex items-center justify-center gap-2"
                >
                    <CalcIcon size={20} /> Calcular Agora
                </motion.button>
            </form>
        </div>
    </div>
  );
};

export default Calculator;
