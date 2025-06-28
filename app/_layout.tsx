import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '../src/contexts/AuthContext';
import { preloadCriticalImages } from '../utils/imageOptimization';
import { preloadCriticalModules } from '../utils/bundleOptimization';
import { PerformanceMonitor } from '../components/PerformanceMonitor';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  useEffect(() => {
    // Optimisations au démarrage
    const initializeApp = async () => {
      try {
        // Préchargement des ressources critiques
        await Promise.all([
          preloadCriticalImages(),
          preloadCriticalModules(),
        ]);
        
        console.log('Ressources critiques préchargées');
      } catch (error) {
        console.warn('Erreur lors du préchargement:', error);
      } finally {
        // Hide splash screen after optimization
        SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, []);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      <PerformanceMonitor enabled={__DEV__} />
    </AuthProvider>
  );
}