import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDaysInMonth, format } from 'date-fns'; // locale/tr eklemeye gerek yok, çünkü bu şekilde doğrudan kullanılıyor

import tr from 'date-fns/locale/tr'; // Türkçe dil desteği

const App = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [ortalamaGunlukCiro, setOrtalamaGunlukCiro] = useState('');
  const [yuksekCiroOrani, setYuksekCiroOrani] = useState('');
  const [cirolar, setCirolar] = useState([]);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedCirolar = await AsyncStorage.getItem('cirolar');
        if (storedCirolar) {
          setCirolar(JSON.parse(storedCirolar));
        }
      } catch (error) {
        console.error('Veriler yüklenemedi', error);
      }
    };
    loadStoredData();
  }, []);

  const hesapla = async () => {
    const ortalamaCiro = parseFloat(ortalamaGunlukCiro);
    const yuksekCiroOraniNumber = parseFloat(yuksekCiroOrani) / 100 + 1; // Yüzdelik oranı çevirmek için
    const yuksekGunler = [2, 5]; // Salı ve Cuma günleri

    const gunSayisi = getDaysInMonth(new Date(year, month - 1));
    const toplamCiro = ortalamaCiro * gunSayisi;
    const yuksekGunCirosu = ortalamaCiro * yuksekCiroOraniNumber;
    const yuksekGunToplamCirosu = yuksekGunCirosu * yuksekGunler.length;
    const normalGunToplamCirosu = toplamCiro - yuksekGunToplamCirosu;
    const normalGunCirosu = normalGunToplamCirosu / (gunSayisi - yuksekGunler.length);

    const gunlukCirolar = [];
    for (let i = 1; i <= gunSayisi; i++) {
      const currentDay = new Date(year, month - 1, i).getDay();
      if (currentDay === 2 || currentDay === 5) { // Salı ve Cuma
        gunlukCirolar.push({ gun: i, ciro: yuksekGunCirosu.toFixed(2) });
      } else {
        gunlukCirolar.push({ gun: i, ciro: normalGunCirosu.toFixed(2) });
      }
    }
    setCirolar(gunlukCirolar);
    
    try {
      await AsyncStorage.setItem('cirolar', JSON.stringify(gunlukCirolar));
    } catch (error) {
      console.error('Veriler kaydedilemedi', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Aylık Ciro Hesaplayıcı</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ay (1-12)"
          keyboardType="numeric"
          value={month}
          onChangeText={setMonth}
        />
        <TextInput
          style={styles.input}
          placeholder="Yıl (YYYY)"
          keyboardType="numeric"
          value={year}
          onChangeText={setYear}
        />
        <TextInput
          style={styles.input}
          placeholder="Ortalama Günlük Ciro"
          keyboardType="numeric"
          value={ortalamaGunlukCiro}
          onChangeText={setOrtalamaGunlukCiro}
        />
        <TextInput
          style={styles.input}
          placeholder="Yüksek Ciro Oranı (%)"
          keyboardType="numeric"
          value={yuksekCiroOrani}
          onChangeText={setYuksekCiroOrani}
        />
        <Button title="Hesapla ve Kaydet" onPress={hesapla} />
      </View>
      {cirolar.length > 0 && (
        <>
          <Text style={styles.subtitle}>{format(new Date(year, month - 1), 'MMMM yyyy', { locale: tr })}</Text>
          {cirolar.map((item) => (
            <View key={item.gun} style={styles.item}>
              <Text style={styles.text}>{item.gun}. {format(new Date(year, month - 1, item.gun), 'dd MMMM', { locale: tr })} {item.ciro} TL</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  text: {
    fontSize: 18,
  },
});

export default App;
