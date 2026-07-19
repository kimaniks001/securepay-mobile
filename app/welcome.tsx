import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { AppCard } from '../src/components/AppCard';
import { Screen } from '../src/components/Screen';
import { SecurePayLogoMark } from '../src/components/SecurePayLogoMark';
import { BRAND, STAGING_DEMO_WARNING } from '../src/doctrine/securepayDoctrine';
import { colors, spacing, typography } from '../src/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SecurePayLogoMark size="lg" />
        <View style={styles.hero}>
          <Text style={styles.brandLine}>{BRAND.byline}</Text>
          <Text style={styles.coreLine}>{BRAND.coreLine}</Text>
          <Text style={styles.tagline}>Trade freely. Fairness built in.</Text>
          <Text style={styles.subtitle}>
            Agreement-backed payments for everyday trust. SecurePay in your pocket — quiet, simple,
            and Kenyan.
          </Text>
          <Text style={styles.demoWarning}>{STAGING_DEMO_WARNING}</Text>
        </View>

        <AppCard muted>
          <FeatureItem title="SecureLink" detail="Agreement-backed requests with safe status labels" />
          <FeatureItem title="Group SecureLink" detail="Welfare, general, and business group flows" />
          <FeatureItem title="Provider-confirmed" detail="Money state from SecurePay backend only" />
        </AppCard>

        <View style={styles.actions}>
          <AppButton label="Continue in demo mode" onPress={() => router.push('/login')} />
          <AppButton
            label="View SecureLinks"
            variant="secondary"
            onPress={() => router.push('/login')}
          />
          <AppButton
            label="Learn how SecurePay works"
            variant="ghost"
            onPress={() => router.push('/login')}
          />
        </View>
      </ScrollView>
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
    paddingVertical: spacing.xl,
  },
  scroll: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  hero: {
    gap: spacing.sm,
  },
  brandLine: {
    ...typography.overline,
    color: colors.primary,
  },
  coreLine: {
    ...typography.title,
    color: colors.text,
    fontSize: 32,
  },
  tagline: {
    ...typography.heading,
    color: colors.accent,
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
  featureItem: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    paddingVertical: spacing.xs,
  },
  featureDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  featureCopy: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    ...typography.label,
    color: colors.text,
  },
  featureDetail: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  actions: {
    gap: spacing.sm,
  },
});
