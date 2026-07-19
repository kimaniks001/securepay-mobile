export const colors = {
  background: '#0B1220',
  surface: '#141D2F',
  surfaceElevated: '#1C2740',
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  accent: '#10B981',
  accentMuted: '#059669',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  border: '#1E293B',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#22C55E',
  overlay: 'rgba(11, 18, 32, 0.85)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
} as const;
