import { useRef } from 'react';
import { Alert, Platform, Share } from 'react-native';
import ViewShot from 'react-native-view-shot';

export function useShare(streak: number) {
  const cardRef = useRef<ViewShot>(null);

  async function shareCard() {
    if (!cardRef.current) return;

    try {
      const uri = await cardRef.current.capture!();
      const message = `🔥 ${streak}日連続学習中！\n継続は力なり。#TomaReco`;

      if (Platform.OS === 'ios') {
        // iOS: テキスト＋画像を同時に渡す
        await Share.share({ message, url: uri });
      } else {
        // Android: Share APIはファイルURIをurlに渡せないためテキストのみ
        await Share.share({ message });
      }
    } catch (e: unknown) {
      // ユーザーがキャンセルした場合は何もしない
      if (e instanceof Error && e.message !== 'User did not share') {
        Alert.alert('エラー', '画像の生成に失敗しました');
      }
    }
  }

  return { cardRef, shareCard };
}
