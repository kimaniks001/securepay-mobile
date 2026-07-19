export const typography = {
  display: {
    fontSize: 36,
    fontWeight: '700' as const,
    letterSpacing: -1,
    lineHeight: 42,
  },
  title: {
    fontSize: 30,
    fontWeight: '700' as const,
    letterSpacing: -0.6,
    lineHeight: 36,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 28,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 19,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  overline: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.9,
    lineHeight: 14,
    textTransform: 'uppercase' as const,
  },
} as const;
