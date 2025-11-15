import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideProps } from 'lucide-react-native';
import { MotiView } from 'moti';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactElement<LucideProps>;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => {
  return (
    <MotiView
      style={styles.card}
      whileHover={{ transform: [{ scale: 1.05 }], shadowOpacity: 0.1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {React.cloneElement(icon, { color: color, size: 22 })}
      </View>
      <Text style={[styles.value, { color: color }]}>{value}</Text>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#d1d5db',
    fontWeight: '600',
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
  },
});
