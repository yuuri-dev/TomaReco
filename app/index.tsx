import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Home() {
  const days = Array.from({ length: 35 }, (_, i) => ({
    day: i + 1,
    hasStudy: Math.random() > 0.7,
  }));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tomato Study 🍅</Text>

      <View style={styles.calendar}>
        <View style={styles.grid}>
          {days.map((item) => (
            <Pressable
              key={item.day}
              style={styles.day}
              onPress={() => setSelectedDay(item.day)}
            >
              <Text style={styles.date}>{item.day}</Text>
              <Text>{item.hasStudy ? '🍅' : '🌱'}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      {selectedDay && (
        <View style={styles.log}>
          <Text style={styles.logTitle}>{selectedDay}日のログ</Text>
          <Text>React Native勉強</Text>
          <Text>Next.js記事</Text>
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

          <Pressable style={styles.saveButton}>
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
    height: 400,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  day: {
    width: 40,
    height: 40,
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
});
