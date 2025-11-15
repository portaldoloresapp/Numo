import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Plus, TrendingUp, TrendingDown, Wallet } from 'lucide-react-native';
import { Transaction } from '../../types/transaction';
import { TransactionItem } from '../../components/TransactionItem';
import { AddTransactionModal } from '../../components/AddTransactionModal';
import { EmptyState } from '../../components/EmptyState';
import { StatCard } from '../../components/StatCard';
import { formatCurrency } from '../../utils/formatters';
import { saveTransactions, loadTransactions } from '../../utils/storage';

export default function HomeScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const loaded = await loadTransactions();
      setTransactions(loaded);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveTransactions(transactions);
    }
  }, [transactions, loading]);

  const handleAddTransaction = (description: string, amount: number, type: Transaction['type']) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description,
      amount,
      type,
      date: new Date().toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'income') {
          acc.totalIncome += curr.amount;
        } else {
          acc.totalExpense += curr.amount;
        }
        acc.balance = acc.totalIncome - acc.totalExpense;
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, balance: 0 }
    );
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={recentTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem transaction={item} onDelete={handleDeleteTransaction} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.greeting}>Bem-vindo(a) de volta!</Text>
              <Text style={styles.subGreeting}>Cada boa escolha é um passo em sua jornada.</Text>
            </View>
            <View style={styles.statsContainer}>
              <StatCard label="Receita" value={formatCurrency(totalIncome)} icon={<TrendingUp />} color="#22c55e" />
              <View style={{ width: 12 }} />
              <StatCard label="Despesa" value={formatCurrency(totalExpense)} icon={<TrendingDown />} color="#ef4444" />
            </View>
            <View style={styles.balanceCard}>
                <View>
                    <Text style={styles.balanceLabel}>Saldo Atual</Text>
                    <Text style={styles.balanceValue}>{formatCurrency(balance)}</Text>
                </View>
                <Wallet size={32} color="#a78bfa" />
            </View>
            <Text style={styles.listHeader}>Atividade Recente</Text>
          </>
        }
        ListEmptyComponent={<EmptyState />}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.9}
      >
        <Plus size={28} color="#ffffff" />
      </TouchableOpacity>

      <AddTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddTransaction}
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
  listContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'Inter_800ExtraBold',
  },
  subGreeting: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  balanceCard: {
    marginHorizontal: 20,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#d1d5db',
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 32,
    color: '#c4b5fd',
    fontWeight: '800',
    marginTop: 4,
  },
  listHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#9333ea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
