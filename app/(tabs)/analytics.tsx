import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useExpenseStore } from '../../src/store/useExpenseStore';
import { PeriodBarChart } from '../../src/components/PeriodBarChart';
import { PeriodFilter } from '../../src/types/expense';
import { formatDateToISO, formatCurrency } from '../../src/utils/formatters';
import {
  getWeekDateRange,
  getMonthDateRange,
  getYearDateRange,
} from '../../src/utils/chartTransforms';
import { getCategoryById } from '../../src/constants/categories';

const FILTERS: { key: PeriodFilter; label: string; icon: string }[] = [
  { key: 'week',  label: 'Week',  icon: 'calendar-week'   },
  { key: 'month', label: 'Month', icon: 'calendar-month'  },
  { key: 'year',  label: 'Year',  icon: 'calendar'        },
  { key: 'all',   label: 'All',   icon: 'calendar-blank-multiple' },
];

export default function AnalyticsScreen() {
  const theme = useTheme();
  const expenses    = useExpenseStore((s) => s.expenses);
  const loadExpenses = useExpenseStore((s) => s.loadExpenses);
  const [filter, setFilter] = useState<PeriodFilter>('week');

  useFocusEffect(
    useCallback(() => { loadExpenses(); }, [])
  );

  // Expenses scoped to the selected period (used for category breakdown & total)
  const periodExpenses = useMemo(() => {
    const now = new Date();
    if (filter === 'all') return expenses;
    let start: string, end: string;
    if (filter === 'week') {
      const r = getWeekDateRange(now);
      start = formatDateToISO(r.start); end = formatDateToISO(r.end);
    } else if (filter === 'month') {
      const r = getMonthDateRange(now);
      start = formatDateToISO(r.start); end = formatDateToISO(r.end);
    } else {
      const r = getYearDateRange(now);
      start = formatDateToISO(r.start); end = formatDateToISO(r.end);
    }
    return expenses.filter((e) => e.date >= start && e.date <= end);
  }, [expenses, filter]);

  const periodTotal = useMemo(
    () => periodExpenses.reduce((s, e) => s + e.amount, 0),
    [periodExpenses]
  );

  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of periodExpenses) map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
    return Array.from(map.entries())
      .map(([id, amount]) => ({
        id, amount,
        pct: periodTotal > 0 ? Math.round((amount / periodTotal) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [periodExpenses, periodTotal]);

  const filterLabel = FILTERS.find((f) => f.key === filter)?.label ?? '';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>Analytics</Text>
        </View>

        {/* Period Filter Tabs */}
        <View style={[styles.filterRow, { backgroundColor: theme.colors.surfaceVariant }]}>
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterTab, active && { backgroundColor: theme.colors.primary }]}
                onPress={() => setFilter(f.key)}
              >
                <Text style={[styles.filterLabel, { color: active ? '#FFF' : theme.colors.onSurfaceVariant }]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bar Chart */}
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            {filterLabel} Overview
          </Text>
        </View>
        <PeriodBarChart expenses={expenses} filter={filter} />

        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 && (
          <>
            <View style={styles.sectionRow}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Top Categories
              </Text>
              <Text style={[styles.totalBadge, { backgroundColor: theme.colors.primaryContainer, color: theme.colors.primary }]}>
                {formatCurrency(periodTotal)}
              </Text>
            </View>

            <View style={[styles.breakdownCard, { backgroundColor: theme.colors.surface }]}>
              {categoryBreakdown.map((item) => {
                const cat = getCategoryById(item.id);
                return (
                  <View key={item.id} style={styles.breakdownRow}>
                    <View style={[styles.catIcon, { backgroundColor: cat.color + '22' }]}>
                      <MaterialCommunityIcons name={cat.icon as any} size={16} color={cat.color} />
                    </View>
                    <Text style={[styles.catLabel, { color: theme.colors.onSurface }]} numberOfLines={1}>
                      {cat.label}
                    </Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: `${item.pct}%`, backgroundColor: cat.color }]} />
                    </View>
                    <Text style={[styles.catPct, { color: theme.colors.onSurfaceVariant }]}>
                      {item.pct}%
                    </Text>
                    <Text style={[styles.catAmount, { color: theme.colors.onSurface }]}>
                      {formatCurrency(item.amount)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Empty state */}
        {periodExpenses.length === 0 && (
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons name="chart-bar" size={48} color={theme.colors.onSurfaceVariant} style={{ opacity: 0.3 }} />
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              No expenses for this period
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 26, fontWeight: '800' },
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 4,
    marginBottom: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 11,
  },
  filterLabel: { fontSize: 13, fontWeight: '700' },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  totalBadge: {
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  breakdownCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catIcon: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  catLabel: { fontSize: 12, fontWeight: '600', width: 80 },
  barTrack: { flex: 1, height: 6, backgroundColor: '#E0E0E0', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  catPct: { fontSize: 11, width: 30, textAlign: 'right' },
  catAmount: { fontSize: 12, fontWeight: '700', width: 68, textAlign: 'right' },
  emptyWrap: { alignItems: 'center', paddingTop: 48, gap: 12 },
  emptyText: { fontSize: 15, fontWeight: '500' },
});
