import * as Notifications from 'expo-notifications';
import { Alert, Linking, Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('tomato-reminder', {
      name: '学習リマインダー',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#ff6347',
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();

  if (existing === 'granted') return true;

  if (existing === 'denied') {
    Alert.alert(
      '通知の許可が必要です',
      '設定アプリでTomaRecoの通知を許可してください。',
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: '設定を開く', onPress: () => Linking.openSettings() },
      ]
    );
    return false;
  }

  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      '通知が許可されませんでした',
      'リマインダーを使うには通知の許可が必要です。',
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: '設定を開く', onPress: () => Linking.openSettings() },
      ]
    );
    return false;
  }

  return true;
}

export async function scheduleDailyReminder(hour: number, minute: number): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📚 今日の学習を記録しよう',
      body: '継続は力なり！TomaRecoで今日の学習を記録しよう。',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
