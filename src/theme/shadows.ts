import { Platform } from 'react-native';

export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#1C2B24',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.05,
      shadowRadius: 16,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }),
  soft: Platform.select({
    ios: {
      shadowColor: '#1C2B24',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 10,
    },
    android: {
      elevation: 1,
    },
    default: {},
  }),
  cta: Platform.select({
    ios: {
      shadowColor: '#E85D04',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
    },
    android: {
      elevation: 3,
    },
    default: {},
  }),
} as const;
