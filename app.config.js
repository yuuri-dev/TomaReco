import 'dotenv/config';

export default {
  expo: {
    name: 'TomaReco',
    slug: 'tomato-study',
    icon: './assets/images/icon.png',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ff6347',
    },
    version: '1.3',
    orientation: 'portrait',
    scheme: 'tomareco',
    userInterfaceStyle: 'automatic',
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.tomareco.app',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    plugins: [
      'expo-router',
      '@react-native-community/datetimepicker',
      [
        'expo-notifications',
        {
          icon: './assets/images/icon.png',
          color: '#ff6347',
        },
      ],
      [
        'react-native-google-mobile-ads',
        {
          androidAppId: process.env.ADMOB_APP_ID ?? '',
          iosAppId: process.env.ADMOB_APP_ID ?? '',
        },
      ],
    ],
    android: {
      package: 'com.anonymous.tomatostudy',
    },
    extra: {
      admobBannerId: process.env.ADMOB_BANNER_ID ?? '',
      router: {},
      eas: {
        projectId: 'e6136588-90f2-47d9-8b7f-dc1b74180cf3',
      },
    },
  },
};
