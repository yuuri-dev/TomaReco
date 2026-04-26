import { useRef } from 'react';
import { Alert, Platform, Share } from 'react-native';
import ViewShot from 'react-native-view-shot';

export function useShare(streak: number) {
  const cardRef = useRef<ViewShot>(null);

  async function shareCard() {
    if (!cardRef.current) return;

    try {
      const uri = await cardRef.current.capture!();
      const message = `🔥 ${streak}日連続学習中！\n継続は力なり。#TomaReco\nhttps://apps.apple.com/jp/app/tomareco/id6760455427`;

      if (Platform.OS === 'ios') {
        // iOS: テキスト＋画像を同時に渡す
        await Share.share({ message, url: uri });
      } else {
        // Android: Share APIはファイルURIをurlに渡せないためテキストのみ
        await Share.share({ message });
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.message !== 'User did not share') {
        const isCaptureError = e.message.toLowerCase().includes('capture') || e.message.toLowerCase().includes('shot');
        Alert.alert('エラー', isCaptureError ? '画像の生成に失敗しました' : 'シェアに失敗しました');
      }
    }
  }

  return { cardRef, shareCard };
}
