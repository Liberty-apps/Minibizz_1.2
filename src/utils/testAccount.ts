export const TEST_ACCOUNT = {
  email: 'test@minibizz.fr',
  password: 'TestMiniBizz2024!',
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
  // Cette fonction peut être utilisée pour créer automatiquement un compte de test
  console.log('Compte de test disponible:', TEST_ACCOUNT.email);
  console.log('Mot de passe:', TEST_ACCOUNT.password);
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