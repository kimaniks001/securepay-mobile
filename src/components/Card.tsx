import { StyleSheet, Text, View, type ViewProps } from 'react-native';

import { colors, radii, spacing, typography } from '../constants/theme';

type CardProps = ViewProps & {
  title?: string;
  subtitle?: string;
};

export function Card({ title, subtitle, children, style, ...props }: CardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
