import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    upi_app TEXT,
    note TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
  CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at DESC);
`;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('expenses.db');
  await db.execAsync(SCHEMA);
  return db;
}
