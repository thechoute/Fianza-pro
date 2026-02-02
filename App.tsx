
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Transaction, SavingsGoal, Commitment, TransactionType } from './types';
import Dashboard from './components/Dashboard';
import SavingsPlanner from './components/SavingsPlanner';
import TransactionForm from './components/TransactionForm';
import CommitmentsManager from './components/CommitmentsManager';
import { getFinancialAdvice } from './services/geminiService';
import { AdBanner, InterstitialAd } from './components/AdComponents';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'savings' | 'commitments' | 'transactions'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [aiAdvice, setAiAdvice] = useState<string>('Analizando tus finanzas...');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // Lógica de Monetización
  const [actionCount, setActionCount] = useState(0);
  const [showInterstitial, setShowInterstitial] = useState(false);

  const incrementAction = () => {
    setActionCount(prev => {
        const next = prev + 1;
        if (next >= 3) {
            setShowInterstitial(true);
            return 0;
        }
        return next;
    });
  };

  const vibrate = (type: 'light' | 'medium' | 'success' = 'light') => {
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      if (type === 'light') window.navigator.vibrate(10);
      else if (type === 'medium') window.navigator.vibrate(30);
      else if (type === 'success') window.navigator.vibrate([20, 50, 20]);
    }
  };

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    const savedGoals = localStorage.getItem('goals');
    const savedCommitments = localStorage.getItem('commitments');
    
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedCommitments) setCommitments(JSON.parse(savedCommitments));
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('goals', JSON.stringify(goals));
    localStorage.setItem('commitments', JSON.stringify(commitments));
  }, [transactions, goals, commitments]);

  const updateAdvice = useCallback(async () => {
    setIsAiLoading(true);
    const advice = await getFinancialAdvice(transactions, goals, commitments);
    setAiAdvice(advice);
    setIsAiLoading(false);
  }, [transactions, goals, commitments]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateAdvice();
    }, 1500);
    return () => clearTimeout(timer);
  }, [transactions, goals, commitments, updateAdvice]);

  const dailySavingsForGoals = useMemo(() => {
    return goals.reduce((acc, goal) => {
      const daysLeft = Math.max(1, Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
      return acc + (goal.targetAmount - goal.savedAmount) / daysLeft;
    }, 0);
  }, [goals]);

  const dailyForCommitments = useMemo(() => {
    return commitments.reduce((acc, c) => acc + c.amount, 0) / 30;
  }, [commitments]);

  const addTransaction = (t: Omit<Transaction, 'id' | 'date'>) => {
    vibrate('medium');
    const newTransaction: Transaction = {
      ...t,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
    incrementAction();
  };

  const addGoal = (g: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    vibrate('success');
    const newGoal: SavingsGoal = {
      ...g,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setGoals(prev => [newGoal, ...prev]);
    incrementAction();
  };

  const addCommitment = (c: Omit<Commitment, 'id'>) => {
    vibrate('success');
    const newC: Commitment = {
      ...c,
      id: Math.random().toString(36).substr(2, 9)
    };
    setCommitments(prev => [...prev, newC]);
    incrementAction();
  };

  return (
    <div className="max-w-6xl mx-auto pb-32 px-4 pt-4 md:pt-8 animate-fade-in relative">
      <InterstitialAd isOpen={showInterstitial} onClose={() => setShowInterstitial(false)} />

      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-indigo-600 tracking-tight">FINANZA PRO</h1>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Premium Ad-Network</p>
        </div>
      </header>

      <AdBanner />

      <div className="mb-6 bg-indigo-600 rounded-[2rem] p-5 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-3">
          <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm mb-0.5">Asesor Inteligente</h3>
            <p className={`text-indigo-50 text-[13px] leading-tight transition-opacity duration-300 ${isAiLoading ? 'opacity-50' : 'opacity-100'}`}>
              {aiAdvice}
            </p>
          </div>
        </div>
      </div>

      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'dashboard', label: 'Inicio' },
          { id: 'commitments', label: 'Gastos' },
          { id: 'savings', label: 'Metas' },
          { id: 'transactions', label: 'Historial' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { vibrate(); setActiveTab(tab.id as any); }}
            className={`flex-1 min-w-[80px] py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm scale-[1.02]' : 'text-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="min-h-[60vh]">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-black text-slate-800">Objetivo Diario</h2>
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">HOY</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-4 rounded-2xl text-center">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Obligatorio</p>
                        <p className="text-xl font-black text-slate-700">${dailyForCommitments.toFixed(0)}</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-2xl text-center">
                        <p className="text-[9px] font-bold text-indigo-400 uppercase mb-1">Ahorro Meta</p>
                        <p className="text-xl font-black text-indigo-700">${dailySavingsForGoals.toFixed(0)}</p>
                    </div>
                </div>
            </div>
            <Dashboard transactions={transactions} goals={goals} />
          </div>
        )}
        
        {activeTab === 'commitments' && (
          <CommitmentsManager 
            commitments={commitments} 
            onAddCommitment={addCommitment} 
            onDeleteCommitment={(id) => { vibrate('medium'); setCommitments(prev => prev.filter(c => c.id !== id)); }}
          />
        )}

        {activeTab === 'savings' && (
          <SavingsPlanner 
            onAddGoal={addGoal} 
            goals={goals} 
            onDeleteGoal={(id) => { vibrate('medium'); setGoals(prev => prev.filter(g => g.id !== id)); }} 
          />
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <TransactionForm onAddTransaction={addTransaction} />
            <div className="bg-white rounded-3xl shadow-sm border border-slate-50 overflow-hidden">
                <div className="p-5 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Historial</h3>
                </div>
                <div className="max-h-[50vh] overflow-y-auto pb-10">
                  {transactions.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">{t.description}</span>
                            <span className="text-[10px] text-slate-400">{t.category}</span>
                        </div>
                        <p className={`text-sm font-black ${t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-slate-800'}`}>
                            {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount}
                        </p>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-24 left-0 w-full z-40 px-4">
         <div className="bg-white/90 backdrop-blur shadow-lg border border-slate-100 rounded-2xl overflow-hidden">
            <div className="text-[7px] text-center text-slate-300 py-0.5">PUBLICIDAD ADMOB</div>
            <div className="h-12 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                BANNER_ID: ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
            </div>
         </div>
      </div>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 px-6 py-4 rounded-full shadow-2xl flex gap-10 z-50 transition-transform active:scale-95">
        <button onClick={() => { vibrate(); setActiveTab('dashboard'); }} className={`transition-all ${activeTab === 'dashboard' ? 'text-white scale-110' : 'text-slate-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        </button>
        <button onClick={() => { vibrate(); setActiveTab('commitments'); }} className={`transition-all ${activeTab === 'commitments' ? 'text-white scale-110' : 'text-slate-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </button>
        <button onClick={() => { vibrate(); setActiveTab('savings'); }} className={`transition-all ${activeTab === 'savings' ? 'text-white scale-110' : 'text-slate-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
        <button onClick={() => { vibrate(); setActiveTab('transactions'); }} className={`transition-all ${activeTab === 'transactions' ? 'text-white scale-110' : 'text-slate-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
        </button>
      </nav>
    </div>
  );
};

export default App;
