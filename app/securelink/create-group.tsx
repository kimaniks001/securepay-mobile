import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Input } from '../../src/components/Input';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { securepayApi } from '../../src/api/securepayApi';
import type { GroupSecureLinkTier } from '../../src/api/types';
import { feeDoctrine } from '../../src/doctrine/securepayDoctrine';
import { colors, spacing, typography } from '../../src/constants/theme';
import { isValidAmount, sanitizeAmountInput } from '../../src/utils/validation';

const tiers: { key: GroupSecureLinkTier; label: string; fee: string }[] = [
  {
    key: 'welfare',
    label: feeDoctrine.welfareGroupSecureLink.label,
    fee: feeDoctrine.welfareGroupSecureLink.description,
  },
  {
    key: 'general',
    label: feeDoctrine.generalGroupSecureLink.label,
    fee: feeDoctrine.generalGroupSecureLink.description,
  },
  {
    key: 'business_solution',
    label: feeDoctrine.businessSolutionContribution.label,
    fee: feeDoctrine.businessSolutionContribution.description,
  },
];

export default function CreateGroupSecureLinkScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [memberCount, setMemberCount] = useState('10');
  const [tier, setTier] = useState<GroupSecureLinkTier>('welfare');
  const [submitting, setSubmitting] = useState(false);

  async function handleCreateDraft() {
    if (!title.trim()) {
      Alert.alert('Title required', 'Add a Group SecureLink title.');
      return;
    }
    if (!isValidAmount(amount)) {
      Alert.alert('Amount required', 'Enter a valid agreement-controlled amount.');
      return;
    }

    setSubmitting(true);
    try {
      const draft = await securepayApi.createGroupSecureLinkDraft({
        title: title.trim(),
        description: description.trim() || 'Group SecureLink draft.',
        agreementControlledAmount: Number(amount),
        groupTier: tier,
        memberCount: Number(memberCount) || 1,
      });
      Alert.alert(
        'Group draft saved (mock)',
        'Group SecureLink draft saved through the mock API adapter only.',
      );
      router.replace(`/securelink/${draft.slug}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <SafeNotice />
        <Card title="Create Group SecureLink" subtitle="Draft only — fee doctrine applies">
          <Text style={styles.sectionLabel}>Group tier</Text>
          <View style={styles.tierList}>
            {tiers.map((item) => (
              <Pressable
                key={item.key}
                style={[styles.tierOption, tier === item.key && styles.tierSelected]}
                onPress={() => setTier(item.key)}
              >
                <Text style={styles.tierLabel}>{item.label}</Text>
                <Text style={styles.tierFee}>{item.fee}</Text>
              </Pressable>
            ))}
          </View>
          <Input label="Title" value={title} onChangeText={setTitle} placeholder="Group agreement title" />
          <Input
            label="Agreement-controlled amount (KES)"
            value={amount}
            onChangeText={(value) => setAmount(sanitizeAmountInput(value))}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
          <Input
            label="Member count"
            value={memberCount}
            onChangeText={setMemberCount}
            keyboardType="number-pad"
          />
          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="What is this group agreement for?"
            multiline
          />
          <Button
            label={submitting ? 'Saving draft...' : 'Save Group SecureLink draft'}
            disabled={submitting}
            onPress={handleCreateDraft}
          />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  tierList: {
    gap: spacing.sm,
  },
  tierOption: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    backgroundColor: colors.surface,
    gap: 2,
  },
  tierSelected: {
    borderColor: colors.primary,
  },
  tierLabel: {
    ...typography.label,
    color: colors.text,
  },
  tierFee: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
