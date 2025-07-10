import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && user.profile) {
        // Vérifier si l'onboarding est complété
        if (user.profile?.onboarding_completed === false) {
          router.replace('/(auth)/onboarding');
        } else {
          router.replace('/(tabs)');
        }
      } else if (!user) {
        // Rediriger vers la page de test au lieu de login direct
        router.replace('/(auth)/test-login');
      } else {
        // Si user existe mais pas de profil, rediriger vers l'onboarding
        router.replace('/(auth)/onboarding');
      }
    }
  }, [user, loading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
  },
});