import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ActivityIndicator, View } from 'react-native';

export type ThemeType = 'light' | 'dark';

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  setTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProviderCustom = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeType>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('user.theme').then(stored => {
      if (stored === 'dark' || stored === 'light') {
        setThemeState(stored);
      } else {
        // Détecte le thème système si aucune préférence utilisateur
        const sysTheme = Appearance.getColorScheme();
        setThemeState(sysTheme === 'dark' ? 'dark' : 'light');
      }
      setIsLoading(false);
    });
  }, []);

  const setTheme = (t: ThemeType) => {
    setThemeState(t);
    AsyncStorage.setItem('user.theme', t);
  };

  if (isLoading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center', height:'100%', backgroundColor: theme === 'dark' ? '#181A20' : '#fff'}}>
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
