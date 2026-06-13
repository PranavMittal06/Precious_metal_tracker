export const Colors = {
  // Background
  background: '#0A0A0F',
  surface: '#12121A',
  surfaceElevated: '#1A1A26',
  card: '#16161F',
  cardBorder: '#2A2A3A',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B8',
  textMuted: '#5A5A78',
  textInverse: '#0A0A0F',

  // Gold
  gold: '#FFD700',
  goldLight: '#FFE44D',
  goldDark: '#B8960C',
  goldGradientStart: '#FFD700',
  goldGradientEnd: '#B8960C',
  goldGlow: 'rgba(255, 215, 0, 0.25)',
  goldCardBg: 'rgba(255, 215, 0, 0.06)',

  // Silver
  silver: '#C0C0C0',
  silverLight: '#E8E8E8',
  silverDark: '#808080',
  silverGradientStart: '#E8E8E8',
  silverGradientEnd: '#808080',
  silverGlow: 'rgba(192, 192, 192, 0.25)',
  silverCardBg: 'rgba(192, 192, 192, 0.06)',

  // Platinum
  platinum: '#E5E4E2',
  platinumLight: '#F5F5F3',
  platinumDark: '#A8A8A6',
  platinumGradientStart: '#B8C0CC',
  platinumGradientEnd: '#6B7280',
  platinumGlow: 'rgba(229, 228, 226, 0.25)',
  platinumCardBg: 'rgba(229, 228, 226, 0.06)',

  // Palladium
  palladium: '#7B68EE',
  palladiumLight: '#9B88FF',
  palladiumDark: '#5B48CE',
  palladiumGradientStart: '#9B88FF',
  palladiumGradientEnd: '#4B3EAE',
  palladiumGlow: 'rgba(123, 104, 238, 0.25)',
  palladiumCardBg: 'rgba(123, 104, 238, 0.06)',

  // Status
  success: '#22C55E',
  successLight: 'rgba(34, 197, 94, 0.15)',
  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.15)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.15)',
  info: '#3B82F6',

  // UI
  divider: '#2A2A3A',
  overlay: 'rgba(0, 0, 0, 0.7)',
  shimmerBase: '#1A1A26',
  shimmerHighlight: '#2A2A3A',

  // Transparent
  transparent: 'transparent',
} as const;

export type MetalType = 'gold' | 'silver' | 'platinum' | 'palladium';

export const MetalColors: Record<MetalType, {
  primary: string;
  light: string;
  dark: string;
  gradientStart: string;
  gradientEnd: string;
  glow: string;
  cardBg: string;
}> = {
  gold: {
    primary: Colors.gold,
    light: Colors.goldLight,
    dark: Colors.goldDark,
    gradientStart: Colors.goldGradientStart,
    gradientEnd: Colors.goldGradientEnd,
    glow: Colors.goldGlow,
    cardBg: Colors.goldCardBg,
  },
  silver: {
    primary: Colors.silver,
    light: Colors.silverLight,
    dark: Colors.silverDark,
    gradientStart: Colors.silverGradientStart,
    gradientEnd: Colors.silverGradientEnd,
    glow: Colors.silverGlow,
    cardBg: Colors.silverCardBg,
  },
  platinum: {
    primary: Colors.platinum,
    light: Colors.platinumLight,
    dark: Colors.platinumDark,
    gradientStart: Colors.platinumGradientStart,
    gradientEnd: Colors.platinumGradientEnd,
    glow: Colors.platinumGlow,
    cardBg: Colors.platinumCardBg,
  },
  palladium: {
    primary: Colors.palladium,
    light: Colors.palladiumLight,
    dark: Colors.palladiumDark,
    gradientStart: Colors.palladiumGradientStart,
    gradientEnd: Colors.palladiumGradientEnd,
    glow: Colors.palladiumGlow,
    cardBg: Colors.palladiumCardBg,
  },
};
