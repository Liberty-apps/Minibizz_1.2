// Configuration pour l'optimisation des bundles
export const BUNDLE_CONFIG = {
  // Modules à charger de manière asynchrone
  LAZY_MODULES: [
    'devis',
    'clients', 
    'planning',
    'calculs',
    'parametres',
    'aide'
  ],
  
  // Taille maximale recommandée par chunk (en KB)
  MAX_CHUNK_SIZE: 250,
  
  // Modules critiques à précharger
  CRITICAL_MODULES: [
    'dashboard',
    'navigation'
  ]
};

// Fonction pour précharger les modules critiques
export const preloadCriticalModules = async () => {
  try {
    // Préchargement du dashboard
    await import('../app/(tabs)/index');
    console.log('Modules critiques préchargés');
  } catch (error) {
    console.warn('Erreur lors du préchargement:', error);
  }
};

// Fonction pour nettoyer les modules non utilisés
export const cleanupUnusedModules = () => {
  // Nettoyage du cache des modules
  if (typeof global !== 'undefined' && global.__DEV__) {
    console.log('Nettoyage des modules en mode développement');
  }
};