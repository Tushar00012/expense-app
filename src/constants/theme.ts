import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#5C35CC',
    onPrimary: '#FFFFFF',
    primaryContainer: '#E8DEFF',
    secondary: '#9B59B6',
    background: '#F5F3FF',
    surface: '#FFFFFF',
    surfaceVariant: '#EDE7FF',
    error: '#E74C3C',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#9B7EF8',
    onPrimary: '#1A0066',
    primaryContainer: '#3D1FA8',
    secondary: '#C39BD3',
    background: '#0F0F23',
    surface: '#1A1A2E',
    surfaceVariant: '#2D2B4A',
    error: '#FF6B6B',
  },
};

export const CHART_COLORS = {
  primary: '#5C35CC',
  secondary: '#9B59B6',
  gradient: ['#5C35CC', '#9B59B6'] as const,
  grid: '#E0E0E0',
  gridDark: '#2D2B4A',
};
