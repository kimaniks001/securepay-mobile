import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Input } from '../../src/components/Input';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { securepayApi } from '../../src/api/securepayApi';
import { colors, spacing, typography } from '../../src/constants/theme';
import { isValidAmount, sanitizeAmountInput } from '../../src/utils/validation';

export default function CreateSecureLinkScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleCreateDraft() {
    if (!title.trim()) {
      Alert.alert('Title required', 'Add a SecureLink title.');
      return;
    }
    if (!isValidAmount(amount)) {
      Alert.alert('Amount required', 'Enter a valid agreement-controlled amount.');
      return;
    }

    setSubmitting(true);
    try {
      const draft = await securepayApi.createSecureLinkDraft({
        title: title.trim(),
        description: description.trim() || 'Agreement-backed SecureLink draft.',
        agreementControlledAmount: Number(amount),
      });
      Alert.alert(
        'Draft saved (mock)',
        'SecureLink draft saved locally through the mock API adapter. Backend submission is not live.',
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
        <Card title="Create SecureLink" subtitle="Draft only — no live payment">
          <Input label="Title" value={title} onChangeText={setTitle} placeholder="Agreement title" />
          <Input
            label="Agreement-controlled amount (KES)"
            value={amount}
            onChangeText={(value) => setAmount(sanitizeAmountInput(value))}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="What is this agreement for?"
            multiline
          />
          <Text style={styles.hint}>
            Drafts stay in mock mode. Provider confirmation and settlement readiness are backend-only.
          </Text>
          <Button
            label={submitting ? 'Saving draft...' : 'Save SecureLink draft'}
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
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
