import { Expense } from '../types/expense';
import { generateId, formatDateToISO } from './formatters';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return formatDateToISO(d);
}

const RAW: Omit<Expense, 'id' | 'createdAt'>[] = [
  // Today
  { amount: 180, category: 'food', paymentMethod: 'upi', upiApp: 'gpay', note: 'Breakfast at café', date: daysAgo(0), time: '08:15' },
  { amount: 45, category: 'transport', paymentMethod: 'cash', note: 'Auto rickshaw', date: daysAgo(0), time: '09:00' },
  { amount: 1200, category: 'shopping', paymentMethod: 'upi', upiApp: 'phonepe', note: 'T-shirt & jeans', date: daysAgo(0), time: '11:30' },
  { amount: 320, category: 'food', paymentMethod: 'upi', upiApp: 'gpay', note: 'Lunch with team', date: daysAgo(0), time: '13:15' },
  { amount: 60, category: 'transport', paymentMethod: 'cash', date: daysAgo(0), time: '14:00' },
  { amount: 499, category: 'entertainment', paymentMethod: 'upi', upiApp: 'cred', note: 'Movie tickets', date: daysAgo(0), time: '17:45' },
  { amount: 250, category: 'food', paymentMethod: 'upi', upiApp: 'paytm', note: 'Dinner takeout', date: daysAgo(0), time: '20:30' },

  // Yesterday
  { amount: 150, category: 'food', paymentMethod: 'cash', note: 'Street food', date: daysAgo(1), time: '09:30' },
  { amount: 2500, category: 'bills', paymentMethod: 'upi', upiApp: 'phonepe', note: 'Electricity bill', date: daysAgo(1), time: '10:00' },
  { amount: 80, category: 'transport', paymentMethod: 'upi', upiApp: 'gpay', date: daysAgo(1), time: '11:00' },
  { amount: 450, category: 'health', paymentMethod: 'upi', upiApp: 'paytm', note: 'Pharmacy', date: daysAgo(1), time: '13:00' },
  { amount: 299, category: 'food', paymentMethod: 'upi', upiApp: 'gpay', note: 'Pizza delivery', date: daysAgo(1), time: '19:30' },
  { amount: 1800, category: 'shopping', paymentMethod: 'upi', upiApp: 'amazonpay', note: 'Headphones', date: daysAgo(1), time: '22:00' },

  // 2 days ago
  { amount: 120, category: 'food', paymentMethod: 'cash', note: 'Breakfast', date: daysAgo(2), time: '08:00' },
  { amount: 350, category: 'food', paymentMethod: 'upi', upiApp: 'gpay', note: 'Lunch at restaurant', date: daysAgo(2), time: '13:00' },
  { amount: 100, category: 'transport', paymentMethod: 'cash', date: daysAgo(2), time: '15:00' },
  { amount: 3200, category: 'education', paymentMethod: 'upi', upiApp: 'phonepe', note: 'Online course', date: daysAgo(2), time: '16:30' },
  { amount: 200, category: 'food', paymentMethod: 'upi', upiApp: 'paytm', note: 'Evening snacks', date: daysAgo(2), time: '18:45' },

  // 3 days ago
  { amount: 90, category: 'transport', paymentMethod: 'upi', upiApp: 'gpay', note: 'Cab to office', date: daysAgo(3), time: '09:15' },
  { amount: 280, category: 'food', paymentMethod: 'upi', upiApp: 'gpay', date: daysAgo(3), time: '13:30' },
  { amount: 650, category: 'health', paymentMethod: 'upi', upiApp: 'phonepe', note: 'Doctor consultation', date: daysAgo(3), time: '15:00' },
  { amount: 500, category: 'shopping', paymentMethod: 'cash', note: 'Groceries', date: daysAgo(3), time: '17:00' },
  { amount: 199, category: 'entertainment', paymentMethod: 'upi', upiApp: 'cred', note: 'Netflix subscription', date: daysAgo(3), time: '20:00' },

  // 4 days ago
  { amount: 160, category: 'food', paymentMethod: 'cash', date: daysAgo(4), time: '08:30' },
  { amount: 1100, category: 'bills', paymentMethod: 'upi', upiApp: 'paytm', note: 'Internet bill', date: daysAgo(4), time: '11:00' },
  { amount: 75, category: 'transport', paymentMethod: 'cash', date: daysAgo(4), time: '12:30' },
  { amount: 420, category: 'food', paymentMethod: 'upi', upiApp: 'gpay', note: 'Family dinner', date: daysAgo(4), time: '19:00' },

  // 5 days ago
  { amount: 2200, category: 'shopping', paymentMethod: 'upi', upiApp: 'amazonpay', note: 'Running shoes', date: daysAgo(5), time: '10:00' },
  { amount: 300, category: 'food', paymentMethod: 'upi', upiApp: 'phonepe', note: 'Lunch', date: daysAgo(5), time: '13:00' },
  { amount: 50, category: 'transport', paymentMethod: 'cash', date: daysAgo(5), time: '14:30' },
  { amount: 800, category: 'health', paymentMethod: 'upi', upiApp: 'gpay', note: 'Gym monthly fee', date: daysAgo(5), time: '16:00' },

  // 6 days ago
  { amount: 130, category: 'food', paymentMethod: 'cash', note: 'Breakfast & tea', date: daysAgo(6), time: '07:45' },
  { amount: 600, category: 'bills', paymentMethod: 'upi', upiApp: 'phonepe', note: 'Mobile recharge', date: daysAgo(6), time: '10:30' },
  { amount: 380, category: 'food', paymentMethod: 'upi', upiApp: 'gpay', note: 'Biryani party', date: daysAgo(6), time: '13:00' },
  { amount: 1500, category: 'travel', paymentMethod: 'upi', upiApp: 'cred', note: 'Train ticket booking', date: daysAgo(6), time: '20:00' },

  // 8 days ago
  { amount: 250, category: 'food', paymentMethod: 'cash', date: daysAgo(8), time: '12:00' },
  { amount: 4500, category: 'shopping', paymentMethod: 'upi', upiApp: 'amazonpay', note: 'Smart watch', date: daysAgo(8), time: '14:00' },
  { amount: 120, category: 'transport', paymentMethod: 'cash', date: daysAgo(8), time: '16:00' },

  // 10 days ago
  { amount: 900, category: 'bills', paymentMethod: 'upi', upiApp: 'paytm', note: 'Gas bill', date: daysAgo(10), time: '10:00' },
  { amount: 350, category: 'food', paymentMethod: 'upi', upiApp: 'gpay', date: daysAgo(10), time: '13:00' },
  { amount: 200, category: 'health', paymentMethod: 'cash', note: 'Vitamins', date: daysAgo(10), time: '17:00' },

  // 12 days ago
  { amount: 1600, category: 'travel', paymentMethod: 'upi', upiApp: 'phonepe', note: 'Hotel stay', date: daysAgo(12), time: '09:00' },
  { amount: 450, category: 'food', paymentMethod: 'cash', note: 'Road trip snacks', date: daysAgo(12), time: '11:00' },
  { amount: 280, category: 'transport', paymentMethod: 'upi', upiApp: 'gpay', note: 'Cab', date: daysAgo(12), time: '18:00' },

  // 15 days ago
  { amount: 5000, category: 'shopping', paymentMethod: 'upi', upiApp: 'cred', note: 'Monthly grocery haul', date: daysAgo(15), time: '11:00' },
  { amount: 700, category: 'education', paymentMethod: 'upi', upiApp: 'paytm', note: 'Books', date: daysAgo(15), time: '14:00' },
  { amount: 300, category: 'food', paymentMethod: 'cash', date: daysAgo(15), time: '19:30' },

  // 18 days ago
  { amount: 1200, category: 'bills', paymentMethod: 'upi', upiApp: 'phonepe', note: 'Water & maintenance', date: daysAgo(18), time: '10:00' },
  { amount: 400, category: 'food', paymentMethod: 'upi', upiApp: 'gpay', date: daysAgo(18), time: '13:30' },
  { amount: 850, category: 'health', paymentMethod: 'upi', upiApp: 'paytm', note: 'Blood test', date: daysAgo(18), time: '16:00' },

  // 20 days ago
  { amount: 220, category: 'food', paymentMethod: 'cash', date: daysAgo(20), time: '09:00' },
  { amount: 3000, category: 'travel', paymentMethod: 'upi', upiApp: 'cred', note: 'Flight tickets', date: daysAgo(20), time: '12:00' },
  { amount: 180, category: 'transport', paymentMethod: 'cash', date: daysAgo(20), time: '15:00' },

  // 22 days ago
  { amount: 650, category: 'entertainment', paymentMethod: 'upi', upiApp: 'gpay', note: 'Concert tickets', date: daysAgo(22), time: '11:00' },
  { amount: 400, category: 'food', paymentMethod: 'cash', note: 'Birthday dinner', date: daysAgo(22), time: '20:00' },

  // 25 days ago
  { amount: 1800, category: 'shopping', paymentMethod: 'upi', upiApp: 'amazonpay', note: 'Winter jacket', date: daysAgo(25), time: '14:00' },
  { amount: 280, category: 'food', paymentMethod: 'upi', upiApp: 'gpay', date: daysAgo(25), time: '13:00' },
  { amount: 500, category: 'bills', paymentMethod: 'upi', upiApp: 'paytm', note: 'OTT subscriptions', date: daysAgo(25), time: '18:00' },

  // 28 days ago
  { amount: 2400, category: 'education', paymentMethod: 'upi', upiApp: 'phonepe', note: 'Certification exam fee', date: daysAgo(28), time: '10:00' },
  { amount: 350, category: 'food', paymentMethod: 'cash', date: daysAgo(28), time: '13:00' },
  { amount: 90, category: 'transport', paymentMethod: 'cash', date: daysAgo(28), time: '17:00' },

  // 30 days ago
  { amount: 600, category: 'health', paymentMethod: 'upi', upiApp: 'gpay', note: 'Eye checkup', date: daysAgo(30), time: '11:00' },
  { amount: 1200, category: 'shopping', paymentMethod: 'upi', upiApp: 'cred', note: 'Shoes', date: daysAgo(30), time: '15:00' },
  { amount: 380, category: 'food', paymentMethod: 'upi', upiApp: 'paytm', note: 'Dinner out', date: daysAgo(30), time: '20:30' },
];

export function generateMockExpenses(): Expense[] {
  return RAW.map((item) => ({
    ...item,
    id: generateId(),
    createdAt: new Date(`${item.date}T${item.time}:00`).getTime(),
  }));
}
