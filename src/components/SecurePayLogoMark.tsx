import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

type SecurePayLogoMarkProps = {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
};

const sizes = {
  sm: 36,
  md: 48,
  lg: 64,
} as const;

export function SecurePayLogoMark({ size = 'md', showWordmark = true }: SecurePayLogoMarkProps) {
  const dimension = sizes[size];

  return (
    <View style={styles.container}>
      <View style={[styles.mark, { width: dimension, height: dimension, borderRadius: dimension / 4 }]}>
        <Text style={[styles.markText, { fontSize: dimension * 0.34 }]}>SP</Text>
      </View>
      {showWordmark ? (
        <View>
          <Text style={styles.wordmark}>SecurePay</Text>
          <Text style={styles.byline}>by Keyman</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  mark: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  wordmark: {
    ...typography.heading,
    color: colors.text,
  },
  byline: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
