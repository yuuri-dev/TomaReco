import { Image, StyleSheet, Text, View } from 'react-native';

const tomatoImg = require('@/assets/images/tomato.jpg');
const naegiImg = require('@/assets/images/naegi.jpg');

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

type DayData = { date: Date; hasStudy: boolean; isToday: boolean };

export default function WeeklyView({ days }: { days: DayData[] }) {
  return (
    <View style={styles.weekRow}>
      {days.map(({ date, hasStudy, isToday }, i) => (
        <View key={i} style={styles.dayItem}>
          <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
            {DAY_LABELS[date.getDay()]}
          </Text>
          <Image
            source={hasStudy ? tomatoImg : naegiImg}
            style={[styles.dayImg, !hasStudy && styles.dayImgNaegi]}
          />
          <Text style={[styles.dayDate, isToday && styles.dayDateToday]}>
            {date.getDate()}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center',
    gap: 6,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#aaa',
  },
  dayLabelToday: {
    color: '#ff6347',
  },
  dayImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  dayImgNaegi: {
    opacity: 0.5,
  },
  dayDate: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },
  dayDateToday: {
    color: '#ff6347',
    fontWeight: '700',
  },
});
