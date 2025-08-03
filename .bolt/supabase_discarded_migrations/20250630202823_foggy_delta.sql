/*
  # Fix subscription and site vitrine tables

  1. New Tables
    - Checks for existence before creating tables
    - Adds plans, abonnements, sites_vitrines, templates_sites, limites_utilisation, historique_paiements, pages_sites
  2. Security
    - Enables RLS on all tables
    - Adds appropriate policies for each table
  3. Functions
    - Adds usage limit checking functions
    - Adds trigger functions for updated_at columns
  4. Data
    - Inserts default plans and templates
*/

-- Check if plans table exists before creating
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'plans') THEN
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
  END IF;
END $$;

-- Check if abonnements table exists before creating
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'abonnements') THEN
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
  END IF;
END $$;

-- Check if sites_vitrines table exists before creating
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sites_vitrines') THEN
    -- Table des sites vitrines
    CREATE TABLE IF NOT EXISTS sites_vitrines (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      nom text NOT NULL,
      sous_domaine text UNIQUE,
      domaine_personnalise text UNIQUE,
      template_id uuid,
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
  END IF;
END $$;

-- Check if templates_sites table exists before creating
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'templates_sites') THEN
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
  END IF;
END $$;

-- Check if limites_utilisation table exists before creating
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'limites_utilisation') THEN
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
  END IF;
END $$;

-- Check if historique_paiements table exists before creating
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'historique_paiements') THEN
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
  END IF;
END $$;

-- Check if pages_sites table exists before creating
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pages_sites') THEN
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
  END IF;
END $$;

-- Activation de RLS
DO $$
BEGIN
  -- Enable RLS on tables if they exist
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'plans') THEN
    ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'abonnements') THEN
    ALTER TABLE abonnements ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sites_vitrines') THEN
    ALTER TABLE sites_vitrines ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'templates_sites') THEN
    ALTER TABLE templates_sites ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'limites_utilisation') THEN
    ALTER TABLE limites_utilisation ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'historique_paiements') THEN
    ALTER TABLE historique_paiements ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pages_sites') THEN
    ALTER TABLE pages_sites ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Supprimer les politiques existantes si elles existent
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'plans' AND policyname = 'Anyone can read active plans') THEN
    DROP POLICY "Anyone can read active plans" ON plans;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'abonnements' AND policyname = 'Users can read own subscription') THEN
    DROP POLICY "Users can read own subscription" ON abonnements;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'abonnements' AND policyname = 'Users can insert own subscription') THEN
    DROP POLICY "Users can insert own subscription" ON abonnements;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'abonnements' AND policyname = 'Users can update own subscription') THEN
    DROP POLICY "Users can update own subscription" ON abonnements;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'sites_vitrines' AND policyname = 'Users can manage own sites') THEN
    DROP POLICY "Users can manage own sites" ON sites_vitrines;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'templates_sites' AND policyname = 'Anyone can read active templates') THEN
    DROP POLICY "Anyone can read active templates" ON templates_sites;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'limites_utilisation' AND policyname = 'Users can read own usage limits') THEN
    DROP POLICY "Users can read own usage limits" ON limites_utilisation;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'limites_utilisation' AND policyname = 'System can manage usage limits') THEN
    DROP POLICY "System can manage usage limits" ON limites_utilisation;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'historique_paiements' AND policyname = 'Users can read own payment history') THEN
    DROP POLICY "Users can read own payment history" ON historique_paiements;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'pages_sites' AND policyname = 'Users can manage own site pages') THEN
    DROP POLICY "Users can manage own site pages" ON pages_sites;
  END IF;
END $$;

-- Politiques RLS pour plans (lecture publique)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'plans') THEN
    CREATE POLICY "Anyone can read active plans"
      ON plans
      FOR SELECT
      TO authenticated
      USING (actif = true);
  END IF;
END $$;

-- Politiques RLS pour abonnements
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'abonnements') THEN
    CREATE POLICY "Users can read own subscription"
      ON abonnements
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own subscription"
      ON abonnements
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update own subscription"
      ON abonnements
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Politiques RLS pour sites vitrines
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sites_vitrines') THEN
    CREATE POLICY "Users can manage own sites"
      ON sites_vitrines
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Politiques RLS pour templates (lecture publique)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'templates_sites') THEN
    CREATE POLICY "Anyone can read active templates"
      ON templates_sites
      FOR SELECT
      TO authenticated
      USING (actif = true);
  END IF;
END $$;

-- Politiques RLS pour limites d'utilisation
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'limites_utilisation') THEN
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
  END IF;
END $$;

-- Politiques RLS pour historique des paiements
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'historique_paiements') THEN
    CREATE POLICY "Users can read own payment history"
      ON historique_paiements
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Politiques RLS pour pages de sites
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pages_sites') THEN
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
  END IF;
END $$;

-- Create function for updating updated_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
       NEW.updated_at = now(); 
       RETURN NEW;
    END;
    $$ language 'plpgsql';
  END IF;
END $$;

-- Triggers pour updated_at - check if they exist first
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'plans') 
     AND NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_plans_updated_at') THEN
    CREATE TRIGGER update_plans_updated_at
      BEFORE UPDATE ON plans
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'abonnements') 
     AND NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_abonnements_updated_at') THEN
    CREATE TRIGGER update_abonnements_updated_at
      BEFORE UPDATE ON abonnements
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sites_vitrines') 
     AND NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_sites_vitrines_updated_at') THEN
    CREATE TRIGGER update_sites_vitrines_updated_at
      BEFORE UPDATE ON sites_vitrines
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'limites_utilisation') 
     AND NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_limites_utilisation_updated_at') THEN
    CREATE TRIGGER update_limites_utilisation_updated_at
      BEFORE UPDATE ON limites_utilisation
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pages_sites') 
     AND NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_pages_sites_updated_at') THEN
    CREATE TRIGGER update_pages_sites_updated_at
      BEFORE UPDATE ON pages_sites
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insertion des plans par défaut (seulement s'ils n'existent pas)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'plans') THEN
    INSERT INTO plans (nom, prix_mensuel, prix_annuel, description, fonctionnalites, limites, couleur, ordre) 
    SELECT * FROM (VALUES
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
        }'::jsonb,
        '{
          "documents_par_mois": 10,
          "clients_export_par_mois": 5,
          "evenements_planning": 5,
          "requetes_ia_par_jour": 2,
          "sites_vitrines": 0
        }'::jsonb,
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
        }'::jsonb,
        '{
          "documents_par_mois": -1,
          "clients_export_par_mois": -1,
          "evenements_planning": -1,
          "requetes_ia_par_jour": 50,
          "sites_vitrines": 0
        }'::jsonb,
        '#2563eb',
        2
      ),
      (
        'Premium + Pack Pro',
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
        }'::jsonb,
        '{
          "documents_par_mois": -1,
          "clients_export_par_mois": -1,
          "evenements_planning": -1,
          "requetes_ia_par_jour": 100,
          "sites_vitrines": 0
        }'::jsonb,
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
        }'::jsonb,
        '{
          "documents_par_mois": -1,
          "clients_export_par_mois": -1,
          "evenements_planning": -1,
          "requetes_ia_par_jour": 50,
          "sites_vitrines": 1
        }'::jsonb,
        '#9333ea',
        4
      )
    ) AS v(nom, prix_mensuel, prix_annuel, description, fonctionnalites, limites, couleur, ordre)
    WHERE NOT EXISTS (SELECT 1 FROM plans WHERE plans.nom = v.nom);
  END IF;
END $$;

-- Insertion des templates par défaut (seulement s'ils n'existent pas)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'templates_sites') THEN
    INSERT INTO templates_sites (nom, description, type_template, structure, styles_defaut) 
    SELECT * FROM (VALUES
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
        }'::jsonb,
        '{
          "couleur_primaire": "#2563eb",
          "couleur_secondaire": "#f0f9ff",
          "couleur_accent": "#16a34a",
          "police_principale": "Inter",
          "police_titres": "Inter"
        }'::jsonb
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
        }'::jsonb,
        '{
          "couleur_primaire": "#9333ea",
          "couleur_secondaire": "#faf5ff",
          "couleur_accent": "#eab308",
          "police_principale": "Poppins",
          "police_titres": "Playfair Display"
        }'::jsonb
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
        }'::jsonb,
        '{
          "couleur_primaire": "#dc2626",
          "couleur_secondaire": "#fef2f2",
          "couleur_accent": "#16a34a",
          "police_principale": "Open Sans",
          "police_titres": "Roboto"
        }'::jsonb
      )
    ) AS v(nom, description, type_template, structure, styles_defaut)
    WHERE NOT EXISTS (SELECT 1 FROM templates_sites WHERE templates_sites.nom = v.nom);
  END IF;
END $$;

-- Create check_usage_limit function if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'check_usage_limit') THEN
    CREATE FUNCTION check_usage_limit(
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
  END IF;
END $$;

-- Create increment_usage function if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'increment_usage') THEN
    CREATE FUNCTION increment_usage(
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
  END IF;
END $$;

-- Index pour améliorer les performances
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'abonnements') 
     AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'abonnements' AND indexname = 'idx_abonnements_user_id') THEN
    CREATE INDEX idx_abonnements_user_id ON abonnements(user_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'abonnements') 
     AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'abonnements' AND indexname = 'idx_abonnements_statut') THEN
    CREATE INDEX idx_abonnements_statut ON abonnements(statut);
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sites_vitrines') 
     AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'sites_vitrines' AND indexname = 'idx_sites_vitrines_user_id') THEN
    CREATE INDEX idx_sites_vitrines_user_id ON sites_vitrines(user_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sites_vitrines') 
     AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'sites_vitrines' AND indexname = 'idx_sites_vitrines_sous_domaine') THEN
    CREATE INDEX idx_sites_vitrines_sous_domaine ON sites_vitrines(sous_domaine);
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'limites_utilisation') 
     AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'limites_utilisation' AND indexname = 'idx_limites_utilisation_user_periode') THEN
    CREATE INDEX idx_limites_utilisation_user_periode ON limites_utilisation(user_id, periode_debut);
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'historique_paiements') 
     AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'historique_paiements' AND indexname = 'idx_historique_paiements_user_id') THEN
    CREATE INDEX idx_historique_paiements_user_id ON historique_paiements(user_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pages_sites') 
     AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'pages_sites' AND indexname = 'idx_pages_sites_site_id') THEN
    CREATE INDEX idx_pages_sites_site_id ON pages_sites(site_id);
  END IF;
END $$;