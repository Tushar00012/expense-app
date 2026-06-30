import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { formatCurrency } from '../utils/formatters';

interface SummaryCardProps {
  label: string;
  amount: number;
  icon: string;
  gradient: readonly [string, string];
  subtitle?: string;
}

export function SummaryCard({ label, amount, icon, gradient, subtitle }: SummaryCardProps) {
  return (
    <LinearGradient colors={gradient} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={styles.iconRow}>
        <MaterialCommunityIcons name={icon as any} size={22} color="rgba(255,255,255,0.9)" />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.amount}>{formatCurrency(amount)}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    minHeight: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  iconRow: {
    marginBottom: 8,
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 4,
  },
});
