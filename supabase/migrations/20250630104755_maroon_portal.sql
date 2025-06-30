-- Insert subscription plans
INSERT INTO plans (nom, prix_mensuel, prix_annuel, description, fonctionnalites, limites, couleur, ordre, actif) VALUES
(
  'Gratuit',
  0.00,
  0.00,
  'Plan gratuit avec fonctionnalités de base',
  '["Gestion de base des clients", "Création de devis simples", "Facturation basique", "Support par email"]'::jsonb,
  '{"clients_max": 10, "devis_par_mois": 5, "factures_par_mois": 5, "sites_vitrines": 0, "stockage_gb": 1}'::jsonb,
  '#6b7280',
  1,
  true
),
(
  'Premium',
  29.99,
  299.99,
  'Plan premium avec fonctionnalités avancées',
  '["Gestion illimitée des clients", "Devis et factures illimités", "Templates personnalisés", "Suivi des paiements", "Rapports avancés", "Support prioritaire"]'::jsonb,
  '{"clients_max": -1, "devis_par_mois": -1, "factures_par_mois": -1, "sites_vitrines": 1, "stockage_gb": 10}'::jsonb,
  '#3b82f6',
  2,
  true
),
(
  'Premium + Pack Pro',
  49.99,
  499.99,
  'Plan premium avec pack professionnel complet',
  '["Toutes les fonctionnalités Premium", "Sites vitrines illimités", "Outils marketing avancés", "Intégrations API", "Automatisation des workflows", "Support téléphonique", "Formation personnalisée"]'::jsonb,
  '{"clients_max": -1, "devis_par_mois": -1, "factures_par_mois": -1, "sites_vitrines": -1, "stockage_gb": 50}'::jsonb,
  '#8b5cf6',
  3,
  true
)
ON CONFLICT (nom) DO UPDATE SET
  prix_mensuel = EXCLUDED.prix_mensuel,
  prix_annuel = EXCLUDED.prix_annuel,
  description = EXCLUDED.description,
  fonctionnalites = EXCLUDED.fonctionnalites,
  limites = EXCLUDED.limites,
  couleur = EXCLUDED.couleur,
  ordre = EXCLUDED.ordre,
  actif = EXCLUDED.actif,
  updated_at = now();