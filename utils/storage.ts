import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types/transaction';

const STORAGE_KEY = '@numo_transactions';

export const saveTransactions = async (transactions: Transaction[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(transactions);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Erro ao salvar transações:', error);
  }
};

export const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
    return [];
  }
};
