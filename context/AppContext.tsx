import { Genre } from '@/type/genre';
import { Record } from '@/type/record';
import {
  cancelAllReminders,
  requestNotificationPermission,
  scheduleDailyReminder,
} from '@/utils/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';

const DATA_KEY = DATA_KEY;
const NOTIFICATION_KEY = 'tomato-notification';

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
  editGenre: (id: string, name: string, color: string) => void;
  changeMonth: (diff: number) => void;
  goToday: () => void;
  deleteAllData: () => void;
  notificationEnabled: boolean;
  notificationTime: { hour: number; minute: number };
  toggleNotification: () => Promise<void>;
  updateNotificationTime: (hour: number, minute: number) => Promise<void>;
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
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState({ hour: 21, minute: 0 });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1 }));
  const firstDay = new Date(year, month, 1).getDay();
  const calendarDays: ({ day: number } | null)[] = [
    ...Array(firstDay).fill(null),
    ...days,
  ];

  const streak = useMemo(() => {
    const dates = records.map((r) => new Date(r.year, r.month, r.day).toDateString());
    const uniqueDates = new Set(dates);
    let count = 0;
    const current = new Date();
    while (uniqueDates.has(current.toDateString())) {
      count++;
      current.setDate(current.getDate() - 1);
    }
    return count;
  }, [records]);

  useEffect(() => {
    const load = async () => {
      try {
        const json = await AsyncStorage.getItem(DATA_KEY);

        if (json !== null) {
          const data = JSON.parse(json);

          type PersistedRecord = Omit<Record, 'id'> & { id?: string };
          const rawRecords = Array.isArray(data.records) ? data.records : [];
          const loadedRecords: Record[] = rawRecords.map(
            (r: PersistedRecord): Record => ({
              id: r.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              year: Number(r.year),
              month: Number(r.month),
              day: Number(r.day),
              title: String(r.title ?? ''),
              genreId: String(r.genreId ?? ''),
            })
          );

          const rawGenres = Array.isArray(data.genres) ? data.genres : null;
          setRecords(loadedRecords);
          setGenres(rawGenres ?? defaultGenres);
        }

        const notifJson = await AsyncStorage.getItem(NOTIFICATION_KEY);
        if (notifJson !== null) {
          const notif = JSON.parse(notifJson);
          setNotificationEnabled(notif.enabled ?? false);
          setNotificationTime({
            hour: notif.hour ?? 21,
            minute: notif.minute ?? 0,
          });
        }
      } catch {
        Alert.alert('エラー', 'データの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const isSavingRef = useRef(false);
  const pendingSaveRef = useRef<{ records: Record[]; genres: Genre[] } | null>(null);

  const flushSave = useCallback(async (data: { records: Record[]; genres: Genre[] }) => {
    if (isSavingRef.current) {
      pendingSaveRef.current = data;
      return;
    }
    isSavingRef.current = true;
    try {
      await AsyncStorage.setItem(DATA_KEY, JSON.stringify(data));
    } catch {
      Alert.alert('エラー', 'データの保存に失敗しました');
    } finally {
      isSavingRef.current = false;
      if (pendingSaveRef.current) {
        const next = pendingSaveRef.current;
        pendingSaveRef.current = null;
        flushSave(next);
      }
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    flushSave({ records, genres });
  }, [records, genres, isLoading, flushSave]);

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

  function editGenre(id: string, name: string, color: string) {
    setGenres((prev) =>
      prev.map((g) => (g.id === id ? { ...g, name, color } : g))
    );
  }

  function deleteGenre(id: string) {
    Alert.alert('ジャンル削除', '削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => {
          if (selectedGenreId === id) {
            const next = genres.find((g) => g.id !== id);
            if (next) setSelectedGenreId(next.id);
          }
          setGenres((prev) => prev.filter((g) => g.id !== id));
        },
      },
    ]);
  }

  async function toggleNotification() {
    if (notificationEnabled) {
      await cancelAllReminders();
      setNotificationEnabled(false);
      await AsyncStorage.setItem(
        NOTIFICATION_KEY,
        JSON.stringify({ enabled: false, ...notificationTime })
      );
    } else {
      const granted = await requestNotificationPermission();
      if (!granted) return;
      await scheduleDailyReminder(notificationTime.hour, notificationTime.minute);
      setNotificationEnabled(true);
      await AsyncStorage.setItem(
        NOTIFICATION_KEY,
        JSON.stringify({ enabled: true, ...notificationTime })
      );
    }
  }

  async function updateNotificationTime(hour: number, minute: number) {
    setNotificationTime({ hour, minute });
    if (notificationEnabled) {
      await scheduleDailyReminder(hour, minute);
    }
    await AsyncStorage.setItem(
      NOTIFICATION_KEY,
      JSON.stringify({ enabled: notificationEnabled, hour, minute })
    );
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
            try {
              await AsyncStorage.removeItem(DATA_KEY);
              setRecords([]);
              setGenres(defaultGenres);
            } catch {
              Alert.alert('エラー', 'データの削除に失敗しました');
            }
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
        editGenre,
        changeMonth,
        goToday,
        deleteAllData,
        notificationEnabled,
        notificationTime,
        toggleNotification,
        updateNotificationTime,
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
