import { Tabs } from 'expo-router';

import { View, Text } from 'react-native';
import React from 'react';
import { MemoSegmentsProvider } from '../../context/MemoSegmentsContext';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { PertesDeChargeTableProvider } from '../../context/PertesDeChargeTableContext';

export default function TabLayout() {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>

      <PertesDeChargeTableProvider>
        <MemoSegmentsProvider>
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: '#D32F2F',
              headerShown: false,
              tabBarStyle: Platform.select({
                ios: { position: 'absolute' },
                default: {},
              }),
            }}
          >
            <Tabs.Screen
              name="Accueil"
              options={{
                title: 'Accueil',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home" size={size ?? 26} color={color} />
                ),
              }}
              initialParams={{ initial: true }}
            />
            <Tabs.Screen
              name="index"
              options={{
                title: 'Pertes de charge',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="speedometer" size={size ?? 26} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="CalculEtablissement"
              options={{
                title: 'Établissement',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="construct" size={size ?? 26} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="DebitMaxPEI"
              options={{
                title: 'Débit max PEI',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="water" size={size ?? 26} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="GrandsFeux"
              options={{
                title: 'Grands feux',
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="fire" size={size ?? 26} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="Parametres"
              options={{
                title: 'Paramètres',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="settings" size={size ?? 26} color={color} />
                ),
              }}
            />
          </Tabs>
        </MemoSegmentsProvider>
      </PertesDeChargeTableProvider>
    </View>
  );
}