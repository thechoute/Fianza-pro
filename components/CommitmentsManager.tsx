
import React, { useState } from 'react';
import { Commitment } from '../types';

interface CommitmentsManagerProps {
  commitments: Commitment[];
  onAddCommitment: (commitment: Omit<Commitment, 'id'>) => void;
  onDeleteCommitment: (id: string) => void;
}

const CommitmentsManager: React.FC<CommitmentsManagerProps> = ({ commitments, onAddCommitment, onDeleteCommitment }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [dueDay, setDueDay] = useState<number>(1);

  const totalMonthly = commitments.reduce((sum, c) => sum + c.amount, 0);
  const dailyRequired = totalMonthly / 30;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || amount <= 0) return;
    onAddCommitment({ name, amount, dueDay });
    setName('');
    setAmount(0);
    setDueDay(1);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Gastos Fijos Mensuales</h2>
        <p className="text-sm text-slate-500 mb-6">Añade tus pagos recurrentes (Renta, local, internet) para calcular tu ahorro diario necesario.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Concepto</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Renta Local"
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Monto ($)</label>
              <input
                type="number"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="0.00"
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Día de pago</label>
              <input
                type="number"
                min="1"
                max="31"
                value={dueDay}
                onChange={(e) => setDueDay(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-colors">
            Añadir Compromiso
          </button>
        </form>

        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex flex-col items-center text-center">
          <span className="text-xs font-bold text-amber-600 uppercase mb-1">Reserva Diaria para Gastos Fijos</span>
          <span className="text-3xl font-black text-amber-700">${dailyRequired.toFixed(2)}</span>
          <p className="text-[10px] text-amber-500 mt-1 italic">Total mensual: ${totalMonthly.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {commitments.map(c => (
          <div key={c.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-700">{c.name}</h4>
              <p className="text-xs text-slate-400">Vence el día {c.dueDay} • ${c.amount.toLocaleString()}</p>
            </div>
            <button onClick={() => onDeleteCommitment(c.id)} className="text-slate-300 hover:text-red-500">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommitmentsManager;
