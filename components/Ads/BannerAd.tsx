import Constants from 'expo-constants';
import { View } from 'react-native';

// react-native-google-mobile-ads はネイティブビルドが必要。
// Expo Go など未登録の環境ではモジュールが存在しないため try-catch でガード。
let NativeBannerAd: React.ComponentType<any> | null = null;
let BannerAdSizeValue: string | null = null;
let testAdUnitId: string | null = null;

try {
  const ads = require('react-native-google-mobile-ads');
  NativeBannerAd = ads.BannerAd;
  BannerAdSizeValue = ads.BannerAdSize.ANCHORED_ADAPTIVE_BANNER;
  testAdUnitId = ads.TestIds.ADAPTIVE_BANNER;
} catch {
  // ネイティブモジュール未登録（Expo Go等）では広告を非表示にする
}

const adUnitId = __DEV__
  ? (testAdUnitId ?? '')
  : (
      process.env.EXPO_PUBLIC_ADMOB_BANNER_ID ??
      Constants.expoConfig?.extra?.admobBannerId ??
      // EAS Update / standalone build で expoConfig が null の場合のフォールバック
      (Constants as any).manifest2?.extra?.expoClient?.admobBannerId ??
      (Constants as any).manifest?.extra?.admobBannerId ??
      ''
    );

export default function AdBanner() {
  console.warn('[AdBanner] NativeBannerAd:', !!NativeBannerAd, 'size:', !!BannerAdSizeValue, 'unitId:', adUnitId);
  if (!NativeBannerAd || !BannerAdSizeValue || !adUnitId) return <View />;

  return (
    <NativeBannerAd
      unitId={adUnitId}
      size={BannerAdSizeValue}
      onAdFailedToLoad={(error: { code?: string; message?: string }) => {
        console.warn(
          `[AdBanner] failed to load banner. unitId=${adUnitId}, code=${error?.code ?? 'unknown'}, message=${error?.message ?? 'unknown'}`
        );
      }}
    />
  );
}
