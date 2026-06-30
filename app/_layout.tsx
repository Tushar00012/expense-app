import React, { useEffect, useState } from 'react';
import { View, Image, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { lightTheme, darkTheme } from '../src/constants/theme';
import { useSettingsStore } from '../src/store/useSettingsStore';
import { useExpenseStore } from '../src/store/useExpenseStore';
import { getDatabase } from '../src/db/database';

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { colorScheme } = useSettingsStore();
  const loadExpenses = useExpenseStore((s) => s.loadExpenses);
  const [ready, setReady] = useState(false);

  const resolvedScheme =
    colorScheme === 'system' ? systemColorScheme ?? 'light' : colorScheme;
  const theme = resolvedScheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    (async () => {
      await getDatabase();
      await loadExpenses();
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0D1A20', alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={require('../assets/favicon.png')}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <StatusBar style={resolvedScheme === 'dark' ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false }} />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
