import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { CATEGORIES } from '../../src/constants/categories';
import { UPI_APPS } from '../../src/constants/upiApps';
import { useExpenseStore } from '../../src/store/useExpenseStore';
import { formatDateToISO, getCurrentTime } from '../../src/utils/formatters';

export default function AddExpenseScreen() {
  const theme = useTheme();
  const addExpense = useExpenseStore((s) => s.addExpense);

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi'>('cash');
  const [upiApp, setUpiApp] = useState('gpay');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(formatDateToISO(new Date()));
  const [time, setTime] = useState(getCurrentTime());
  const [saving, setSaving] = useState(false);

  // Refresh date & time from the phone every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setDate(formatDateToISO(new Date()));
      setTime(getCurrentTime());
    }, [])
  );

  async function handleSave() {
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }
    setSaving(true);
    await addExpense({
      amount: parsed,
      category,
      paymentMethod,
      upiApp: paymentMethod === 'upi' ? upiApp : undefined,
      note: note.trim() || undefined,
      date,
      time,
    });
    setSaving(false);
    setAmount('');
    setNote('');
    setCategory('food');
    setPaymentMethod('cash');
    router.push('/(tabs)');
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>Add Expense</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)')}>
              <MaterialCommunityIcons name="close" size={24} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Amount */}
          <View style={[styles.amountContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.currencySymbol, { color: theme.colors.primary }]}>₹</Text>
            <TextInput
              style={[styles.amountInput, { color: theme.colors.onSurface }]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              keyboardType="decimal-pad"
              autoFocus
            />
          </View>

          {/* Category */}
          <Text style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll} contentContainerStyle={styles.chipRow}>
            {CATEGORIES.map((cat) => {
              const selected = category === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selected ? cat.color : theme.colors.surfaceVariant,
                      borderColor: selected ? cat.color : 'transparent',
                    },
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <MaterialCommunityIcons
                    name={cat.icon as any}
                    size={16}
                    color={selected ? '#FFF' : theme.colors.onSurfaceVariant}
                  />
                  <Text style={[styles.chipText, { color: selected ? '#FFF' : theme.colors.onSurfaceVariant }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Payment Method */}
          <Text style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>Payment Method</Text>
          <View style={[styles.segmentedRow, { backgroundColor: theme.colors.surfaceVariant }]}>
            {(['cash', 'upi'] as const).map((method) => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.segment,
                  paymentMethod === method && { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => setPaymentMethod(method)}
              >
                <MaterialCommunityIcons
                  name={method === 'cash' ? 'cash' : 'cellphone-wireless'}
                  size={18}
                  color={paymentMethod === method ? '#FFF' : theme.colors.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.segmentText,
                    { color: paymentMethod === method ? '#FFF' : theme.colors.onSurfaceVariant },
                  ]}
                >
                  {method === 'cash' ? 'Cash' : 'UPI'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* UPI App Picker */}
          {paymentMethod === 'upi' && (
            <>
              <Text style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>UPI App</Text>
              <View style={styles.upiGrid}>
                {UPI_APPS.map((app) => {
                  const selected = upiApp === app.id;
                  return (
                    <TouchableOpacity
                      key={app.id}
                      style={[
                        styles.upiCard,
                        {
                          backgroundColor: selected ? app.color + '22' : theme.colors.surfaceVariant,
                          borderColor: selected ? app.color : 'transparent',
                          borderWidth: selected ? 2 : 0,
                        },
                      ]}
                      onPress={() => setUpiApp(app.id)}
                    >
                      <MaterialCommunityIcons
                        name={app.icon as any}
                        size={22}
                        color={selected ? app.color : theme.colors.onSurfaceVariant}
                      />
                      <Text style={[styles.upiLabel, { color: selected ? app.color : theme.colors.onSurfaceVariant }]}>
                        {app.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {/* Note */}
          <Text style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>Note (optional)</Text>
          <TextInput
            style={[styles.noteInput, { backgroundColor: theme.colors.surface, color: theme.colors.onSurface, borderColor: theme.colors.surfaceVariant }]}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            multiline
            numberOfLines={2}
          />

          {/* Date & Time */}
          <View style={styles.dateTimeRow}>
            <View style={[styles.dateTimeInput, { backgroundColor: theme.colors.surface, flex: 1, marginRight: 8 }]}>
              <MaterialCommunityIcons name="calendar" size={18} color={theme.colors.primary} />
              <TextInput
                style={[styles.dateTimeText, { color: theme.colors.onSurface }]}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.onSurfaceVariant}
              />
            </View>
            <View style={[styles.dateTimeInput, { backgroundColor: theme.colors.surface, flex: 1 }]}>
              <MaterialCommunityIcons name="clock-outline" size={18} color={theme.colors.primary} />
              <TextInput
                style={[styles.dateTimeText, { color: theme.colors.onSurface }]}
                value={time}
                onChangeText={setTime}
                placeholder="HH:MM"
                placeholderTextColor={theme.colors.onSurfaceVariant}
              />
            </View>
          </View>

          {/* Save Button */}
          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            disabled={saving}
            style={styles.saveButton}
            contentStyle={styles.saveButtonContent}
            labelStyle={styles.saveButtonLabel}
          >
            Save Expense
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: { fontSize: 24, fontWeight: '800' },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  currencySymbol: { fontSize: 36, fontWeight: '800', marginRight: 8 },
  amountInput: { flex: 1, fontSize: 48, fontWeight: '800' },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 4,
  },
  chipScroll: { marginBottom: 16 },
  chipRow: { paddingHorizontal: 16, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
  segmentedRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  segmentText: { fontSize: 14, fontWeight: '600' },
  upiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  upiCard: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 4,
  },
  upiLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  noteInput: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    marginBottom: 16,
    textAlignVertical: 'top',
    minHeight: 70,
  },
  dateTimeRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 24 },
  dateTimeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dateTimeText: { fontSize: 14, fontWeight: '500', flex: 1 },
  saveButton: {
    marginHorizontal: 16,
    borderRadius: 14,
  },
  saveButtonContent: { paddingVertical: 6 },
  saveButtonLabel: { fontSize: 16, fontWeight: '700' },
});
