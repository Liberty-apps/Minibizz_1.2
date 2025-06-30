import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';

interface UserLogoProps {
  size?: number;
  showName?: boolean;
}

export default function UserLogo({ size = 32, showName = true }: UserLogoProps) {
  const { user } = useAuth();
  
  // Get initials from user name or email
  const getInitials = () => {
    if (user?.profile?.prenom && user?.profile?.nom) {
      return `${user.profile.prenom.charAt(0)}${user.profile.nom.charAt(0)}`.toUpperCase();
    }
    
    if (user?.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length > 1) {
        return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
      }
      return user.name.charAt(0).toUpperCase();
    }
    
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  // Check if user has a logo URL
  const hasLogo = user?.profile?.logo_url;

  return (
    <View style={styles.container}>
      {hasLogo ? (
        <Image 
          source={{ uri: user?.profile?.logo_url }} 
          style={[styles.logoImage, { width: size, height: size }]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.initialsContainer, { width: size, height: size, borderRadius: size / 2 }]}>
          <Text style={[styles.initialsText, { fontSize: size * 0.4 }]}>{getInitials()}</Text>
        </View>
      )}
      
      {showName && (
        <Text style={styles.greeting}>
          Bonjour{' '}
          <Text style={styles.userName}>
            {user?.profile?.prenom || user?.name || user?.email?.split('@')[0] || 'Utilisateur'}
          </Text>
          {' '}!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  initialsContainer: {
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  logoImage: {
    borderRadius: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#6b7280',
  },
  userName: {
    fontWeight: '500',
    color: '#374151',
  },
});