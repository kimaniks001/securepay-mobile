import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../src/components/Button';
import { Screen } from '../src/components/Screen';
import { colors, spacing, typography } from '../src/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <Screen style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Phase 1</Text>
        </View>
        <Text style={styles.title}>SecurePay</Text>
        <Text style={styles.subtitle}>
          Send money securely with biometric protection, encrypted storage, and a modern mobile
          experience.
        </Text>
      </View>

      <View style={styles.features}>
        <FeatureItem title="Bank-grade security" detail="Tokens stored in the device keychain" />
        <FeatureItem title="Fast transfers" detail="Pay people and businesses in seconds" />
        <FeatureItem title="Full visibility" detail="Track every transaction in one place" />
      </View>

      <View style={styles.actions}>
        <Button label="Get Started" onPress={() => router.push('/login')} />
        <Button
          label="Learn More"
          variant="ghost"
          onPress={() => router.push('/login')}
        />
      </View>
    </Screen>
  );
}

function FeatureItem({ title, detail }: { title: string; detail: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureDot} />
      <View style={styles.featureCopy}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDetail}>{detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
  },
  hero: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
  },
  title: {
    ...typography.title,
    color: colors.text,
    fontSize: 40,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  features: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  featureDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
    marginTop: 6,
  },
  featureCopy: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    ...typography.heading,
    color: colors.text,
    fontSize: 16,
  },
  featureDetail: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  actions: {
    gap: spacing.sm,
  },
});
