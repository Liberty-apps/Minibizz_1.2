/*
  # Ajout des champs pour l'onboarding

  1. Modifications
    - Ajouter le champ onboarding_completed à la table profiles
    - Mettre à jour les politiques RLS si nécessaire

  2. Sécurité
    - Les utilisateurs peuvent mettre à jour leur propre statut d'onboarding
*/

-- Ajouter le champ onboarding_completed à la table profiles
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;
END $$;

-- Mettre à jour les profils existants pour marquer l'onboarding comme terminé
-- si ils ont déjà des informations de base
UPDATE profiles 
SET onboarding_completed = true 
WHERE nom IS NOT NULL 
  AND prenom IS NOT NULL 
  AND activite_principale IS NOT NULL
  AND onboarding_completed IS NULL;