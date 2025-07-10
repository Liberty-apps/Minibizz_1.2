import { createClient } from '@supabase/supabase-js';

// Vérification des variables d'environnement
// Utiliser des valeurs par défaut pour le développement
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Afficher un avertissement au lieu de bloquer l'application
if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Variables d\'environnement Supabase:', {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL ? 'Définie' : 'Manquante',
    key: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'Définie' : 'Manquante'
  });
  console.warn(
    'Variables d\'environnement Supabase manquantes. Veuillez configurer EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY dans votre fichier .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Types pour TypeScript
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          nom: string | null;
          prenom: string | null;
          telephone: string | null;
          adresse: string | null;
          code_postal: string | null;
          ville: string | null;
          pays: string | null;
          siret: string | null;
          siren: string | null;
          activite_principale: string | null;
          forme_juridique: string | null;
          date_creation_entreprise: string | null;
          taux_tva: number | null;
          regime_fiscal: string | null;
          logo_url: string | null;
          signature_url: string | null;
          iban: string | null;
          bic: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          nom?: string | null;
          prenom?: string | null;
          telephone?: string | null;
          adresse?: string | null;
          code_postal?: string | null;
          ville?: string | null;
          pays?: string | null;
          siret?: string | null;
          siren?: string | null;
          activite_principale?: string | null;
          forme_juridique?: string | null;
          date_creation_entreprise?: string | null;
          taux_tva?: number | null;
          regime_fiscal?: string | null;
          logo_url?: string | null;
          signature_url?: string | null;
          iban?: string | null;
          bic?: string | null;
        };
        Update: {
          email?: string;
          nom?: string | null;
          prenom?: string | null;
          telephone?: string | null;
          adresse?: string | null;
          code_postal?: string | null;
          ville?: string | null;
          pays?: string | null;
          siret?: string | null;
          siren?: string | null;
          activite_principale?: string | null;
          forme_juridique?: string | null;
          date_creation_entreprise?: string | null;
          taux_tva?: number | null;
          regime_fiscal?: string | null;
          logo_url?: string | null;
          signature_url?: string | null;
          iban?: string | null;
          bic?: string | null;
        };
      };
      clients: {
        Row: {
          id: string;
          user_id: string;
          nom: string;
          prenom: string | null;
          entreprise: string | null;
          email: string | null;
          telephone: string | null;
          adresse: string | null;
          code_postal: string | null;
          ville: string | null;
          pays: string | null;
          siret: string | null;
          notes: string | null;
          type_client: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          nom: string;
          prenom?: string | null;
          entreprise?: string | null;
          email?: string | null;
          telephone?: string | null;
          adresse?: string | null;
          code_postal?: string | null;
          ville?: string | null;
          pays?: string | null;
          siret?: string | null;
          notes?: string | null;
          type_client?: string | null;
        };
        Update: {
          nom?: string;
          prenom?: string | null;
          entreprise?: string | null;
          email?: string | null;
          telephone?: string | null;
          adresse?: string | null;
          code_postal?: string | null;
          ville?: string | null;
          pays?: string | null;
          siret?: string | null;
          notes?: string | null;
          type_client?: string | null;
        };
      };
      devis: {
        Row: {
          id: string;
          user_id: string;
          client_id: string;
          numero: string;
          date_emission: string;
          date_validite: string | null;
          statut: string;
          objet: string | null;
          conditions_particulieres: string | null;
          montant_ht: number;
          montant_tva: number;
          montant_ttc: number;
          acompte_demande: number;
          delai_realisation: string | null;
          lieu_prestation: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          client_id: string;
          numero: string;
          date_emission?: string;
          date_validite?: string | null;
          statut?: string;
          objet?: string | null;
          conditions_particulieres?: string | null;
          montant_ht?: number;
          montant_tva?: number;
          montant_ttc?: number;
          acompte_demande?: number;
          delai_realisation?: string | null;
          lieu_prestation?: string | null;
        };
        Update: {
          client_id?: string;
          numero?: string;
          date_emission?: string;
          date_validite?: string | null;
          statut?: string;
          objet?: string | null;
          conditions_particulieres?: string | null;
          montant_ht?: number;
          montant_tva?: number;
          montant_ttc?: number;
          acompte_demande?: number;
          delai_realisation?: string | null;
          lieu_prestation?: string | null;
        };
      };
      factures: {
        Row: {
          id: string;
          user_id: string;
          client_id: string;
          devis_id: string | null;
          numero: string;
          date_emission: string;
          date_echeance: string | null;
          statut: string;
          objet: string | null;
          montant_ht: number;
          montant_tva: number;
          montant_ttc: number;
          montant_paye: number;
          date_paiement: string | null;
          mode_paiement: string | null;
          reference_paiement: string | null;
          penalites_retard: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          client_id: string;
          devis_id?: string | null;
          numero: string;
          date_emission?: string;
          date_echeance?: string | null;
          statut?: string;
          objet?: string | null;
          montant_ht?: number;
          montant_tva?: number;
          montant_ttc?: number;
          montant_paye?: number;
          date_paiement?: string | null;
          mode_paiement?: string | null;
          reference_paiement?: string | null;
          penalites_retard?: number;
        };
        Update: {
          client_id?: string;
          devis_id?: string | null;
          numero?: string;
          date_emission?: string;
          date_echeance?: string | null;
          statut?: string;
          objet?: string | null;
          montant_ht?: number;
          montant_tva?: number;
          montant_ttc?: number;
          montant_paye?: number;
          date_paiement?: string | null;
          mode_paiement?: string | null;
          reference_paiement?: string | null;
          penalites_retard?: number;
        };
      };
      planning: {
        Row: {
          id: string;
          user_id: string;
          client_id: string | null;
          devis_id: string | null;
          facture_id: string | null;
          titre: string;
          description: string | null;
          date_debut: string;
          date_fin: string | null;
          lieu: string | null;
          type_evenement: string;
          statut: string;
          rappel_avant: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          client_id?: string | null;
          devis_id?: string | null;
          facture_id?: string | null;
          titre: string;
          description?: string | null;
          date_debut: string;
          date_fin?: string | null;
          lieu?: string | null;
          type_evenement?: string;
          statut?: string;
          rappel_avant?: string | null;
        };
        Update: {
          client_id?: string | null;
          devis_id?: string | null;
          facture_id?: string | null;
          titre?: string;
          description?: string | null;
          date_debut?: string;
          date_fin?: string | null;
          lieu?: string | null;
          type_evenement?: string;
          statut?: string;
          rappel_avant?: string | null;
        };
      };
      missions: {
        Row: {
          id: string;
          createur_id: string;
          titre: string;
          description: string;
          budget_min: number | null;
          budget_max: number | null;
          localisation: string | null;
          competences_requises: string[] | null;
          date_limite: string | null;
          statut: string;
          type_mission: string;
          niveau_experience: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          createur_id: string;
          titre: string;
          description: string;
          budget_min?: number | null;
          budget_max?: number | null;
          localisation?: string | null;
          competences_requises?: string[] | null;
          date_limite?: string | null;
          statut?: string;
          type_mission?: string;
          niveau_experience?: string;
        };
        Update: {
          titre?: string;
          description?: string;
          budget_min?: number | null;
          budget_max?: number | null;
          localisation?: string | null;
          competences_requises?: string[] | null;
          date_limite?: string | null;
          statut?: string;
          type_mission?: string;
          niveau_experience?: string;
        };
      };
      plans: {
        Row: {
          id: string;
          nom: string;
          prix_mensuel: number;
          prix_annuel: number;
          description: string | null;
          fonctionnalites: any;
          limites: any;
          couleur: string | null;
          ordre: number | null;
          actif: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          nom: string;
          prix_mensuel?: number;
          prix_annuel?: number;
          description?: string | null;
          fonctionnalites?: any;
          limites?: any;
          couleur?: string | null;
          ordre?: number | null;
          actif?: boolean | null;
        };
        Update: {
          nom?: string;
          prix_mensuel?: number;
          prix_annuel?: number;
          description?: string | null;
          fonctionnalites?: any;
          limites?: any;
          couleur?: string | null;
          ordre?: number | null;
          actif?: boolean | null;
        };
      };
      abonnements: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          statut: string;
          type_facturation: string;
          date_debut: string;
          date_fin: string | null;
          date_prochaine_facturation: string | null;
          montant_paye: number;
          stripe_subscription_id: string | null;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          plan_id: string;
          statut?: string;
          type_facturation?: string;
          date_debut?: string;
          date_fin?: string | null;
          date_prochaine_facturation?: string | null;
          montant_paye?: number;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
        };
        Update: {
          plan_id?: string;
          statut?: string;
          type_facturation?: string;
          date_debut?: string;
          date_fin?: string | null;
          date_prochaine_facturation?: string | null;
          montant_paye?: number;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
        };
      };
      sites_vitrines: {
        Row: {
          id: string;
          user_id: string;
          nom: string;
          sous_domaine: string | null;
          domaine_personnalise: string | null;
          template_id: string | null;
          configuration: any;
          contenu: any;
          styles: any;
          statut: string;
          ssl_actif: boolean | null;
          analytics_actif: boolean | null;
          seo_config: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          nom: string;
          sous_domaine?: string | null;
          domaine_personnalise?: string | null;
          template_id?: string | null;
          configuration?: any;
          contenu?: any;
          styles?: any;
          statut?: string;
          ssl_actif?: boolean | null;
          analytics_actif?: boolean | null;
          seo_config?: any | null;
        };
        Update: {
          nom?: string;
          sous_domaine?: string | null;
          domaine_personnalise?: string | null;
          template_id?: string | null;
          configuration?: any;
          contenu?: any;
          styles?: any;
          statut?: string;
          ssl_actif?: boolean | null;
          analytics_actif?: boolean | null;
          seo_config?: any | null;
        };
      };
      templates_sites: {
        Row: {
          id: string;
          nom: string;
          description: string | null;
          type_template: string;
          structure: any;
          styles_defaut: any;
          preview_url: string | null;
          actif: boolean | null;
          created_at: string;
        };
        Insert: {
          nom: string;
          description?: string | null;
          type_template?: string;
          structure?: any;
          styles_defaut?: any;
          preview_url?: string | null;
          actif?: boolean | null;
        };
        Update: {
          nom?: string;
          description?: string | null;
          type_template?: string;
          structure?: any;
          styles_defaut?: any;
          preview_url?: string | null;
          actif?: boolean | null;
        };
      };
      pages_sites: {
        Row: {
          id: string;
          site_id: string;
          nom: string;
          slug: string;
          titre: string | null;
          contenu: any;
          meta_description: string | null;
          meta_keywords: string | null;
          ordre: number | null;
          visible: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          site_id: string;
          nom: string;
          slug: string;
          titre?: string | null;
          contenu?: any;
          meta_description?: string | null;
          meta_keywords?: string | null;
          ordre?: number | null;
          visible?: boolean | null;
        };
        Update: {
          nom?: string;
          slug?: string;
          titre?: string | null;
          contenu?: any;
          meta_description?: string | null;
          meta_keywords?: string | null;
          ordre?: number | null;
          visible?: boolean | null;
        };
      };
      limites_utilisation: {
        Row: {
          id: string;
          user_id: string;
          periode_debut: string;
          periode_fin: string;
          documents_crees: number | null;
          clients_exportes: number | null;
          requetes_ia: number | null;
          sites_crees: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          periode_debut?: string;
          periode_fin?: string;
          documents_crees?: number | null;
          clients_exportes?: number | null;
          requetes_ia?: number | null;
          sites_crees?: number | null;
        };
        Update: {
          periode_debut?: string;
          periode_fin?: string;
          documents_crees?: number | null;
          clients_exportes?: number | null;
          requetes_ia?: number | null;
          sites_crees?: number | null;
        };
      };
      historique_paiements: {
        Row: {
          id: string;
          user_id: string;
          abonnement_id: string | null;
          montant: number;
          devise: string | null;
          statut: string;
          stripe_payment_intent_id: string | null;
          stripe_invoice_id: string | null;
          date_paiement: string | null;
          methode_paiement: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          abonnement_id?: string | null;
          montant: number;
          devise?: string | null;
          statut?: string;
          stripe_payment_intent_id?: string | null;
          stripe_invoice_id?: string | null;
          date_paiement?: string | null;
          methode_paiement?: string | null;
        };
        Update: {
          abonnement_id?: string | null;
          montant?: number;
          devise?: string | null;
          statut?: string;
          stripe_payment_intent_id?: string | null;
          stripe_invoice_id?: string | null;
          date_paiement?: string | null;
          methode_paiement?: string | null;
        };
      };
    };
  };
}