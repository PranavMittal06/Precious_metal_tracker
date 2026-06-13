import {MetalType} from './colors';

export const GradientPresets: Record<MetalType, string[]> = {
  gold: ['#FFD700', '#E6C200', '#B8960C'],
  silver: ['#E8E8E8', '#C0C0C0', '#808080'],
  platinum: ['#B8C0CC', '#8A9BB0', '#6B7280'],
  palladium: ['#9B88FF', '#7B68EE', '#4B3EAE'],
};

export const CardGradients: Record<MetalType, string[]> = {
  gold: ['rgba(255, 215, 0, 0.12)', 'rgba(184, 150, 12, 0.04)', 'rgba(10, 10, 15, 0)'],
  silver: ['rgba(192, 192, 192, 0.12)', 'rgba(128, 128, 128, 0.04)', 'rgba(10, 10, 15, 0)'],
  platinum: ['rgba(184, 192, 204, 0.12)', 'rgba(107, 114, 128, 0.04)', 'rgba(10, 10, 15, 0)'],
  palladium: ['rgba(155, 136, 255, 0.12)', 'rgba(75, 62, 174, 0.04)', 'rgba(10, 10, 15, 0)'],
};

export const BackgroundGradient = ['#0A0A0F', '#0F0F18', '#0A0A0F'];
