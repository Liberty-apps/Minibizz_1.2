import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Chrome as Home, ArrowLeft } from 'lucide-react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Home size={64} color="#9ca3af" />
        <Text style={styles.title}>Cette page n'existe pas.</Text>
        <Text style={styles.subtitle}>
          La page que vous recherchez est introuvable.
        </Text>
        
        <View style={styles.actions}>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Home size={20} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Retourner à l'accueil</Text>
            </TouchableOpacity>
          </Link>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => window.history.back()}
          >
            <ArrowLeft size={20} color="#6b7280" />
            <Text style={styles.secondaryButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Besoin d'aide ? Contactez notre support à{' '}
            <Text style={styles.helpLink}>support@minibizz.fr</Text>
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  actions: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  helpContainer: {
    marginTop: 32,
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  helpLink: {
    color: '#2563eb',
    fontWeight: '500',
  },
});