import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Trash2, ShoppingBag } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Expense } from '../types/expense';
import { formatCurrency } from '../utils/formatters';

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir a despesa "${expense.description}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => onDelete(expense.id) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1e3a8a', '#9333ea']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      >
        <View style={styles.iconWrapper}>
          <ShoppingBag size={22} color="#e0e7ff" />
        </View>
        <View style={styles.content}>
          <Text style={styles.description} numberOfLines={1}>
            {expense.description}
          </Text>
          <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.7}>
          <Trash2 size={20} color="#fecaca" />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});
