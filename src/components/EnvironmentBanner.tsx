import { StyleSheet, Text, View } from 'react-native';

import { getEnvironmentBannerMessage, getEnvironmentLabel } from '../api/config';
import { colors, radius, spacing, typography } from '../theme';

type EnvironmentBannerProps = {
  compact?: boolean;
};

export function EnvironmentBanner({ compact = false }: EnvironmentBannerProps) {
  const label = getEnvironmentLabel();
  const message = getEnvironmentBannerMessage();

  const tone =
    label === 'Unsafe environment blocked'
      ? styles.blocked
      : label === 'Staging mode'
        ? styles.staging
        : label === 'Production disabled'
          ? styles.disabled
          : styles.mock;

  return (
    <View style={[styles.banner, tone, compact && styles.compact]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.xs,
  },
  compact: {
    paddingVertical: spacing.sm,
  },
  mock: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
  },
  staging: {
    backgroundColor: '#E8F5EE',
    borderColor: colors.primary,
  },
  disabled: {
    backgroundColor: '#FFF4E5',
    borderColor: colors.warning,
  },
  blocked: {
    backgroundColor: '#FDECEC',
    borderColor: colors.error,
  },
  label: {
    ...typography.overline,
    color: colors.text,
  },
  message: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
