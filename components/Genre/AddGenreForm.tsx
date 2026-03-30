import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  newGenreName: string;
  setNewGenreName: (v: string) => void;
  newGenreColor: string;
  setNewGenreColor: (v: string) => void;
  goBack: () => void;
};

export default function AddGenreForm({
  newGenreName,
  setNewGenreName,
  newGenreColor,
  setNewGenreColor,
  goBack,
}: Props) {
  return (
    <>
      <Text style={styles.title}>ジャンルを追加</Text>

      <TextInput
        placeholder="ジャンル名"
        value={newGenreName}
        onChangeText={setNewGenreName}
        style={styles.input}
      />

      <View style={styles.colorRow}>
        {['#4CAF50', '#2196F3', '#FF9800', '#E91E63'].map((c) => {
          const selected = newGenreColor === c;

          return (
            <Pressable
              key={c}
              onPress={() => setNewGenreColor(c)}
              style={[
                styles.color,
                { backgroundColor: c },
                selected && styles.selectedColor,
              ]}
            >
              {selected && <Text style={styles.check}>✓</Text>}
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginTop: 20 }}>
        <Pressable onPress={goBack}>
          <Text style={{ color: '#666' }}>← 戻る</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },

  footer: {
    marginTop: 20,
  },

  saveButton: {
    backgroundColor: '#ff6347',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  saveText: {
    color: 'white',
    fontWeight: '600',
  },

  backText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
      marginBottom: 18,
    textAlign:'center'
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  selected: {
    borderWidth: 3,
    borderColor: '#333',
  },
  colorRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  color: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedColor: {
    borderWidth: 3,
    borderColor: '#333',
  },

  check: {
    color: 'white',
    fontWeight: 'bold',
  },

  backButton: {
    marginTop: 10,
    alignItems: 'center',
  },
});
