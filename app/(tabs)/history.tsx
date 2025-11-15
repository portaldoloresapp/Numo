import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Transaction } from '../../types/transaction';
import { TransactionItem } from '../../components/TransactionItem';
import { EmptyState } from '../../components/EmptyState';
import { loadTransactions, saveTransactions } from '../../utils/storage';

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const loadData = async () => {
    setLoading(true);
    const loaded = await loadTransactions();
    setTransactions(loaded);
    setLoading(false);
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem transaction={item} onDelete={handleDeleteTransaction} />
        )}
        contentContainerStyle={[
          styles.listContent,
          transactions.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
  },
  listContent: {
    paddingBottom: 20,
  },
});
