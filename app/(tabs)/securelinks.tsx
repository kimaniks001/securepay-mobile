import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../src/components/AppButton';
import { ApiStatePanel } from '../../src/components/ApiStatePanel';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { MoneyStateStatusBadge } from '../../src/components/StatusBadge';
import { colors, spacing, typography } from '../../src/theme';
import { useSecureLinks } from '../../src/hooks/useSecurePayApi';
import { formatCurrency } from '../../src/utils/format';
import { getMoneyStateLabel } from '../../src/utils/moneyState';

export default function SecureLinksScreen() {
  const router = useRouter();
  const links = useSecureLinks();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="SecureLinks"
          subtitle="Agreement-backed links with provider confirmation and readiness states."
        />

        <SafeNotice compact />

        <View style={styles.actions}>
          <AppButton label="Create SecureLink" onPress={() => router.push('/securelink/create')} />
          <AppButton
            label="Create Group SecureLink"
            variant="secondary"
            onPress={() => router.push('/securelink/create-group')}
          />
        </View>

        {links.loading || links.error || !links.data?.length ? (
          <ApiStatePanel
            loading={links.loading}
            error={links.error}
            empty={!links.loading && !links.error && !links.data?.length}
            emptyMessage="No SecureLinks yet. Create a draft to get started."
            onRetry={links.retry}
          />
        ) : (
          links.data.map((link) => (
            <Pressable
              key={link.id}
              style={styles.row}
              onPress={() => router.push(`/securelink/${link.slug}`)}
            >
              <View style={styles.rowMain}>
                <Text style={styles.kind}>
                  {link.kind === 'group_securelink' ? 'Group SecureLink' : 'SecureLink'}
                </Text>
                <Text style={styles.name}>{link.title}</Text>
                <Text style={styles.meta}>
                  {link.moneyStateLabel}
                  {link.feeKes ? ` · KES ${link.feeKes} fee` : ''}
                </Text>
                {link.reviewHold === 'active' ? (
                  <Text style={styles.reviewHold}>Review hold active</Text>
                ) : null}
              </View>
              <View style={styles.rowAside}>
                <Text style={styles.amount}>
                  {formatCurrency(link.agreementControlledAmount, link.currency)}
                </Text>
                <MoneyStateStatusBadge
                  state={link.moneyState}
                  explanation={getMoneyStateLabel(link.moneyState)}
                />
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  actions: {
    gap: spacing.sm,
  },
  row: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowMain: {
    flex: 1,
    gap: 4,
  },
  rowAside: {
    alignItems: 'flex-end',
    gap: spacing.xs,
    maxWidth: '48%',
  },
  kind: {
    ...typography.overline,
    color: colors.primary,
  },
  name: {
    ...typography.label,
    color: colors.text,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 16,
  },
  reviewHold: {
    ...typography.caption,
    color: colors.reviewHold,
    fontWeight: '600',
  },
  amount: {
    ...typography.label,
    color: colors.text,
  },
});
