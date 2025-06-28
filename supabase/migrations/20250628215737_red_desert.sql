/*
  # Add onboarding_completed field to profiles

  1. Changes
    - Add `onboarding_completed` boolean field to profiles table
    - Set default value to false
    - Update existing records to false

  2. Security
    - No changes to RLS policies needed
*/

-- Add onboarding_completed field to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;
END $$;

-- Update existing profiles to have onboarding_completed = false
UPDATE profiles SET onboarding_completed = false WHERE onboarding_completed IS NULL;