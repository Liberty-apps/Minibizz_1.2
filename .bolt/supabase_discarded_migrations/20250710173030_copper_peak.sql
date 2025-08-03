/*
  # Schéma initial de la base de données

  1. New Tables
    - `profiles` - Profils utilisateurs étendus
    - `clients` - Clients des utilisateurs
    - `prestations` - Services proposés par les utilisateurs
    - `devis` - Devis créés par les utilisateurs
    - `devis_lignes` - Lignes de devis
    - `factures` - Factures créées par les utilisateurs
    - `factures_lignes` - Lignes de factures
    - `planning` - Événements du planning
    - `documents` - Documents stockés
    - `parametres_entreprise` - Paramètres de l'entreprise
    - `missions` - Missions partagées
    - `candidatures_missions` - Candidatures aux missions
    - `notifications` - Notifications utilisateurs
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
  
  3. Functions
    - Add trigger functions for updated_at columns
    - Add functions for calculating totals
*/

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des profils utilisateurs étendus
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  nom text,
  prenom text,
  telephone text,
  adresse text,
  code_postal text,
  ville text,
  pays text DEFAULT 'France',
  siret text,
  siren text,
  activite_principale text,
  forme_juridique text DEFAULT 'Auto-entrepreneur',
  date_creation_entreprise date,
  taux_tva decimal(5,2) DEFAULT 0.00,
  regime_fiscal text DEFAULT 'Micro-entreprise',
  logo_url text,
  signature_url text,
  iban text,
  bic text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  onboarding_completed boolean DEFAULT false
);

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nom text NOT NULL,
  prenom text,
  entreprise text,
  email text,
  telephone text,
  adresse text,
  code_postal text,
  ville text,
  pays text DEFAULT 'France',
  siret text,
  notes text,
  type_client text DEFAULT 'particulier' CHECK (type_client IN ('particulier', 'entreprise')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des prestations/services
CREATE TABLE IF NOT EXISTS prestations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nom text NOT NULL,
  description text,
  prix_unitaire decimal(10,2) NOT NULL DEFAULT 0.00,
  unite text DEFAULT 'unité',
  taux_tva decimal(5,2) DEFAULT 0.00,
  categorie text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des devis
CREATE TABLE IF NOT EXISTS devis (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  numero text NOT NULL,
  date_emission date DEFAULT CURRENT_DATE,
  date_validite date,
  statut text DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'envoye', 'accepte', 'refuse', 'expire')),
  objet text,
  conditions_particulieres text,
  montant_ht decimal(10,2) DEFAULT 0.00,
  montant_tva decimal(10,2) DEFAULT 0.00,
  montant_ttc decimal(10,2) DEFAULT 0.00,
  acompte_demande decimal(10,2) DEFAULT 0.00,
  delai_realisation text,
  lieu_prestation text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, numero)
);

-- Table des lignes de devis
CREATE TABLE IF NOT EXISTS devis_lignes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  devis_id uuid NOT NULL REFERENCES devis(id) ON DELETE CASCADE,
  prestation_id uuid REFERENCES prestations(id),
  description text NOT NULL,
  quantite decimal(10,2) DEFAULT 1.00,
  prix_unitaire decimal(10,2) NOT NULL,
  taux_tva decimal(5,2) DEFAULT 0.00,
  montant_ht decimal(10,2) GENERATED ALWAYS AS (quantite * prix_unitaire) STORED,
  montant_tva decimal(10,2) GENERATED ALWAYS AS (quantite * prix_unitaire * taux_tva / 100) STORED,
  montant_ttc decimal(10,2) GENERATED ALWAYS AS (quantite * prix_unitaire * (1 + taux_tva / 100)) STORED,
  ordre integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Table des factures
CREATE TABLE IF NOT EXISTS factures (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  devis_id uuid REFERENCES devis(id),
  numero text NOT NULL,
  date_emission date DEFAULT CURRENT_DATE,
  date_echeance date,
  statut text DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'envoyee', 'payee', 'en_retard', 'annulee')),
  objet text,
  montant_ht decimal(10,2) DEFAULT 0.00,
  montant_tva decimal(10,2) DEFAULT 0.00,
  montant_ttc decimal(10,2) DEFAULT 0.00,
  montant_paye decimal(10,2) DEFAULT 0.00,
  date_paiement date,
  mode_paiement text,
  reference_paiement text,
  penalites_retard decimal(10,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, numero)
);

-- Table des lignes de factures
CREATE TABLE IF NOT EXISTS factures_lignes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  facture_id uuid NOT NULL REFERENCES factures(id) ON DELETE CASCADE,
  prestation_id uuid REFERENCES prestations(id),
  description text NOT NULL,
  quantite decimal(10,2) DEFAULT 1.00,
  prix_unitaire decimal(10,2) NOT NULL,
  taux_tva decimal(5,2) DEFAULT 0.00,
  montant_ht decimal(10,2) GENERATED ALWAYS AS (quantite * prix_unitaire) STORED,
  montant_tva decimal(10,2) GENERATED ALWAYS AS (quantite * prix_unitaire * taux_tva / 100) STORED,
  montant_ttc decimal(10,2) GENERATED ALWAYS AS (quantite * prix_unitaire * (1 + taux_tva / 100)) STORED,
  ordre integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Table du planning
CREATE TABLE IF NOT EXISTS planning (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id),
  devis_id uuid REFERENCES devis(id),
  facture_id uuid REFERENCES factures(id),
  titre text NOT NULL,
  description text,
  date_debut timestamptz NOT NULL,
  date_fin timestamptz,
  lieu text,
  type_evenement text DEFAULT 'rdv' CHECK (type_evenement IN ('rdv', 'prestation', 'relance', 'autre')),
  statut text DEFAULT 'planifie' CHECK (statut IN ('planifie', 'confirme', 'reporte', 'annule', 'termine')),
  rappel_avant interval,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des documents
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id),
  devis_id uuid REFERENCES devis(id),
  facture_id uuid REFERENCES factures(id),
  nom text NOT NULL,
  type_document text NOT NULL CHECK (type_document IN ('devis', 'facture', 'contrat', 'autre')),
  url_fichier text NOT NULL,
  taille_fichier bigint,
  type_mime text,
  created_at timestamptz DEFAULT now()
);

-- Table des paramètres entreprise
CREATE TABLE IF NOT EXISTS parametres_entreprise (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nom_entreprise text,
  slogan text,
  couleur_primaire text DEFAULT '#2563eb',
  couleur_secondaire text DEFAULT '#f0f9ff',
  police_principale text DEFAULT 'Inter',
  logo_url text,
  signature_email text,
  mentions_legales text,
  cgv text,
  delai_paiement_defaut integer DEFAULT 30,
  penalites_retard decimal(5,2) DEFAULT 0.00,
  escompte_paiement_anticipe decimal(5,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Table des missions partagées
CREATE TABLE IF NOT EXISTS missions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  createur_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  titre text NOT NULL,
  description text NOT NULL,
  budget_min decimal(10,2),
  budget_max decimal(10,2),
  localisation text,
  competences_requises text[],
  date_limite date,
  statut text DEFAULT 'ouverte' CHECK (statut IN ('ouverte', 'en_cours', 'terminee', 'annulee')),
  type_mission text DEFAULT 'ponctuelle' CHECK (type_mission IN ('ponctuelle', 'recurrente', 'long_terme')),
  niveau_experience text DEFAULT 'tous' CHECK (niveau_experience IN ('debutant', 'intermediaire', 'expert', 'tous')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des candidatures aux missions
CREATE TABLE IF NOT EXISTS candidatures_missions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id uuid NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  candidat_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text,
  tarif_propose decimal(10,2),
  delai_propose text,
  statut text DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'acceptee', 'refusee', 'retiree')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(mission_id, candidat_id)
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  titre text NOT NULL,
  message text NOT NULL,
  type_notification text DEFAULT 'info' CHECK (type_notification IN ('info', 'success', 'warning', 'error')),
  lue boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Activation de RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestations ENABLE ROW LEVEL SECURITY;
ALTER TABLE devis ENABLE ROW LEVEL SECURITY;
ALTER TABLE devis_lignes ENABLE ROW LEVEL SECURITY;
ALTER TABLE factures ENABLE ROW LEVEL SECURITY;
ALTER TABLE factures_lignes ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE parametres_entreprise ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatures_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Politiques RLS pour clients
CREATE POLICY "Users can manage own clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques RLS pour prestations
CREATE POLICY "Users can manage own prestations"
  ON prestations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques RLS pour devis
CREATE POLICY "Users can manage own devis"
  ON devis
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques RLS pour devis_lignes
CREATE POLICY "Users can manage own devis lines"
  ON devis_lignes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM devis 
      WHERE devis.id = devis_lignes.devis_id 
      AND devis.user_id = auth.uid()
    )
  );

-- Politiques RLS pour factures
CREATE POLICY "Users can manage own factures"
  ON factures
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques RLS pour factures_lignes
CREATE POLICY "Users can manage own facture lines"
  ON factures_lignes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM factures 
      WHERE factures.id = factures_lignes.facture_id 
      AND factures.user_id = auth.uid()
    )
  );

-- Politiques RLS pour planning
CREATE POLICY "Users can manage own planning"
  ON planning
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques RLS pour documents
CREATE POLICY "Users can manage own documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques RLS pour parametres_entreprise
CREATE POLICY "Users can manage own company settings"
  ON parametres_entreprise
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques RLS pour missions
CREATE POLICY "Anyone can read missions"
  ON missions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own missions"
  ON missions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = createur_id);

CREATE POLICY "Users can update own missions"
  ON missions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = createur_id);

CREATE POLICY "Users can delete own missions"
  ON missions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = createur_id);

-- Politiques RLS pour candidatures_missions
CREATE POLICY "Users can read relevant candidatures"
  ON candidatures_missions
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = candidat_id OR 
    EXISTS (
      SELECT 1 FROM missions 
      WHERE missions.id = candidatures_missions.mission_id 
      AND missions.createur_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own candidatures"
  ON candidatures_missions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = candidat_id);

CREATE POLICY "Users can update own candidatures"
  ON candidatures_missions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = candidat_id);

CREATE POLICY "Users can delete own candidatures"
  ON candidatures_missions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = candidat_id);

-- Politiques RLS pour notifications
CREATE POLICY "Users can manage own notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Fonctions pour la mise à jour automatique des timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prestations_updated_at BEFORE UPDATE ON prestations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_devis_updated_at BEFORE UPDATE ON devis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_factures_updated_at BEFORE UPDATE ON factures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_planning_updated_at BEFORE UPDATE ON planning FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parametres_entreprise_updated_at BEFORE UPDATE ON parametres_entreprise FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidatures_missions_updated_at BEFORE UPDATE ON candidatures_missions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour calculer les totaux des devis
CREATE OR REPLACE FUNCTION calculate_devis_totals()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE devis SET
    montant_ht = (
      SELECT COALESCE(SUM(montant_ht), 0)
      FROM devis_lignes
      WHERE devis_id = NEW.devis_id
    ),
    montant_tva = (
      SELECT COALESCE(SUM(montant_tva), 0)
      FROM devis_lignes
      WHERE devis_id = NEW.devis_id
    ),
    montant_ttc = (
      SELECT COALESCE(SUM(montant_ttc), 0)
      FROM devis_lignes
      WHERE devis_id = NEW.devis_id
    )
  WHERE id = NEW.devis_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Fonction pour calculer les totaux des factures
CREATE OR REPLACE FUNCTION calculate_factures_totals()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE factures SET
    montant_ht = (
      SELECT COALESCE(SUM(montant_ht), 0)
      FROM factures_lignes
      WHERE facture_id = NEW.facture_id
    ),
    montant_tva = (
      SELECT COALESCE(SUM(montant_tva), 0)
      FROM factures_lignes
      WHERE facture_id = NEW.facture_id
    ),
    montant_ttc = (
      SELECT COALESCE(SUM(montant_ttc), 0)
      FROM factures_lignes
      WHERE facture_id = NEW.facture_id
    )
  WHERE id = NEW.facture_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour le calcul automatique des totaux
CREATE TRIGGER calculate_devis_totals_trigger
  AFTER INSERT OR UPDATE OR DELETE ON devis_lignes
  FOR EACH ROW EXECUTE FUNCTION calculate_devis_totals();

CREATE TRIGGER calculate_factures_totals_trigger
  AFTER INSERT OR UPDATE OR DELETE ON factures_lignes
  FOR EACH ROW EXECUTE FUNCTION calculate_factures_totals();

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_devis_user_id ON devis(user_id);
CREATE INDEX IF NOT EXISTS idx_devis_client_id ON devis(client_id);
CREATE INDEX IF NOT EXISTS idx_devis_statut ON devis(statut);
CREATE INDEX IF NOT EXISTS idx_factures_user_id ON factures(user_id);
CREATE INDEX IF NOT EXISTS idx_factures_client_id ON factures(client_id);
CREATE INDEX IF NOT EXISTS idx_factures_statut ON factures(statut);
CREATE INDEX IF NOT EXISTS idx_planning_user_id ON planning(user_id);
CREATE INDEX IF NOT EXISTS idx_planning_date_debut ON planning(date_debut);
CREATE INDEX IF NOT EXISTS idx_missions_statut ON missions(statut);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_lue ON notifications(lue);