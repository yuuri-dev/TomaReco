import { Genre } from '@/type/genre';
import { Record } from '@/type/record';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

const defaultGenres: Genre[] = [
  { id: 'programming', name: 'プログラミング', color: '#4CAF50' },
  { id: 'reading', name: '読書', color: '#2196F3' },
  { id: 'English', name: '英語', color: '#FF9800' },
];

type AppContextType = {
  records: Record[];
  genres: Genre[];
  selectedGenreId: string;
  setSelectedGenreId: (id: string) => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  year: number;
  month: number;
  calendarDays: ({ day: number } | null)[];
  streak: number;
  isLoading: boolean;
  saveRecord: (title: string) => void;
  saveGenre: (name: string, color: string) => void;
  deleteRecord: (record: Record) => void;
  deleteGenre: (id: string) => void;
  changeMonth: (diff: number) => void;
  goToday: () => void;
  deleteAllData: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const today = new Date();

  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState<Record[]>([]);
  const [genres, setGenres] = useState<Genre[]>(defaultGenres);
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [selectedGenreId, setSelectedGenreId] = useState<string>(defaultGenres[0].id);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1 }));
  const firstDay = new Date(year, month, 1).getDay();
  const calendarDays: ({ day: number } | null)[] = [
    ...Array(firstDay).fill(null),
    ...days,
  ];

  function calculateStreak(recs: Record[]) {
    const dates = recs.map((r) => new Date(r.year, r.month, r.day).toDateString());
    const uniqueDates = [...new Set(dates)];
    let streak = 0;
    const current = new Date();
    while (uniqueDates.includes(current.toDateString())) {
      streak++;
      current.setDate(current.getDate() - 1);
    }
    return streak;
  }

  const streak = calculateStreak(records);

  useEffect(() => {
    const load = async () => {
      try {
        const json = await AsyncStorage.getItem('tomato-data');

        if (json !== null) {
          const data = JSON.parse(json);

          type PersistedRecord = Omit<Record, 'id'> & { id?: string };
          const loadedRecords: Record[] = (data.records || []).map(
            (r: PersistedRecord): Record => ({
              id: r.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              year: r.year,
              month: r.month,
              day: r.day,
              title: r.title,
              genreId: r.genreId,
            })
          );

          setRecords(loadedRecords);
          setGenres(data.genres || defaultGenres);
        }
      } catch {
        Alert.alert('エラー', 'データの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const save = async () => {
      try {
        await AsyncStorage.setItem(
          'tomato-data',
          JSON.stringify({ records, genres })
        );
      } catch {
        Alert.alert('エラー', 'データの保存に失敗しました');
      }
    };

    save();
  }, [records, genres, isLoading]);

  function changeMonth(diff: number) {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + diff);
      return next;
    });
  }

  function goToday() {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDay(now.getDate());
  }

  function saveRecord(title: string) {
    const genre = genres.find((g) => g.id === selectedGenreId);
    const newRecord: Record = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      year,
      month,
      day: selectedDay,
      title: title.trim() || (genre ? `${genre.name}の学習` : '学習'),
      genreId: selectedGenreId,
    };
    setRecords((prev) => [...prev, newRecord]);
  }

  function saveGenre(name: string, color: string) {
    const newGenre: Genre = {
      id: Date.now().toString(),
      name,
      color,
    };
    setGenres((prev) => [...prev, newGenre]);
    setSelectedGenreId(newGenre.id);
  }

  function deleteRecord(record: Record) {
    Alert.alert('記録を削除', 'この記録を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => setRecords((prev) => prev.filter((r) => r.id !== record.id)),
      },
    ]);
  }

  function deleteGenre(id: string) {
    Alert.alert('ジャンル削除', '削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => setGenres((prev) => prev.filter((g) => g.id !== id)),
      },
    ]);
  }

  function deleteAllData() {
    Alert.alert(
      'データをリセット',
      'すべての記録とジャンルが削除されます。\nこの操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除する',
          style: 'destructive',
          onPress: async () => {
            setRecords([]);
            setGenres(defaultGenres);
            await AsyncStorage.removeItem('tomato-data');
          },
        },
      ]
    );
  }

  return (
    <AppContext.Provider
      value={{
        records,
        genres,
        selectedGenreId,
        setSelectedGenreId,
        selectedDay,
        setSelectedDay,
        currentDate,
        setCurrentDate,
        year,
        month,
        calendarDays,
        streak,
        isLoading,
        saveRecord,
        saveGenre,
        deleteRecord,
        deleteGenre,
        changeMonth,
        goToday,
        deleteAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
