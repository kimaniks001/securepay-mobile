import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router';

import {
  tabBarActiveTintColor,
  tabBarInactiveTintColor,
  tabBarStyle,
} from '../../src/constants/app';
import { colors } from '../../src/theme';
import { useAuth } from '../../src/hooks/useAuth';

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/welcome" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarLabel: 'Home' }} />
      <Tabs.Screen
        name="securelinks"
        options={{ title: 'SecureLinks', tabBarLabel: 'SecureLinks' }}
      />
      <Tabs.Screen name="create" options={{ title: 'Create', tabBarLabel: 'Create' }} />
      <Tabs.Screen name="history" options={{ title: 'Activity', tabBarLabel: 'Activity' }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarLabel: 'Account' }} />
    </Tabs>
  );
}
