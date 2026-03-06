import Calendar from '@/components/Calendar/Calendar';
import { Record } from '@/type/record';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function Home() {
  const defaultGenres = [
    { id: 'programming', name: 'Programming', color: '#4CAF50' },
    { id: 'reading', name: 'Reading', color: '#2196F3' },
    { id: 'math', name: 'Math', color: '#FF9800' },
  ];

  const [records, setRecords] = useState<Record[]>([]);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [genres, setGenres] = useState(defaultGenres);
  const [selectedGenreId, setSelectedGenreId] = useState(genres[0].id);
  const [showAddGenre, setShowAddGenre] = useState(false);
  const [newGenreName, setNewGenreName] = useState('');
  const [newGenreColor, setNewGenreColor] = useState('#4CAF50');

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

  const pan = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onEnd((e) => {
      if (e.translationX > 50) changeMonth(-1);
      if (e.translationX < -50) changeMonth(1);
    })
    .runOnJS(true);
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
      <GestureDetector gesture={pan}>
        <View>
          <Calendar
            calendarDays={calendarDays}
            records={records}
            setSelectedDay={setSelectedDay}
            year={year}
            month={month}
            selectedDay={selectedDay}
          />
        </View>
      </GestureDetector>
      {selectedDay && (
        <View style={styles.log}>
          <Text style={styles.logTitle}>{selectedDay}日のログ</Text>
          {records
            .filter(
              (r) =>
                r.year === year && r.month === month && r.day === selectedDay
            )
            .map((r, i) => {
              const genre = genres.find((g) => g.id === r.genreId);
              return (
                <View key={i} style={styles.recordCard}>
                  <View
                    style={[
                      styles.genreTag,
                      { backgroundColor: genre?.color || '#ccc' },
                    ]}
                  >
                    <Text style={styles.genreText}>{genre?.name}</Text>
                  </View>

                  <Text style={styles.recordTitle}>{r.title}</Text>
                </View>
              );
            })}
        </View>
      )}
      <Pressable style={styles.addButton} onPress={() => setShowInput(true)}>
        <Text style={styles.addText}>＋</Text>
      </Pressable>

      <Modal visible={showInput} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowInput(false)}
          />

          <View style={styles.inputModal}>
            {!showAddGenre && (
              <>
                <Text
                  style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}
                >
                  Add Record
                </Text>

                <TextInput
                  placeholder="記録する内容"
                  value={title}
                  onChangeText={setTitle}
                  style={styles.input}
                />

                <Text style={{ marginBottom: 5 }}>Genre</Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 10 }}
                  contentContainerStyle={{ paddingRight: 20 }}
                >
                  {genres.map((g) => (
                    <Pressable
                      key={g.id}
                      onPress={() => setSelectedGenreId(g.id)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        marginRight: 8,
                        borderRadius: 8,
                        backgroundColor:
                          selectedGenreId === g.id ? g.color : '#eee',
                      }}
                    >
                      <Text
                        style={{
                          color: selectedGenreId === g.id ? 'white' : 'black',
                        }}
                      >
                        {g.name}
                      </Text>
                    </Pressable>
                  ))}

                  <Pressable
                    onPress={() => setShowAddGenre(true)}
                    style={styles.addGenreButton}
                  >
                    <Text style={{ fontWeight: '600' }}>＋</Text>
                  </Pressable>
                </ScrollView>

                <Pressable
                  style={styles.saveButton}
                  onPress={() => {
                    if (!selectedDay) return;

                    const newRecord = {
                      year,
                      month,
                      day: selectedDay,
                      title,
                      genreId: selectedGenreId,
                    };

                    setRecords([...records, newRecord]);
                    setTitle('');
                    setShowInput(false);
                  }}
                >
                  <Text style={{ color: 'white' }}>保存</Text>
                </Pressable>
              </>
            )}

            {showAddGenre && (
              <>
                <Text
                  style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}
                >
                  Add Genre
                </Text>

                <TextInput
                  placeholder="Genre name"
                  value={newGenreName}
                  onChangeText={setNewGenreName}
                  style={styles.input}
                />

                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                  {['#4CAF50', '#2196F3', '#FF9800', '#E91E63'].map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setNewGenreColor(c)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: c,
                        marginRight: 10,
                        borderWidth: newGenreColor === c ? 2 : 0,
                      }}
                    />
                  ))}
                </View>

                <Pressable
                  style={styles.saveButton}
                  onPress={() => {
                    const newGenre = {
                      id: Date.now().toString(),
                      name: newGenreName,
                      color: newGenreColor,
                    };

                    setGenres([...genres, newGenre]);
                    setSelectedGenreId(newGenre.id);

                    setNewGenreName('');
                    setShowAddGenre(false);
                  }}
                >
                  <Text style={{ color: 'white' }}>Save</Text>
                </Pressable>

                <Pressable
                  style={{ marginTop: 10 }}
                  onPress={() => setShowAddGenre(false)}
                >
                  <Text style={{ textAlign: 'center' }}>Back</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  addGenreButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },

  addButton: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    width: 65,
    height: 65,
    borderRadius: 32,

    backgroundColor: '#ff6347',

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,

    elevation: 8,
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
  recordCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 3,
  },

  genreTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },

  genreText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },

  recordTitle: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  genreModal: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
  },
  inputModal: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
  },
});
