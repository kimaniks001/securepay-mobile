import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { AppButton } from '../../src/components/AppButton';
import { AppCard } from '../../src/components/AppCard';
import { FeeDoctrineCard } from '../../src/components/FeeDoctrineCard';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { disabledMoneyActions } from '../../src/doctrine/securepayDoctrine';
import { colors, spacing, typography } from '../../src/theme';

export default function CreateTabScreen() {
  const router = useRouter();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Create"
          subtitle="Start a SecureLink or Group SecureLink draft. Demo only — no live payment."
        />

        <SafeNotice />

        <AppCard title="SecureLink" subtitle="Agreement-backed payment request">
          <AppButton label="Create SecureLink" onPress={() => router.push('/securelink/create')} />
        </AppCard>

        <AppCard title="Group SecureLink" subtitle="Welfare, general, or business solution">
          <AppButton
            label="Create Group SecureLink"
            variant="accent"
            onPress={() => router.push('/securelink/create-group')}
          />
        </AppCard>

        <FeeDoctrineCard />

        <AppCard title="Disabled on mobile" subtitle="Backend-controlled money actions">
          {disabledMoneyActions.map((action) => (
            <Text key={action} style={styles.disabledItem}>
              • {action}
            </Text>
          ))}
        </AppCard>
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
  disabledItem: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
    textTransform: 'capitalize',
  },
});
