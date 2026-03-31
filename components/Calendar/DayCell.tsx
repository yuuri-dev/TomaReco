import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const tomatoImg = require('@/assets/images/tomato.jpg');
const naegiImg = require('@/assets/images/naegi.jpg');

type Props = {
  day: number;
  hasStudy: boolean;
  isToday: boolean;
  isSelected: boolean;
  onPress: () => void;
};

export default function DayCell({ day, hasStudy, isToday, isSelected, onPress }: Props) {
  return (
    <Pressable
      style={[styles.day, isSelected && styles.selected]}
      onPress={onPress}
    >
      <View style={[styles.dateCircle, isToday && styles.todayCircle]}>
        <Text style={[styles.date, isToday && styles.todayText]}>{day}</Text>
      </View>
      <View style={styles.dotArea}>
        {hasStudy ? (
          <Image source={tomatoImg} style={styles.icon} />
        ) : isToday ? (
          <Image source={naegiImg} style={styles.iconSmall} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  day: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  selected: {
    backgroundColor: '#fff0ee',
  },

  dateCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  todayCircle: {
    backgroundColor: '#ff6347',
  },

  date: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },

  todayText: {
    color: 'white',
    fontWeight: '700',
  },

  dotArea: {
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },

  iconSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});
