import { supabase } from '../lib/supabase';

interface OnboardingData {
  nom: string;
  prenom: string;
  nom_entreprise?: string | null;
  logo_url?: string | null;
  activite_principale: string;
}

export const onboardingService = {
  // Compléter l'onboarding d'un utilisateur
  async completeOnboarding(userId: string, data: OnboardingData) {
    try {
      // Mettre à jour le profil utilisateur
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          nom: data.nom,
          prenom: data.prenom,
          activite_principale: data.activite_principale,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Créer ou mettre à jour les paramètres d'entreprise
      const { error: entrepriseError } = await supabase
        .from('parametres_entreprise')
        .upsert({
          user_id: userId,
          nom_entreprise: data.nom_entreprise,
          logo_url: data.logo_url,
          updated_at: new Date().toISOString()
        });

      if (entrepriseError) throw entrepriseError;

      // Marquer l'onboarding comme terminé (on peut ajouter un champ dans profiles si nécessaire)
      const { error: onboardingError } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (onboardingError) {
        console.warn('Impossible de marquer l\'onboarding comme terminé:', onboardingError);
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de l\'onboarding:', error);
      throw error;
    }
  },

  // Vérifier si l'onboarding est nécessaire
  async needsOnboarding(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('nom, prenom, activite_principale, onboarding_completed')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // L'onboarding est nécessaire si :
      // - onboarding_completed est false/null
      // - OU nom/prenom/activite_principale sont manquants
      return !data.onboarding_completed || 
             !data.nom || 
             !data.prenom || 
             !data.activite_principale;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'onboarding:', error);
      return true; // En cas d'erreur, on assume que l'onboarding est nécessaire
    }
  },

  // Sauvegarder temporairement les données d'onboarding
  async saveOnboardingProgress(userId: string, step: number, data: Partial<OnboardingData>) {
    try {
      // On peut utiliser localStorage ou une table temporaire
      if (typeof window !== 'undefined') {
        const progressKey = `onboarding_progress_${userId}`;
        const progress = {
          step,
          data,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(progressKey, JSON.stringify(progress));
      }
    } catch (error) {
      console.warn('Impossible de sauvegarder le progrès de l\'onboarding:', error);
    }
  },

  // Récupérer le progrès de l'onboarding
  async getOnboardingProgress(userId: string) {
    try {
      if (typeof window !== 'undefined') {
        const progressKey = `onboarding_progress_${userId}`;
        const saved = localStorage.getItem(progressKey);
        if (saved) {
          return JSON.parse(saved);
        }
      }
      return null;
    } catch (error) {
      console.warn('Impossible de récupérer le progrès de l\'onboarding:', error);
      return null;
    }
  },

  // Nettoyer le progrès de l'onboarding après completion
  async clearOnboardingProgress(userId: string) {
    try {
      if (typeof window !== 'undefined') {
        const progressKey = `onboarding_progress_${userId}`;
        localStorage.removeItem(progressKey);
      }
    } catch (error) {
      console.warn('Impossible de nettoyer le progrès de l\'onboarding:', error);
    }
  }
};