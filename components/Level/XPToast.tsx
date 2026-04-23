import { getTomatoImage } from '@/utils/level';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  level: number;
  xpInLevel: number;
  xpToNext: number | null;
  xpGained: number;
  visible: boolean;
  onHide: () => void;
};

export default function XPToast({ level, xpInLevel, xpToNext, xpGained, visible, onHide }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    if (!visible) return;
    opacity.value = withSequence(
      withTiming(1, { duration: 180 }),
      withDelay(1100, withTiming(0, { duration: 250 }))
    );
    translateY.value = withSequence(
      withTiming(0, { duration: 180 }),
      withDelay(1100, withTiming(16, { duration: 250 }, (done) => {
        if (done) runOnJS(onHide)();
      }))
    );
  }, [visible]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const progress = xpToNext ? Math.min(xpInLevel / xpToNext, 1) : 1;

  return (
    <Animated.View style={[styles.container, animStyle]} pointerEvents="none">
      <Image source={getTomatoImage(level)} style={styles.icon} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.level}>Lv.{level}</Text>
          <Text style={styles.gained}>+{xpGained} XP</Text>
        </View>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${progress * 100}%` as `${number}%` }]} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 96,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  content: {
    gap: 6,
    minWidth: 160,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  level: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  gained: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ff6347',
  },
  barBg: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#ff6347',
    borderRadius: 3,
  },
});
