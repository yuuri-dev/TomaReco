import * as Sharing from 'expo-sharing';
import { useRef } from 'react';
import { Alert } from 'react-native';
import ViewShot from 'react-native-view-shot';

export function useShare() {
  const cardRef = useRef<ViewShot>(null);

  async function shareCard() {
    if (!cardRef.current) return;

    try {
      const uri = await cardRef.current.capture!();

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('エラー', 'このデバイスでは共有できません');
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: '学習記録をシェア',
      });
    } catch {
      Alert.alert('エラー', '画像の生成に失敗しました');
    }
  }

  return { cardRef, shareCard };
}
