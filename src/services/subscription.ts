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
      .eq('statut', 'actif')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Souscrire à un plan
  async subscribe(userId: string, planId: string, billingType: 'mensuel' | 'annuel') {
    // Vérifier d'abord s'il y a un abonnement existant
    const existingSubscription = await this.getCurrentSubscription(userId);
    
    if (existingSubscription) {
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

  // Vérifier les limites d'utilisation
  async checkUsageLimit(userId: string, limitType: string, increment: number = 1) {
    const { data, error } = await supabase
      .rpc('check_usage_limit', {
        p_user_id: userId,
        p_limit_type: limitType,
        p_increment: increment
      });

    if (error) throw error;
    return data;
  },

  // Incrémenter l'utilisation
  async incrementUsage(userId: string, limitType: string, increment: number = 1) {
    const { error } = await supabase
      .rpc('increment_usage', {
        p_user_id: userId,
        p_limit_type: limitType,
        p_increment: increment
      });

    if (error) throw error;
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

  // Récupérer les limites d'utilisation actuelles
  async getCurrentUsage(userId: string) {
    const currentPeriodStart = new Date();
    currentPeriodStart.setDate(1);
    currentPeriodStart.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('limites_utilisation')
      .select('*')
      .eq('user_id', userId)
      .eq('periode_debut', currentPeriodStart.toISOString().split('T')[0])
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || {
      documents_crees: 0,
      clients_exportes: 0,
      requetes_ia: 0,
      sites_crees: 0
    };
  }
};