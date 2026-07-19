import { Stack } from 'expo-router';

import { colors } from '../../src/constants/theme';

export default function ReadinessLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="account" options={{ title: 'Account readiness' }} />
      <Stack.Screen name="payment-ready" options={{ title: 'Payment Ready readiness' }} />
    </Stack>
  );
}
