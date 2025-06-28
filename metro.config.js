const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Optimisations Metro pour de meilleures performances
config.resolver.platforms = ['native', 'web', 'ios', 'android'];

// Configuration pour le tree-shaking
config.transformer.minifierConfig = {
  mangle: {
    keep_fnames: true,
  },
  output: {
    ascii_only: true,
    quote_keys: true,
    wrap_iife: true,
  },
  sourceMap: {
    includeSources: false,
  },
  toplevel: false,
  warnings: false,
};

// Optimisation des assets
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

// Configuration pour le code splitting
config.serializer.createModuleIdFactory = function () {
  const fileToIdMap = new Map();
  let nextId = 0;
  return (path) => {
    if (!fileToIdMap.has(path)) {
      fileToIdMap.set(path, nextId++);
    }
    return fileToIdMap.get(path);
  };
};

// Optimisation de la taille des bundles
config.serializer.processModuleFilter = function (module) {
  // Exclure les modules de développement en production
  if (process.env.NODE_ENV === 'production') {
    if (module.path.includes('__tests__') || 
        module.path.includes('.test.') ||
        module.path.includes('.spec.')) {
      return false;
    }
  }
  return true;
};

module.exports = config;