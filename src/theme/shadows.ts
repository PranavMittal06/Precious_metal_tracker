import {Platform} from 'react-native';

export const createShadow = (color: string, elevation: number = 8) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: color,
      shadowOffset: {width: 0, height: elevation / 2},
      shadowOpacity: 0.4,
      shadowRadius: elevation,
    };
  }
  return {
    elevation,
    shadowColor: color,
  };
};

export const Shadows = {
  card: (color: string) => createShadow(color, 12),
  glow: (color: string) => createShadow(color, 20),
  subtle: (color: string) => createShadow(color, 6),
} as const;
