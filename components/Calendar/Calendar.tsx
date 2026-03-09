import { Record } from '@/type/record';
import { StyleSheet, Text, View } from 'react-native';
import DayCell from './DayCell';

type Props = {
  calendarDays: ({ day: number } | null)[];
  records: Record[];
  setSelectedDay: (day: number) => void;
  year: number;
  month: number; // 0〜11の月 (Date.getMonth()のまま)
  selectedDay: number | null;
};

export default function Calendar({
  calendarDays,
  records,
  setSelectedDay,
  year,
  month,
  selectedDay,
}: Props) {
  const today = new Date();

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

          const hasStudy = records.some(
            (r) => r.year === year && r.month === month && r.day === item.day
          );

          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === item.day;

          return (
            <DayCell
              key={index}
              day={item.day}
              hasStudy={hasStudy}
              isToday={isToday}
              isSelected={selectedDay === item.day}
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
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 15,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,

    elevation: 5,
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
