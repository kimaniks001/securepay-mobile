import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ApiStatePanel } from '../../src/components/ApiStatePanel';
import { AppButton } from '../../src/components/AppButton';
import { AppCard } from '../../src/components/AppCard';
import { FeeDoctrineCard } from '../../src/components/FeeDoctrineCard';
import { ReadinessPanel } from '../../src/components/ReadinessPanel';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { MoneyStateStatusBadge } from '../../src/components/StatusBadge';
import { securepayApi } from '../../src/api/securepayApi';
import type { GroupSecureLinkDetail, SecureLinkDetail } from '../../src/api/types';
import { safeMoneyStateLabels } from '../../src/doctrine/securepayDoctrine';
import { colors, spacing, typography } from '../../src/theme';
import { formatCurrency } from '../../src/utils/format';
import { getMoneyStateLabel } from '../../src/utils/moneyState';

export default function SecureLinkDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const [detail, setDetail] = useState<SecureLinkDetail | GroupSecureLinkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const result = await securepayApi.getSecureLinkBySlug(slug);
      setDetail(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load SecureLink detail.');
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  if (!loading && !error && !detail) {
    return (
      <Screen>
        <Text style={styles.missing}>SecureLink not found.</Text>
        <AppButton label="Back to SecureLinks" onPress={() => router.back()} />
      </Screen>
    );
  }

  const groupDetail = detail?.kind === 'group_securelink' ? (detail as GroupSecureLinkDetail) : null;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <SafeNotice compact />

        <ApiStatePanel loading={loading} error={error} onRetry={loadDetail}>
          {detail ? (
            <>
              <AppCard title="Agreement summary" subtitle={detail.title}>
                <InfoRow label="Type" value={detail.kind === 'group_securelink' ? 'Group SecureLink' : 'SecureLink'} />
                <InfoRow label="Agreement status" value={detail.moneyStateLabel} />
                <InfoRow label="Amount" value={formatCurrency(detail.agreementControlledAmount, detail.currency)} />
                <MoneyStateStatusBadge state={detail.moneyState} explanation={detail.moneyStateLabel} />
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

              <AppCard title="Agreement conditions">
                {detail.releaseConditions.length ? (
                  detail.releaseConditions.map((c) => (
                    <Text key={c} style={styles.bullet}>• {c}</Text>
                  ))
                ) : (
                  <Text style={styles.body}>Agreement conditions will appear when returned by the API Gateway.</Text>
                )}
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
                  {
                    label: safeMoneyStateLabels.ledgerReadinessPending,
                    value: 'Backend-controlled — not posted from mobile',
                    state: 'not_ready',
                  },
                ]}
              />

              {groupDetail ? (
                <>
                  <AppCard title="Group SecureLink" subtitle={`${groupDetail.memberCount} members`}>
                    <InfoRow label="Tier" value={groupDetail.groupTier.replaceAll('_', ' ')} />
                    <InfoRow
                      label="Contributions"
                      value={`${groupDetail.contributionSummary.recordedContributions} / ${groupDetail.contributionSummary.expectedContributions}`}
                    />
                    <InfoRow
                      label="Fee per contribution"
                      value={`KES ${groupDetail.contributionSummary.feePerContributionKes}`}
                    />
                  </AppCard>
              <FeeDoctrineCard />
                </>
              ) : null}

              <AppCard title="Activity" subtitle="Recent safe labels only">
                <Text style={styles.body}>
                  View full timeline in Activity tab. No release or withdrawal actions here.
                </Text>
                <AppButton label="Open Activity" variant="secondary" onPress={() => router.push('/(tabs)/history')} />
              </AppCard>
            </>
          ) : null}
        </ApiStatePanel>
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
