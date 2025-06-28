/*
  # Migration complète MiniBizz - Schéma de base de données

  1. Tables principales
    - `profiles` - Profils utilisateurs étendus
    - `clients` - Gestion des clients
    - `prestations` - Services/prestations
    - `devis` et `devis_lignes` - Système de devis
    - `factures` et `factures_lignes` - Système de facturation
    - `planning` - Gestion du planning
    - `documents` - Stockage des documents
    - `parametres_entreprise` - Configuration entreprise
    - `missions` et `candidatures_missions` - Partage de missions
    - `notifications` - Système de notifications

  2. Système d'abonnements
    - `plans` - Plans tarifaires
    - `abonnements` - Abonnements utilisateurs
    - `limites_utilisation` - Suivi des limites
    - `historique_paiements` - Historique des paiements

  3. Sites vitrines
    - `templates_sites` - Templates de sites
    - `sites_vitrines` - Sites utilisateurs
    - `pages_sites` - Pages des sites

  4. Sécurité
    - RLS activé sur toutes les tables
    - Politiques de sécurité appropriées
    - Triggers pour les timestamps automatiques
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
  updated_at timestamptz DEFAULT now()
);

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  titre text NOT NULL,
  message text NOT NULL,
  type_notification text DEFAULT 'info' CHECK (type_notification IN ('info', 'success', 'warning', 'error')),
  lue boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Table des plans tarifaires
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL UNIQUE,
  prix_mensuel decimal(10,2) NOT NULL DEFAULT 0.00,
  prix_annuel decimal(10,2) NOT NULL DEFAULT 0.00,
  description text,
  fonctionnalites jsonb NOT NULL DEFAULT '{}',
  limites jsonb NOT NULL DEFAULT '{}',
  couleur text DEFAULT '#2563eb',
  ordre integer DEFAULT 0,
  actif boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des abonnements utilisateurs
CREATE TABLE IF NOT EXISTS abonnements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES plans(id),
  statut text DEFAULT 'actif' CHECK (statut IN ('actif', 'suspendu', 'annule', 'expire')),
  type_facturation text DEFAULT 'mensuel' CHECK (type_facturation IN ('mensuel', 'annuel')),
  date_debut date DEFAULT CURRENT_DATE,
  date_fin date,
  date_prochaine_facturation date,
  montant_paye decimal(10,2) DEFAULT 0.00,
  stripe_subscription_id text,
  stripe_customer_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Table des templates de sites
CREATE TABLE IF NOT EXISTS templates_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  description text,
  type_template text DEFAULT 'vitrine' CHECK (type_template IN ('vitrine', 'boutique', 'portfolio')),
  structure jsonb NOT NULL DEFAULT '{}',
  styles_defaut jsonb NOT NULL DEFAULT '{}',
  preview_url text,
  actif boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Table des sites vitrines
CREATE TABLE IF NOT EXISTS sites_vitrines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nom text NOT NULL,
  sous_domaine text UNIQUE,
  domaine_personnalise text UNIQUE,
  template_id uuid REFERENCES templates_sites(id),
  configuration jsonb NOT NULL DEFAULT '{}',
  contenu jsonb NOT NULL DEFAULT '{}',
  styles jsonb NOT NULL DEFAULT '{}',
  statut text DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'publie', 'suspendu')),
  ssl_actif boolean DEFAULT false,
  analytics_actif boolean DEFAULT false,
  seo_config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des pages de sites vitrines
CREATE TABLE IF NOT EXISTS pages_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES sites_vitrines(id) ON DELETE CASCADE,
  nom text NOT NULL,
  slug text NOT NULL,
  titre text,
  contenu jsonb NOT NULL DEFAULT '{}',
  meta_description text,
  meta_keywords text,
  ordre integer DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(site_id, slug)
);

-- Table de suivi des limites d'utilisation
CREATE TABLE IF NOT EXISTS limites_utilisation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  periode_debut date DEFAULT CURRENT_DATE,
  periode_fin date DEFAULT (CURRENT_DATE + INTERVAL '1 month'),
  documents_crees integer DEFAULT 0,
  clients_exportes integer DEFAULT 0,
  requetes_ia integer DEFAULT 0,
  sites_crees integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, periode_debut)
);

-- Table de l'historique des paiements
CREATE TABLE IF NOT EXISTS historique_paiements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  abonnement_id uuid REFERENCES abonnements(id),
  montant decimal(10,2) NOT NULL,
  devise text DEFAULT 'EUR',
  statut text DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'reussi', 'echec', 'rembourse')),
  stripe_payment_intent_id text,
  stripe_invoice_id text,
  date_paiement timestamptz,
  methode_paiement text,
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
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE abonnements ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites_vitrines ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE limites_utilisation ENABLE ROW LEVEL SECURITY;
ALTER TABLE historique_paiements ENABLE ROW LEVEL SECURITY;

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

-- Politiques RLS pour missions (lecture publique, écriture propriétaire)
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

-- Politiques RLS pour plans (lecture publique)
CREATE POLICY "Anyone can read active plans"
  ON plans
  FOR SELECT
  TO authenticated
  USING (actif = true);

-- Politiques RLS pour abonnements
CREATE POLICY "Users can read own subscription"
  ON abonnements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON abonnements
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON abonnements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour templates (lecture publique)
CREATE POLICY "Anyone can read active templates"
  ON templates_sites
  FOR SELECT
  TO authenticated
  USING (actif = true);

-- Politiques RLS pour sites vitrines
CREATE POLICY "Users can manage own sites"
  ON sites_vitrines
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques RLS pour pages de sites
CREATE POLICY "Users can manage own site pages"
  ON pages_sites
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sites_vitrines 
      WHERE sites_vitrines.id = pages_sites.site_id 
      AND sites_vitrines.user_id = auth.uid()
    )
  );

-- Politiques RLS pour limites d'utilisation
CREATE POLICY "Users can read own usage limits"
  ON limites_utilisation
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage usage limits"
  ON limites_utilisation
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques RLS pour historique des paiements
CREATE POLICY "Users can read own payment history"
  ON historique_paiements
  FOR SELECT
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
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_abonnements_updated_at BEFORE UPDATE ON abonnements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sites_vitrines_updated_at BEFORE UPDATE ON sites_vitrines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_sites_updated_at BEFORE UPDATE ON pages_sites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_limites_utilisation_updated_at BEFORE UPDATE ON limites_utilisation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour calculer les totaux des devis
CREATE OR REPLACE FUNCTION calculate_devis_totals()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE devis SET
    montant_ht = (
      SELECT COALESCE(SUM(montant_ht), 0)
      FROM devis_lignes
      WHERE devis_id = COALESCE(NEW.devis_id, OLD.devis_id)
    ),
    montant_tva = (
      SELECT COALESCE(SUM(montant_tva), 0)
      FROM devis_lignes
      WHERE devis_id = COALESCE(NEW.devis_id, OLD.devis_id)
    ),
    montant_ttc = (
      SELECT COALESCE(SUM(montant_ttc), 0)
      FROM devis_lignes
      WHERE devis_id = COALESCE(NEW.devis_id, OLD.devis_id)
    )
  WHERE id = COALESCE(NEW.devis_id, OLD.devis_id);
  
  RETURN COALESCE(NEW, OLD);
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
      WHERE facture_id = COALESCE(NEW.facture_id, OLD.facture_id)
    ),
    montant_tva = (
      SELECT COALESCE(SUM(montant_tva), 0)
      FROM factures_lignes
      WHERE facture_id = COALESCE(NEW.facture_id, OLD.facture_id)
    ),
    montant_ttc = (
      SELECT COALESCE(SUM(montant_ttc), 0)
      FROM factures_lignes
      WHERE facture_id = COALESCE(NEW.facture_id, OLD.facture_id)
    )
  WHERE id = COALESCE(NEW.facture_id, OLD.facture_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers pour le calcul automatique des totaux
CREATE TRIGGER calculate_devis_totals_trigger
  AFTER INSERT OR UPDATE OR DELETE ON devis_lignes
  FOR EACH ROW EXECUTE FUNCTION calculate_devis_totals();

CREATE TRIGGER calculate_factures_totals_trigger
  AFTER INSERT OR UPDATE OR DELETE ON factures_lignes
  FOR EACH ROW EXECUTE FUNCTION calculate_factures_totals();

-- Fonction pour vérifier les limites d'utilisation
CREATE OR REPLACE FUNCTION check_usage_limit(
  p_user_id uuid,
  p_limit_type text,
  p_increment integer DEFAULT 1
) RETURNS boolean AS $$
DECLARE
  current_usage integer;
  user_plan_limits jsonb;
  limit_value integer;
  current_period_start date;
  current_period_end date;
BEGIN
  -- Récupérer les limites du plan utilisateur
  SELECT p.limites INTO user_plan_limits
  FROM abonnements a
  JOIN plans p ON p.id = a.plan_id
  WHERE a.user_id = p_user_id AND a.statut = 'actif';
  
  -- Si pas d'abonnement, utiliser les limites du plan gratuit
  IF user_plan_limits IS NULL THEN
    SELECT limites INTO user_plan_limits
    FROM plans
    WHERE nom = 'Freemium';
  END IF;
  
  -- Récupérer la limite pour ce type
  limit_value := (user_plan_limits ->> p_limit_type)::integer;
  
  -- Si limite illimitée (-1), autoriser
  IF limit_value = -1 THEN
    RETURN true;
  END IF;
  
  -- Calculer la période actuelle
  current_period_start := date_trunc('month', CURRENT_DATE)::date;
  current_period_end := (current_period_start + INTERVAL '1 month' - INTERVAL '1 day')::date;
  
  -- Récupérer l'utilisation actuelle
  SELECT COALESCE(
    CASE p_limit_type
      WHEN 'documents_par_mois' THEN documents_crees
      WHEN 'clients_export_par_mois' THEN clients_exportes
      WHEN 'requetes_ia_par_jour' THEN requetes_ia
      WHEN 'sites_vitrines' THEN sites_crees
      ELSE 0
    END, 0
  ) INTO current_usage
  FROM limites_utilisation
  WHERE user_id = p_user_id 
    AND periode_debut = current_period_start;
  
  -- Vérifier si l'ajout dépasse la limite
  RETURN (current_usage + p_increment) <= limit_value;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour incrémenter l'utilisation
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id uuid,
  p_limit_type text,
  p_increment integer DEFAULT 1
) RETURNS void AS $$
DECLARE
  current_period_start date;
  current_period_end date;
BEGIN
  current_period_start := date_trunc('month', CURRENT_DATE)::date;
  current_period_end := (current_period_start + INTERVAL '1 month' - INTERVAL '1 day')::date;
  
  INSERT INTO limites_utilisation (
    user_id, 
    periode_debut, 
    periode_fin,
    documents_crees,
    clients_exportes,
    requetes_ia,
    sites_crees
  ) VALUES (
    p_user_id,
    current_period_start,
    current_period_end,
    CASE WHEN p_limit_type = 'documents_par_mois' THEN p_increment ELSE 0 END,
    CASE WHEN p_limit_type = 'clients_export_par_mois' THEN p_increment ELSE 0 END,
    CASE WHEN p_limit_type = 'requetes_ia_par_jour' THEN p_increment ELSE 0 END,
    CASE WHEN p_limit_type = 'sites_vitrines' THEN p_increment ELSE 0 END
  )
  ON CONFLICT (user_id, periode_debut) DO UPDATE SET
    documents_crees = CASE WHEN p_limit_type = 'documents_par_mois' 
      THEN limites_utilisation.documents_crees + p_increment 
      ELSE limites_utilisation.documents_crees END,
    clients_exportes = CASE WHEN p_limit_type = 'clients_export_par_mois' 
      THEN limites_utilisation.clients_exportes + p_increment 
      ELSE limites_utilisation.clients_exportes END,
    requetes_ia = CASE WHEN p_limit_type = 'requetes_ia_par_jour' 
      THEN limites_utilisation.requetes_ia + p_increment 
      ELSE limites_utilisation.requetes_ia END,
    sites_crees = CASE WHEN p_limit_type = 'sites_vitrines' 
      THEN limites_utilisation.sites_crees + p_increment 
      ELSE limites_utilisation.sites_crees END,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Insertion des plans par défaut
INSERT INTO plans (nom, prix_mensuel, prix_annuel, description, fonctionnalites, limites, couleur, ordre) VALUES
(
  'Freemium',
  0.00,
  0.00,
  'Plan gratuit pour découvrir MiniBizz',
  '{
    "documents": "10 documents/mois",
    "clients": "Fiches clients illimitées",
    "planning": "5 événements actifs max",
    "dashboard": "Dashboard simplifié",
    "missions": "Postuler uniquement",
    "ia": "2 requêtes/jour",
    "export": "PDF standard avec logo MiniBizz",
    "support": "Email (48h)"
  }',
  '{
    "documents_par_mois": 10,
    "clients_export_par_mois": 5,
    "evenements_planning": 5,
    "requetes_ia_par_jour": 2,
    "sites_vitrines": 0
  }',
  '#6b7280',
  1
),
(
  'Premium Standard',
  2.99,
  25.00,
  'Pour les auto-entrepreneurs actifs',
  '{
    "documents": "Documents illimités",
    "signature": "Signature électronique",
    "cgv": "CGV IA auto-générées",
    "qr_paiement": "QR Code paiement",
    "missions": "Module complet",
    "ia": "IA prospection avancée (5km)",
    "dashboard": "Dashboard avancé avec filtres",
    "export": "PDF personnalisable",
    "support": "Chat (<2h)"
  }',
  '{
    "documents_par_mois": -1,
    "clients_export_par_mois": -1,
    "evenements_planning": -1,
    "requetes_ia_par_jour": 50,
    "sites_vitrines": 0
  }',
  '#2563eb',
  2
),
(
  'Premium + Pack Pro+',
  3.99,
  39.00,
  'Premium + assistance juridique et marketing',
  '{
    "tout_premium": "Tout le Premium Standard",
    "assistance_juridique": "Modèles contrats, CGV/CGU, conseils",
    "assistance_marketing": "Templates flyers, visuels réseaux",
    "rc_pro": "RC Pro Express -20%",
    "templates": "Templates Stories/Reels/Carrousels",
    "beta": "Accès beta nouveaux modules"
  }',
  '{
    "documents_par_mois": -1,
    "clients_export_par_mois": -1,
    "evenements_planning": -1,
    "requetes_ia_par_jour": 100,
    "sites_vitrines": 0
  }',
  '#16a34a',
  3
),
(
  'Premium + Site Vitrine',
  4.99,
  49.00,
  'Premium + mini-site vitrine professionnel',
  '{
    "tout_premium": "Tout le Premium Standard",
    "site_vitrine": "Mini-site vitrine (3 pages)",
    "sous_domaine": "Sous-domaine .minibizz.fr",
    "domaine_perso": "Domaine perso (+5€/an)",
    "editeur": "Éditeur drag & drop",
    "personnalisation": "Couleurs/logo/police",
    "produits": "Sélection produits à exposer",
    "cgv_site": "CGV/CGU IA selon config site"
  }',
  '{
    "documents_par_mois": -1,
    "clients_export_par_mois": -1,
    "evenements_planning": -1,
    "requetes_ia_par_jour": 50,
    "sites_vitrines": 1
  }',
  '#9333ea',
  4
);

-- Insertion des templates par défaut
INSERT INTO templates_sites (nom, description, type_template, structure, styles_defaut) VALUES
(
  'Vitrine Classique',
  'Template simple et élégant pour présenter votre activité',
  'vitrine',
  '{
    "pages": ["accueil", "services", "contact"],
    "sections": {
      "accueil": ["hero", "services-preview", "about"],
      "services": ["services-detail", "tarifs"],
      "contact": ["formulaire", "coordonnees"]
    }
  }',
  '{
    "couleur_primaire": "#2563eb",
    "couleur_secondaire": "#f0f9ff",
    "couleur_accent": "#16a34a",
    "police_principale": "Inter",
    "police_titres": "Inter"
  }'
),
(
  'Portfolio Créatif',
  'Parfait pour les créatifs et freelances',
  'portfolio',
  '{
    "pages": ["accueil", "portfolio", "services", "contact"],
    "sections": {
      "accueil": ["hero-creative", "portfolio-preview", "services-preview"],
      "portfolio": ["galerie", "projets-detail"],
      "services": ["services-creative"],
      "contact": ["formulaire-creative"]
    }
  }',
  '{
    "couleur_primaire": "#9333ea",
    "couleur_secondaire": "#faf5ff",
    "couleur_accent": "#eab308",
    "police_principale": "Poppins",
    "police_titres": "Playfair Display"
  }'
),
(
  'Boutique Simple',
  'Template e-commerce basique pour vendre vos produits',
  'boutique',
  '{
    "pages": ["accueil", "boutique", "produit", "panier", "contact"],
    "sections": {
      "accueil": ["hero-shop", "produits-featured", "about-shop"],
      "boutique": ["catalogue", "filtres"],
      "produit": ["detail-produit", "produits-similaires"],
      "panier": ["recap-commande", "checkout"]
    }
  }',
  '{
    "couleur_primaire": "#dc2626",
    "couleur_secondaire": "#fef2f2",
    "couleur_accent": "#16a34a",
    "police_principale": "Open Sans",
    "police_titres": "Roboto"
  }'
);

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
CREATE INDEX IF NOT EXISTS idx_abonnements_user_id ON abonnements(user_id);
CREATE INDEX IF NOT EXISTS idx_abonnements_statut ON abonnements(statut);
CREATE INDEX IF NOT EXISTS idx_sites_vitrines_user_id ON sites_vitrines(user_id);
CREATE INDEX IF NOT EXISTS idx_sites_vitrines_sous_domaine ON sites_vitrines(sous_domaine);
CREATE INDEX IF NOT EXISTS idx_limites_utilisation_user_periode ON limites_utilisation(user_id, periode_debut);
CREATE INDEX IF NOT EXISTS idx_historique_paiements_user_id ON historique_paiements(user_id);
CREATE INDEX IF NOT EXISTS idx_pages_sites_site_id ON pages_sites(site_id);