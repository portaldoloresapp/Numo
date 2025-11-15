import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wallet } from 'lucide-react-native';

export const EmptyState: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Wallet size={64} color="#4b5563" />
      </View>
      <Text style={styles.title}>Nenhuma transação encontrada</Text>
      <Text style={styles.subtitle}>
        Toque no botão + para adicionar sua primeira transação
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 24,
    opacity: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
