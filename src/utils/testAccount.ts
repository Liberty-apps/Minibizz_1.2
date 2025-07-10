import { supabase } from '../lib/supabase';

export const TEST_ACCOUNT = {
  email: 'test@minibizz.fr',
  password: 'MiniBizz2024!Test#Secure',
  profile: {
    nom: 'Dupont',
    prenom: 'Jean',
    entreprise: 'JD Consulting',
    telephone: '06 12 34 56 78',
    siret: '12345678901234',
    activite_principale: 'Conseil en informatique',
    forme_juridique: 'Auto-entrepreneur'
  }
};

export const createTestAccount = async () => {
  try {
    // Tentative de création du compte
    const { data, error } = await supabase.auth.signUp({
      email: TEST_ACCOUNT.email,
      password: TEST_ACCOUNT.password,
      options: {
        data: {
          nom: TEST_ACCOUNT.profile.nom,
          prenom: TEST_ACCOUNT.profile.prenom,
          entreprise: TEST_ACCOUNT.profile.entreprise,
          telephone: TEST_ACCOUNT.profile.telephone,
          siret: TEST_ACCOUNT.profile.siret,
          activite_principale: TEST_ACCOUNT.profile.activite_principale,
          forme_juridique: TEST_ACCOUNT.profile.forme_juridique
        }
      }
    });

    if (error) {
      // Si l'utilisateur existe déjà, ce n'est pas une erreur critique
      if (error.message.includes('already registered')) {
        console.log('Le compte de test existe déjà');
        return { success: true, message: 'Compte existant' };
      }
      throw error;
    }

    // Si le compte a été créé avec succès
    if (data.user) {
      console.log('Compte de test créé avec succès:', TEST_ACCOUNT.email);
      
      // Créer le profil utilisateur
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: TEST_ACCOUNT.email,
          nom: TEST_ACCOUNT.profile.nom,
          prenom: TEST_ACCOUNT.profile.prenom,
          telephone: TEST_ACCOUNT.profile.telephone,
          siret: TEST_ACCOUNT.profile.siret,
          activite_principale: TEST_ACCOUNT.profile.activite_principale,
          forme_juridique: TEST_ACCOUNT.profile.forme_juridique,
          onboarding_completed: true
        });

      if (profileError) {
        console.warn('Erreur lors de la création du profil:', profileError);
      }

      return { success: true, message: 'Compte créé' };
    }

    return { success: false, message: 'Erreur inconnue' };
  } catch (error: any) {
    console.error('Erreur lors de la création du compte de test:', error);
    return { success: false, message: error.message };
  }
};

export const getTestData = () => {
  return {
    clients: [
      {
        nom: 'Martin',
        prenom: 'Sophie',
        email: 'sophie.martin@email.com',
        telephone: '06 98 76 54 32',
        type_client: 'particulier',
        ville: 'Paris'
      },
      {
        nom: 'TechCorp',
        entreprise: 'TechCorp SARL',
        email: 'contact@techcorp.fr',
        telephone: '01 23 45 67 89',
        type_client: 'entreprise',
        ville: 'Lyon',
        siret: '98765432109876'
      }
    ],
    devis: [
      {
        numero: 'DEV-2024-001',
        objet: 'Développement site web',
        montant_ht: 2500.00,
        montant_tva: 500.00,
        montant_ttc: 3000.00,
        statut: 'en_attente'
      }
    ],
    planning: [
      {
        titre: 'Rendez-vous client TechCorp',
        description: 'Présentation du devis pour le site web',
        date_debut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Demain
        type_evenement: 'rdv',
        statut: 'planifie',
        lieu: 'Bureau client - Lyon'
      }
    ]
  };
};