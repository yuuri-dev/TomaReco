import {
  Modal,
  View,
  Pressable,
  TextInput,
  Text,
  StyleSheet,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import GenreSelector from '../Genre/GenreSelector';
import AddGenreForm from '../Genre/AddGenreForm';

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

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />

        <GestureDetector gesture={pan}>
          <View style={styles.sheet}>
            <View style={styles.dragBar} />

            {!showAddGenre && (
              <>
                <Text style={styles.title}>Add Record</Text>

                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="記録する内容"
                  style={styles.input}
                />

                <Text style={styles.genreLabel}>Genre</Text>

                <GenreSelector
                  genres={genres}
                  selectedGenreId={selectedGenreId}
                  setSelectedGenreId={setSelectedGenreId}
                  openAddGenre={() => setShowAddGenre(true)}
                />

                <Pressable style={styles.saveButton} onPress={saveRecord}>
                  <Text style={styles.saveText}>保存</Text>
                </Pressable>
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
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },

  genreLabel: {
    marginBottom: 8,
    fontWeight: '600',
  },

  saveButton: {
    backgroundColor: '#ff6347',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  saveText: {
    color: 'white',
    fontWeight: '600',
  },
});
