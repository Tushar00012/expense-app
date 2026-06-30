import { Expense, PeriodFilter } from '../types/expense';
import { formatDateToISO } from './formatters';

export interface LineDataPoint {
  value: number;
  label?: string;
  hideDataPoint?: boolean;
}

export interface BarDataPoint {
  value: number;
  label: string;
  frontColor: string;
}

const PRIMARY = '#5C35CC';
const EMPTY_COLOR = 'transparent';

function makeBar(value: number, label: string): BarDataPoint {
  return {
    value,
    label,
    frontColor: value > 0 ? PRIMARY : EMPTY_COLOR,
  };
}

export function buildHourlyLineData(expenses: Expense[]): LineDataPoint[] {
  const buckets = Array.from({ length: 24 }, () => 0);
  for (const e of expenses) {
    const hour = parseInt(e.time.split(':')[0], 10);
    if (hour >= 0 && hour < 24) buckets[hour] += e.amount;
  }
  let running = 0;
  return buckets.map((val, i) => {
    running += val;
    const showLabel = [0, 6, 12, 18, 23].includes(i);
    const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
    const period = i < 12 ? 'AM' : 'PM';
    const label = i === 0 ? '12AM' : i === 12 ? '12PM' : `${hour}${period}`;
    return { value: running, label: showLabel ? label : undefined };
  });
}

export function buildBarData(
  expenses: Expense[],
  filter: PeriodFilter,
  referenceDate: Date
): BarDataPoint[] {
  if (filter === 'week') {
    // Mon–Sun of the current week
    const start = getStartOfWeek(referenceDate);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const dateStr = formatDateToISO(day);
      const total = expenses
        .filter((e) => e.date === dateStr)
        .reduce((sum, e) => sum + e.amount, 0);
      return makeBar(total, days[i]);
    });
  }

  if (filter === 'month') {
    // W1, W2… weeks within the current month
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const weeks: BarDataPoint[] = [];
    let cursor = new Date(firstDay);
    let weekNum = 1;
    while (cursor <= lastDay) {
      const weekEnd = new Date(cursor);
      weekEnd.setDate(cursor.getDate() + 6);
      const startStr = formatDateToISO(cursor);
      const endStr = formatDateToISO(weekEnd > lastDay ? lastDay : weekEnd);
      const total = expenses
        .filter((e) => e.date >= startStr && e.date <= endStr)
        .reduce((sum, e) => sum + e.amount, 0);
      weeks.push(makeBar(total, `W${weekNum}`));
      cursor.setDate(cursor.getDate() + 7);
      weekNum++;
    }
    return weeks;
  }

  if (filter === 'year') {
    // Jan–Dec of the current year
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Array.from({ length: 12 }, (_, i) => {
      const monthPrefix = `${referenceDate.getFullYear()}-${String(i + 1).padStart(2, '0')}`;
      const total = expenses
        .filter((e) => e.date.startsWith(monthPrefix))
        .reduce((sum, e) => sum + e.amount, 0);
      return makeBar(total, months[i]);
    });
  }

  // 'all' — one bar per calendar year found in the data
  const yearMap = new Map<number, number>();
  for (const e of expenses) {
    const y = parseInt(e.date.substring(0, 4), 10);
    yearMap.set(y, (yearMap.get(y) ?? 0) + e.amount);
  }
  if (yearMap.size === 0) {
    const y = referenceDate.getFullYear();
    return [makeBar(0, String(y))];
  }
  const sorted = Array.from(yearMap.entries()).sort((a, b) => a[0] - b[0]);
  return sorted.map(([y, total]) => makeBar(total, String(y)));
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekDateRange(date: Date): { start: Date; end: Date } {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

export function getMonthDateRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end };
}

export function getYearDateRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), 0, 1);
  const end = new Date(date.getFullYear(), 11, 31);
  return { start, end };
}
