import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { 
  Crown, 
  Check, 
  CreditCard,
  Calendar,
  Star,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Info,
  Sparkles,
  ExternalLink
} from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { stripeService, type SubscriptionData } from '../../src/services/stripe';
import { stripeConfig, type StripeProduct } from '../../src/stripe-config';
import { subscriptionService } from '../../src/services/subscription';

export default function Abonnement() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const subscriptionData = await stripeService.getUserSubscription();
      setSubscription(subscriptionData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      Alert.alert('Erreur', 'Impossible de charger les informations d\'abonnement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (product: StripeProduct) => {
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour souscrire à un plan');
      return;
    }

    try {
      setSubscribing(product.id);
      
      // Pour les besoins de la démo, nous allons simuler un changement de plan
      // sans passer par Stripe (qui nécessiterait une configuration complète)
      await subscriptionService.updateUserPlan(user.id, product.name);
      
      Alert.alert(
        'Abonnement activé',
        `Votre abonnement ${product.name} a été activé avec succès.`,
        [
          { 
            text: 'OK', 
            onPress: () => {
              loadSubscription();
            }
          }
        ]
      );
      
      // Dans une implémentation réelle avec Stripe, on utiliserait ce code :
      /*
      const { url } = await stripeService.createCheckoutSession({
        priceId: product.priceId,
        mode: product.mode,
      });

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      }
      */
    } catch (error: any) {
      console.error('Erreur souscription:', error);
      Alert.alert('Erreur', error.message || 'Impossible de créer la session de paiement');
    } finally {
      setSubscribing(null);
    }
  };

  const getCurrentProduct = (): StripeProduct | null => {
    if (!subscription?.price_id) return null;
    return stripeConfig.products.find(p => p.priceId === subscription.price_id) || null;
  };

  const isCurrentPlan = (product: StripeProduct): boolean => {
    return subscription?.price_id === product.priceId;
  };

  const getPlanIcon = (productName: string) => {
    if (productName.includes('Premium + Site Vitrine')) return Globe;
    if (productName.includes('Premium + Pack Pro')) return Shield;
    if (productName.includes('Premium')) return Zap;
    return Star;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const currentProduct = getCurrentProduct();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Crown size={32} color="#2563eb" />
        <Text style={styles.title}>Plans & Abonnements</Text>
        <Text style={styles.subtitle}>
          Choisissez le plan qui correspond à vos besoins
        </Text>
      </View>

      {/* Current Subscription */}
      {subscription && stripeService.isSubscriptionActive(subscription.subscription_status) && (
        <View style={styles.currentSubscription}>
          <Text style={styles.currentTitle}>Votre abonnement actuel</Text>
          <View style={styles.currentCard}>
            <View style={styles.currentInfo}>
              <View style={styles.currentHeader}>
                <Text style={styles.currentPlan}>
                  {currentProduct?.name || 'Plan Premium'}
                </Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: stripeService.isSubscriptionActive(subscription.subscription_status) ? '#16a34a' : '#dc2626' }
                ]}>
                  <Text style={styles.statusText}>
                    {stripeService.isSubscriptionActive(subscription.subscription_status) ? 'Actif' : subscription.subscription_status}
                  </Text>
                </View>
              </View>
              
              {subscription.current_period_end && (
                <Text style={styles.currentExpiry}>
                  {stripeService.isSubscriptionCanceling(subscription.cancel_at_period_end) 
                    ? 'Expire le' 
                    : 'Renouvellement le'
                  } : {stripeService.formatDate(subscription.current_period_end)}
                </Text>
              )}

              {subscription.payment_method_brand && subscription.payment_method_last4 && (
                <Text style={styles.currentPayment}>
                  Paiement: {subscription.payment_method_brand.toUpperCase()} •••• {subscription.payment_method_last4}
                </Text>
              )}
            </View>
            
            <View style={styles.currentActions}>
              <TouchableOpacity style={styles.manageButton}>
                <CreditCard size={20} color="#2563eb" />
                <Text style={styles.manageText}>Gérer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Plans Grid */}
      <View style={styles.plansContainer}>
        <Text style={styles.plansTitle}>Plans disponibles</Text>
        
        {stripeConfig.products.map((product) => {
          const IconComponent = getPlanIcon(product.name);
          const isCurrentUserPlan = isCurrentPlan(product);
          const isPopular = product.name.includes('Premium +');
          
          return (
            <View key={product.id} style={[
              styles.planCard,
              isCurrentUserPlan && styles.currentPlanCard,
              isPopular && styles.popularPlanCard,
            ]}>
              {isPopular && (
                <View style={styles.popularBadge}>
                  <Star size={14} color="#ffffff" />
                  <Text style={styles.popularText}>Populaire</Text>
                </View>
              )}

              {/* Plan Header */}
              <View style={styles.planHeader}>
                <View style={styles.planIcon}>
                  <IconComponent size={24} color="#ffffff" />
                </View>
                <Text style={styles.planName}>{product.name}</Text>
              </View>

              {/* Price */}
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  {stripeService.formatPrice(product.price)}
                </Text>
                <Text style={styles.priceUnit}>/{product.interval}</Text>
              </View>

              {/* Features */}
              <View style={styles.featuresContainer}>
                {product.features.map((feature, index) => (
                  <View key={index} style={styles.feature}>
                    <Check size={16} color="#16a34a" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {/* Action Button */}
              <TouchableOpacity
                style={[
                  styles.subscribeButton,
                  isCurrentUserPlan && styles.currentPlanButton,
                  subscribing === product.id && styles.loadingButton,
                ]}
                onPress={() => !isCurrentUserPlan && handleSubscribe(product)}
                disabled={isCurrentUserPlan || subscribing === product.id}
              >
                {subscribing === product.id ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Text style={[
                      styles.subscribeText,
                      isCurrentUserPlan && styles.currentPlanText
                    ]}>
                      {isCurrentUserPlan ? 'Plan actuel' : 'Choisir ce plan'}
                    </Text>
                    {!isCurrentUserPlan && <ArrowRight size={16} color="#ffffff" />}
                  </>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* FAQ Section */}
      <View style={styles.faqSection}>
        <Text style={styles.faqTitle}>Questions fréquentes</Text>
        
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Puis-je changer de plan à tout moment ?</Text>
          <Text style={styles.faqAnswer}>
            Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. 
            Les changements prennent effet immédiatement.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Que se passe-t-il si j'annule mon abonnement ?</Text>
          <Text style={styles.faqAnswer}>
            Vous conservez l'accès aux fonctionnalités premium jusqu'à la fin de votre période de facturation, 
            puis votre compte revient au plan gratuit.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Les paiements sont-ils sécurisés ?</Text>
          <Text style={styles.faqAnswer}>
            Oui, tous les paiements sont traités de manière sécurisée par Stripe. 
            Vos données de paiement sont protégées selon les standards de l'industrie.
          </Text>
        </View>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Info size={20} color="#2563eb" />
        <Text style={styles.infoBannerText}>
          Tous les plans incluent un support client et des mises à jour gratuites
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  currentSubscription: {
    padding: 16,
  },
  currentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  currentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  currentInfo: {
    marginBottom: 12,
  },
  currentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentPlan: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  currentExpiry: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  currentPayment: {
    fontSize: 14,
    color: '#6b7280',
  },
  currentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  manageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563eb',
    marginLeft: 6,
  },
  plansContainer: {
    padding: 16,
  },
  plansTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  currentPlanCard: {
    borderColor: '#2563eb',
  },
  popularPlanCard: {
    borderColor: '#9333ea',
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    backgroundColor: '#9333ea',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    gap: 4,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  priceUnit: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  subscribeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  currentPlanButton: {
    backgroundColor: '#f3f4f6',
  },
  loadingButton: {
    opacity: 0.7,
  },
  subscribeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  currentPlanText: {
    color: '#6b7280',
  },
  faqSection: {
    padding: 16,
    paddingBottom: 32,
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoBannerText: {
    fontSize: 14,
    color: '#1e40af',
    marginLeft: 8,
    flex: 1,
  },
});