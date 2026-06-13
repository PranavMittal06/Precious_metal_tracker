import {Platform} from 'react-native';

const fontFamily = Platform.select({
  ios: {
    regular: 'SF Pro Display',
    medium: 'SF Pro Display',
    semiBold: 'SF Pro Display',
    bold: 'SF Pro Display',
    mono: 'SF Mono',
  },
  android: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    semiBold: 'Roboto-Medium',
    bold: 'Roboto-Bold',
    mono: 'RobotoMono-Regular',
  },
  default: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
    mono: 'System',
  },
});

export const Typography = {
  fontFamily,

  // Font Sizes
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
    '6xl': 48,
  },

  // Font Weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },
} as const;
