import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Planning() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Planning & Calendrier</Text>
        <Text style={styles.subtitle}>Gérez vos rendez-vous et votre planning</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholder}>
          Interface Planning en cours de développement...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  placeholder: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});