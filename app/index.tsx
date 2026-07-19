import { Redirect } from 'expo-router';

import { Screen } from '../src/components/Screen';
import { useAuth } from '../src/hooks/useAuth';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Screen loading />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/welcome" />;
}
