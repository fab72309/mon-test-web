import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Header } from '@/components/ui/Header';
import { useThemeContext } from '../../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GrandFeuxCalculator from '../../components/GrandFeuxCalculator';

export default function GrandsFeux() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const navigation = useNavigation();
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: isDark ? '#181A20' : '#fff'}]}>
      {/* Header harmonisé */}
      <Header title="Grands feux" iconName="whatshot" iconFamily="MaterialIcons" iconColor="#D32F2F" titleColor="#D32F2F" iconSize={32} style={{marginBottom: 10, marginTop: 0, paddingLeft: 0}} />
      <GrandFeuxCalculator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#fff', padding: 20 },

  subtitle: { fontSize: 18, color: '#888', textAlign: 'center' },

});
