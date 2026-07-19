import { StyleSheet, Text, View } from 'react-native';

import { BRAND } from '../doctrine/securepayDoctrine';
import { colors, spacing, typography } from '../theme';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  showBrand?: boolean;
};

export function ScreenHeader({ title, subtitle, eyebrow, showBrand = false }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      {showBrand ? <Text style={styles.brand}>{BRAND.byline}</Text> : null}
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  brand: {
    ...typography.overline,
    color: colors.primary,
  },
  eyebrow: {
    ...typography.overline,
    color: colors.textMuted,
  },
  title: {
    ...typography.title,
    color: colors.text,
    fontSize: 30,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
