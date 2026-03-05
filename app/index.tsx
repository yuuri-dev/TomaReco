import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Home() {
  const [records, setRecords] = useState<{ day: number; title: string }[]>([]);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState('');

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
  }));
  const firstDay = new Date(year, month, 1).getDay();

  const calendarDays = [...Array(firstDay).fill(null), ...days];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tomato Study 🍅</Text>

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
              <Pressable
                key={item.day}
                style={styles.day}
                onPress={() => setSelectedDay(item.day)}
              >
                <Text style={styles.date}>{item.day}</Text>
                <Text>{hasStudy ? '🍅' : '🌱'}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
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
});
