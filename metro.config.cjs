const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add support for web extensions
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configure for NativeWind (Tailwind CSS)
module.exports = withNativeWind(config, { input: './src/index.css' });