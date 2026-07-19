import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { colors, spacing, typography } from '../../src/constants/theme';
import { useSecureLinks } from '../../src/hooks/useSecurePayApi';
import { formatCurrency } from '../../src/utils/format';
import { getMoneyStateColor } from '../../src/utils/moneyState';

export default function SecureLinksScreen() {
  const router = useRouter();
  const links = useSecureLinks();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>SecureLinks</Text>
          <Text style={styles.subtitle}>Agreement-backed links from the mock API adapter.</Text>
        </View>

        <SafeNotice compact />

        <View style={styles.actions}>
          <Button label="Create SecureLink" onPress={() => router.push('/securelink/create')} />
          <Button
            label="Create Group SecureLink"
            variant="secondary"
            onPress={() => router.push('/securelink/create-group')}
          />
        </View>

        {links.loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          links.data?.map((link) => (
            <Pressable
              key={link.id}
              style={styles.row}
              onPress={() => router.push(`/securelink/${link.slug}`)}
            >
              <View style={styles.rowMain}>
                <Text style={styles.kind}>
                  {link.kind === 'group_securelink' ? 'Group SecureLink' : 'SecureLink'}
                </Text>
                <Text style={styles.name}>{link.title}</Text>
                <Text style={styles.meta}>
                  {link.moneyStateLabel}
                  {link.feeKes ? ` · KES ${link.feeKes} fee` : ''}
                </Text>
              </View>
              <View style={styles.rowAside}>
                <Text style={styles.amount}>
                  {formatCurrency(link.agreementControlledAmount, link.currency)}
                </Text>
                <Text style={[styles.state, { color: getMoneyStateColor(link.moneyState) }]}>
                  {link.moneyState.replaceAll('_', ' ')}
                </Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
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
  actions: {
    gap: spacing.sm,
  },
  row: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowMain: {
    flex: 1,
    gap: 2,
  },
  rowAside: {
    alignItems: 'flex-end',
    gap: 4,
  },
  kind: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  name: {
    ...typography.label,
    color: colors.text,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  amount: {
    ...typography.label,
    color: colors.text,
  },
  state: {
    ...typography.caption,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
});
