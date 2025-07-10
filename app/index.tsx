import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('Auth state:', { user, loading });
    
    // Attendre un peu pour s'assurer que l'état d'authentification est stable
    const timer = setTimeout(() => {
      if (user) {
        // Vérifier si l'onboarding est complété
        if (user.profile?.onboarding_completed === false) {
          router.replace('/(auth)/onboarding');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        // Rediriger vers la page de test au lieu de login direct
        router.replace('/(auth)/test-login');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user, loading, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563eb" />
      <Text style={styles.loadingText}>Chargement de l'application...</Text>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#2563eb',
  },
});