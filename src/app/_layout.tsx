import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../hooks/useAuth';

SplashScreen.preventAutoHideAsync();

function AuthGate() {
  const { laedt, token, hatZugang } = useAuth();
  const router   = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (laedt) return;
    SplashScreen.hideAsync();

    const inTabs = (segments[0] as string | undefined) === '(tabs)';

    if (!token) {
      router.replace('/login');
    } else if (!hatZugang) {
      router.replace('/kein-zugang');
    } else if (!inTabs) {
      router.replace('/(tabs)');
    }
  }, [laedt, token, hatZugang]);

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate />
      <Stack>
        <Stack.Screen name="(tabs)"         options={{ headerShown: false }} />
        <Stack.Screen name="login"          options={{ headerShown: false }} />
        <Stack.Screen name="kein-zugang"    options={{ headerShown: false }} />
        <Stack.Screen name="rechnung/[id]"  options={{ title: 'Rechnungsdetail' }} />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
