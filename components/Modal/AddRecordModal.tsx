import { useAppContext } from '@/context/AppContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useState } from 'react';
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
  const [newGenreColor, setNewGenreColor] = useState('#4CAF50');
  const pan = Gesture.Pan()
    .onEnd((e) => {
      if (e.translationY > 80) {
        close();
      }
    })
    .runOnJS(true);

  const genre = genres.find((g) => g.id === selectedGenreId);

  const selectedDate = new Date(year, month, selectedDay ?? 1);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />

        <GestureDetector gesture={pan}>
          <View style={styles.sheet}>
            <View style={styles.topContent}>
              <View style={styles.dragBar} />

              {!showAddGenre && (
                <>
                  <Text style={styles.title}>記録を追加する</Text>

                  <Text style={styles.input_label}>Date</Text>
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="compact"
                    style={styles.datePicker}
                    onChange={(event, date) => {
                      if (!date) return;

                      setSelectedDay(date.getDate());
                      setCurrentDate(date);
                    }}
                  />

                  <Text style={styles.genreLabel}>タイトル</Text>
                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder={`${genre?.name ?? '例) 英語'}の勉強`}
                    style={styles.input}
                  />

                  <Text style={styles.genreLabel}>ジャンルを選択</Text>

                  <GenreSelector />
                  <View style={styles.addGenreRow}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.addGenreButton,
                        pressed && styles.addGenrePressed,
                      ]}
                      onPress={() => setShowAddGenre(true)}
                    >
                      <Text style={styles.addGenreText}>＋ 新しいジャンル</Text>
                    </Pressable>
                  </View>
                </>
              )}

              {showAddGenre && (
                <AddGenreForm
                  newGenreName={newGenreName}
                  setNewGenreName={setNewGenreName}
                  newGenreColor={newGenreColor}
                  setNewGenreColor={setNewGenreColor}
                  goBack={() => setShowAddGenre(false)}
                />
              )}
            </View>

            <Pressable
              style={styles.saveButton}
              onPress={() => {
                if (showAddGenre) {
                  saveGenre(newGenreName, newGenreColor);
                  setNewGenreName('');
                  setShowAddGenre(false);
                } else {
                  saveRecord(title);
                  setTitle('');
                  close();
                }
              }}
            >
              <Text style={styles.saveText}>
                {showAddGenre ? 'ジャンル保存' : '保存'}
              </Text>
            </Pressable>
          </View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  topContent: {
    justifyContent: 'flex-start',
  },
  sheet: {
    height: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  dragBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 15,
  },

  dateBox: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
  },

  datePicker: {
    marginBottom: 40,
  },

  dateText: {
    fontSize: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 24,
  },
  input_label: {
    marginBottom: 4,
    fontWeight: '600',
  },

  genreLabel: {
    marginBottom: 8,
    fontWeight: '600',
  },

  saveButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,

    backgroundColor: '#ff6347',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  saveText: {
    color: 'white',
    fontWeight: '600',
  },

  addGenreRow: {
    alignItems: 'flex-end',
    marginTop: 8,
  },

  addGenreButton: {
    backgroundColor: '#f3f3f3',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  addGenrePressed: {
    opacity: 0.6,
  },

  addGenreText: {
    fontSize: 12,
    color: '#444',
    fontWeight: '500',
  },
});
