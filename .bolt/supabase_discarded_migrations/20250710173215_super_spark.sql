/*
  # Ajout des tables pour les sites vitrines

  1. New Tables
    - `sites_vitrines` - Sites vitrines des utilisateurs
    - `templates_sites` - Templates de sites disponibles
    - `pages_sites` - Pages des sites vitrines
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Table des templates de sites
CREATE TABLE IF NOT EXISTS templates_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  description text,
  type_template text DEFAULT 'vitrine' CHECK (type_template IN ('vitrine', 'boutique', 'portfolio')),
  structure jsonb NOT NULL DEFAULT '{}'::jsonb,
  styles_defaut jsonb NOT NULL DEFAULT '{}'::jsonb,
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
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
  contenu jsonb NOT NULL DEFAULT '{}'::jsonb,
  styles jsonb NOT NULL DEFAULT '{}'::jsonb,
  statut text DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'publie', 'suspendu')),
  ssl_actif boolean DEFAULT false,
  analytics_actif boolean DEFAULT false,
  seo_config jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des pages de sites
CREATE TABLE IF NOT EXISTS pages_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES sites_vitrines(id) ON DELETE CASCADE,
  nom text NOT NULL,
  slug text NOT NULL,
  titre text,
  contenu jsonb NOT NULL DEFAULT '{}'::jsonb,
  meta_description text,
  meta_keywords text,
  ordre integer DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(site_id, slug)
);

-- Activation de RLS sur toutes les tables
ALTER TABLE templates_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites_vitrines ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages_sites ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour templates_sites
CREATE POLICY "Anyone can read active templates"
  ON templates_sites
  FOR SELECT
  TO authenticated
  USING (actif = true);

-- Politiques RLS pour sites_vitrines
CREATE POLICY "Users can manage own sites"
  ON sites_vitrines
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques RLS pour pages_sites
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

-- Triggers pour updated_at
CREATE TRIGGER update_sites_vitrines_updated_at BEFORE UPDATE ON sites_vitrines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_sites_updated_at BEFORE UPDATE ON pages_sites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_sites_vitrines_user_id ON sites_vitrines(user_id);
CREATE INDEX IF NOT EXISTS idx_sites_vitrines_sous_domaine ON sites_vitrines(sous_domaine);
CREATE INDEX IF NOT EXISTS idx_pages_sites_site_id ON pages_sites(site_id);

-- Insérer les templates par défaut
INSERT INTO templates_sites (nom, description, type_template, structure, styles_defaut, preview_url, actif)
VALUES
  ('Business Simple', 'Template épuré pour entreprises de services', 'vitrine', 
   '{"pages": ["accueil", "services", "contact"], "sections": {"accueil": ["hero", "services", "testimonials", "cta"], "services": ["header", "services-list", "pricing", "faq"], "contact": ["header", "contact-form", "map", "info"]}}',
   '{"couleur_primaire": "#2563eb", "couleur_secondaire": "#f0f9ff", "couleur_accent": "#16a34a", "police_principale": "Inter", "police_titres": "Poppins"}',
   'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
   true),
  
  ('Portfolio Créatif', 'Template pour freelances créatifs', 'portfolio', 
   '{"pages": ["accueil", "projets", "a-propos", "contact"], "sections": {"accueil": ["hero", "featured-projects", "skills", "cta"], "projets": ["header", "projects-grid", "filter"], "a-propos": ["header", "bio", "experience", "education"], "contact": ["header", "contact-form", "social"]}}',
   '{"couleur_primaire": "#9333ea", "couleur_secondaire": "#faf5ff", "couleur_accent": "#ec4899", "police_principale": "Poppins", "police_titres": "Poppins"}',
   'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
   true),
  
  ('Boutique Minimaliste', 'Template e-commerce minimaliste', 'boutique', 
   '{"pages": ["accueil", "produits", "a-propos", "contact"], "sections": {"accueil": ["hero", "featured-products", "categories", "newsletter"], "produits": ["header", "products-grid", "filter", "cart"], "a-propos": ["header", "story", "team", "values"], "contact": ["header", "contact-form", "faq", "map"]}}',
   '{"couleur_primaire": "#111827", "couleur_secondaire": "#f9fafb", "couleur_accent": "#f59e0b", "police_principale": "Inter", "police_titres": "Inter"}',
   'https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg',
   true);