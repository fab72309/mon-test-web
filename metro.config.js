const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Optionnel : si tu veux activer le hash des assets
// config.transformer.assetPlugins = [
//   require.resolve('expo-asset/tools/hashAssetFiles')
// ];

module.exports = config;
