import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../src/components/AppButton';
import { AppCard } from '../../src/components/AppCard';
import { ReadinessPanel } from '../../src/components/ReadinessPanel';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { MoneyStateStatusBadge } from '../../src/components/StatusBadge';
import { securepayApi } from '../../src/api/securepayApi';
import type { GroupSecureLinkDetail, SecureLinkDetail } from '../../src/api/types';
import { MOCK_KS_NUMBER } from '../../src/mocks/mockProfile';
import { colors, spacing, typography } from '../../src/theme';
import { formatCurrency } from '../../src/utils/format';
import { getMoneyStateLabel } from '../../src/utils/moneyState';

export default function SecureLinkDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const [detail, setDetail] = useState<SecureLinkDetail | GroupSecureLinkDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!slug) return;
      const result = await securepayApi.getSecureLinkBySlug(slug);
      if (mounted) {
        setDetail(result);
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [slug]);

  if (loading) {
    return <Screen loading><ActivityIndicator color={colors.primary} /></Screen>;
  }

  if (!detail) {
    return (
      <Screen>
        <Text style={styles.missing}>SecureLink not found in mock data.</Text>
        <AppButton label="Back to SecureLinks" onPress={() => router.back()} />
      </Screen>
    );
  }

  const groupDetail = detail.kind === 'group_securelink' ? (detail as GroupSecureLinkDetail) : null;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <SafeNotice compact />

        <AppCard title="Agreement summary" subtitle={detail.title}>
          <InfoRow label="Type" value={detail.kind === 'group_securelink' ? 'Group SecureLink' : 'SecureLink'} />
          <InfoRow label="Amount" value={formatCurrency(detail.agreementControlledAmount, detail.currency)} />
          <MoneyStateStatusBadge state={detail.moneyState} explanation={detail.moneyStateLabel} />
        </AppCard>

        <AppCard title="Parties / KSNumbers">
          <InfoRow label="Creator KSNumber" value={MOCK_KS_NUMBER} />
          <InfoRow label="Other party" value="Placeholder — backend assigns" />
        </AppCard>

        <AppCard title="Provider confirmation status">
          <InfoRow
            label="Status"
            value={detail.moneyState === 'provider_confirmed' ? 'Provider-confirmed' : 'Provider confirmation pending'}
          />
          {detail.providerConfirmedAt ? (
            <InfoRow label="Confirmed at" value={new Date(detail.providerConfirmedAt).toLocaleString()} />
          ) : null}
          <Text style={styles.note}>Mobile does not confirm provider status.</Text>
        </AppCard>

        <AppCard title="Evidence" subtitle="Placeholder">
          <Text style={styles.body}>Agreement evidence is stored and verified on the SecurePay backend.</Text>
        </AppCard>

        <AppCard title="Agreement conditions">
          {detail.releaseConditions.map((c) => (
            <Text key={c} style={styles.bullet}>• {c}</Text>
          ))}
        </AppCard>

        <ReadinessPanel
          title="Readiness"
          subtitle="Readiness only — not payout"
          items={[
            {
              label: 'Payment Ready readiness',
              value: detail.paymentReadyReadiness.label,
              state: detail.paymentReadyReadiness.status,
              explanation: detail.paymentReadyReadiness.summary,
            },
            {
              label: 'Review hold',
              value: detail.reviewHold === 'active' ? 'Review hold active' : 'No review hold',
              state: detail.reviewHold === 'active' ? 'review_hold' : 'not_ready',
            },
            {
              label: 'Settlement readiness',
              value: getMoneyStateLabel(
                detail.settlementReadiness === 'not_ready'
                  ? 'settlement_readiness_pending'
                  : detail.settlementReadiness,
              ),
            },
          ]}
        />

        {groupDetail ? (
          <AppCard title="Group SecureLink" subtitle={`${groupDetail.memberCount} members`}>
            <InfoRow label="Tier" value={groupDetail.groupTier.replaceAll('_', ' ')} />
            <InfoRow label="Contributions" value={`${groupDetail.contributionSummary.recordedContributions} / ${groupDetail.contributionSummary.expectedContributions}`} />
            <InfoRow label="Fee per contribution" value={`KES ${groupDetail.contributionSummary.feePerContributionKes}`} />
          </AppCard>
        ) : null}

        <AppCard title="Activity" subtitle="Recent safe labels only">
          <Text style={styles.body}>View full timeline in Activity tab. No release or withdrawal actions here.</Text>
          <AppButton label="Open Activity" variant="secondary" onPress={() => router.push('/(tabs)/history')} />
        </AppCard>
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

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingVertical: spacing.lg, paddingBottom: spacing.xxl },
  missing: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },
  body: { ...typography.caption, color: colors.textSecondary, lineHeight: 20 },
  note: { ...typography.caption, color: colors.warning, lineHeight: 16 },
  bullet: { ...typography.caption, color: colors.textSecondary, lineHeight: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, paddingVertical: spacing.xs },
  infoLabel: { ...typography.caption, color: colors.textMuted, flex: 1 },
  infoValue: { ...typography.caption, color: colors.text, flex: 1, textAlign: 'right', textTransform: 'capitalize' },
});
