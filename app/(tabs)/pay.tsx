import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Input } from '../../src/components/Input';
import { Screen } from '../../src/components/Screen';
import { colors, spacing, typography } from '../../src/constants/theme';
import { authenticateWithBiometrics } from '../../src/services/biometrics';
import { formatCurrency } from '../../src/utils/format';
import { isValidAmount, sanitizeAmountInput } from '../../src/utils/validation';

export default function PayScreen() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  async function handlePayment() {
    const nextErrors: { recipient?: string; amount?: string } = {};

    if (!recipient.trim()) {
      nextErrors.recipient = 'Recipient is required';
    }
    if (!isValidAmount(amount)) {
      nextErrors.amount = 'Enter a valid amount up to $1,000,000';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const confirmed = await authenticateWithBiometrics('Confirm payment');
    if (!confirmed) {
      Alert.alert('Authentication required', 'Confirm the payment with biometrics to continue.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Payment queued',
        `${formatCurrency(Number(amount))} to ${recipient.trim()} is pending backend integration.`,
      );
      setRecipient('');
      setAmount('');
      setNote('');
    }, 600);
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Send payment</Text>
          <Text style={styles.subtitle}>Transfers are protected with biometric confirmation.</Text>
        </View>

        <Card>
          <Input
            label="Recipient"
            placeholder="Name, phone, or account"
            value={recipient}
            onChangeText={setRecipient}
            error={errors.recipient}
          />
          <Input
            label="Amount"
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={(value) => setAmount(sanitizeAmountInput(value))}
            error={errors.amount}
          />
          <Input
            label="Note (optional)"
            placeholder="What is this for?"
            value={note}
            onChangeText={setNote}
          />
        </Card>

        <Card title="Security" subtitle="Phase 1 safeguards">
          <Text style={styles.securityItem}>• Biometric confirmation before sending</Text>
          <Text style={styles.securityItem}>• Amount validation and input sanitization</Text>
          <Text style={styles.securityItem}>• No card data stored on device in this phase</Text>
        </Card>

        <Button
          label={submitting ? 'Processing...' : 'Confirm Payment'}
          disabled={submitting}
          onPress={handlePayment}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.text,
    fontSize: 30,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  securityItem: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
