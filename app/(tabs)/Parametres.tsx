import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Header } from '@/components/ui/Header';
import { useThemeContext } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/Colors';

export default function Parametres() {
  const { theme, setTheme } = useThemeContext();
  const palette = Colors[theme];


  const [isFrench, setIsFrench] = useState(true);

  const styles = StyleSheet.create({

    section: {
      backgroundColor: '#fff',
      borderRadius: 18,
      padding: 16,
      marginBottom: 18,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    sectionTitle: {
      fontWeight: 'bold',
      fontSize: 18,
      color: palette.text,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    redBtn: {
      borderColor: palette.primary,
      borderWidth: 1.5,
      borderRadius: 10,
      paddingVertical: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    redBtnTxt: {
      color: palette.primary,
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

  return (
    <SafeAreaView style={{flex:1, backgroundColor: palette.background}}>
      {/* Header harmonisé */}
      <Header title="Paramètres" iconName="settings" iconFamily="MaterialIcons" iconColor="#D32F2F" titleColor="#D32F2F" iconSize={32} style={{marginBottom: 10, marginTop: 0, alignSelf: 'center'}} />
      <ScrollView contentContainerStyle={{padding:16, paddingTop:0, backgroundColor: palette.background}}>
        {/* Langue */}
        <View style={[styles.section, {backgroundColor: palette.card}]}> 
          <Text style={[styles.sectionTitle, {color: palette.title}]}><Ionicons name="language" size={20} color={palette.title}/>  Langue</Text>
          <View style={styles.rowBetween}>
            <Text style={{color: palette.text}}>Français</Text>
            <Switch value={isFrench} onValueChange={v=>setIsFrench(v)} />
          </View>
          <View style={styles.rowBetween}>
            <Text style={{color: palette.text}}>English</Text>
            <Switch value={!isFrench} onValueChange={v=>setIsFrench(!v)} />
          </View>
        </View>
        {/* Apparence */}
        <View style={[styles.section, {backgroundColor: palette.card}]}> 
          <Text style={[styles.sectionTitle, {color: palette.title}]}><Ionicons name="moon" size={20} color={palette.title}/>  Apparence</Text>
          <View style={styles.rowBetween}>
            <Text style={{color: palette.text}}>Mode sombre</Text>
            <Switch value={theme === 'dark'} onValueChange={(v) => setTheme(v ? 'dark' : 'light')} />
          </View>
        </View>
        {/* Calculs */}
        <View style={[styles.section, {backgroundColor: palette.card}]}> 
          <Text style={[styles.sectionTitle, {color: palette.title}]}><Ionicons name="calculator" size={20} color={palette.title}/>  Calculs</Text>
          <TouchableOpacity style={[styles.redBtn, {backgroundColor: palette.button}]} onPress={()=>router.push('/ValeursPerso')}>
            <Text style={[styles.redBtnTxt, {color: palette.buttonText}]}>Valeurs personnalisées</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

