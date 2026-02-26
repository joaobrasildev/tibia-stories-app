import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { MedievalSharp_400Regular } from '@expo-google-fonts/medievalsharp';
import {
  Martel_400Regular,
  Martel_600SemiBold,
  Martel_700Bold,
} from '@expo-google-fonts/martel';
import AppNavigator from '@/navigation/AppNavigator';
import { openDatabase } from '@/repositories/database';
import { runMigrations } from '@/repositories/migrations';
import { theme } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    MedievalSharp: MedievalSharp_400Regular,
    Martel: Martel_400Regular,
    'Martel-SemiBold': Martel_600SemiBold,
    'Martel-Bold': Martel_700Bold,
  });

  useEffect(() => {
    try {
      openDatabase();
      runMigrations();
      setDbReady(true);
    } catch (error) {
      console.error('Failed to initialize database:', error);
      setDbReady(true); // Continue even on error to show UI
    }
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if ((fontsLoaded || fontError) && dbReady) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, dbReady]);

  if ((!fontsLoaded && !fontError) || !dbReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.gold} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <AppNavigator />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: theme.colors.headerBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
