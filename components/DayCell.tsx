import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  day: number;
  hasStudy: boolean;
  onPress: () => void;
};

export default function DayCell({ day, hasStudy, onPress }: Props) {
  return (
    <Pressable style={styles.day} onPress={onPress}>
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
});
