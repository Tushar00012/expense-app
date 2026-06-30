import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, FAB } from 'react-native-paper';
import { router, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useExpenseStore, selectTodayTotal, selectWeekTotal } from '../../src/store/useExpenseStore';
import { SummaryCard } from '../../src/components/SummaryCard';
import { ExpenseListItem } from '../../src/components/ExpenseListItem';
import { EmptyState } from '../../src/components/EmptyState';
import { formatDate } from '../../src/utils/formatters';

export default function HomeScreen() {
  const theme = useTheme();
  const expenses = useExpenseStore((s) => s.expenses);
  const loadExpenses = useExpenseStore((s) => s.loadExpenses);
  const removeExpense = useExpenseStore((s) => s.removeExpense);
  const todayTotal = selectTodayTotal(expenses);
  const weekTotal = selectWeekTotal(expenses);
  const recent = expenses.slice(0, 5);

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.onSurfaceVariant }]}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>My Expenses</Text>
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.cardsRow}>
          <SummaryCard
            label="Today"
            amount={todayTotal}
            icon="calendar-today"
            gradient={['#5C35CC', '#7B5CE6']}
            subtitle={formatDate(new Date().toISOString().split('T')[0])}
          />
          <View style={{ width: 12 }} />
          <SummaryCard
            label="This Week"
            amount={weekTotal}
            icon="calendar-week"
            gradient={['#9B59B6', '#C39BD3']}
          />
        </View>

        {/* Recent Expenses */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Recent</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
            <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {recent.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title="No expenses yet"
            subtitle="Tap + to add your first expense"
          />
        ) : (
          recent.map((item) => (
            <ExpenseListItem key={item.id} expense={item} onDelete={removeExpense} />
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#FFFFFF"
        onPress={() => router.push('/(tabs)/add')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  greeting: { fontSize: 13, fontWeight: '500' },
  title: { fontSize: 26, fontWeight: '800', marginTop: 2 },
  cardsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  seeAll: { fontSize: 14, fontWeight: '600' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    borderRadius: 28,
  },
});
