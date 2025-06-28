import React, { lazy, Suspense } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

// Composant de chargement réutilisable
const LoadingSpinner = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#2563eb" />
    <Text style={styles.loadingText}>Chargement...</Text>
  </View>
);

// Lazy loading des composants lourds
export const LazyDevis = lazy(() => import('../app/(tabs)/devis'));
export const LazyClients = lazy(() => import('../app/(tabs)/clients'));
export const LazyPlanning = lazy(() => import('../app/(tabs)/planning'));
export const LazyCalculs = lazy(() => import('../app/(tabs)/calculs'));
export const LazyParametres = lazy(() => import('../app/(tabs)/parametres'));
export const LazyAide = lazy(() => import('../app/(tabs)/aide'));

// HOC pour wrapper les composants lazy avec Suspense
export const withLazyLoading = (Component: React.ComponentType) => {
  return (props: any) => (
    <Suspense fallback={<LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
});