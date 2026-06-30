import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Expense, PeriodFilter } from '../types/expense';
import { buildBarData } from '../utils/chartTransforms';
import { formatCurrency } from '../utils/formatters';

interface PeriodBarChartProps {
  expenses: Expense[];
  filter: PeriodFilter;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_HEIGHT = 180;
const Y_AXIS_WIDTH = 52;
const H_PADDING = 16;

export function PeriodBarChart({ expenses, filter }: PeriodBarChartProps) {
  const theme = useTheme();
  const data = useMemo(() => buildBarData(expenses, filter, new Date()), [expenses, filter]);

  const maxValue = Math.max(...data.map((d) => d.value), 0);
  const hasData = maxValue > 0;

  // Round max to a clean ceiling
  const chartMax = hasData
    ? (() => {
        const mag = Math.pow(10, Math.floor(Math.log10(maxValue)));
        return Math.ceil(maxValue / mag) * mag;
      })()
    : 1000;

  const barCount = data.length;
  const availableWidth = SCREEN_WIDTH - 32 - Y_AXIS_WIDTH - H_PADDING * 2;
  const barWidth = Math.max(12, Math.min(36, Math.floor(availableWidth / barCount) - 8));

  const yTicks = [1, 0.75, 0.5, 0.25, 0];

  if (!hasData) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
          No data for this period
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.chartArea}>
        {/* Y-axis labels */}
        <View style={[styles.yAxis, { height: CHART_HEIGHT }]}>
          {yTicks.map((frac) => (
            <Text key={frac} style={[styles.yLabel, { color: theme.dark ? '#9999BB' : '#999' }]}>
              {frac === 0 ? '0' : formatCurrency(chartMax * frac).replace('₹', '₹')}
            </Text>
          ))}
        </View>

        {/* Bars + grid */}
        <View style={{ flex: 1 }}>
          {/* Grid lines */}
          <View style={[styles.gridContainer, { height: CHART_HEIGHT }]}>
            {yTicks.map((frac) => (
              <View
                key={frac}
                style={[
                  styles.gridLine,
                  {
                    bottom: frac * CHART_HEIGHT,
                    backgroundColor: theme.dark ? '#2D2B4A' : '#ECECEC',
                  },
                ]}
              />
            ))}

            {/* Bars row */}
            <View style={styles.barsRow}>
              {data.map((bar, i) => {
                const barH = bar.value > 0 ? (bar.value / chartMax) * CHART_HEIGHT : 0;
                const showInside = barH >= 36;
                const showAbove  = bar.value > 0 && !showInside;
                return (
                  <View key={i} style={styles.barCol}>
                    {showAbove && (
                      <Text style={[styles.aboveLabel, { color: theme.colors.primary }]}>
                        {formatCurrency(bar.value)}
                      </Text>
                    )}
                    <View
                      style={[
                        styles.bar,
                        {
                          width: barWidth,
                          height: Math.max(barH, 0),
                          backgroundColor: bar.value > 0 ? '#5C35CC' : 'transparent',
                          justifyContent: 'center',
                          alignItems: 'center',
                        },
                      ]}
                    >
                      {showInside && (
                        <Text style={styles.insideLabel} numberOfLines={1}>
                          {formatCurrency(bar.value)}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* X-axis labels */}
          <View style={styles.xAxis}>
            {data.map((bar, i) => (
              <View key={i} style={[styles.xLabelCol, { width: barWidth }]}>
                <Text style={[styles.xLabel, { color: theme.dark ? '#9999BB' : '#888' }]}>
                  {bar.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    borderRadius: 16,
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: H_PADDING,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  emptyContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: { fontSize: 14 },
  chartArea: { flexDirection: 'row' },
  yAxis: {
    width: Y_AXIS_WIDTH,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
    paddingBottom: 2,
  },
  yLabel: { fontSize: 9, textAlign: 'right' },
  gridContainer: {
    flex: 1,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
  barsRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    height: CHART_HEIGHT,
    gap: 8,
    paddingLeft: 8,
  },
  barCol: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  insideLabel: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    transform: [{ rotate: '-90deg' }],
    width: 60,
  },
  aboveLabel: {
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  xAxis: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 8,
    paddingLeft: 8,
  },
  xLabelCol: { alignItems: 'center' },
  xLabel: { fontSize: 10 },
});
