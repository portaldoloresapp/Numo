import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Transaction } from '../types/transaction';
import { formatCurrency } from '../utils/formatters';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === 'income';

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir a transação "${transaction.description}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => onDelete(transaction.id) },
      ]
    );
  };

  const gradientColors = isIncome ? ['#15803d', '#10b981'] : ['#1e3a8a', '#9333ea'];

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.gradient}>
        <View style={styles.iconWrapper}>
          {isIncome ? (
            <ArrowUpCircle size={24} color="#a7f3d0" />
          ) : (
            <ArrowDownCircle size={24} color="#e0e7ff" />
          )}
        </View>
        <View style={styles.content}>
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text style={[styles.amount, isIncome && styles.incomeAmount]}>
            {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
          </Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.date}>
            {formatDistanceToNow(new Date(transaction.date), { addSuffix: true, locale: ptBR })}
          </Text>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.7}>
            <Trash2 size={20} color={isIncome ? '#a7f3d0' : '#fecaca'} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  iconWrapper: {
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e0e7ff',
    marginBottom: 2,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  incomeAmount: {
    color: '#d1fae5',
  },
  meta: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  deleteButton: {
    padding: 4,
  },
});
