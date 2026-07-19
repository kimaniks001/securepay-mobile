import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radii, spacing, typography } from '../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
};

const variantStyles: Record<ButtonVariant, { button: ViewStyle; text: { color: string } }> = {
  primary: {
    button: { backgroundColor: colors.primary },
    text: { color: colors.text },
  },
  secondary: {
    button: { backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border },
    text: { color: colors.text },
  },
  ghost: {
    button: { backgroundColor: 'transparent' },
    text: { color: colors.primary },
  },
  danger: {
    button: { backgroundColor: colors.error },
    text: { color: colors.text },
  },
};

export function Button({
  label,
  variant = 'primary',
  disabled,
  style,
  ...props
}: ButtonProps) {
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
    minHeight: 52,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  label: {
    ...typography.label,
    fontSize: 16,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
