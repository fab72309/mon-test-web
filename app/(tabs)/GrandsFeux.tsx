import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Header } from '../../components/ui/Header';
import GrandFeuxCalculator from '../../components/GrandFeuxCalculator';
import { useThemeContext } from '../../context/ThemeContext';

export default function GrandsFeux() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#181A20' : '#fff' }]}>  

      <GrandFeuxCalculator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
