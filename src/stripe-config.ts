export const stripeConfig = {
  products: [
    {
      id: 'prod_freemium',
      priceId: 'price_freemium',
      name: 'Freemium',
      description: 'Plan gratuit pour découvrir MiniBizz',
      mode: 'subscription' as const,
      price: 0,
      currency: 'EUR',
      interval: 'month',
      features: [
        '10 documents/mois',
        'Fiches clients illimitées',
        '5 événements planning max',
        'Dashboard simplifié',
        'Postuler aux missions uniquement',
        '2 requêtes IA/jour',
        'PDF standard avec logo MiniBizz',
        'Support email (48h)'
      ]
    },
    {
      id: 'prod_premium_standard',
      priceId: 'price_premium_standard',
      name: 'Premium Standard',
      description: 'Pour les auto-entrepreneurs actifs',
      mode: 'subscription' as const,
      price: 2.99,
      currency: 'EUR',
      interval: 'month',
      features: [
        'Documents illimités',
        'Signature électronique',
        'CGV IA auto-générées',
        'QR Code paiement',
        'Module missions complet',
        'IA prospection avancée (5km)',
        'Dashboard avancé avec filtres',
        'PDF personnalisable',
        'Support chat (<2h)'
      ]
    },
    {
      id: 'prod_premium_pro',
      priceId: 'price_premium_pro',
      name: 'Premium + Pack Pro',
      description: 'Premium + assistance juridique et marketing',
      mode: 'subscription' as const,
      price: 3.99,
      currency: 'EUR',
      interval: 'month',
      features: [
        'Tout le Premium Standard',
        'Assistance juridique (modèles contrats, CGV/CGU)',
        'Assistance marketing (templates flyers, visuels)',
        'RC Pro Express -20%',
        'Templates Stories/Reels/Carrousels',
        'Accès beta aux nouveaux modules',
        'Actualités & Emplois',
        'Missions partagées avancées'
      ]
    },
    {
      id: 'prod_premium_site',
      priceId: 'price_premium_site',
      name: 'Premium + Site Vitrine',
      description: 'Premium + mini-site vitrine professionnel',
      mode: 'subscription' as const,
      price: 4.99,
      currency: 'EUR',
      interval: 'month',
      features: [
        'Tout le Premium Standard',
        'Mini-site vitrine (3 pages)',
        'Sous-domaine .minibizz.fr',
        'Domaine personnalisé (+5€/an)',
        'Éditeur drag & drop',
        'Personnalisation couleurs/logo/police',
        'Sélection produits à exposer',
        'CGV/CGU IA selon config site'
      ]
    }
  ]
};

export type StripeProduct = typeof stripeConfig.products[0];