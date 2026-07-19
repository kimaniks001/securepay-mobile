import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../src/components/Button';
import { Screen } from '../src/components/Screen';
import { BRAND, STAGING_DEMO_WARNING } from '../src/doctrine/securepayDoctrine';
import { colors, spacing, typography } from '../src/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <Screen style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Phase 2 · Demo</Text>
        </View>
        <Text style={styles.brandLine}>{BRAND.byline}</Text>
        <Text style={styles.title}>{BRAND.name}</Text>
        <Text style={styles.coreLine}>{BRAND.coreLine}</Text>
        <Text style={styles.subtitle}>
          Agreement-backed SecureLinks for Kenyan groups and businesses. Quiet trust, mobile-first,
          with backend as the source of truth.
        </Text>
        <Text style={styles.demoWarning}>{STAGING_DEMO_WARNING}</Text>
      </View>

      <View style={styles.features}>
        <FeatureItem title="SecureLink" detail="Create agreement-backed payment requests safely" />
        <FeatureItem title="Group SecureLink" detail="Welfare, general, and business group flows" />
        <FeatureItem title="Provider-confirmed" detail="Money state comes from SecurePay backend only" />
      </View>

      <View style={styles.actions}>
        <Button label="Get Started" onPress={() => router.push('/login')} />
        <Button label="View SecureLinks" variant="secondary" onPress={() => router.push('/login')} />
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
  brandLine: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    ...typography.title,
    color: colors.text,
    fontSize: 40,
  },
  coreLine: {
    ...typography.heading,
    color: colors.primary,
    fontSize: 18,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  demoWarning: {
    ...typography.caption,
    color: colors.warning,
    lineHeight: 18,
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
