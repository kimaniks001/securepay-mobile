import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AgreementFlowCard } from '../../src/components/AgreementFlowCard';
import { AppButton } from '../../src/components/AppButton';
import { ApiStatePanel } from '../../src/components/ApiStatePanel';
import { AppCard } from '../../src/components/AppCard';
import { EnvironmentBanner } from '../../src/components/EnvironmentBanner';
import { MoneyStateCard } from '../../src/components/MoneyStateCard';
import { ReadinessPanel } from '../../src/components/ReadinessPanel';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { BRAND, safeMoneyStateLabels } from '../../src/doctrine/securepayDoctrine';
import { colors, spacing, typography } from '../../src/theme';
import { useAuth } from '../../src/hooks/useAuth';
import {
  useAccountReadiness,
  useKSNumberProfile,
  usePaymentReadyReadiness,
  useSecureLinks,
  useTransactionHistory,
} from '../../src/hooks/useSecurePayApi';
import { DEMO_AGREEMENT_READINESS_KES } from '../../src/mocks/mockTransactions';
import { formatCurrency, formatRelativeDate } from '../../src/utils/format';
import { MoneyStateStatusBadge } from '../../src/components/StatusBadge';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const profile = useKSNumberProfile();
  const links = useSecureLinks();
  const readiness = useAccountReadiness();
  const paymentReady = usePaymentReadyReadiness();
  const history = useTransactionHistory();

  const groupCount = links.data?.filter((l) => l.kind === 'group_securelink').length ?? 0;
  const secureLinkCount = links.data?.filter((l) => l.kind === 'securelink').length ?? 0;
  const recentActivity = history.data?.slice(0, 3) ?? [];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow={BRAND.siteName}
          title={`Hello, ${user?.name.split(' ')[0] ?? 'there'}`}
          subtitle={`${BRAND.coreLine} · demo / staging`}
        />

        <SafeNotice message="This mobile build does not confirm payments, release money, withdraw funds, or move money directly." />

        <EnvironmentBanner compact />

        <AppCard>
          <MoneyStateCard
            title="Demo balance / placeholder only"
            amount={DEMO_AGREEMENT_READINESS_KES}
            state="agreement_controlled"
            subtitle={safeMoneyStateLabels.agreementReadiness}
            placeholder
          />
          <Text style={styles.hint}>{safeMoneyStateLabels.noLiveMoney}</Text>
        </AppCard>

        <AppCard title="My KSNumber" subtitle="Identity placeholder">
          <ApiStatePanel loading={profile.loading} error={profile.error} onRetry={profile.retry}>
            <InfoRow label="KSNumber" value={profile.data?.ksNumber ?? user?.ksNumber ?? '—'} />
            <InfoRow label="Display name" value={profile.data?.displayName ?? user?.name ?? '—'} />
          </ApiStatePanel>
        </AppCard>

        <View style={styles.quickGrid}>
          <QuickTile
            label="SecureLinks"
            value={String(secureLinkCount)}
            onPress={() => router.push('/(tabs)/securelinks')}
          />
          <QuickTile
            label="Group SecureLinks"
            value={String(groupCount)}
            onPress={() => router.push('/(tabs)/securelinks')}
          />
        </View>

        <ApiStatePanel
          loading={readiness.loading || paymentReady.loading}
          error={readiness.error ?? paymentReady.error}
          onRetry={() => {
            void readiness.retry();
            void paymentReady.retry();
          }}
        >
          {readiness.data && paymentReady.data ? (
            <ReadinessPanel
              title="Readiness"
              subtitle="Readiness only — not payout"
              items={[
                {
                  label: 'Payment Ready readiness',
                  value: paymentReady.data.label,
                  state: paymentReady.data.status,
                  explanation: paymentReady.data.summary,
                },
                {
                  label: 'Account readiness',
                  value: readiness.data.label,
                  state: readiness.data.status,
                  explanation: readiness.data.summary,
                },
              ]}
            />
          ) : null}
        </ApiStatePanel>

        <AgreementFlowCard subtitle="Aligned with the public SecurePay site — mobile shows readiness only." />

        <View style={styles.actions}>
          <AppButton label="Create SecureLink" onPress={() => router.push('/securelink/create')} />
          <AppButton
            label="View all SecureLinks"
            variant="secondary"
            onPress={() => router.push('/(tabs)/securelinks')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          <ApiStatePanel
            loading={history.loading}
            error={history.error}
            empty={!history.data?.length}
            emptyMessage="No recent activity yet."
            onRetry={history.retry}
          >
            {recentActivity.map((item) => (
              <View key={item.id} style={styles.activityRow}>
                <View style={styles.activityMain}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activityMeta}>
                    {formatRelativeDate(item.createdAt)} · {item.activityDisplay}
                  </Text>
                </View>
                <View style={styles.activityAside}>
                  <Text style={styles.activityAmount}>
                    {formatCurrency(item.agreementControlledAmount, item.currency)}
                  </Text>
                  <MoneyStateStatusBadge state={item.moneyState} />
                </View>
              </View>
            ))}
          </ApiStatePanel>
        </View>
      </ScrollView>
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function QuickTile({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <AppCard style={styles.quickTile}>
      <Text style={styles.quickValue}>{value}</Text>
      <Text style={styles.quickLabel}>{label}</Text>
      <AppButton label="Open" variant="ghost" onPress={onPress} />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickTile: {
    flex: 1,
    alignItems: 'flex-start',
  },
  quickValue: {
    ...typography.title,
    color: colors.primary,
    fontSize: 28,
  },
  quickLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  actions: {
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  infoValue: {
    ...typography.caption,
    color: colors.text,
    flexShrink: 1,
    textAlign: 'right',
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
  },
  activityRow: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  activityMain: {
    flex: 1,
    gap: 4,
  },
  activityAside: {
    alignItems: 'flex-end',
    gap: spacing.xs,
    maxWidth: '46%',
  },
  activityTitle: {
    ...typography.label,
    color: colors.text,
  },
  activityMeta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  activityAmount: {
    ...typography.label,
    color: colors.text,
  },
});
