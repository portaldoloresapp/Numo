import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { Transaction } from '../types/transaction';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (description: string, amount: number, type: Transaction['type']) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<Transaction['type']>('expense');
  const [errors, setErrors] = useState({ description: '', amount: '' });

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setType('expense');
    setErrors({ description: '', amount: '' });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateAndSubmit = () => {
    const newErrors = { description: '', amount: '' };
    let hasError = false;

    if (!description.trim()) {
      newErrors.description = 'A descrição é obrigatória';
      hasError = true;
    }

    if (!amount.trim()) {
      newErrors.amount = 'O valor é obrigatório';
      hasError = true;
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Digite um valor válido';
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      onAdd(description.trim(), parseFloat(amount), type);
      handleClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Nova Transação</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeButton, type === 'expense' && styles.typeButtonActiveExpense]}
                onPress={() => setType('expense')}
              >
                <Text style={[styles.typeButtonText, type === 'expense' && styles.typeButtonTextActive]}>Despesa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, type === 'income' && styles.typeButtonActiveIncome]}
                onPress={() => setType('income')}
              >
                <Text style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextActive]}>Receita</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, errors.description && styles.inputError]}
                placeholder="Ex: Almoço, Salário..."
                placeholderTextColor="#9ca3af"
                value={description}
                onChangeText={setDescription}
                autoFocus
              />
              {errors.description ? (
                <Text style={styles.errorText}>{errors.description}</Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Valor</Text>
              <TextInput
                style={[styles.input, errors.amount && styles.inputError]}
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
              {errors.amount ? (
                <Text style={styles.errorText}>{errors.amount}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={[styles.addButton, type === 'income' && styles.addButtonIncome]}
              onPress={validateAndSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1f2937',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    paddingHorizontal: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActiveExpense: {
    backgroundColor: '#be123c',
  },
  typeButtonActiveIncome: {
    backgroundColor: '#16a34a',
  },
  typeButtonText: {
    color: '#d1d5db',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#374151',
    color: '#ffffff',
  },
  inputError: {
    borderColor: '#f87171',
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 12,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#9333ea',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonIncome: {
    backgroundColor: '#10b981',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
