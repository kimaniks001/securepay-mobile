import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger';

type AppButtonProps = PressableProps & {
  label: string;
  variant?: AppButtonVariant;
  style?: StyleProp<ViewStyle>;
};

const variantStyles: Record<
  AppButtonVariant,
  { button: ViewStyle; text: { color: string } }
> = {
  primary: {
    button: { backgroundColor: colors.primary },
    text: { color: '#FFFFFF' },
  },
  accent: {
    button: { backgroundColor: colors.accent },
    text: { color: '#FFFFFF' },
  },
  secondary: {
    button: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    text: { color: colors.primary },
  },
  ghost: {
    button: { backgroundColor: 'transparent' },
    text: { color: colors.primary },
  },
  danger: {
    button: { backgroundColor: colors.error },
    text: { color: '#FFFFFF' },
  },
};

export function AppButton({
  label,
  variant = 'primary',
  disabled,
  style,
  ...props
}: AppButtonProps) {
  const palette = variantStyles[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        palette.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      <Text style={[styles.label, palette.text]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: spacing.touch,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  label: {
    ...typography.label,
    fontSize: 16,
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
});
