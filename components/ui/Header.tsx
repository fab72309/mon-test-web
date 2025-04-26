import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface HeaderProps {
  title: string;
  iconName?: string; // Nom de l’icône à afficher (doit correspondre à la famille)
  // Pour une vraie sécurité, tu pourrais faire :
  // iconName?: MaterialIconsGlyphs | IoniconsGlyphs | FontAwesomeGlyphs;
  // Mais ici, on force le cast dans le render.
  iconColor?: string;
  iconSize?: number;
  iconFamily?: 'MaterialIcons' | 'Ionicons' | 'FontAwesome';
  titleColor?: string;
  style?: any;
}

export function Header({ title, iconName, iconColor = '#333', iconSize = 28, iconFamily = 'MaterialIcons', titleColor = '#222', style }: HeaderProps) {
  let IconComponent: any = MaterialIcons;
  if (iconFamily === 'Ionicons') IconComponent = Ionicons;
  if (iconFamily === 'FontAwesome') IconComponent = FontAwesome;

  return (
    <View style={[styles.container, style]}>
      {iconName && (
        <IconComponent
          name={iconName as any}
          size={iconSize}
          color={iconColor}
          style={styles.icon}
        />
      )}
      <ThemedText type="title" style={[styles.title, { color: titleColor }]}>{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    paddingLeft: 4,
    paddingBottom: 8,
  },
  icon: {
    marginRight: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
