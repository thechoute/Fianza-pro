
import React, { useState } from 'react';
import { TransactionType, Transaction } from '../types';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState('General');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) return;

    onAddTransaction({
      description,
      amount,
      type,
      category,
    });

    setDescription('');
    setAmount(0);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Añadir Movimiento</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setType(TransactionType.EXPENSE)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              type === TransactionType.EXPENSE ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Gasto
          </button>
          <button
            type="button"
            onClick={() => setType(TransactionType.INCOME)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              type === TransactionType.INCOME ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Ingreso
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Descripción</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Ej. Súper, Pago de Nómina..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Monto</label>
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="General">General</option>
              <option value="Comida">Comida</option>
              <option value="Transporte">Transporte</option>
              <option value="Entretenimiento">Entretenimiento</option>
              <option value="Servicios">Servicios</option>
              <option value="Salud">Salud</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full text-white font-semibold py-3 rounded-xl transition-all shadow-lg ${
            type === TransactionType.INCOME 
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' 
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
          }`}
        >
          Guardar {type === TransactionType.INCOME ? 'Ingreso' : 'Gasto'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
