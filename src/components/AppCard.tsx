import { StyleSheet, Text, View, type ViewProps } from 'react-native';

import { colors, radius, shadows, spacing, typography } from '../theme';

type AppCardProps = ViewProps & {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  muted?: boolean;
};

export function AppCard({ title, subtitle, children, muted = false, style, ...props }: AppCardProps) {
  return (
    <View
      style={[styles.card, muted && styles.muted, shadows.card, style]}
      {...props}
    >
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  muted: {
    backgroundColor: colors.surfaceMuted,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
