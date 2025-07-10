import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Home, ArrowLeft } from 'lucide-react-native';
import Logo from '../components/Logo';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Logo size="large" showText={true} color="#2563eb" style={styles.logo} />
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.subtitle}>
          The page you're looking for doesn't exist or has been moved.
        </Text>
        
        <View style={styles.actions}>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Home size={20} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Go to home</Text>
            </TouchableOpacity>
          </Link>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => window.history.back()}
          >
            <ArrowLeft size={20} color="#64748b" />
            <Text style={styles.secondaryButtonText}>Go back</Text>
          </TouchableOpacity>
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
    backgroundColor: '#f8fafc',
  },
  logo: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
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
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
    fontFamily: 'Inter-Medium',
  },
});