import Calendar from '@/components/Calendar/Calendar';
import MonthHeader from '@/components/Calendar/MonthHeader';
import AddRecordModal from '@/components/Modal/AddRecordModal';
import RecordList from '@/components/Record/RecordList';
import { Genre } from '@/type/genre';
import { Record } from '@/type/record';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

export default function Home() {
  const defaultGenres = [
    { id: 'programming', name: 'プログラミング', color: '#4CAF50' },
    { id: 'reading', name: '読書', color: '#2196F3' },
    { id: 'English', name: '英語', color: '#FF9800' },
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

  const saveData = async (records: Record[], genres: Genre[]) => {
    try {
      const data = {
        records,
        genres,
      };

      await AsyncStorage.setItem('tomato-data', JSON.stringify(data));
    } catch (e) {
      console.log('save error', e);
    }
  };

  const loadData = async () => {
    try {
      const json = await AsyncStorage.getItem('tomato-data');

      if (json !== null) {
        const data = JSON.parse(json);

        setRecords(data.records || []);
        setGenres(data.genres || defaultGenres);
      }
    } catch (e) {
      console.log('load error', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    saveData(records, genres);
  }, [records, genres]);

  const pan = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onEnd((e) => {
      if (e.translationX > 50) changeMonth(-1);
      if (e.translationX < -50) changeMonth(1);
    })
    .runOnJS(true);

  function saveRecord() {
    if (!selectedDay) return;

    const genre = genres.find((g) => g.id === selectedGenreId);

    const newRecord = {
      year,
      month,
      day: selectedDay,
      title: title.trim() || genre?.name+"の学習" || '',
      genreId: selectedGenreId,
    };

    setRecords([...records, newRecord]);
    setTitle('');
    setShowAddGenre(false);
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

const deleteRecord = (record: Record) => {
  Alert.alert('記録を削除', 'この記録を削除しますか？', [
    {
      text: 'キャンセル',
      style: 'cancel',
    },
    {
      text: '削除',
      style: 'destructive',
      onPress: () => {
        setRecords((prev) =>
          prev.filter(
            (r) =>
              !(
                r.year === record.year &&
                r.month === record.month &&
                r.day === record.day &&
                r.title === record.title &&
                r.genreId === record.genreId
              )
          )
        );
      },
    },
  ]);
};

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
        deleteRecord={deleteRecord}
      />

      <Pressable style={styles.addButton} onPress={() => setShowInput(true)}>
        <Text style={styles.addText}>＋</Text>
      </Pressable>

      <AddRecordModal
        visible={showInput}
        close={() => {
          setShowInput(false);
          setShowAddGenre(false);
        }}
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
