import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { APP_NAME } from '@/placeholder';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{APP_NAME}</Text>
      <Text style={styles.subtitle}>Setup completo — Fase 0 ✓</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B2020',
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
