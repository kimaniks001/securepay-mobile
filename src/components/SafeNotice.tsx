import { StyleSheet, Text, View } from 'react-native';

import { SAFE_NOTICE_DEFAULT } from '../doctrine/securepayDoctrine';
import { colors, radii, spacing, typography } from '../constants/theme';

type SafeNoticeProps = {
  message?: string;
  compact?: boolean;
};

export function SafeNotice({ message = SAFE_NOTICE_DEFAULT, compact = false }: SafeNoticeProps) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <Text style={styles.label}>Safety notice</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  compact: {
    padding: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  message: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
