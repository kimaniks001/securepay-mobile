import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../src/components/AppButton';
import { AppCard } from '../../src/components/AppCard';
import { FeeDoctrineCard } from '../../src/components/FeeDoctrineCard';
import { Input } from '../../src/components/Input';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { StepCard } from '../../src/components/StepCard';
import { securepayApi } from '../../src/api/securepayApi';
import type { GroupSecureLinkTier } from '../../src/api/types';
import { groupSecureLinkCreateJourney } from '../../src/doctrine/mobileJourneyMap';
import { feeDoctrine } from '../../src/doctrine/securepayDoctrine';
import { MOCK_KS_NUMBER } from '../../src/mocks/mockProfile';
import { colors, spacing, typography } from '../../src/theme';
import { formatCurrency } from '../../src/utils/format';
import { isValidAmount, sanitizeAmountInput } from '../../src/utils/validation';

const TOTAL_STEPS = groupSecureLinkCreateJourney.steps.length;

const tiers: { key: GroupSecureLinkTier; label: string; fee: string }[] = [
  { key: 'welfare', label: feeDoctrine.welfareGroupSecureLink.label, fee: feeDoctrine.welfareGroupSecureLink.description },
  { key: 'general', label: feeDoctrine.generalGroupSecureLink.label, fee: feeDoctrine.generalGroupSecureLink.description },
  { key: 'business_solution', label: feeDoctrine.businessSolutionContribution.label, fee: feeDoctrine.businessSolutionContribution.description },
];

export default function CreateGroupSecureLinkScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [tier, setTier] = useState<GroupSecureLinkTier>('welfare');
  const [approvers, setApprovers] = useState('2');
  const [minApprovals, setMinApprovals] = useState('2');
  const [memberCount, setMemberCount] = useState('10');
  const [submitting, setSubmitting] = useState(false);

  const current = groupSecureLinkCreateJourney.steps[step - 1];
  const selectedTier = tiers.find((t) => t.key === tier)!;

  const canContinue = useMemo(() => {
    if (step === 1) return Boolean(title.trim() && purpose.trim() && isValidAmount(amount));
    if (step === 4) return Boolean(approvers.trim() && minApprovals.trim());
    return true;
  }, [step, title, purpose, amount, approvers, minApprovals]);

  async function handleSaveDraft() {
    setSubmitting(true);
    try {
      const draft = await securepayApi.createGroupSecureLinkDraft({
        title: title.trim(),
        description: purpose.trim(),
        agreementControlledAmount: Number(amount),
        groupTier: tier,
        memberCount: Number(memberCount) || 1,
      });
      Alert.alert('Group draft saved (mock)', 'Saved through mock API adapter only.');
      router.replace(`/securelink/${draft.slug}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Create Group SecureLink" subtitle="Step-based group journey" />
        <SafeNotice message="Group SecureLink release and withdrawal controls remain backend-controlled and disabled in this mobile build." />

        <StepCard stepNumber={step} totalSteps={TOTAL_STEPS} title={current.label} description={current.explanation}>
          {step === 1 ? (
            <View style={styles.fields}>
              <Input label="Group title" value={title} onChangeText={setTitle} />
              <Input label="Purpose" value={purpose} onChangeText={setPurpose} multiline />
              <Input label="Agreement-controlled amount (KES)" value={amount} onChangeText={(v) => setAmount(sanitizeAmountInput(v))} keyboardType="decimal-pad" />
            </View>
          ) : null}

          {step === 2 ? (
            <View style={styles.tierList}>
              {tiers.map((item) => (
                <Pressable key={item.key} style={[styles.tier, tier === item.key && styles.tierSelected]} onPress={() => setTier(item.key)}>
                  <Text style={styles.tierLabel}>{item.label}</Text>
                  <Text style={styles.tierFee}>{item.fee}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {step === 3 ? (
            <Input label="Organizer KSNumber" value={MOCK_KS_NUMBER} editable={false} />
          ) : null}

          {step === 4 ? (
            <View style={styles.fields}>
              <Input label="Approvers (count)" value={approvers} onChangeText={setApprovers} keyboardType="number-pad" />
              <Input label="Minimum approvals" value={minApprovals} onChangeText={setMinApprovals} keyboardType="number-pad" />
              <Input label="Member count" value={memberCount} onChangeText={setMemberCount} keyboardType="number-pad" />
            </View>
          ) : null}

          {step === 5 ? <FeeDoctrineCard /> : null}

          {step === 6 ? (
            <AppCard muted>
              <SummaryRow label="Title" value={title} />
              <SummaryRow label="Category" value={selectedTier.label} />
              <SummaryRow label="Amount" value={formatCurrency(Number(amount) || 0)} />
              <SummaryRow label="Governance" value={`${minApprovals} of ${approvers} approvals`} />
              <Text style={styles.readinessNote}>Readiness note: no live collection claim in this build.</Text>
              <AppButton label={submitting ? 'Saving...' : 'Save Group SecureLink draft'} disabled={submitting} onPress={handleSaveDraft} />
            </AppCard>
          ) : null}
        </StepCard>

        <View style={styles.nav}>
          {step > 1 ? <AppButton label="Back" variant="secondary" onPress={() => setStep((s) => s - 1)} /> : null}
          {step < TOTAL_STEPS ? <AppButton label="Continue" disabled={!canContinue} onPress={() => setStep((s) => s + 1)} /> : null}
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
  content: { gap: spacing.lg, paddingVertical: spacing.lg, paddingBottom: spacing.xxl },
  fields: { gap: spacing.md },
  nav: { gap: spacing.sm },
  tierList: { gap: spacing.sm },
  tier: { borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: spacing.md, backgroundColor: colors.surface, gap: 2 },
  tierSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  tierLabel: { ...typography.label, color: colors.text },
  tierFee: { ...typography.caption, color: colors.textMuted },
  readinessNote: { ...typography.caption, color: colors.warning, lineHeight: 18 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  summaryLabel: { ...typography.caption, color: colors.textMuted },
  summaryValue: { ...typography.caption, color: colors.text, flexShrink: 1, textAlign: 'right' },
});
