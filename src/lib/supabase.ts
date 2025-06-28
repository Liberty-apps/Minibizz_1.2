import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

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
    };
  };
}