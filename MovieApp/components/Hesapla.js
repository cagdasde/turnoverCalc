import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import CheckBox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDaysInMonth, format } from 'date-fns';
import { tr } from 'date-fns/locale';

const App = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [ortalamaGunlukCiro, setOrtalamaGunlukCiro] = useState('');
  const [yuksekGunler, setYuksekGunler] = useState([]);
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
    const maxFark = ortalamaCiro * 0.05;

    let toplamYuksekCiro = 0;
    let toplamDusukCiro = 0;

    const yuksekGunAdedi = yuksekGunler.length;
    const dusukGunAdedi = gunSayisi - yuksekGunAdedi;

    // Yüksek ve düşük günlerin ortalama cirosunu hesapla
    const yuksekGunOrtCiro = ortalamaCiro + maxFark;
    const dusukGunOrtCiro = ortalamaCiro - maxFark;

    const gunlukCirolar = [];
    let kümülatifToplam = 0;

    for (let i = 1; i <= gunSayisi; i++) {
      const currentDay = new Date(year, month - 1, i).getDay();
      let ciro;

      if (yuksekGunler.includes(currentDay)) {
        ciro = (Math.random() * (yuksekGunOrtCiro * 1.05 - yuksekGunOrtCiro * 0.95) + yuksekGunOrtCiro * 0.95).toFixed(2);
      } else {
        ciro = (Math.random() * (dusukGunOrtCiro * 1.05 - dusukGunOrtCiro * 0.95) + dusukGunOrtCiro * 0.95).toFixed(2);
      }

      ciro = parseFloat(ciro);
      kümülatifToplam += ciro;
      gunlukCirolar.push({ gun: i, ciro, kümülatifToplam: kümülatifToplam.toFixed(2) });
    }

    const toplamHesaplananCiro = gunlukCirolar.reduce((acc, item) => acc + item.ciro, 0);

    if (toplamHesaplananCiro > toplamCiro) {
      Alert.alert('Hata', 'Hesaplanan toplam ciro, aylık toplam ciroyu geçiyor.');
      return;
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
        <View style={styles.checkboxContainer}>
          <Text>Yüksek Ciro Günleri:</Text>
          <View style={styles.checkboxRow}>
            <CheckBox value={yuksekGunler.includes(0)} onValueChange={() => toggleGun(0)} />
            <Text>Pazar</Text>
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox value={yuksekGunler.includes(1)} onValueChange={() => toggleGun(1)} />
            <Text>Pazartesi</Text>
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox value={yuksekGunler.includes(2)} onValueChange={() => toggleGun(2)} />
            <Text>Salı</Text>
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox value={yuksekGunler.includes(3)} onValueChange={() => toggleGun(3)} />
            <Text>Çarşamba</Text>
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox value={yuksekGunler.includes(4)} onValueChange={() => toggleGun(4)} />
            <Text>Perşembe</Text>
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox value={yuksekGunler.includes(5)} onValueChange={() => toggleGun(5)} />
            <Text>Cuma</Text>
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox value={yuksekGunler.includes(6)} onValueChange={() => toggleGun(6)} />
            <Text>Cumartesi</Text>
          </View>
        </View>
        <Button title="Hesapla ve Kaydet" onPress={hesapla} />
      </View>
      {cirolar.length > 0 && (
        <>
          <Text style={styles.subtitle}>{format(new Date(year, month - 1), 'MMMM yyyy', { locale: tr })}</Text>
          {cirolar.map((item) => (
            <View key={item.gun} style={styles.item}>
              <Text style={styles.text}>
                {item.gun}. {format(new Date(year, month - 1, item.gun), 'dd MMMM EEEE', { locale: tr })} - {item.ciro} TL (Kümülatif: {item.kümülatifToplam} TL)
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
