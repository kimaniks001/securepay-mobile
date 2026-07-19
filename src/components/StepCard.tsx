import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

type StepCardProps = {
  stepNumber: number;
  totalSteps: number;
  title: string;
  description?: string;
  active?: boolean;
  completed?: boolean;
  children?: React.ReactNode;
};

export function StepCard({
  stepNumber,
  totalSteps,
  title,
  description,
  active = true,
  completed = false,
  children,
}: StepCardProps) {
  return (
    <View style={[styles.card, active && styles.active, completed && styles.completed]}>
      <Text style={styles.progress}>
        Step {stepNumber} of {totalSteps}
      </Text>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  active: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceElevated,
  },
  completed: {
    borderColor: colors.borderStrong,
  },
  progress: {
    ...typography.overline,
    color: colors.primary,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
