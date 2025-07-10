import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { FileText } from 'lucide-react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  color?: string;
  style?: any;
}

export default function Logo({ size = 'medium', showText = true, color = '#2563eb', style }: LogoProps) {
  // Définir les tailles en fonction du paramètre
  const sizes = {
    small: { container: 32, icon: 16, fontSize: 14 },
    medium: { container: 48, icon: 24, fontSize: 18 },
    large: { container: 64, icon: 32, fontSize: 24 },
  };

  const currentSize = sizes[size];

  // Utiliser l'image du logo si disponible, sinon utiliser l'icône
  const logoUrl = 'https://i.imgur.com/Ql4RX3l.png'; // URL de l'image du logo MiniBizz

  return (
    <View style={[styles.container, style]}>
      <View 
        style={[
          styles.logoContainer, 
          { 
            width: currentSize.container, 
            height: currentSize.container, 
            borderRadius: currentSize.container / 4,
            backgroundColor: color
          }
        ]}
      >
        <Image 
          source={{ uri: logoUrl }} 
          style={{ width: currentSize.container, height: currentSize.container }}
          resizeMode="contain"
        />
      </View>
      
      {showText && (
        <Text 
          style={[
            styles.logoText, 
            { fontSize: currentSize.fontSize }
          ]}
        >
          MiniBizz
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoText: {
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
    fontFamily: 'Inter-Bold',
  },
});