import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router';

import {
  tabBarActiveTintColor,
  tabBarInactiveTintColor,
  tabBarStyle,
} from '../../src/constants/app';
import { colors } from '../../src/constants/theme';
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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="securelinks"
        options={{
          title: 'SecureLinks',
          tabBarLabel: 'Links',
        }}
      />
      <Tabs.Screen
        name="pay"
        options={{
          title: 'Actions',
          tabBarLabel: 'Actions',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Activity',
          tabBarLabel: 'Activity',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}
