import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface OnboardingData {
  nom: string;
  prenom: string;
  nom_entreprise?: string;
  activite_principale: string;
  logo_url?: string;
}

export const onboardingService = {
  // Récupérer le profil utilisateur avec le statut d'onboarding
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('nom, prenom, activite_principale, onboarding_completed')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  },

  // Compléter l'onboarding
  async completeOnboarding(userId: string, onboardingData: OnboardingData): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: '', // Will be updated by trigger or separate call
        nom: onboardingData.nom,
        prenom: onboardingData.prenom,
        activite_principale: onboardingData.activite_principale,
        logo_url: onboardingData.logo_url,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (error) {
      throw error;
    }

    // Créer les paramètres d'entreprise si un nom d'entreprise est fourni
    if (onboardingData.nom_entreprise) {
      await supabase
        .from('parametres_entreprise')
        .upsert({
          user_id: userId,
          nom_entreprise: onboardingData.nom_entreprise,
          logo_url: onboardingData.logo_url
        }, {
          onConflict: 'user_id'
        });
    }
  },

  // Vérifier si l'onboarding est complété
  async isOnboardingCompleted(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data?.onboarding_completed || false;
  },

  // Télécharger un logo
  async uploadLogo(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/logo.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(fileName, file, {
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('logos')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
};

// Liste des activités professionnelles
export const ACTIVITES_PROFESSIONNELLES = [
  'Développement web',
  'Développement mobile',
  'Design graphique',
  'Rédaction web',
  'Marketing digital',
  'Conseil en informatique',
  'Formation',
  'Photographie',
  'Vidéographie',
  'Architecture',
  'Comptabilité',
  'Juridique',
  'Traduction',
  'Coaching',
  'Consulting',
  'E-commerce',
  'Artisanat',
  'Restauration',
  'Services à la personne',
  'Nettoyage',
  'Jardinage',
  'Bricolage',
  'Transport',
  'Livraison',
  'Immobilier',
  'Assurance',
  'Santé',
  'Bien-être',
  'Sport',
  'Musique',
  'Art',
  'Événementiel',
  'Communication',
  'Relations publiques',
  'Vente',
  'Commerce',
  'Import/Export',
  'Logistique',
  'Maintenance',
  'Réparation',
  'Installation',
  'Sécurité',
  'Surveillance',
  'Autre'
].sort();