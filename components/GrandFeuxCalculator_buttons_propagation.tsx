// Bloc boutons pour stratégie 'propagation' à insérer sous la View des valeurs interactives du slider
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

export default function PropagationButtons({ onReset, onCalculate }: { onReset: () => void, onCalculate: () => void }) {
  return (
    <View style={{flexDirection:'row', justifyContent:'center', gap:10, marginTop:14}}>
      <TouchableOpacity
        style={{
          borderWidth: 2,
          borderColor: '#D32F2F',
          backgroundColor: '#fff',
          borderRadius: 18,
          paddingVertical: 8,
          paddingHorizontal: 22,
        }}
        onPress={onReset}
      >
        <Text style={{color: '#D32F2F', fontWeight: 'bold', fontSize: 16}}>Réinitialiser</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: '#D32F2F',
          borderRadius: 18,
          paddingVertical: 8,
          paddingHorizontal: 22,
        }}
        onPress={onCalculate}
      >
        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Calculer</Text>
      </TouchableOpacity>
    </View>
  );
}
