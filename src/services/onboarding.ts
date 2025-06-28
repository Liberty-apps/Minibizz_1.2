import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface OnboardingData {
  nom: string;
  prenom: string;
  nom_entreprise?: string;
  logo_url?: string;
  activite_principale: string;
}

export const onboardingService = {
  // Récupérer les informations de profil pour l'onboarding
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('nom, prenom, activite_principale, onboarding_completed')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return null;
    }
  },

  // Mettre à jour le profil avec les données d'onboarding
  async updateProfile(userId: string, data: OnboardingData): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          nom: data.nom,
          prenom: data.prenom,
          activite_principale: data.activite_principale,
          logo_url: data.logo_url,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  },

  // Marquer l'onboarding comme terminé
  async completeOnboarding(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Erreur lors de la finalisation de l\'onboarding:', error);
      throw error;
    }
  },

  // Vérifier si l'onboarding est terminé
  async isOnboardingCompleted(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data?.onboarding_completed || false;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'onboarding:', error);
      return false;
    }
  },

  // Liste des secteurs d'activité
  getActivites(): string[] {
    return [
      'Conseil en informatique',
      'Développement web',
      'Développement mobile',
      'Design graphique',
      'Marketing digital',
      'Rédaction web',
      'Traduction',
      'Formation',
      'Coaching',
      'Photographie',
      'Vidéographie',
      'Architecture',
      'Ingénierie',
      'Comptabilité',
      'Juridique',
      'Immobilier',
      'Commerce',
      'Artisanat',
      'Services à la personne',
      'Santé et bien-être',
      'Transport',
      'Restauration',
      'Tourisme',
      'Événementiel',
      'Communication',
      'Relations publiques',
      'Ressources humaines',
      'Finance',
      'Assurance',
      'Éducation',
      'Sport',
      'Culture',
      'Environnement',
      'Énergie',
      'Agriculture',
      'Industrie',
      'Logistique',
      'Sécurité',
      'Nettoyage',
      'Maintenance',
      'Réparation',
      'Installation',
      'Autre'
    ];
  }
};