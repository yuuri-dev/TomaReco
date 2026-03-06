import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

type Props = {
  newGenreName: string;
  setNewGenreName: (v: string) => void;
  newGenreColor: string;
  setNewGenreColor: (v: string) => void;
  saveGenre: () => void;
  goBack: () => void;
};

export default function AddGenreForm({
  newGenreName,
  setNewGenreName,
  newGenreColor,
  setNewGenreColor,
  saveGenre,
  goBack,
}: Props) {
  return (
    <>
      <Text style={styles.title}>Add Genre</Text>

      <TextInput
        placeholder="Genre name"
        value={newGenreName}
        onChangeText={setNewGenreName}
        style={styles.input}
      />

      <View style={styles.colorRow}>
        {['#4CAF50', '#2196F3', '#FF9800', '#E91E63'].map((c) => (
          <Pressable
            key={c}
            onPress={() => setNewGenreColor(c)}
            style={[
              styles.color,
              { backgroundColor: c },
              newGenreColor === c && styles.selected,
            ]}
          />
        ))}
      </View>

      <Pressable style={styles.saveButton} onPress={saveGenre}>
        <Text style={styles.saveText}>Save</Text>
      </Pressable>

      <Pressable style={styles.backButton} onPress={goBack}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 10,
  },

  colorRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  color: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },

  selected: {
    borderWidth: 3,
    borderColor: '#333',
  },

  saveButton: {
    backgroundColor: '#ff6347',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  saveText: {
    color: 'white',
    fontWeight: '600',
  },

  backButton: {
    marginTop: 10,
    alignItems: 'center',
  },

  backText: {
    color: '#666',
  },
});
