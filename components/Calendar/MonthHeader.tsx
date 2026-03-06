import { View, Text, Pressable, StyleSheet } from 'react-native';

type Props = {
  year: number;
  month: number;
  changeMonth: (diff: number) => void;
};

export default function MonthHeader({ year, month, changeMonth }: Props) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <View style={styles.monthHeader}>
      <Pressable onPress={() => changeMonth(-1)}>
        <Text style={styles.arrow}>◀</Text>
      </Pressable>

      <Text style={styles.monthText}>
        {monthNames[month]} {year}
      </Text>

      <Pressable onPress={() => changeMonth(1)}>
        <Text style={styles.arrow}>▶</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },

  arrow: {
    fontSize: 20,
  },
});
