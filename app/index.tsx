import Calendar from '@/components/Calendar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Home() {
  const [records, setRecords] = useState<{ day: number; title: string }[]>([]);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
  }));
  const firstDay = new Date(year, month, 1).getDay();

  const calendarDays = [...Array(firstDay).fill(null), ...days];

  function changeMonth(diff: number) {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + diff);
    setCurrentDate(newDate);
  }

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
    <View style={styles.container}>
      <Text style={styles.title}>Tomato Study 🍅</Text>

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
      <Calendar
        calendarDays={calendarDays}
        records={records}
        setSelectedDay={setSelectedDay}
      />
      {selectedDay && (
        <View style={styles.log}>
          <Text style={styles.logTitle}>{selectedDay}日のログ</Text>
          {records
            .filter((r) => r.day === selectedDay)
            .map((r, i) => (
              <Text key={i}>{r.title}</Text>
            ))}
        </View>
      )}
      <Pressable style={styles.addButton} onPress={() => setShowInput(true)}>
        <Text style={styles.addText}>＋</Text>
      </Pressable>

      {showInput && (
        <View style={styles.inputBox}>
          <TextInput
            placeholder="何を勉強しましたか？"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <Pressable
            style={styles.saveButton}
            onPress={() => {
              if (!selectedDay) return;

              const newRecord = {
                day: selectedDay,
                title: title,
              };

              setRecords([...records, newRecord]);
              setTitle('');
              setShowInput(false);
            }}
          >
            <Text style={{ color: 'white' }}>保存</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  calendar: {
    width: '90%',
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  day: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: 10,
  },
  log: {
    marginTop: 20,
    width: '90%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },

  logTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff6347',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addText: {
    fontSize: 30,
    color: 'white',
  },
  inputBox: {
    position: 'absolute',
    bottom: 120,
    width: '90%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },

  saveButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  week: {
    width: '14.28%',
    textAlign: 'center',
    fontWeight: '600',
  },
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
