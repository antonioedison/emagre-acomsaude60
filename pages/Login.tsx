
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Zap, Lock, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useGame();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Preencha todos os campos');
      setLoading(false);
      return;
    }

    // Simulating network delay for realism
    setTimeout(async () => {
        const success = await login(email, password);
        if (success) {
            navigate('/');
        } else {
            setError('E-mail ou senha inválidos');
        }
        setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-aqua to-brand-darkGreen flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 space-y-6">
        
        <div className="text-center space-y-2">
            <div className="bg-brand-yellow w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
                <Zap size={32} className="text-yellow-900" />
            </div>
            <h1 className="text-2xl font-black text-brand-darkGreen">Bem-vindo!</h1>
            <p className="text-gray-400 text-sm font-medium">Faça login para continuar sua jornada</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">E-mail</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-aqua focus:ring-2 focus:ring-brand-aqua/20 font-bold text-gray-700 transition-all"
                        placeholder="seu@email.com"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Senha</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-aqua focus:ring-2 focus:ring-brand-aqua/20 font-bold text-gray-700 transition-all"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-500 text-sm font-bold p-3 rounded-xl text-center">
                    {error}
                </div>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-aqua text-white font-extrabold py-4 rounded-xl shadow-lg hover:bg-brand-darkGreen active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? 'Carregando...' : 'ENTRAR'}
            </button>
        </form>

        <div className="text-center pt-2">
            <p className="text-sm text-gray-500">
                Não tem conta? <Link to="/register" className="text-brand-darkGreen font-bold hover:underline">Cadastre-se</Link>
            </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
