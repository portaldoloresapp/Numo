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

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (description: string, amount: number) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({ description: '', amount: '' });

  const resetForm = () => {
    setDescription('');
    setAmount('');
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
      onAdd(description.trim(), parseFloat(amount));
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
            <Text style={styles.title}>Nova Despesa</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, errors.description && styles.inputError]}
                placeholder="Ex: Almoço, Combustível..."
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
              style={styles.addButton}
              onPress={validateAndSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>Adicionar Despesa</Text>
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
    maxHeight: '80%',
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
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
