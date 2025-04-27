import React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/ui/Header';
import GrandFeuxCalculator from '../../components/GrandFeuxCalculator';
import { useThemeContext } from '../../context/ThemeContext';

export default function GrandsFeux() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#181A20' : '#fff' }]}>  
      <View style={{zIndex:10, backgroundColor: isDark ? '#181A20' : '#fff', paddingHorizontal:0, paddingVertical:16, alignSelf: 'center'}}>
        <View style={{flexDirection:'row', alignItems:'center', marginBottom:0, marginTop:10}}>
          <Ionicons name="flame" size={26} color={isDark ? '#FF7043' : '#D32F2F'} style={{marginRight: 6}}/>
          <Text style={{color: isDark ? '#FF7043' : '#D32F2F', fontSize: 23, fontWeight: 'bold', marginVertical: 0, textAlign: 'left', letterSpacing: 0.2}}>Grands feux</Text>
        </View>
      </View>
      <GrandFeuxCalculator key="grands-feux" hideTitle />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
