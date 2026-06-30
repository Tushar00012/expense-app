import { create } from 'zustand';
import { Expense } from '../types/expense';
import { getAllExpenses, insertExpense, deleteExpense } from '../db/queries';
import { getDatabase } from '../db/database';
import { formatDateToISO, generateId, getCurrentTime } from '../utils/formatters';

interface ExpenseStore {
  expenses: Expense[];
  isLoading: boolean;
  searchQuery: string;
  filterCategory: string | null;
  filterPaymentMethod: 'cash' | 'upi' | null;

  loadExpenses: () => Promise<void>;
  addExpense: (data: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  seedMockData: (mockExpenses: Expense[]) => Promise<void>;
  clearAllExpenses: () => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  setSearchQuery: (q: string) => void;
  setFilterCategory: (c: string | null) => void;
  setFilterPaymentMethod: (m: 'cash' | 'upi' | null) => void;
  clearFilters: () => void;
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  expenses: [],
  isLoading: false,
  searchQuery: '',
  filterCategory: null,
  filterPaymentMethod: null,

  loadExpenses: async () => {
    set({ isLoading: true });
    try {
      const db = await getDatabase();
      const data = await getAllExpenses(db);
      set({ expenses: data });
    } finally {
      set({ isLoading: false });
    }
  },

  addExpense: async (data) => {
    const expense: Expense = {
      ...data,
      id: generateId(),
      createdAt: Date.now(),
    };
    const db = await getDatabase();
    await insertExpense(db, expense);
    set((state) => ({ expenses: [expense, ...state.expenses] }));
  },

  removeExpense: async (id) => {
    const db = await getDatabase();
    await deleteExpense(db, id);
    set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) }));
  },

  seedMockData: async (mockExpenses) => {
    const db = await getDatabase();
    for (const expense of mockExpenses) {
      await insertExpense(db, expense);
    }
    const all = await getAllExpenses(db);
    set({ expenses: all });
  },

  clearAllExpenses: async () => {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM expenses');
    set({ expenses: [] });
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterCategory: (c) => set({ filterCategory: c }),
  setFilterPaymentMethod: (m) => set({ filterPaymentMethod: m }),
  clearFilters: () => set({ searchQuery: '', filterCategory: null, filterPaymentMethod: null }),
}));

export function selectTodayExpenses(expenses: Expense[]): Expense[] {
  const today = formatDateToISO(new Date());
  return expenses.filter((e) => e.date === today);
}

export function selectTodayTotal(expenses: Expense[]): number {
  return selectTodayExpenses(expenses).reduce((sum, e) => sum + e.amount, 0);
}

export function selectWeekTotal(expenses: Expense[]): number {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);
  const startStr = formatDateToISO(startOfWeek);
  const todayStr = formatDateToISO(now);
  return expenses
    .filter((e) => e.date >= startStr && e.date <= todayStr)
    .reduce((sum, e) => sum + e.amount, 0);
}

export function selectFilteredExpenses(
  expenses: Expense[],
  searchQuery: string,
  filterCategory: string | null,
  filterPaymentMethod: 'cash' | 'upi' | null
): Expense[] {
  return expenses.filter((e) => {
    if (filterCategory && e.category !== filterCategory) return false;
    if (filterPaymentMethod && e.paymentMethod !== filterPaymentMethod) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        e.category.toLowerCase().includes(q) ||
        (e.note?.toLowerCase().includes(q) ?? false) ||
        e.amount.toString().includes(q)
      );
    }
    return true;
  });
}

export function selectGroupedExpenses(expenses: Expense[]) {
  const groups = new Map<string, Expense[]>();
  for (const e of expenses) {
    if (!groups.has(e.date)) groups.set(e.date, []);
    groups.get(e.date)!.push(e);
  }
  return Array.from(groups.entries()).map(([date, items]) => ({
    title: date,
    data: items,
    total: items.reduce((sum, e) => sum + e.amount, 0),
  }));
}
