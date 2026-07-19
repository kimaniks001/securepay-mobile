import { StyleSheet, Text, View } from 'react-native';

import { feeDoctrine } from '../doctrine/securepayDoctrine';
import { colors, spacing, typography } from '../theme';
import { AppCard } from './AppCard';

export function FeeDoctrineCard() {
  const items = [
    feeDoctrine.welfareGroupSecureLink,
    feeDoctrine.generalGroupSecureLink,
    feeDoctrine.businessSolutionContribution,
  ];

  return (
    <AppCard title="Fee doctrine" subtitle="Display only — backend applies fees">
      {items.map((item) => (
        <View key={item.label} style={styles.row}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.fee}>{item.description}</Text>
        </View>
      ))}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: spacing.xs,
    gap: 2,
  },
  label: {
    ...typography.label,
    color: colors.text,
  },
  fee: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
