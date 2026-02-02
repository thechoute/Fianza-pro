
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Transaction, TransactionType, SavingsGoal } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  goals: SavingsGoal[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, goals }) => {
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Chart data for history (simulated from current transactions)
  const chartData = transactions.slice(-7).map(t => ({
    name: new Date(t.date).toLocaleDateString('es-MX', { weekday: 'short' }),
    amount: t.amount,
    type: t.type
  }));

  const pieData = [
    { name: 'Gastos', value: totalExpense },
    { name: 'Ingresos', value: totalIncome },
  ];

  const COLORS = ['#ef4444', '#10b981'];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-slate-400 text-sm font-medium">Saldo Total</span>
          <span className={`text-3xl font-bold mt-1 ${balance >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
            ${balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl shadow-sm border border-emerald-100 flex flex-col">
          <span className="text-emerald-600 text-sm font-medium">Ingresos</span>
          <span className="text-3xl font-bold text-emerald-700 mt-1">
            +${totalIncome.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100 flex flex-col">
          <span className="text-red-600 text-sm font-medium">Gastos</span>
          <span className="text-3xl font-bold text-red-700 mt-1">
            -${totalExpense.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Actividad Reciente</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Distribución Financiera</h3>
          <div className="h-64 w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-xs text-slate-400 font-medium">Balance</span>
              <span className="text-lg font-bold text-slate-700">
                {((totalIncome / (totalIncome + totalExpense || 1)) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
