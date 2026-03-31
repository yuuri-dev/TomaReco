import { useAppContext } from '@/context/AppContext';
import { StyleSheet, Text, View } from 'react-native';
import DayCell from './DayCell';

export default function Calendar() {
  const { calendarDays, records, setSelectedDay, year, month, selectedDay } =
    useAppContext();
  const today = new Date();

  return (
    <View style={styles.calendar}>
      <View style={styles.weekRow}>
        {['日', '月', '火', '水', '木', '金', '土'].map((d, i) => (
          <Text
            key={d}
            style={[
              styles.week,
              i === 0 && styles.weekSun,
              i === 6 && styles.weekSat,
            ]}
          >
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
    paddingVertical: 12,
    paddingHorizontal: 4,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,

    elevation: 4,
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
    marginBottom: 4,
    paddingHorizontal: 2,
  },

  week: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },

  weekSun: {
    color: '#e05555',
  },

  weekSat: {
    color: '#4a8fe8',
  },
});
