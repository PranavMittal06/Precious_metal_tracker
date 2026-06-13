module.exports = {
  dependencies: {
    // Reanimated is not used in this project (we use the built-in Animated API).
    // Disabling Android linking prevents its incompatible Paper-era Java code
    // from being compiled against React Native 0.86's New Architecture.
    'react-native-reanimated': {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
};
