import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppButton } from './AppButton';
import { colors, spacing, typography } from '../theme';

type ApiStatePanelProps = {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  children?: React.ReactNode;
};

export function ApiStatePanel({
  loading,
  error,
  empty,
  emptyMessage = 'No records to show yet.',
  onRetry,
  children,
}: ApiStatePanelProps) {
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.panel}>
        <Text style={styles.errorTitle}>Unable to load data</Text>
        <Text style={styles.errorBody}>{error}</Text>
        {onRetry ? <AppButton label="Try again" variant="secondary" onPress={onRetry} /> : null}
      </View>
    );
  }

  if (empty) {
    return (
      <View style={styles.panel}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  centered: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  panel: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  errorTitle: {
    ...typography.label,
    color: colors.error,
  },
  errorBody: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
