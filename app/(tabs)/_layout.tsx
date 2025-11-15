import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { LayoutGrid, History, Plus } from 'lucide-react-native';
import { View, Pressable, StyleSheet } from 'react-native';
import { MotiView, useAnimationState } from 'moti';
import { AddTransactionModal } from '../../components/AddTransactionModal';
import { Transaction } from '../../types/transaction';
import { loadTransactions, saveTransactions } from '../../utils/storage';

const CustomTabBarButton = ({ onPress }: { onPress: () => void }) => {
  const animationState = useAnimationState({
    from: { scale: 1 },
    to: { scale: 1 },
    hovered: { scale: 1.1 },
    tapped: { scale: 0.9 },
  });

  return (
    <Pressable
      style={styles.fabContainer}
      onPress={onPress}
      onPressIn={() => animationState.transitionTo('tapped')}
      onPressOut={() => animationState.transitionTo('to')}
      onHoverIn={() => animationState.transitionTo('hovered')}
      onHoverOut={() => animationState.transitionTo('to')}
    >
      <MotiView
        style={styles.fab}
        state={animationState}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        from={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Plus size={30} color="#fff" />
      </MotiView>
    </Pressable>
  );
};

export default function TabLayout() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddTransaction = async (description: string, amount: number, type: Transaction['type']) => {
    const currentTransactions = await loadTransactions();
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description,
      amount,
      type,
      date: new Date().toISOString(),
    };
    await saveTransactions([newTransaction, ...currentTransactions]);
    // As telas serão atualizadas automaticamente ao ganhar foco.
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#c084fc',
          tabBarInactiveTintColor: '#585368',
          tabBarStyle: {
            backgroundColor: '#1c1b22',
            borderTopWidth: 0,
            height: 80,
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            borderRadius: 25,
            paddingHorizontal: 10,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.5,
            elevation: 5,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: -5,
            marginBottom: 10,
          },
          tabBarIconStyle: {
            marginTop: 5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Início',
            tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: '',
            tabBarButton: () => <CustomTabBarButton onPress={() => setModalVisible(true)} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'Histórico',
            tabBarIcon: ({ color, size }) => <History color={color} size={size} />,
          }}
        />
      </Tabs>
      <AddTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddTransaction}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#9333ea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#1c1b22',
  },
});
