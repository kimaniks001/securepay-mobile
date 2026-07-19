import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AgreementFlowCard } from '../src/components/AgreementFlowCard';
import { AppButton } from '../src/components/AppButton';
import { AppCard } from '../src/components/AppCard';
import { SafeNotice } from '../src/components/SafeNotice';
import { Screen } from '../src/components/Screen';
import { SecurePayLogoMark } from '../src/components/SecurePayLogoMark';
import { BRAND, STAGING_DEMO_WARNING } from '../src/doctrine/securepayDoctrine';
import { PUBLIC_SITE } from '../src/doctrine/publicSiteReference';
import { colors, spacing, typography } from '../src/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SecurePayLogoMark size="lg" />
        <View style={styles.hero}>
          <Text style={styles.siteTitle}>{PUBLIC_SITE.title}</Text>
          <Text style={styles.brandLine}>{BRAND.byline}</Text>
          <Text style={styles.coreLine}>{BRAND.coreLine}</Text>
          <Text style={styles.heroSubline}>{PUBLIC_SITE.heroSubline}</Text>
          <Text style={styles.tagline}>{BRAND.tagline}</Text>
          <Text style={styles.subtitle}>{BRAND.promise}</Text>
          <Text style={styles.demoBanner}>{PUBLIC_SITE.demoBanner}</Text>
          <Text style={styles.demoWarning}>{STAGING_DEMO_WARNING}</Text>
        </View>

        <AppCard muted>
          <Text style={styles.notABank}>{PUBLIC_SITE.notABank}</Text>
        </AppCard>

        <AgreementFlowCard />

        <AppCard muted title="Try in demo mode">
          <FeatureItem title="SecureLink" detail="Create a link, agree terms, see payment-ready readiness." />
          <FeatureItem title="Group SecureLink" detail="Welfare, general, and business collections with fee doctrine." />
          <FeatureItem title="Quiet Trust" detail="Records and readiness — backend remains source of truth." />
        </AppCard>

        <SafeNotice compact />

        <View style={styles.actions}>
          <AppButton label="Continue in demo mode" onPress={() => router.push('/login')} />
          <AppButton label="View SecureLinks" variant="secondary" onPress={() => router.push('/login')} />
          <AppButton label="Learn how SecurePay works" variant="ghost" onPress={() => router.push('/login')} />
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
  screen: { paddingVertical: spacing.xl },
  scroll: { gap: spacing.lg, paddingBottom: spacing.xxl },
  hero: { gap: spacing.sm },
  siteTitle: { ...typography.caption, color: colors.textMuted, fontWeight: '600' },
  brandLine: { ...typography.overline, color: colors.primary },
  coreLine: { ...typography.display, color: colors.text, fontSize: 34 },
  heroSubline: { ...typography.bodyLarge, color: colors.textSecondary },
  tagline: { ...typography.heading, color: colors.accent, fontSize: 18 },
  subtitle: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },
  demoBanner: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  demoWarning: { ...typography.caption, color: colors.warning, lineHeight: 18 },
  notABank: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },
  featureItem: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start', paddingVertical: spacing.xs },
  featureDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary, marginTop: 6 },
  featureCopy: { flex: 1, gap: 2 },
  featureTitle: { ...typography.label, color: colors.text },
  featureDetail: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },
  actions: { gap: spacing.sm },
});
