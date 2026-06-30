import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import {
  useExpenseStore,
  selectFilteredExpenses,
  selectGroupedExpenses,
} from '../../src/store/useExpenseStore';
import { ExpenseListItem } from '../../src/components/ExpenseListItem';
import { EmptyState } from '../../src/components/EmptyState';
import { CATEGORIES } from '../../src/constants/categories';
import { formatDate, formatCurrency } from '../../src/utils/formatters';

export default function HistoryScreen() {
  const theme = useTheme();
  const loadExpenses = useExpenseStore((s) => s.loadExpenses);
  const {
    expenses,
    removeExpense,
    searchQuery,
    filterCategory,
    filterPaymentMethod,
    setSearchQuery,
    setFilterCategory,
    setFilterPaymentMethod,
    clearFilters,
  } = useExpenseStore();

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  const filtered = useMemo(
    () => selectFilteredExpenses(expenses, searchQuery, filterCategory, filterPaymentMethod),
    [expenses, searchQuery, filterCategory, filterPaymentMethod]
  );
  const grouped = useMemo(() => selectGroupedExpenses(filtered), [filtered]);
  const hasFilters = !!(searchQuery || filterCategory || filterPaymentMethod);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>History</Text>
        {hasFilters && (
          <TouchableOpacity onPress={clearFilters}>
            <Text style={[styles.clearText, { color: theme.colors.error }]}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
        <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.onSurfaceVariant} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.onSurface }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search expenses..."
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons name="close-circle" size={18} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Payment Method Filter */}
      <View style={styles.filterRow}>
        {(['cash', 'upi'] as const).map((m) => (
          <TouchableOpacity
            key={m}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  filterPaymentMethod === m ? theme.colors.primary : theme.colors.surfaceVariant,
              },
            ]}
            onPress={() => setFilterPaymentMethod(filterPaymentMethod === m ? null : m)}
          >
            <MaterialCommunityIcons
              name={m === 'cash' ? 'cash' : 'cellphone-wireless'}
              size={14}
              color={filterPaymentMethod === m ? '#FFF' : theme.colors.onSurfaceVariant}
            />
            <Text
              style={[styles.filterChipText, { color: filterPaymentMethod === m ? '#FFF' : theme.colors.onSurfaceVariant }]}
            >
              {m === 'cash' ? 'Cash' : 'UPI'}
            </Text>
          </TouchableOpacity>
        ))}
        {CATEGORIES.slice(0, 4).map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  filterCategory === cat.id ? cat.color : theme.colors.surfaceVariant,
              },
            ]}
            onPress={() => setFilterCategory(filterCategory === cat.id ? null : cat.id)}
          >
            <Text
              style={[styles.filterChipText, { color: filterCategory === cat.id ? '#FFF' : theme.colors.onSurfaceVariant }]}
            >
              {cat.label.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Expense List */}
      {grouped.length === 0 ? (
        <EmptyState
          icon="magnify"
          title={hasFilters ? 'No results found' : 'No expenses yet'}
          subtitle={hasFilters ? 'Try clearing filters' : 'Your expense history will appear here'}
        />
      ) : (
        <SectionList
          sections={grouped}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExpenseListItem expense={item} onDelete={removeExpense} />
          )}
          renderSectionHeader={({ section }) => (
            <View style={[styles.sectionHeader, { backgroundColor: theme.colors.background }]}>
              <Text style={[styles.sectionDate, { color: theme.colors.onSurface }]}>
                {formatDate(section.title)}
              </Text>
              <Text style={[styles.sectionTotal, { color: theme.colors.primary }]}>
                {formatCurrency(section.total)}
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          stickySectionHeadersEnabled
        />
      )}
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
  title: { fontSize: 26, fontWeight: '800' },
  clearText: { fontSize: 14, fontWeight: '600' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 15 },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  filterChipText: { fontSize: 12, fontWeight: '600' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  sectionDate: { fontSize: 14, fontWeight: '700' },
  sectionTotal: { fontSize: 14, fontWeight: '700' },
});
