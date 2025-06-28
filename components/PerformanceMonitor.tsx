import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
}

export const PerformanceMonitor = ({ enabled = __DEV__ }: { enabled?: boolean }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    bundleSize: 0,
  });

  useEffect(() => {
    if (!enabled) return;

    const startTime = performance.now();
    
    // Mesure du temps de rendu
    const measureRenderTime = () => {
      const endTime = performance.now();
      setMetrics(prev => ({
        ...prev,
        renderTime: endTime - startTime,
      }));
    };

    // Mesure de l'utilisation mémoire (si disponible)
    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // MB
        }));
      }
    };

    measureRenderTime();
    measureMemory();

    // Mise à jour périodique
    const interval = setInterval(measureMemory, 5000);
    
    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Performance</Text>
      <Text style={styles.metric}>
        Rendu: {metrics.renderTime.toFixed(2)}ms
      </Text>
      <Text style={styles.metric}>
        Mémoire: {metrics.memoryUsage.toFixed(2)}MB
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 8,
    borderRadius: 4,
    zIndex: 1000,
  },
  title: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  metric: {
    color: '#fff',
    fontSize: 10,
  },
});