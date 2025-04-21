import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';

type DebitTable = {
  [diam: string]: {
    [debit: string]: string;
  };
};

const DEFAULT_VALUES: DebitTable = {
  "45": { "250": "0.3", "500": "1.3", "1000": "Impossible" },
  "70": { "250": "0.05", "500": "0.2", "1000": "0.5", "1500": "1.5", "2000": "2" },
  "110": { "250": "Impossible", "500": "Impossible", "1000": "0.05", "1500": "0.1", "2000": "0.3" }
};

const STORAGE_KEY = 'valeursPerso.table';

import { useNavigation } from '@react-navigation/native';

export default function ValeursPerso() {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerBackTitle: 'Retour' });
  }, [navigation]);
  const [values, setValues] = useState<DebitTable>(DEFAULT_VALUES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Styles dynamiques selon le thème
  const themedStyles = StyleSheet.create({
    headerTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: colors.text, alignSelf:'center' },
    subtitle: { color: colors.text + '99', marginBottom: 18, textAlign:'center' },
    block: { backgroundColor: dark ? '#23272e' : '#f7f8fa', borderRadius:14, padding:16, marginBottom:18 },
    diamTitle: { fontWeight:'bold', fontSize:17, marginBottom:8, color: colors.text },
    row: { flexDirection:'row', alignItems:'center', marginBottom:10 },
    label: { width:100, color: colors.text, fontSize:15 },
    input: { backgroundColor: dark ? '#1a1d22' : '#f2f3f4', color: colors.text, borderRadius:8, padding:6, minWidth:60, textAlign:'center', fontSize:16, borderWidth:1, borderColor: dark ? '#333' : '#e0e0e0' },
    impossible: { color: colors.text + '77', fontStyle:'italic', backgroundColor: dark ? '#1a1d22' : '#f2f3f4', borderRadius:8, padding:6, minWidth:60, textAlign:'center', fontSize:16 },
    resetBtn: { backgroundColor: colors.primary ?? '#D32F2F', borderRadius:8, padding:12, marginTop:18, alignSelf:'center' },
    resetBtnTxt: { color:'#fff', fontWeight:'bold', fontSize:16, textAlign:'center' },
  });

  // Chargement initial
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setValues(JSON.parse(stored));
        }
      } catch (e) {
        Alert.alert('Erreur', 'Impossible de charger les valeurs personnalisées.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Sauvegarde automatique à chaque modification
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    }
  }, [values, loading]);

  const handleChange: (diam: string, debit: string, val: string) => void = (diam, debit, val) => {
    setValues((prev: typeof DEFAULT_VALUES) => ({
      ...prev,
      [diam]: { ...prev[diam], [debit]: val }
    }));
  };

  const resetDefaults = async () => {
    setSaving(true);
    try {
      setValues(DEFAULT_VALUES);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_VALUES));
      Alert.alert('Réinitialisé', 'Les valeurs par défaut ont été restaurées.');
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de réinitialiser.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:colors.background}}><Text style={{color:colors.text}}>Chargement...</Text></View>;

  return (
    <ScrollView style={{flex:1, backgroundColor:colors.background}} contentContainerStyle={{padding:16}}>
      <Text style={themedStyles.headerTitle}>Valeurs personnalisées</Text>
      <Text style={themedStyles.subtitle}>Personnalisez les valeurs de pertes de charge pour les tuyaux de 20m. Les valeurs sont en bars.</Text>
      {Object.entries(values)
        .filter(([diam]) => diam !== '22')
        .map(([diam, debits]) => (
        <View key={diam} style={themedStyles.block}>
          <Text style={themedStyles.diamTitle}>Diamètre {diam}mm</Text>
          {Object.entries(debits as Record<string, string>).map(([debit, val]) => (
            <View key={debit} style={themedStyles.row}>
              <Text style={themedStyles.label}>{debit} L/min</Text>
              {val === 'Impossible' ? (
                <Text style={themedStyles.impossible}>Impossible</Text>
              ) : (
                <TextInput
                  style={themedStyles.input}
                  keyboardType="numeric"
                  value={val}
                  onChangeText={v => handleChange(diam as string, debit as string, v)}
                  placeholder="-"
                  placeholderTextColor={dark ? '#888' : '#aaa'}
                />
              )}
            </View>
          ))}
        </View>
      ))}
      <TouchableOpacity style={themedStyles.resetBtn} onPress={resetDefaults} disabled={saving}>
        <Text style={[themedStyles.resetBtnTxt, saving && {opacity:0.6}]}>Réinitialiser les valeurs par défaut</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
