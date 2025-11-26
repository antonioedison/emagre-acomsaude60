import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator as CalcIcon, Activity } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Calculator: React.FC = () => {
  const { updateStats } = useGame();
  const [step, setStep] = useState(1); // 1: Inputs, 2: Results
  const [formData, setFormData] = useState({
    weight: '',
    height: '', // in cm
    age: '',
    gender: 'female',
    activity: '1.2' // Sedentary
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
    return (
        <div className="p-6 space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-brand-darkGreen">Seus Resultados</h2>
                <p className="text-gray-500">Baseado no seu perfil metabólico</p>
            </div>

            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-6 rounded-3xl shadow-xl border-t-4 border-brand-yellow text-center"
            >
                <p className="text-gray-500 font-bold uppercase text-xs tracking-wider">Metabolismo Basal (TMB)</p>
                <div className="text-4xl font-black text-gray-800 my-2">{results.bmr} <span className="text-lg font-normal text-gray-400">kcal</span></div>
                <p className="text-xs text-gray-400">O que você queima parado.</p>
            </motion.div>

            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-brand-aqua p-6 rounded-3xl shadow-xl text-center text-white"
            >
                <p className="font-bold uppercase text-xs tracking-wider opacity-80">Gasto Total Diário (GET)</p>
                <div className="text-5xl font-black my-2">{results.tdee} <span className="text-lg font-normal opacity-70">kcal</span></div>
                <p className="text-xs opacity-80">Para manter o peso atual.</p>
            </motion.div>

            <div className="space-y-3 mt-8">
                <h3 className="font-bold text-gray-700 ml-1">Recomendação Diária:</h3>
                <div className="bg-green-100 p-4 rounded-xl border border-green-200 flex justify-between items-center">
                    <span className="text-green-800 font-medium">Emagrecer (Leve)</span>
                    <span className="font-bold text-green-900">{Math.round(results.tdee * 0.85)} kcal</span>
                </div>
                <div className="bg-orange-100 p-4 rounded-xl border border-orange-200 flex justify-between items-center">
                    <span className="text-orange-800 font-medium">Perder 1kg/sem (Agressivo)</span>
                    <span className="font-bold text-orange-900">{Math.round(results.tdee - 750)} kcal</span>
                </div>
            </div>

            <button 
                onClick={() => setStep(1)}
                className="w-full mt-6 py-4 bg-gray-200 text-gray-600 font-bold rounded-2xl"
            >
                Recalcular
            </button>
        </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center space-x-2 mb-6 text-brand-darkGreen">
        <CalcIcon size={28} />
        <h1 className="text-2xl font-bold">Calculadora Metabólica</h1>
      </div>

      <form onSubmit={calculate} className="space-y-5 bg-white p-6 rounded-3xl shadow-lg">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Peso (kg)</label>
                <input 
                    type="number" required 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-brand-aqua focus:ring-2 focus:ring-brand-aqua outline-none transition-all font-bold text-lg text-center"
                    value={formData.weight}
                    onChange={e => setFormData({...formData, weight: e.target.value})}
                    placeholder="00"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Altura (cm)</label>
                <input 
                    type="number" required 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-brand-aqua focus:ring-2 focus:ring-brand-aqua outline-none transition-all font-bold text-lg text-center"
                    value={formData.height}
                    onChange={e => setFormData({...formData, height: e.target.value})}
                    placeholder="165"
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Idade</label>
                <input 
                    type="number" required 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-brand-aqua focus:ring-2 focus:ring-brand-aqua outline-none transition-all font-bold text-lg text-center"
                    value={formData.age}
                    onChange={e => setFormData({...formData, age: e.target.value})}
                    placeholder="30"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Sexo</label>
                <select 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-brand-aqua outline-none font-medium h-[54px]"
                    value={formData.gender}
                    onChange={e => setFormData({...formData, gender: e.target.value})}
                >
                    <option value="female">Mulher</option>
                    <option value="male">Homem</option>
                </select>
            </div>
        </div>

        <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Nível de Atividade</label>
            <div className="space-y-2">
                {[
                    { val: '1.2', label: 'Sedentário (Pouco ou nenhum exercício)' },
                    { val: '1.375', label: 'Leve (Exercício 1-3 dias/sem)' },
                    { val: '1.55', label: 'Moderado (Exercício 3-5 dias/sem)' },
                    { val: '1.725', label: 'Intenso (Exercício 6-7 dias/sem)' }
                ].map(opt => (
                    <button
                        type="button"
                        key={opt.val}
                        onClick={() => setFormData({...formData, activity: opt.val})}
                        className={`w-full p-3 rounded-xl text-left text-sm transition-all border ${formData.activity === opt.val ? 'bg-brand-aqua text-white border-brand-aqua shadow-md' : 'bg-white text-gray-600 border-gray-200'}`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>

        <motion.button 
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-brand-yellow text-yellow-900 font-extrabold text-lg py-4 rounded-2xl shadow-lg mt-4"
        >
            CALCULAR AGORA
        </motion.button>
      </form>
    </div>
  );
};

export default Calculator;
