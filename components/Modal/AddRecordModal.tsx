import {
  Modal,
  View,
  Pressable,
  TextInput,
  Text,
  StyleSheet,
} from 'react-native';
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
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        {/* 背景タップ */}
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />

        {/* Bottom Sheet */}
        <View style={styles.sheet}>
          {/* ドラッグバー */}
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
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 320,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },

  genreLabel: {
    marginBottom: 5,
    fontWeight: '500',
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
