import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const BalanceSheetForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    plannedRevenue: '',
    actualRevenue: '',
    workingHours: '',
    cumulativeHours: '',
    performance: '',
    customers: '',
  });

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    onCalculate(formData);
  };

  return (
    <View style={styles.formContainer}>
      <Text>Planned Revenue:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange('plannedRevenue', text)}
        value={formData.plannedRevenue}
      />
      <Text>Actual Revenue:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange('actualRevenue', text)}
        value={formData.actualRevenue}
      />
      <Text>Working Hours:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange('workingHours', text)}
        value={formData.workingHours}
      />
      <Text>Cumulative Hours:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange('cumulativeHours', text)}
        value={formData.cumulativeHours}
      />
      <Text>Performance:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange('performance', text)}
        value={formData.performance}
      />
      <Text>Customers:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange('customers', text)}
        value={formData.customers}
      />
      <Button title="Calculate" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 24,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 12,
    padding: 8,
  },
});

export default BalanceSheetForm;