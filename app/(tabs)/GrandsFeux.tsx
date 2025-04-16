import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function GrandsFeux() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const navigation = useNavigation();
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: isDark ? '#181A20' : '#fff'}]}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Accueil' as never)}>
        <Ionicons name="arrow-back" size={28} color="#D32F2F" />
        <Text style={styles.backTxt}>Retour</Text>
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="fire" size={56} color="#D32F2F" />
      </View>
      <Text style={styles.title}>Grands feux</Text>
      <Text style={styles.subtitle}>Fonctionnalité en développement</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  iconContainer: { marginTop: 60, marginBottom: 24 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#D32F2F', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#888', textAlign: 'center' },
  backBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 10, marginBottom: 10 },
  backTxt: { color: '#D32F2F', fontWeight: 'bold', fontSize: 18, marginLeft: 6 },
});
