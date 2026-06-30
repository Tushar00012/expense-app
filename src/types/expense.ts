export interface Expense {
  id: string;
  amount: number;
  category: string;
  paymentMethod: 'cash' | 'upi';
  upiApp?: string;
  note?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  createdAt: number;
}

export type PeriodFilter = 'week' | 'month' | 'year' | 'all';
