import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  day: number;
  hasStudy: boolean;
  isToday: boolean;
  isSelected: boolean;
  onPress: () => void;
};

export default function DayCell({ day, hasStudy, isToday,isSelected, onPress }: Props) {
  return (
    <Pressable
      style={[
        styles.day,
        isSelected && styles.selected,
        isToday && styles.today,
      ]}
      onPress={onPress}
    >
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
  selected: {
    backgroundColor: '#ffe5e0',
    borderRadius: 8,
  },
});
