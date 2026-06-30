import { SQLiteDatabase } from 'expo-sqlite';
import { Expense } from '../types/expense';

export async function insertExpense(db: SQLiteDatabase, expense: Expense): Promise<void> {
  await db.runAsync(
    `INSERT INTO expenses (id, amount, category, payment_method, upi_app, note, date, time, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      expense.id,
      expense.amount,
      expense.category,
      expense.paymentMethod,
      expense.upiApp ?? null,
      expense.note ?? null,
      expense.date,
      expense.time,
      expense.createdAt,
    ]
  );
}

export async function deleteExpense(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
}

export async function getAllExpenses(db: SQLiteDatabase): Promise<Expense[]> {
  const rows = await db.getAllAsync<{
    id: string;
    amount: number;
    category: string;
    payment_method: string;
    upi_app: string | null;
    note: string | null;
    date: string;
    time: string;
    created_at: number;
  }>('SELECT * FROM expenses ORDER BY created_at DESC');

  return rows.map((r) => ({
    id: r.id,
    amount: r.amount,
    category: r.category,
    paymentMethod: r.payment_method as 'cash' | 'upi',
    upiApp: r.upi_app ?? undefined,
    note: r.note ?? undefined,
    date: r.date,
    time: r.time,
    createdAt: r.created_at,
  }));
}

export async function getExpensesByDateRange(
  db: SQLiteDatabase,
  startDate: string,
  endDate: string
): Promise<Expense[]> {
  const rows = await db.getAllAsync<{
    id: string;
    amount: number;
    category: string;
    payment_method: string;
    upi_app: string | null;
    note: string | null;
    date: string;
    time: string;
    created_at: number;
  }>(
    'SELECT * FROM expenses WHERE date BETWEEN ? AND ? ORDER BY created_at ASC',
    [startDate, endDate]
  );
  return rows.map((r) => ({
    id: r.id,
    amount: r.amount,
    category: r.category,
    paymentMethod: r.payment_method as 'cash' | 'upi',
    upiApp: r.upi_app ?? undefined,
    note: r.note ?? undefined,
    date: r.date,
    time: r.time,
    createdAt: r.created_at,
  }));
}

export async function getTodayTotal(db: SQLiteDatabase, date: string): Promise<number> {
  const row = await db.getFirstAsync<{ total: number }>(
    'SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE date = ?',
    [date]
  );
  return row?.total ?? 0;
}
