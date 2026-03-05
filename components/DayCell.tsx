import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  day: number;
  hasStudy: boolean;
  isToday: boolean;
  onPress: () => void;
};

export default function DayCell({ day, hasStudy, isToday, onPress }: Props) {
  return (
    <Pressable style={[styles.day, isToday && styles.today]} onPress={onPress}>
      <Text style={styles.date}>{day}</Text>
      <Text>{hasStudy ? '🍅' : '🌱'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  day: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  date: {
    fontSize: 10,
  },

  today: {
    borderWidth: 2,
    borderColor: '#ff6347',
    borderRadius: 8,
  },
});
