import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { securepayApi } from '../../src/api/securepayApi';
import type { GroupSecureLinkDetail, SecureLinkDetail } from '../../src/api/types';
import { colors, spacing, typography } from '../../src/constants/theme';
import { formatCurrency } from '../../src/utils/format';
import { getMoneyStateColor } from '../../src/utils/moneyState';

export default function SecureLinkDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const [detail, setDetail] = useState<SecureLinkDetail | GroupSecureLinkDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!slug) {
        return;
      }
      const result = await securepayApi.getSecureLinkBySlug(slug);
      if (mounted) {
        setDetail(result);
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <Screen loading>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  if (!detail) {
    return (
      <Screen>
        <Text style={styles.missing}>SecureLink not found in mock data.</Text>
        <Button label="Back to SecureLinks" onPress={() => router.back()} />
      </Screen>
    );
  }

  const isGroup = detail.kind === 'group_securelink';
  const groupDetail = isGroup ? (detail as GroupSecureLinkDetail) : null;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <SafeNotice compact />
        <Card title={detail.title} subtitle={detail.moneyStateLabel}>
          <InfoRow
            label="Agreement-controlled amount"
            value={formatCurrency(detail.agreementControlledAmount, detail.currency)}
          />
          <InfoRow label="Money state" value={detail.moneyState.replaceAll('_', ' ')} />
          <InfoRow
            label="Settlement readiness"
            value={detail.settlementReadiness.replaceAll('_', ' ')}
          />
          <InfoRow label="Review hold" value={detail.reviewHold.replaceAll('_', ' ')} />
          {detail.feeKes ? <InfoRow label="Contribution fee" value={`KES ${detail.feeKes}`} /> : null}
        </Card>

        <Card title="Description">
          <Text style={styles.body}>{detail.description}</Text>
        </Card>

        {groupDetail ? (
          <Card title="Group SecureLink" subtitle={`${groupDetail.memberCount} members`}>
            <InfoRow label="Tier" value={groupDetail.groupTier.replaceAll('_', ' ')} />
            <InfoRow
              label="Recorded contributions"
              value={`${groupDetail.contributionSummary.recordedContributions} / ${groupDetail.contributionSummary.expectedContributions}`}
            />
            <InfoRow
              label="Fee per contribution"
              value={`KES ${groupDetail.contributionSummary.feePerContributionKes}`}
            />
          </Card>
        ) : null}

        <Card title="Release conditions">
          {detail.releaseConditions.map((condition) => (
            <Text key={condition} style={styles.bullet}>
              • {condition}
            </Text>
          ))}
        </Card>

        <Card title="Payment Ready readiness">
          <Text style={[styles.state, { color: getMoneyStateColor(detail.paymentReadyReadiness.status) }]}>
            {detail.paymentReadyReadiness.summary}
          </Text>
          <Button
            label="Open Payment Ready detail"
            variant="secondary"
            onPress={() => router.push('/readiness/payment-ready')}
          />
        </Card>
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
  content: {
    gap: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  missing: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  bullet: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  state: {
    ...typography.caption,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textMuted,
    flex: 1,
  },
  infoValue: {
    ...typography.caption,
    color: colors.text,
    flex: 1,
    textAlign: 'right',
    textTransform: 'capitalize',
  },
});
