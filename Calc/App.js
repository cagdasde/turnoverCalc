import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native';
import BalanceSheetForm from './components/BalanceSheetForm';
import BalanceSheetResult from './components/BalanceSheetResult';
import Hesapla from './components/Hesapla';

const App = () => {
  const [data, setData] = useState([]);

  const handleCalculate = (formData) => {
    // Here, you can process the form data and calculate the results.
    // For simplicity, this example will just store the data in state.
    setData(formData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.sectionContainer}>
        
          <Hesapla />
        
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
});

export default App;