import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MemoSegmentsProvider } from '../../context/MemoSegmentsContext';
import { PertesDeChargeTableProvider } from '../../context/PertesDeChargeTableContext';

import Accueil from './Accueil';
import Parametres from './Parametres';
import GrandsFeux from './GrandsFeux';
import DebitMaxPEI from './DebitMaxPEI';
import CalculEtablissement from './CalculEtablissement';
import CalculPertesDeCharge from './CalculPertesDeCharge';
import { View, Text } from 'react-native';

const Tabs = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <PertesDeChargeTableProvider>
      <MemoSegmentsProvider>
        <Tabs.Navigator
          initialRouteName="Accueil"
          screenOptions={{
            tabBarActiveTintColor: '#D32F2F',
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="Accueil"
            component={Accueil}
            options={{
              title: 'Accueil',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" size={size ?? 26} color={color} />
              ),
            }}
            initialParams={{ initial: true }}
          />
          <Tabs.Screen
            name="CalculPertesDeCharge"
            component={CalculPertesDeCharge}
            options={{
              title: 'Pertes de charge',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="water-pump" size={size ?? 26} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="CalculEtablissement"
            component={CalculEtablissement}
            options={{
              title: 'Établissement',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="construct" size={size ?? 26} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="DebitMaxPEI"
            component={DebitMaxPEI}
            options={{
              title: 'Débit max PEI',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="speedometer" size={size ?? 26} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="GrandsFeux"
            component={GrandsFeux}
            options={{
              title: 'Grands feux',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="fire" size={size ?? 26} color={color} />
              ),
              headerShown: true,
              headerTitleAlign: 'left',
              headerStyle: { backgroundColor: '#fff', elevation: 0, shadowOpacity: 0 },
              headerTintColor: '#D32F2F',
              headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
              headerLeft: () => (
                <MaterialCommunityIcons name="fire" size={26} color="#D32F2F" style={{ marginLeft: 16, marginRight: 8 }} />
              ),
            }}
          />
          <Tabs.Screen
            name="Parametres"
            component={Parametres}
            options={{
              title: 'Paramètres',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings" size={size ?? 26} color={color} />
              ),
            }}
          />
        </Tabs.Navigator>
      </MemoSegmentsProvider>
    </PertesDeChargeTableProvider>
  );
}