import Calendar from '@/components/Calendar/Calendar';
import MonthHeader from '@/components/Calendar/MonthHeader';
import AddRecordModal from '@/components/Modal/AddRecordModal';
import RecordList from '@/components/Record/RecordList';
import { Record } from '@/type/record';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
  const days = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1 }));
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

  function saveRecord() {
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
  }

  function saveGenre() {
    const newGenre = {
      id: Date.now().toString(),
      name: newGenreName,
      color: newGenreColor,
    };

    setGenres([...genres, newGenre]);
    setSelectedGenreId(newGenre.id);
    setNewGenreName('');
    setShowAddGenre(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tomato Study 🍅</Text>

      <MonthHeader year={year} month={month} changeMonth={changeMonth} />

      <GestureDetector gesture={pan}>
        <Calendar
          calendarDays={calendarDays}
          records={records}
          setSelectedDay={setSelectedDay}
          year={year}
          month={month}
          selectedDay={selectedDay}
        />
      </GestureDetector>

      <RecordList
        records={records}
        genres={genres}
        year={year}
        month={month}
        selectedDay={selectedDay}
      />

      <Pressable style={styles.addButton} onPress={() => setShowInput(true)}>
        <Text style={styles.addText}>＋</Text>
      </Pressable>

      <AddRecordModal
        visible={showInput}
        close={() => setShowInput(false)}
        showAddGenre={showAddGenre}
        setShowAddGenre={setShowAddGenre}
        title={title}
        setTitle={setTitle}
        genres={genres}
        selectedGenreId={selectedGenreId}
        setSelectedGenreId={setSelectedGenreId}
        newGenreName={newGenreName}
        setNewGenreName={setNewGenreName}
        newGenreColor={newGenreColor}
        setNewGenreColor={setNewGenreColor}
        saveRecord={saveRecord}
        saveGenre={saveGenre}
      />
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
  },

  addText: {
    fontSize: 30,
    color: 'white',
  },
});
