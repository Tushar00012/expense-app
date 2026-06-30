export const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: 'food-fork-drink', color: '#FF6B6B' },
  { id: 'transport', label: 'Transport', icon: 'car', color: '#4ECDC4' },
  { id: 'shopping', label: 'Shopping', icon: 'shopping', color: '#45B7D1' },
  { id: 'entertainment', label: 'Entertainment', icon: 'movie-open', color: '#A29BFE' },
  { id: 'bills', label: 'Bills & Utilities', icon: 'lightning-bolt', color: '#FFEAA7' },
  { id: 'health', label: 'Health & Medical', icon: 'heart-pulse', color: '#FD79A8' },
  { id: 'education', label: 'Education', icon: 'school', color: '#55EFC4' },
  { id: 'travel', label: 'Travel', icon: 'airplane', color: '#74B9FF' },
  { id: 'other', label: 'Other', icon: 'dots-horizontal', color: '#B2BEC3' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];

export function getCategoryById(id: string) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}
