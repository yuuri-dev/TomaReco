import { StyleSheet, Text, View } from 'react-native';
import DayCell from './Daycell';

type Props = {
  calendarDays: ({ day: number } | null)[];
  records: { day: number; title: string }[];
  setSelectedDay: (day: number) => void;
};

export default function Calendar({
  calendarDays,
  records,
  setSelectedDay,
}: Props) {
  return (
    <View style={styles.calendar}>
      <View style={styles.weekRow}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <Text key={d} style={styles.week}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {calendarDays.map((item, index) => {
          if (!item) {
            return <View key={index} style={styles.day} />;
          }

          const hasStudy = records.some((r) => r.day === item.day);

          return (
            <DayCell
              key={item.day}
              day={item.day}
              hasStudy={hasStudy}
              onPress={() => setSelectedDay(item.day)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    width: '90%',
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 10,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  day: {
    width: '14.28%',
    aspectRatio: 1,
  },

  weekRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },

  week: {
    width: '14.28%',
    textAlign: 'center',
    fontWeight: '600',
  },
});
