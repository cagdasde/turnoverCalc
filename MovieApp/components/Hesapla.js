import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import CheckBox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDaysInMonth, format, getDay } from 'date-fns';
import { tr } from 'date-fns/locale';

const App = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [ortalamaGunlukCiro, setOrtalamaGunlukCiro] = useState('');
  const [yuksekGunler, setYuksekGunler] = useState([]);
  const [cirolar, setCirolar] = useState([]);

  const gunIsimleri = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

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

  const toggleGun = (day) => {
    if (yuksekGunler.includes(day)) {
      setYuksekGunler(yuksekGunler.filter(g => g !== day));
    } else {
      setYuksekGunler([...yuksekGunler, day]);
    }
  };

  const hesapla = async () => {
    const ortalamaCiro = parseFloat(ortalamaGunlukCiro);
    const gunSayisi = getDaysInMonth(new Date(year, month - 1));
    const toplamCiro = ortalamaCiro * gunSayisi;
    const maxFark = ortalamaCiro * 0.05; // Fark %5'i geçmesin

    let kümülatifToplam = 0;

    // Belirli bir aya ait tüm günleri ve haftalık gün sıralarını hesapla
    const gunlukCirolar = Array.from({ length: gunSayisi }, (_, i) => {
      const currentDate = new Date(year, month - 1, i + 1);
      const dayIndex = getDay(currentDate);

      // Gün ismi seçimine göre yüksek ve düşük ciro ayarlaması
      const ciro = yuksekGunler.includes(gunIsimleri[dayIndex])
        ? (ortalamaCiro + Math.random() * maxFark).toFixed(0) // Yüksek ciro günleri
        : (ortalamaCiro - Math.random() * maxFark).toFixed(0); // Düşük ciro günleri

      kümülatifToplam += parseFloat(ciro);
      return { gun: i + 1, gunIsmi: gunIsimleri[dayIndex], ciro, kümülatifToplam: kümülatifToplam.toFixed(0) };
    });

    const toplamHesaplananCiro = gunlukCirolar.reduce((acc, item) => acc + parseFloat(item.ciro), 0);

  

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
        <View style={styles.checkboxContainer}>
          <Text>Yüksek Ciro Günleri:</Text>
          {gunIsimleri.map((day, index) => (
            <TouchableOpacity key={index} style={styles.checkboxRow} onPress={() => toggleGun(day)}>
              <CheckBox
                value={yuksekGunler.includes(day)}
                onValueChange={() => toggleGun(day)}
                style={styles.checkbox}
              />
              <Text style={styles.checkboxLabel}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Hesapla ve Kaydet" onPress={hesapla} />
      </View>
      {cirolar.length > 0 && (
        <>
          <Text style={styles.subtitle}>{format(new Date(year, month - 1), 'MMMM yyyy', { locale: tr })}</Text>
          {cirolar.map((item) => (
            <View key={item.gun} style={styles.item}>
              <Text style={styles.text}>
                {format(new Date(year, month - 1, item.gun), 'dd MMMM EEEE', { locale: tr })} - {item.ciro} TL (Kümülatif: {item.kümülatifToplam} TL)
              </Text>
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
  checkboxContainer: {
    marginVertical: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  checkboxLabel: {
    fontSize: 18,
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
