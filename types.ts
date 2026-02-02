
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string; // ISO string
  createdAt: string;
}

export interface Commitment {
  id: string;
  name: string;
  amount: number;
  dueDay: number; // Day of the month (1-31)
}

export interface FinancialSummary {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
}
