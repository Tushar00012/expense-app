import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from 'react-native-paper';
import { Expense } from '../types/expense';
import { buildHourlyLineData } from '../utils/chartTransforms';
import { formatCurrency, formatDateToISO } from '../utils/formatters';

interface DailyLineChartProps {
  expenses: Expense[];
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export function DailyLineChart({ expenses }: DailyLineChartProps) {
  const theme = useTheme();
  const today = formatDateToISO(new Date());
  const todayExpenses = expenses.filter((e) => e.date === today);
  const data = useMemo(() => buildHourlyLineData(todayExpenses), [todayExpenses]);
  const maxValue = Math.max(...data.map((d) => d.value), 100);

  if (todayExpenses.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
          No expenses today yet
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <LineChart
        data={data}
        width={SCREEN_WIDTH - 80}
        height={180}
        color="#5C35CC"
        thickness={3}
        startFillColor="#5C35CC"
        endFillColor="transparent"
        startOpacity={0.3}
        endOpacity={0.0}
        areaChart
        curved
        hideDataPoints={false}
        dataPointsColor="#5C35CC"
        dataPointsRadius={4}
        xAxisColor={theme.dark ? '#3D3D5C' : '#E0E0E0'}
        yAxisColor={theme.dark ? '#3D3D5C' : '#E0E0E0'}
        yAxisTextStyle={{ color: theme.dark ? '#9999BB' : '#666' , fontSize: 10 }}
        xAxisLabelTextStyle={{ color: theme.dark ? '#9999BB' : '#666', fontSize: 10 }}
        noOfSections={4}
        maxValue={Math.ceil(maxValue / 100) * 100}
        rulesColor={theme.dark ? '#2D2B4A' : '#F0F0F0'}
        rulesType="solid"
        hideRules={false}
        pointerConfig={{
          pointerStripHeight: 160,
          pointerStripColor: '#5C35CC44',
          pointerStripWidth: 2,
          pointerColor: '#5C35CC',
          radius: 6,
          pointerLabelWidth: 100,
          pointerLabelHeight: 36,
          activatePointersOnLongPress: false,
          autoAdjustPointerLabelPosition: true,
          pointerLabelComponent: (items: any[]) => {
            const item = items[0];
            return (
              <View style={[styles.tooltip, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.tooltipText}>{formatCurrency(item.value)}</Text>
              </View>
            );
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 16,
    paddingLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  emptyContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  tooltip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tooltipText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
