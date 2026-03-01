import React, { useCallback } from 'react';
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
import { useInitApp } from '@/hooks/useInitApp';
import { theme } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { isReady } = useInitApp();

  const [fontsLoaded, fontError] = useFonts({
    MedievalSharp: MedievalSharp_400Regular,
    Martel: Martel_400Regular,
    'Martel-SemiBold': Martel_600SemiBold,
    'Martel-Bold': Martel_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if ((fontsLoaded || fontError) && isReady) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isReady]);

  if ((!fontsLoaded && !fontError) || !isReady) {
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
