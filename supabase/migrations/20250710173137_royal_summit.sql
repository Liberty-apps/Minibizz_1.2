/*
  # Ajout des tables pour les abonnements et plans

  1. New Tables
    - `plans` - Plans d'abonnement disponibles
    - `abonnements` - Abonnements des utilisateurs
    - `historique_paiements` - Historique des paiements
    - `limites_utilisation` - Limites d'utilisation par période
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Types pour les statuts d'abonnement Stripe
CREATE TYPE IF NOT EXISTS stripe_subscription_status AS ENUM (
  'not_started',
  'incomplete',
  'incomplete_expired',
  'trialing',
  'active',
  'past_due',
  'canceled',
  'unpaid',
  'paused'
);

-- Types pour les statuts de commande Stripe
CREATE TYPE IF NOT EXISTS stripe_order_status AS ENUM (
  'pending',
  'completed',
  'canceled'
);

-- Table des plans d'abonnement
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text UNIQUE NOT NULL,
  prix_mensuel decimal(10,2) NOT NULL DEFAULT 0.00,
  prix_annuel decimal(10,2) NOT NULL DEFAULT 0.00,
  description text,
  fonctionnalites jsonb NOT NULL DEFAULT '{}'::jsonb,
  limites jsonb NOT NULL DEFAULT '{}'::jsonb,
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

-- Table des clients Stripe
CREATE TABLE IF NOT EXISTS stripe_customers (
  id bigint PRIMARY KEY,
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id),
  customer_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Table des abonnements Stripe
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id bigint PRIMARY KEY,
  customer_id text UNIQUE NOT NULL,
  subscription_id text,
  price_id text,
  current_period_start bigint,
  current_period_end bigint,
  cancel_at_period_end boolean DEFAULT false,
  payment_method_brand text,
  payment_method_last4 text,
  status stripe_subscription_status NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Table des commandes Stripe
CREATE TABLE IF NOT EXISTS stripe_orders (
  id bigint PRIMARY KEY,
  checkout_session_id text NOT NULL,
  payment_intent_id text NOT NULL,
  customer_id text NOT NULL,
  amount_subtotal bigint NOT NULL,
  amount_total bigint NOT NULL,
  currency text NOT NULL,
  payment_status text NOT NULL,
  status stripe_order_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Table des limites d'utilisation
CREATE TABLE IF NOT EXISTS limites_utilisation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  periode_debut date DEFAULT CURRENT_DATE,
  periode_fin date DEFAULT CURRENT_DATE + INTERVAL '1 month',
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
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE abonnements ENABLE ROW LEVEL SECURITY;
ALTER TABLE limites_utilisation ENABLE ROW LEVEL SECURITY;
ALTER TABLE historique_paiements ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour plans
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

-- Politiques RLS pour limites_utilisation
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

-- Politiques RLS pour historique_paiements
CREATE POLICY "Users can read own payment history"
  ON historique_paiements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques RLS pour stripe_customers
CREATE POLICY "Users can view their own customer data"
  ON stripe_customers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Politiques RLS pour stripe_subscriptions
CREATE POLICY "Users can view their own subscription data"
  ON stripe_subscriptions
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM stripe_customers 
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    ) AND deleted_at IS NULL
  );

-- Politiques RLS pour stripe_orders
CREATE POLICY "Users can view their own order data"
  ON stripe_orders
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM stripe_customers 
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    ) AND deleted_at IS NULL
  );

-- Triggers pour updated_at
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_abonnements_updated_at BEFORE UPDATE ON abonnements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_limites_utilisation_updated_at BEFORE UPDATE ON limites_utilisation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vues pour faciliter l'accès aux données Stripe
CREATE OR REPLACE VIEW stripe_user_subscriptions AS
SELECT 
  c.customer_id,
  s.subscription_id,
  s.status AS subscription_status,
  s.price_id,
  s.current_period_start,
  s.current_period_end,
  s.cancel_at_period_end,
  s.payment_method_brand,
  s.payment_method_last4
FROM 
  stripe_customers c
JOIN 
  stripe_subscriptions s ON c.customer_id = s.customer_id
WHERE 
  c.deleted_at IS NULL AND s.deleted_at IS NULL;

CREATE OR REPLACE VIEW stripe_user_orders AS
SELECT 
  c.customer_id,
  o.id AS order_id,
  o.checkout_session_id,
  o.payment_intent_id,
  o.amount_subtotal,
  o.amount_total,
  o.currency,
  o.payment_status,
  o.status AS order_status,
  o.created_at AS order_date
FROM 
  stripe_customers c
JOIN 
  stripe_orders o ON c.customer_id = o.customer_id
WHERE 
  c.deleted_at IS NULL AND o.deleted_at IS NULL;

-- Insérer les plans par défaut
INSERT INTO plans (nom, prix_mensuel, prix_annuel, description, fonctionnalites, limites, couleur, ordre, actif)
VALUES
  ('Freemium', 0.00, 0.00, 'Plan gratuit pour découvrir MiniBizz', 
   '{"features": ["10 documents/mois", "Fiches clients illimitées", "5 événements planning max", "Dashboard simplifié", "Postuler aux missions uniquement", "2 requêtes IA/jour", "PDF standard avec logo MiniBizz", "Support email (48h)"]}',
   '{"clients": 999, "devis": 10, "factures": 0, "sites": 0, "stockage": 100}',
   '#6b7280', 1, true),
  
  ('Premium Standard', 2.99, 29.90, 'Pour les auto-entrepreneurs actifs', 
   '{"features": ["Documents illimités", "Signature électronique", "CGV IA auto-générées", "QR Code paiement", "Module missions complet", "IA prospection avancée (5km)", "Dashboard avancé avec filtres", "PDF personnalisable", "Support chat (<2h)"]}',
   '{"clients": 999, "devis": 999, "factures": 999, "sites": 0, "stockage": 1000}',
   '#2563eb', 2, true),
  
  ('Premium + Pack Pro', 3.99, 39.90, 'Premium + assistance juridique et marketing', 
   '{"features": ["Tout le Premium Standard", "Assistance juridique (modèles contrats, CGV/CGU)", "Assistance marketing (templates flyers, visuels)", "RC Pro Express -20%", "Templates Stories/Reels/Carrousels", "Accès beta aux nouveaux modules", "Actualités & Emplois", "Missions partagées avancées"]}',
   '{"clients": 999, "devis": 999, "factures": 999, "sites": 0, "stockage": 2000}',
   '#9333ea', 3, true),
  
  ('Premium + Site Vitrine', 4.99, 49.90, 'Premium + mini-site vitrine professionnel', 
   '{"features": ["Tout le Premium Standard", "Mini-site vitrine (3 pages)", "Sous-domaine .minibizz.fr", "Domaine personnalisé (+5€/an)", "Éditeur drag & drop", "Personnalisation couleurs/logo/police", "Sélection produits à exposer", "CGV/CGU IA selon config site"]}',
   '{"clients": 999, "devis": 999, "factures": 999, "sites": 1, "stockage": 2000}',
   '#16a34a', 4, true);