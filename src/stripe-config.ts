export const stripeConfig = {
  products: [
    {
      id: 'prod_SaHnXkVYp8FKv1',
      priceId: 'price_1Rf7DaHbLDqkyd2HMBK4ajkV',
      name: 'Minibizz Premium',
      description: '• Documents illimités (devis & factures) • Signature électronique • CGV IA (auto-générées) • QR Code paiement • Module Missions complet • IA prospection avancée (zone 5 km) • Dashboard avancé (filtres et graphiques) • PDF personnalisable • Support chat (< 2 h)',
      mode: 'subscription' as const,
      price: 2.99,
      currency: 'EUR',
      interval: 'month',
      features: [
        'Documents illimités (devis & factures)',
        'Signature électronique',
        'CGV IA (auto-générées)',
        'QR Code paiement',
        'Module Missions complet',
        'IA prospection avancée (zone 5 km)',
        'Dashboard avancé (filtres et graphiques)',
        'PDF personnalisable',
        'Support chat (< 2 h)'
      ]
    },
    {
      id: 'prod_SaI1zf4BO7xXF8',
      priceId: 'price_1Rf7R2HbLDqkyd2HCfv6Ibt4',
      name: 'Premium + Pack Pro',
      description: 'Tout le Premium Standard + : • Assistance juridique (modèles contrats, CGV/CGU, conseils) • Assistance marketing (templates flyers, visuels réseaux, guides) • Templates Stories/Reels/Carrousels (Figma, Canva) • Accès beta aux nouveaux modules',
      mode: 'subscription' as const,
      price: 4.00,
      currency: 'EUR',
      interval: 'month',
      features: [
        'Tout le Premium Standard',
        'Assistance juridique (modèles contrats, CGV/CGU, conseils)',
        'Assistance marketing (templates flyers, visuels réseaux, guides)',
        'Templates Stories/Reels/Carrousels (Figma, Canva)',
        'Accès beta aux nouveaux modules'
      ]
    },
    {
      id: 'prod_SaI3pYWtCAJGZd',
      priceId: 'price_1Rf7TZHbLDqkyd2H1kEXjbwY',
      name: 'Premium + Site Vitrine',
      description: '• Tout le Premium Standard + : • Mini-site vitrine (3 pages) • Sous-domaine .minibizz.fr• Domaine perso (+ 5 €/an) • Éditeur drag & drop • Personnalisation couleurs/logo/police • Sélection produits à exposer • CGV/CGU IA selon config site Exemple de mini-site complet : Arborescence du projet : / ├── index.html ├── services.html ├── contact.html └── assets/    └── styles.css',
      mode: 'subscription' as const,
      price: 5.50,
      currency: 'EUR',
      interval: 'month',
      features: [
        'Tout le Premium Standard',
        'Mini-site vitrine (3 pages)',
        'Sous-domaine .minibizz.fr',
        'Domaine perso (+ 5 €/an)',
        'Éditeur drag & drop',
        'Personnalisation couleurs/logo/police',
        'Sélection produits à exposer',
        'CGV/CGU IA selon config site'
      ]
    }
  ]
};

export type StripeProduct = typeof stripeConfig.products[0];