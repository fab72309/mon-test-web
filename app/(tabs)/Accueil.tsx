import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '@/components/ui/Header';
import { useThemeContext } from '../../context/ThemeContext';
import { Colors } from '../../constants/Colors';

export default function Accueil() {
  const { theme } = useThemeContext();
  const navigation = useNavigation();
  const palette = Colors[theme];

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: palette.background}]}> 
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/firefighter_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.title, {color: palette.title}]}>HYDRAULIQUE</Text>
        <Text style={[styles.title, {color: palette.title}]}>OPERATIONNELLE</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, {backgroundColor: palette.button}]} onPress={() => navigation.navigate('index' as never)}>
          <Text style={[styles.buttonText, {color: palette.buttonText}]}>Pertes de charge</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor: palette.button}]} onPress={() => navigation.navigate('CalculEtablissement' as never)}>
          <Text style={[styles.buttonText, {color: palette.buttonText}]}>Etablissement</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor: palette.button}]} onPress={() => navigation.navigate('DebitMaxPEI' as never)}>
          <Text style={[styles.buttonText, {color: palette.buttonText}]}>Débit max du PEI</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor: palette.button}]} onPress={() => navigation.navigate('GrandsFeux' as never)}>
          <Text style={[styles.buttonText, {color: palette.buttonText}]}>Grands feux</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor: palette.button}]} onPress={() => navigation.navigate('Parametres' as never)}>
          <Text style={[styles.buttonText, {color: palette.buttonText}]}>Paramètres</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
    // Couleur dynamique via palette
    marginBottom: 24,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    // Couleur dynamique via palette
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    // Couleur dynamique via palette
    letterSpacing: 2,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    marginTop: 24,
    alignItems: 'center',
  },
  button: {
    // Couleur dynamique via palette
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 14,
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
  },
  buttonText: {
    // Couleur dynamique via palette
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
});
