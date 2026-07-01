import React, { useEffect, useState } from 'react';
import { View, Image, Text, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { Button, PaperProvider } from 'react-native-paper';
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
  const [startupError, setStartupError] = useState<string | null>(null);

  const resolvedScheme =
    colorScheme === 'system' ? systemColorScheme ?? 'light' : colorScheme;
  const theme = resolvedScheme === 'dark' ? darkTheme : lightTheme;

  async function bootstrap() {
    setStartupError(null);
    try {
      await getDatabase();
      await loadExpenses();
    } catch (error) {
      console.error('App bootstrap failed', error);
      setStartupError(
        'Unable to load saved expenses right now. You can keep using the app and retry loading.'
      );
    } finally {
      setReady(true);
    }
  }

  useEffect(() => {
    void bootstrap();
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
          {startupError ? (
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: theme.colors.errorContainer,
              }}
            >
              <Text
                style={{
                  color: theme.colors.onErrorContainer,
                  fontSize: 14,
                  lineHeight: 20,
                  marginBottom: 8,
                }}
              >
                {startupError}
              </Text>
              <Button mode="contained" onPress={() => void bootstrap()}>
                Retry loading
              </Button>
            </View>
          ) : null}
          <Stack screenOptions={{ headerShown: false }} />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
