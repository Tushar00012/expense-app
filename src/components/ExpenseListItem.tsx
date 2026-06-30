import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Expense } from '../types/expense';
import { CategoryIcon } from './CategoryIcon';
import { getCategoryById } from '../constants/categories';
import { getUpiAppById } from '../constants/upiApps';
import { formatCurrency, formatTime } from '../utils/formatters';

interface ExpenseListItemProps {
  expense: Expense;
  onDelete?: (id: string) => void;
}

export function ExpenseListItem({ expense, onDelete }: ExpenseListItemProps) {
  const theme = useTheme();
  const category = getCategoryById(expense.category);
  const paymentLabel =
    expense.paymentMethod === 'cash'
      ? 'Cash'
      : getUpiAppById(expense.upiApp ?? 'other_upi').label;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <CategoryIcon categoryId={expense.category} size={44} />
      <View style={styles.details}>
        <Text style={[styles.categoryLabel, { color: theme.colors.onSurface }]}>
          {category.label}
        </Text>
        {expense.note ? (
          <Text style={[styles.note, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
            {expense.note}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: expense.paymentMethod === 'cash' ? '#4ECDC422' : '#5C35CC22' }]}>
            <Text style={[styles.badgeText, { color: expense.paymentMethod === 'cash' ? '#4ECDC4' : '#5C35CC' }]}>
              {paymentLabel}
            </Text>
          </View>
          <Text style={[styles.time, { color: theme.colors.onSurfaceVariant }]}>
            {formatTime(expense.time)}
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: theme.colors.onSurface }]}>
          {formatCurrency(expense.amount)}
        </Text>
        {onDelete ? (
          <TouchableOpacity onPress={() => onDelete(expense.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialCommunityIcons name="delete-outline" size={18} color={theme.colors.error} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  time: {
    fontSize: 11,
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
