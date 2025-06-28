import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { 
  Crown, 
  Check, 
  X,
  CreditCard,
  Calendar,
  Star,
  Zap,
  Shield,
  Globe,
  Palette,
  ArrowRight,
  Info,
  Sparkles
} from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { useSubscription } from '../../src/contexts/SubscriptionContext';
import { subscriptionService } from '../../src/services/subscription';

interface Plan {
  id: string;
  nom: string;
  prix_mensuel: number;
  prix_annuel: number;
  description: string;
  fonctionnalites: Record<string, string>;
  limites: Record<string, number>;
  couleur: string;
  ordre: number;
}

export default function Abonnement() {
  const { user } = useAuth();
  const { subscription, plan: currentPlan, refreshSubscription } = useSubscription();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [billingType, setBillingType] = useState<'mensuel' | 'annuel'>('mensuel');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const plansData = await subscriptionService.getPlans();
      setPlans(plansData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      Alert.alert('Erreur', 'Impossible de charger les plans d\'abonnement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour souscrire à un plan');
      return;
    }

    const selectedPlan = plans.find(p => p.id === planId);
    if (!selectedPlan) return;

    const price = billingType === 'mensuel' ? selectedPlan.prix_mensuel : selectedPlan.prix_annuel;
    const period = billingType === 'mensuel' ? 'mois' : 'an';

    Alert.alert(
      'Confirmation d\'abonnement',
      `Vous allez souscrire au plan "${selectedPlan.nom}" pour ${price}€/${period}.\n\nSouhaitez-vous continuer ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            try {
              setLoading(true);
              await subscriptionService.subscribe(user.id, planId, billingType);
              Alert.alert('Succès', 'Abonnement souscrit avec succès !');
              await refreshSubscription();
            } catch (error) {
              console.error('Erreur souscription:', error);
              Alert.alert('Erreur', 'Impossible de souscrire à ce plan. Veuillez réessayer.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleCancelSubscription = async () => {
    if (!user || !subscription) return;

    Alert.alert(
      'Annuler l\'abonnement',
      'Êtes-vous sûr de vouloir annuler votre abonnement ? Vous conserverez l\'accès jusqu\'à la fin de votre période de facturation.',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await subscriptionService.cancelSubscription(user.id);
              Alert.alert('Succès', 'Abonnement annulé avec succès');
              await refreshSubscription();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible d\'annuler l\'abonnement');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'freemium': return Star;
      case 'premium standard': return Zap;
      case 'premium + pack pro+': return Shield;
      case 'premium + site vitrine': return Globe;
      default: return Crown;
    }
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Gratuit' : `${price.toFixed(0)}€`;
  };

  const getEconomies = (mensuel: number, annuel: number) => {
    if (mensuel === 0) return 0;
    const prixAnnuelMensualise = mensuel * 12;
    return Math.round(((prixAnnuelMensualise - annuel) / prixAnnuelMensualise) * 100);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Crown size={48} color="#2563eb" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

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
      {subscription && (
        <View style={styles.currentSubscription}>
          <Text style={styles.currentTitle}>Votre abonnement actuel</Text>
          <View style={styles.currentCard}>
            <View style={styles.currentInfo}>
              <View style={styles.currentHeader}>
                <Text style={styles.currentPlan}>{subscription.plan.nom}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: subscription.statut === 'actif' ? '#16a34a' : '#dc2626' }
                ]}>
                  <Text style={styles.statusText}>
                    {subscription.statut === 'actif' ? 'Actif' : subscription.statut}
                  </Text>
                </View>
              </View>
              <Text style={styles.currentBilling}>
                Facturation: {subscription.type_facturation}
              </Text>
              {subscription.date_fin && (
                <Text style={styles.currentExpiry}>
                  {subscription.statut === 'actif' ? 'Renouvellement' : 'Expire'} le: {' '}
                  {new Date(subscription.date_fin).toLocaleDateString('fr-FR')}
                </Text>
              )}
            </View>
            <View style={styles.currentActions}>
              <TouchableOpacity style={styles.manageButton}>
                <CreditCard size={20} color="#2563eb" />
                <Text style={styles.manageText}>Gérer</Text>
              </TouchableOpacity>
              {subscription.statut === 'actif' && subscription.plan.nom !== 'Freemium' && (
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={handleCancelSubscription}
                >
                  <X size={20} color="#dc2626" />
                  <Text style={styles.cancelText}>Annuler</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Billing Toggle */}
      <View style={styles.billingToggle}>
        <TouchableOpacity
          style={[
            styles.billingOption,
            billingType === 'mensuel' && styles.billingOptionActive
          ]}
          onPress={() => setBillingType('mensuel')}
        >
          <Text style={[
            styles.billingText,
            billingType === 'mensuel' && styles.billingTextActive
          ]}>
            Mensuel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.billingOption,
            billingType === 'annuel' && styles.billingOptionActive
          ]}
          onPress={() => setBillingType('annuel')}
        >
          <Text style={[
            styles.billingText,
            billingType === 'annuel' && styles.billingTextActive
          ]}>
            Annuel
          </Text>
          <View style={styles.savingsBadge}>
            <Sparkles size={12} color="#ffffff" />
            <Text style={styles.savingsText}>-20%</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Plans Grid */}
      <View style={styles.plansContainer}>
        {plans.map((plan) => {
          const IconComponent = getPlanIcon(plan.nom);
          const isCurrentPlan = subscription?.plan_id === plan.id;
          const price = billingType === 'mensuel' ? plan.prix_mensuel : plan.prix_annuel;
          const economies = getEconomies(plan.prix_mensuel, plan.prix_annuel);
          const isPopular = plan.nom.includes('Standard');
          
          return (
            <View key={plan.id} style={[
              styles.planCard,
              isCurrentPlan && styles.currentPlanCard,
              isPopular && styles.popularPlanCard,
              { borderColor: plan.couleur }
            ]}>
              {isPopular && (
                <View style={[styles.popularBadge, { backgroundColor: plan.couleur }]}>
                  <Star size={14} color="#ffffff" />
                  <Text style={styles.popularText}>Populaire</Text>
                </View>
              )}

              {/* Plan Header */}
              <View style={styles.planHeader}>
                <View style={[styles.planIcon, { backgroundColor: plan.couleur }]}>
                  <IconComponent size={24} color="#ffffff" />
                </View>
                <Text style={styles.planName}>{plan.nom}</Text>
                <Text style={styles.planDescription}>{plan.description}</Text>
              </View>

              {/* Price */}
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{formatPrice(price)}</Text>
                {price > 0 && (
                  <Text style={styles.priceUnit}>
                    /{billingType === 'mensuel' ? 'mois' : 'an'}
                  </Text>
                )}
                {billingType === 'annuel' && economies > 0 && (
                  <Text style={styles.savings}>Économisez {economies}%</Text>
                )}
              </View>

              {/* Features */}
              <View style={styles.featuresContainer}>
                {Object.entries(plan.fonctionnalites).map(([key, value]) => (
                  <View key={key} style={styles.feature}>
                    <Check size={16} color="#16a34a" />
                    <Text style={styles.featureText}>{value}</Text>
                  </View>
                ))}
                
                {/* Limits */}
                {plan.limites && Object.keys(plan.limites).length > 0 && (
                  <View style={styles.limitsContainer}>
                    <Text style={styles.limitsTitle}>Limites :</Text>
                    {Object.entries(plan.limites).map(([key, value]) => (
                      <Text key={key} style={styles.limitText}>
                        • {key}: {value === 999 ? 'Illimité' : value}
                      </Text>
                    ))}
                  </View>
                )}
              </View>

              {/* Action Button */}
              <TouchableOpacity
                style={[
                  styles.subscribeButton,
                  isCurrentPlan && styles.currentPlanButton,
                  { backgroundColor: isCurrentPlan ? '#f3f4f6' : plan.couleur }
                ]}
                onPress={() => !isCurrentPlan && handleSubscribe(plan.id)}
                disabled={isCurrentPlan || loading}
              >
                <Text style={[
                  styles.subscribeText,
                  isCurrentPlan && styles.currentPlanText
                ]}>
                  {isCurrentPlan ? 'Plan actuel' : 'Choisir ce plan'}
                </Text>
                {!isCurrentPlan && <ArrowRight size={16} color="#ffffff" />}
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
            Oui, tous les paiements sont traités de manière sécurisée. 
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
  currentBilling: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  currentExpiry: {
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
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#dc2626',
    marginLeft: 6,
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  billingOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    position: 'relative',
  },
  billingOptionActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  billingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  billingTextActive: {
    color: '#111827',
  },
  savingsBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: '#16a34a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  savingsText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  plansContainer: {
    padding: 16,
    gap: 16,
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
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
    borderWidth: 2,
  },
  popularPlanCard: {
    borderWidth: 2,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  planDescription: {
    fontSize: 14,
    color: '#6b7280',
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
  savings: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
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
  limitsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  limitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 6,
  },
  limitText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  subscribeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  currentPlanButton: {
    backgroundColor: '#f3f4f6',
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