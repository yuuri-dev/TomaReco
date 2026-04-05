import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AddGenreForm from '../Genre/AddGenreForm';
import GenreSelector from '../Genre/GenreSelector';

type Props = {
  visible: boolean;
  close: () => void;
};

export default function AddRecordModal({ visible, close }: Props) {
  const {
    genres,
    selectedGenreId,
    selectedDay,
    setSelectedDay,
    year,
    month,
    setCurrentDate,
    saveRecord,
    saveGenre,
  } = useAppContext();

  const [showAddGenre, setShowAddGenre] = useState(false);
  const [title, setTitle] = useState('');
  const [newGenreName, setNewGenreName] = useState('');
  const [newGenreColor, setNewGenreColor] = useState('#ff6347');

  const genre = genres.find((g) => g.id === selectedGenreId);
  const selectedDate = new Date(year, month, selectedDay ?? 1);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />

        <View style={styles.dialog}>
          {!showAddGenre ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>記録を追加</Text>
                <Pressable onPress={close} hitSlop={12}>
                  <Ionicons name="close" size={22} color="#aaa" />
                </Pressable>
              </View>

              <Text style={styles.label}>日付</Text>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={18} color="#aaa" />
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="compact"
                  onChange={(_, date) => {
                    if (!date) return;
                    setSelectedDay(date.getDate());
                    setCurrentDate(date);
                  }}
                />
              </View>

              <Text style={styles.label}>タイトル</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder={`${genre?.name ?? '英語'}の勉強`}
                placeholderTextColor="#bbb"
                style={styles.input}
              />

              <Text style={styles.label}>ジャンル</Text>
              <GenreSelector />
              {!genre && (
                <Text style={styles.errorText}>ジャンルを選択してください</Text>
              )}

              <Pressable
                style={styles.addGenreChip}
                onPress={() => setShowAddGenre(true)}
              >
                <Ionicons name="add" size={15} color="#888" />
                <Text style={styles.addGenreText}>新しいジャンル</Text>
              </Pressable>

              <Pressable
                style={[styles.saveButton, !genre && styles.saveButtonDisabled]}
                disabled={!genre}
                onPress={() => {
                  saveRecord(title);
                  setTitle('');
                  close();
                }}
              >
                <Text style={styles.saveText}>保存する</Text>
              </Pressable>
            </>
          ) : (
            <AddGenreForm
              newGenreName={newGenreName}
              setNewGenreName={setNewGenreName}
              newGenreColor={newGenreColor}
              setNewGenreColor={setNewGenreColor}
              goBack={() => setShowAddGenre(false)}
              onSave={() => {
                saveGenre(newGenreName, newGenreColor);
                setNewGenreName('');
                setNewGenreColor('#ff6347');
                setShowAddGenre(false);
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  dialog: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#aaa',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 8,
  },

  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1a1a1a',
    marginBottom: 20,
  },

  addGenreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 4,
  },

  addGenreText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },

  errorText: {
    fontSize: 12,
    color: '#e05555',
    marginTop: 8,
    marginBottom: 2,
  },

  saveButton: {
    backgroundColor: '#ff6347',
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 24,
  },

  saveButtonDisabled: {
    opacity: 0.4,
  },

  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
