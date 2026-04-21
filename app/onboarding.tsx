import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { ONBOARDING_KEY } from './index';

const { width } = Dimensions.get('window');

type Page = {
  key: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
};

const pages: Page[] = [
  {
    key: '1',
    icon: 'timer-outline',
    iconColor: '#ff6347',
    iconBg: '#fff0ed',
    title: 'ようこそ、TomaReco へ！',
    description: '毎日の学習をシンプルに記録して\n習慣化をサポートするアプリです。',
  },
  {
    key: '2',
    icon: 'calendar-outline',
    iconColor: '#4a8fe8',
    iconBg: '#eef4ff',
    title: 'カレンダーで記録しよう',
    description: '日付をタップして学習内容を入力するだけ。\n今月の勉強が一目でわかります。',
  },
  {
    key: '3',
    icon: 'color-palette-outline',
    iconColor: '#FF9800',
    iconBg: '#fff8ee',
    title: 'ジャンルで色分け管理',
    description: '科目やテーマごとにジャンルを設定。\n自分だけのカテゴリも追加できます。',
  },
  {
    key: '4',
    icon: 'bar-chart-outline',
    iconColor: '#4CAF50',
    iconBg: '#eefbef',
    title: '成長を振り返ろう',
    description: '統計画面で学習の傾向を確認しよう。\n継続することで成長が見えてきます。',
  },
];

export default function OnboardingScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const fromSettings = from === 'settings';
  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<FlatList<Page>>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const goNext = () => {
    if (currentIndex < pages.length - 1) {
      listRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const finish = async () => {
    if (!fromSettings) {
      try {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      } catch {
        Alert.alert('エラー', '設定の保存に失敗しました');
        return;
      }
    }
    router.replace('/home');
  };

  const isLast = currentIndex === pages.length - 1;

  return (
    <View style={styles.container}>
      {fromSettings && (
        <Pressable style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={22} color="#888" />
        </Pressable>
      )}

      <FlatList
        ref={listRef}
        data={pages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
              <Ionicons name={item.icon} size={64} color={item.iconColor} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      {/* ドット */}
      <View style={styles.dots}>
        {pages.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* ボタン */}
      <View style={styles.footer}>
        {isLast ? (
          <Pressable style={styles.primaryBtn} onPress={finish}>
            <Text style={styles.primaryBtnText}>
              {fromSettings ? '閉じる' : 'さあ始めよう！'}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.footerRow}>
            <Pressable onPress={finish}>
              <Text style={styles.skipText}>スキップ</Text>
            </Pressable>
            <Pressable style={styles.nextBtn} onPress={goNext}>
              <Text style={styles.nextBtnText}>次へ</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  closeBtn: {
    position: 'absolute',
    top: 56,
    right: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  page: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },

  iconWrap: {
    width: 140,
    height: 140,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 30,
  },

  description: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },

  dotActive: {
    width: 24,
    backgroundColor: '#ff6347',
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  skipText: {
    fontSize: 15,
    color: '#bbb',
  },

  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6347',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 6,
  },

  nextBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },

  primaryBtn: {
    backgroundColor: '#ff6347',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  primaryBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
});
