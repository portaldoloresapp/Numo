import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideProps } from 'lucide-react-native';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactElement<LucideProps>;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {React.cloneElement(icon, { color: color, size: 22 })}
      </View>
      <Text style={[styles.value, { color: color }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    flex: 1,
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
