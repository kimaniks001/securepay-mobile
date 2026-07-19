import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { disabledMoneyActions } from '../../src/doctrine/securepayDoctrine';
import { colors, spacing, typography } from '../../src/constants/theme';

export default function PayScreen() {
  const router = useRouter();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>SecureLink actions</Text>
          <Text style={styles.subtitle}>
            Create or review SecureLink payment requests. This mobile build does not complete
            payments.
          </Text>
        </View>

        <SafeNotice message="This mobile build does not complete payments. Payment confirmation must come from SecurePay backend provider confirmation." />

        <Card title="Available actions" subtitle="Demo / staging only">
          <Button label="Create SecureLink" onPress={() => router.push('/securelink/create')} />
          <Button
            label="Create Group SecureLink"
            variant="secondary"
            onPress={() => router.push('/securelink/create-group')}
          />
          <Button
            label="Browse SecureLinks"
            variant="ghost"
            onPress={() => router.push('/(tabs)/securelinks')}
          />
        </Card>

        <Card title="Disabled on mobile" subtitle="Backend-only money actions">
          {disabledMoneyActions.map((action) => (
            <Text key={action} style={styles.disabledItem}>
              • {action}
            </Text>
          ))}
        </Card>

        <Card title="Payment request" subtitle="Placeholder form">
          <Text style={styles.placeholderCopy}>
            Use Create SecureLink to draft an agreement-backed request. The mobile app saves drafts
            locally through the mock API adapter only. Provider confirmation, settlement readiness,
            and release conditions are handled by the SecurePay API Gateway — not this phone.
          </Text>
        </Card>
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
    lineHeight: 22,
  },
  disabledItem: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
    textTransform: 'capitalize',
  },
  placeholderCopy: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
