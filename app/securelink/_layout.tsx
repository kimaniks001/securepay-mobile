import { Stack } from 'expo-router';

import { colors } from '../../src/constants/theme';

export default function SecureLinkLayout() {
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
      <Stack.Screen name="[slug]" options={{ title: 'SecureLink detail' }} />
      <Stack.Screen name="create" options={{ title: 'Create SecureLink' }} />
      <Stack.Screen name="create-group" options={{ title: 'Create Group SecureLink' }} />
    </Stack>
  );
}
