import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export const ONBOARDING_KEY = 'tomato-onboarding-seen';

export default function Index() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
      setTarget(val === 'true' ? '/home' : '/onboarding');
    });
  }, []);

  if (!target) return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  return <Redirect href={target as '/home' | '/onboarding'} />;
}
