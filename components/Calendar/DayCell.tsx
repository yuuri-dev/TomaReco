import { Pressable, StyleSheet, Text, View } from 'react-native';

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
        {hasStudy && <View style={styles.dot} />}
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
    height: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ff6347',
  },
});
