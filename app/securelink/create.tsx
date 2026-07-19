import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../src/components/AppButton';
import { AppCard } from '../../src/components/AppCard';
import { Input } from '../../src/components/Input';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { StepCard } from '../../src/components/StepCard';
import { securepayApi } from '../../src/api/securepayApi';
import { secureLinkCreateJourney } from '../../src/doctrine/mobileJourneyMap';
import { MOCK_KS_NUMBER } from '../../src/mocks/mockProfile';
import { colors, spacing, typography } from '../../src/theme';
import { formatCurrency } from '../../src/utils/format';
import { isValidAmount, sanitizeAmountInput } from '../../src/utils/validation';

const TOTAL_STEPS = secureLinkCreateJourney.steps.length;

export default function CreateSecureLinkScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [otherParty, setOtherParty] = useState('');
  const [releaseCondition, setReleaseCondition] = useState('');
  const [evidenceRequired, setEvidenceRequired] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const current = secureLinkCreateJourney.steps[step - 1];

  const canContinue = useMemo(() => {
    if (step === 1) return Boolean(title.trim() && purpose.trim() && isValidAmount(amount));
    if (step === 2) return Boolean(otherParty.trim());
    if (step === 3) return Boolean(releaseCondition.trim());
    return true;
  }, [step, title, purpose, amount, otherParty, releaseCondition]);

  async function handleSaveDraft() {
    setSubmitting(true);
    try {
      const draft = await securepayApi.createSecureLinkDraft({
        title: title.trim(),
        description: purpose.trim(),
        agreementControlledAmount: Number(amount),
      });
      Alert.alert('Draft saved (mock)', 'SecureLink draft saved through mock API only.');
      router.replace(`/securelink/${draft.slug}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Create SecureLink" subtitle="Step-based journey aligned with SecurePay web" />
        <SafeNotice compact />

        <StepCard
          stepNumber={step}
          totalSteps={TOTAL_STEPS}
          title={current.label}
          description={current.explanation}
        >
          {step === 1 ? (
            <View style={styles.fields}>
              <Input label="Agreement title" value={title} onChangeText={setTitle} />
              <Input label="Purpose" value={purpose} onChangeText={setPurpose} multiline />
              <Input
                label="Agreement-controlled amount (KES)"
                value={amount}
                onChangeText={(v) => setAmount(sanitizeAmountInput(v))}
                keyboardType="decimal-pad"
              />
            </View>
          ) : null}

          {step === 2 ? (
            <View style={styles.fields}>
              <Input label="Creator KSNumber" value={MOCK_KS_NUMBER} editable={false} />
              <Input
                label="Other party / recipient KSNumber"
                value={otherParty}
                onChangeText={setOtherParty}
                placeholder="KS-XXXX-XXXX"
              />
            </View>
          ) : null}

          {step === 3 ? (
            <View style={styles.fields}>
              <Input label="Release condition" value={releaseCondition} onChangeText={setReleaseCondition} multiline />
              <Input label="Evidence required" value={evidenceRequired} onChangeText={setEvidenceRequired} />
              <Input label="Deadline (placeholder)" value={deadline} onChangeText={setDeadline} />
            </View>
          ) : null}

          {step === 4 ? (
            <AppCard muted>
              <SummaryRow label="Title" value={title} />
              <SummaryRow label="Purpose" value={purpose} />
              <SummaryRow label="Amount" value={formatCurrency(Number(amount) || 0)} />
              <SummaryRow label="Creator" value={MOCK_KS_NUMBER} />
              <SummaryRow label="Other party" value={otherParty} />
              <Text style={styles.draftBadge}>Draft only — Phase 2B</Text>
            </AppCard>
          ) : null}

          {step === 5 ? (
            <AppCard muted>
              <Text style={styles.body}>
                Share is disabled in demo mode. Backend submission through SecurePay API Gateway
                comes in a later phase.
              </Text>
              <AppButton
                label={submitting ? 'Saving draft...' : 'Save SecureLink draft'}
                disabled={submitting}
                onPress={handleSaveDraft}
              />
            </AppCard>
          ) : null}
        </StepCard>

        <View style={styles.nav}>
          {step > 1 ? (
            <AppButton label="Back" variant="secondary" onPress={() => setStep((s) => s - 1)} />
          ) : null}
          {step < TOTAL_STEPS ? (
            <AppButton
              label="Continue"
              disabled={!canContinue}
              onPress={() => setStep((s) => s + 1)}
            />
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  fields: {
    gap: spacing.md,
  },
  nav: {
    gap: spacing.sm,
  },
  body: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  draftBadge: {
    ...typography.overline,
    color: colors.accent,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  summaryValue: {
    ...typography.caption,
    color: colors.text,
    flexShrink: 1,
    textAlign: 'right',
  },
});
