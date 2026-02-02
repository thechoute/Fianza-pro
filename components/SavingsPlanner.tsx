
import React, { useState, useMemo } from 'react';
import { SavingsGoal } from '../types';
import { format, differenceInDays, addDays, parseISO } from 'date-fns';

interface SavingsPlannerProps {
  onAddGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  goals: SavingsGoal[];
  onDeleteGoal: (id: string) => void;
}

const SavingsPlanner: React.FC<SavingsPlannerProps> = ({ onAddGoal, goals, onDeleteGoal }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [days, setDays] = useState<number>(30);

  const dailyAmount = useMemo(() => {
    if (targetAmount <= 0 || days <= 0) return 0;
    return targetAmount / days;
  }, [targetAmount, days]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || targetAmount <= 0) return;

    const targetDate = addDays(new Date(), days).toISOString();
    onAddGoal({
      name,
      targetAmount,
      savedAmount: 0,
      targetDate,
    });

    setName('');
    setTargetAmount(0);
    setDays(30);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Nueva Meta de Ahorro</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">¿Para qué quieres ahorrar?</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              placeholder="Ej. Viaje a Japón, Fondo de Emergencia..."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Monto Objetivo ($)</label>
              <input
                type="number"
                value={targetAmount || ''}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Días para lograrlo</label>
              <input
                type="number"
                value={days || ''}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="Días"
                required
              />
            </div>
          </div>

          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Tu plan diario</span>
            <span className="text-3xl font-bold text-indigo-700">
              ${dailyAmount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-sm text-indigo-500 mt-1">por día para alcanzar tu meta</span>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
          >
            Crear Meta
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Tus Metas Activas</h3>
        {goals.length === 0 ? (
          <p className="text-slate-500 text-sm italic">No tienes metas activas aún. ¡Empieza a ahorrar hoy!</p>
        ) : (
          goals.map((goal) => {
            const daysLeft = Math.max(0, differenceInDays(parseISO(goal.targetDate), new Date()));
            const dailyNext = daysLeft > 0 ? (goal.targetAmount - goal.savedAmount) / daysLeft : 0;
            const progress = (goal.savedAmount / goal.targetAmount) * 100;

            return (
              <div key={goal.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-slate-800">{goal.name}</h4>
                    <p className="text-xs text-slate-400">Objetivo: ${goal.targetAmount.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => onDeleteGoal(goal.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, progress)}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <p className="text-[10px] text-slate-500 uppercase">Quedan</p>
                    <p className="font-bold text-slate-700">{daysLeft} días</p>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-lg">
                    <p className="text-[10px] text-emerald-600 uppercase">Ahorro Diario</p>
                    <p className="font-bold text-emerald-700">${dailyNext.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SavingsPlanner;
