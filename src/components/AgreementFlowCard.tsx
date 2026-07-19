import { StyleSheet, Text, View } from 'react-native';

import { publicAgreementSteps } from '../doctrine/publicSiteReference';
import { colors, radius, spacing, typography } from '../theme';
import { AppCard } from './AppCard';

type AgreementFlowCardProps = {
  title?: string;
  subtitle?: string;
};

export function AgreementFlowCard({
  title = 'How SecurePay helps money follow the agreement',
  subtitle = 'Four steps. Clear every time — readiness on mobile, backend confirms.',
}: AgreementFlowCardProps) {
  return (
    <AppCard title={title} subtitle={subtitle}>
      {publicAgreementSteps.map((step, index) => (
        <View key={step.id} style={styles.row}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</Text>
          </View>
          <View style={styles.copy}>
            <Text style={styles.stepLabel}>{step.label}</Text>
            <Text style={styles.stepDetail}>{step.detail}</Text>
          </View>
        </View>
      ))}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  stepBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  stepLabel: {
    ...typography.label,
    color: colors.text,
  },
  stepDetail: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
