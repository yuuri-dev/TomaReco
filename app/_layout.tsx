import { AppProvider } from '@/context/AppContext';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.3);

  useEffect(() => {
    async function initAds() {
      // 1. iOS: ATT 許可リクエスト（先に取得してからAdMobを初期化する）
      if (Platform.OS === 'ios') {
        try {
          const { requestTrackingPermissionsAsync } = require('expo-tracking-transparency');
          await requestTrackingPermissionsAsync();
        } catch {
          // パッケージ未導入の場合は無視
        }
      }
      // 2. ATT取得後にAdMob SDK を初期化
      try {
        const { default: mobileAds } = require('react-native-google-mobile-ads');
        await mobileAds().initialize();
      } catch {
        // ネイティブ未登録環境では無視
      }
    }

    initAds();
    SplashScreen.hideAsync();

    // フェードイン + バウンス
    opacity.value = withTiming(1, { duration: 350 });
    scale.value = withSequence(
      withSpring(1.15, { damping: 6, stiffness: 150 }),
      withSpring(1.0, { damping: 14, stiffness: 200 })
    );

    // 900ms後にフェードアウト
    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 350 });
      scale.value = withTiming(1.4, { duration: 350 }, (done) => {
        if (done) runOnJS(setShowCustomSplash)(false);
      });
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (showCustomSplash) {
    return (
      <View style={styles.splashContainer}>
        <Animated.Image
          source={require('../assets/images/icon.png')}
          style={[styles.splashIcon, animatedStyle]}
        />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AppProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#ff6347',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashIcon: {
    width: 120,
    height: 120,
    borderRadius: 28,
  },
});
