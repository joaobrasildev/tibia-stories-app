import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { APP_TEXTS } from '@/constants/app';
import { theme } from '@/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{APP_TEXTS.appName}</Text>
      <Text style={styles.subtitle}>Fundação completa — Fase 1 ✓</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.headerBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
