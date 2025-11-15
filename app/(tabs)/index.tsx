import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react-native';
import { MotiView, MotiText } from 'moti';

import { Transaction } from '../../types/transaction';
import { TransactionItem } from '../../components/TransactionItem';
import { EmptyState } from '../../components/EmptyState';
import { StatCard } from '../../components/StatCard';
import { formatCurrency } from '../../utils/formatters';
import { saveTransactions, loadTransactions } from '../../utils/storage';

export default function HomeScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    // Recarrega os dados sempre que a tela entra em foco
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

  const handleDeleteTransaction = async (id: string) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
    await saveTransactions(updatedTransactions);
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
        <ActivityIndicator size="large" color="#9333ea" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={recentTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TransactionItem transaction={item} onDelete={handleDeleteTransaction} index={index} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <MotiView
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400 }}
            >
              <View style={styles.header}>
                <Text style={styles.greeting}>Bem-vindo(a) de volta!</Text>
                <Text style={styles.subGreeting}>Cada boa escolha é um passo em sua jornada.</Text>
              </View>
            </MotiView>
            
            <MotiView
              style={styles.statsContainer}
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 100 }}
            >
              <StatCard label="Receita" value={formatCurrency(totalIncome)} icon={<TrendingUp />} color="#a78bfa" />
              <View style={{ width: 12 }} />
              <StatCard label="Despesa" value={formatCurrency(totalExpense)} icon={<TrendingDown />} color="#7e22ce" />
            </MotiView>

            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 400, delay: 200 }}
            >
              <View style={styles.balanceCard}>
                  <View>
                      <Text style={styles.balanceLabel}>Saldo Atual</Text>
                      <Text style={styles.balanceValue}>{formatCurrency(balance)}</Text>
                  </View>
                  <Wallet size={32} color="#a78bfa" />
              </View>
            </MotiView>

            <MotiText
              style={styles.listHeader}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 300 }}
            >
              Atividade Recente
            </MotiText>
          </>
        }
        ListEmptyComponent={transactions.length === 0 ? <EmptyState /> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100f14',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#100f14',
  },
  listContent: {
    paddingBottom: 120,
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
    backgroundColor: '#1c1b22',
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
    color: '#c084fc',
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
});
