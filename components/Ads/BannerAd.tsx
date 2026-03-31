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
  : (Constants.expoConfig?.extra?.admobBannerId ?? '');

export default function AdBanner() {
  if (!NativeBannerAd || !BannerAdSizeValue || !adUnitId) return <View />;

  return (
    <NativeBannerAd
      unitId={adUnitId}
      size={BannerAdSizeValue}
    />
  );
}
