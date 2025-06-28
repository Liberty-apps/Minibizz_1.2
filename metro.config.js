const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuration spécifique pour React Native Web
config.resolver.alias = {
  'react-native$': 'react-native-web',
  'react-native/Libraries/EventEmitter/NativeEventEmitter$': 'react-native-web/dist/vendor/react-native/NativeEventEmitter',
  'react-native/Libraries/vendor/emitter/EventEmitter$': 'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
  'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$': 'react-native-web/dist/vendor/react-native/NativeEventEmitter',
};

// Extensions de fichiers pour le web
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

// Plateformes supportées
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

// Configuration pour éviter les erreurs de résolution
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;