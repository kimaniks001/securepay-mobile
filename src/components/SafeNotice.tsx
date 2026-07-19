import { StyleSheet, Text, View } from 'react-native';

import { SAFE_NOTICE_DEFAULT } from '../doctrine/securepayDoctrine';
import { colors, radius, spacing, typography } from '../theme';

type SafeNoticeProps = {
  message?: string;
  compact?: boolean;
};

export function SafeNotice({ message = SAFE_NOTICE_DEFAULT, compact = false }: SafeNoticeProps) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <View style={styles.iconRow}>
        <View style={styles.dot} />
        <Text style={styles.label}>Safety notice</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.accentLight,
    borderColor: `${colors.accent}33`,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  compact: {
    padding: spacing.sm,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  label: {
    ...typography.overline,
    color: colors.accent,
  },
  message: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
