import { supabase } from '../lib/supabase';

export const subscriptionService = {
  // Récupérer tous les plans disponibles
  async getPlans() {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('actif', true)
      .order('ordre');

    if (error) throw error;
    return data || [];
  },

  // Récupérer l'abonnement actuel d'un utilisateur
  async getCurrentSubscription(userId: string) {
    const { data, error } = await supabase
      .from('abonnements')
      .select(`
        *,
        plan:plans(*)
      `)
      .eq('user_id', userId)
      .in('statut', ['actif', 'suspendu'])
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  },

  // Souscrire à un plan
  async subscribe(userId: string, planId: string, billingType: 'mensuel' | 'annuel') {
    // Vérifier d'abord s'il y a un abonnement existant
    const existingSubscription = await this.getCurrentSubscription(userId);
    
    if (existingSubscription && existingSubscription.statut === 'actif') {
      // Mettre à jour l'abonnement existant
      const { data, error } = await supabase
        .from('abonnements')
        .update({
          plan_id: planId,
          type_facturation: billingType,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Créer un nouvel abonnement
      const dateDebut = new Date();
      const dateFin = new Date();
      if (billingType === 'mensuel') {
        dateFin.setMonth(dateFin.getMonth() + 1);
      } else {
        dateFin.setFullYear(dateFin.getFullYear() + 1);
      }

      const { data, error } = await supabase
        .from('abonnements')
        .insert({
          user_id: userId,
          plan_id: planId,
          type_facturation: billingType,
          date_debut: dateDebut.toISOString().split('T')[0],
          date_fin: dateFin.toISOString().split('T')[0],
          date_prochaine_facturation: dateFin.toISOString().split('T')[0],
          statut: 'actif'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  // Annuler un abonnement
  async cancelSubscription(userId: string) {
    const { data, error } = await supabase
      .from('abonnements')
      .update({
        statut: 'annule',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Vérifier les permissions d'accès
  async checkAccess(userId: string, feature: string): Promise<boolean> {
    const subscription = await this.getCurrentSubscription(userId);
    
    if (!subscription || subscription.statut !== 'actif') {
      // Plan gratuit par défaut
      return this.checkFeatureAccess('freemium', feature);
    }

    return this.checkFeatureAccess(subscription.plan.nom.toLowerCase(), feature);
  },

  // Vérifier l'accès à une fonctionnalité selon le plan
  checkFeatureAccess(planName: string, feature: string): boolean {
    const planFeatures = {
      'freemium': [
        'dashboard',
        'clients_basic',
        'devis_basic',
        'planning_basic',
        'calculs',
        'aide',
        'premium'
      ],
      'premium standard': [
        'dashboard',
        'clients',
        'devis',
        'factures',
        'planning',
        'calculs',
        'parametres',
        'aide',
        'premium'
      ],
      'premium + pack pro': [
        'dashboard',
        'clients',
        'devis',
        'factures',
        'planning',
        'calculs',
        'parametres',
        'aide',
        'missions',
        'actualites',
        'analytics',
        'premium'
      ],
      'premium + site vitrine': [
        'dashboard',
        'clients',
        'devis',
        'factures',
        'planning',
        'calculs',
        'parametres',
        'aide',
        'sites-vitrines',
        'domaine-personnalise',
        'premium'
      ]
    };

    const allowedFeatures = planFeatures[planName] || planFeatures['freemium'];
    return allowedFeatures.includes(feature);
  },

  // Récupérer les limites d'utilisation
  async getUsageLimits(userId: string) {
    const subscription = await this.getCurrentSubscription(userId);
    
    if (!subscription || subscription.statut !== 'actif') {
      return {
        clients: 5,
        devis: 3,
        factures: 0,
        sites: 0,
        stockage: 100 // MB
      };
    }

    const limits = subscription.plan.limites || {};
    return {
      clients: limits.clients || 999,
      devis: limits.devis || 999,
      factures: limits.factures || 999,
      sites: limits.sites || 0,
      stockage: limits.stockage || 1000
    };
  },

  // Vérifier si une limite est atteinte
  async checkUsageLimit(userId: string, type: string): Promise<boolean> {
    const limits = await this.getUsageLimits(userId);
    
    let currentUsage = 0;
    
    switch (type) {
      case 'clients':
        const { count: clientsCount } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
        currentUsage = clientsCount || 0;
        return currentUsage < limits.clients;
        
      case 'devis':
        const { count: devisCount } = await supabase
          .from('devis')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
        currentUsage = devisCount || 0;
        return currentUsage < limits.devis;
        
      case 'factures':
        const { count: facturesCount } = await supabase
          .from('factures')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
        currentUsage = facturesCount || 0;
        return currentUsage < limits.factures;
        
      case 'sites':
        const { count: sitesCount } = await supabase
          .from('sites_vitrines')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
        currentUsage = sitesCount || 0;
        return currentUsage < limits.sites;
        
      default:
        return true;
    }
  },

  // Récupérer l'historique des paiements
  async getPaymentHistory(userId: string) {
    const { data, error } = await supabase
      .from('historique_paiements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
  
  // Mettre à jour manuellement le plan d'un utilisateur (pour les tests)
  async updateUserPlan(userId: string, planName: string) {
    try {
      console.log(`Updating user ${userId} to plan: ${planName}`);
      
      // Récupérer l'ID du plan
      const { data: planData, error: planError } = await supabase
        .from('plans')
        .select('id')
        .eq('nom', planName)
        .maybeSingle();
        
      if (planError) throw planError;
      
      if (!planData) {
        throw new Error(`Plan "${planName}" non trouvé dans la base de données. Veuillez vérifier que le plan existe.`);
      }
      
      console.log(`Found plan ID: ${planData.id}`);
      
      // Vérifier si l'utilisateur a déjà un abonnement
      const { data: existingSubscription, error: subError } = await supabase
        .from('abonnements')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (subError && subError.code !== 'PGRST116') throw subError;
      
      if (existingSubscription) {
        console.log(`Updating existing subscription: ${existingSubscription.id}`);
        
        // Mettre à jour l'abonnement existant
        const { error: updateError } = await supabase
          .from('abonnements')
          .update({
            plan_id: planData.id,
            statut: 'actif',
            date_debut: new Date().toISOString().split('T')[0],
            date_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSubscription.id);
          
        if (updateError) throw updateError;
      } else {
        console.log(`Creating new subscription for user: ${userId}`);
        
        // Créer un nouvel abonnement
        const { error: insertError } = await supabase
          .from('abonnements')
          .insert({
            user_id: userId,
            plan_id: planData.id,
            statut: 'actif',
            type_facturation: 'mensuel',
            date_debut: new Date().toISOString().split('T')[0],
            date_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          });
          
        if (insertError) throw insertError;
      }
      
      console.log('Plan update successful');
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du plan:', error);
      throw error;
    }
  }
};