import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import AddGenreForm from '../Genre/AddGenreForm';
import GenreSelector from '../Genre/GenreSelector';

type Genre = {
  id: string;
  name: string;
  color: string;
};

type Props = {
  visible: boolean;
  close: () => void;
  showAddGenre: boolean;
  setShowAddGenre: (v: boolean) => void;
  title: string;
  setTitle: (v: string) => void;
  genres: Genre[];
  selectedGenreId: string;
  setSelectedGenreId: (id: string) => void;
  newGenreName: string;
  setNewGenreName: (v: string) => void;
  newGenreColor: string;
  setNewGenreColor: (v: string) => void;
  saveRecord: () => void;
  saveGenre: () => void;
};

export default function AddRecordModal({
  visible,
  close,
  showAddGenre,
  setShowAddGenre,
  title,
  setTitle,
  genres,
  selectedGenreId,
  setSelectedGenreId,
  newGenreName,
  setNewGenreName,
  newGenreColor,
  setNewGenreColor,
  saveRecord,
  saveGenre,
}: Props) {
  const pan = Gesture.Pan()
    .onEnd((e) => {
      if (e.translationY > 80) {
        close();
      }
    })
    .runOnJS(true);
  
  const genre = genres.find((g) => g.id === selectedGenreId);

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

                  <Text style={styles.genreLabel}>タイトル</Text>
                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder={`${genre?.name}の勉強`}
                    style={styles.input}
                  />

                  <Text style={styles.genreLabel}>ジャンルを選択</Text>

                  <GenreSelector
                    genres={genres}
                    selectedGenreId={selectedGenreId}
                    setSelectedGenreId={setSelectedGenreId}
                  />
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
                  saveGenre={saveGenre}
                  goBack={() => setShowAddGenre(false)}
                />
              )}
            </View>

            <Pressable
              style={styles.saveButton}
              onPress={showAddGenre ? saveGenre : saveRecord}
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

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign:'center',
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
