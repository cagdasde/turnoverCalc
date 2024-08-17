import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BalanceSheetResult = ({ data }) => {
  return (
    <View style={styles.resultContainer}>
      <Text style={styles.resultTitle}>Results</Text>
      <Text>Planned Revenue: {data.plannedRevenue}</Text>
      <Text>Actual Revenue: {data.actualRevenue}</Text>
      <Text>Working Hours: {data.workingHours}</Text>
      <Text>Cumulative Hours: {data.cumulativeHours}</Text>
      <Text>Performance: {data.performance}</Text>
      <Text>Customers: {data.customers}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

export default BalanceSheetResult;