const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuration pour React Native Web
config.resolver.alias = {
  'react-native': 'react-native-web',
};

config.resolver.extensions = [
  '.web.js',
  '.web.jsx',
  '.web.ts',
  '.web.tsx',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
];

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

module.exports = config;