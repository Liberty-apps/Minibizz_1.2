-- Correction des politiques existantes
DO $$
BEGIN
  -- Vérifier si la politique existe avant de la supprimer
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can read own profile') THEN
    DROP POLICY "Users can read own profile" ON profiles;
  END IF;
  
  -- Recréer la politique
  CREATE POLICY "Users can read own profile"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);
END;
$$;

-- Vérifier et corriger les autres politiques si nécessaire
DO $$
BEGIN
  -- Vérifier si la politique existe avant de la supprimer
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    DROP POLICY "Users can update own profile" ON profiles;
  END IF;
  
  -- Recréer la politique
  CREATE POLICY "Users can update own profile"
    ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);
END;
$$;

DO $$
BEGIN
  -- Vérifier si la politique existe avant de la supprimer
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
    DROP POLICY "Users can insert own profile" ON profiles;
  END IF;
  
  -- Recréer la politique
  CREATE POLICY "Users can insert own profile"
    ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);
END;
$$;