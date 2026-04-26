import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const COLORS = [
  '#ff6347',
  '#4CAF50',
  '#2196F3',
  '#FF9800',
  '#E91E63',
  '#9C27B0',
];

type Props = {
  newGenreName: string;
  setNewGenreName: (v: string) => void;
  newGenreColor: string;
  setNewGenreColor: (v: string) => void;
  goBack: () => void;
  onSave: () => void;
};

export default function AddGenreForm({
  newGenreName,
  setNewGenreName,
  newGenreColor,
  setNewGenreColor,
  goBack,
  onSave,
}: Props) {
  return (
    <>
      <View style={styles.header}>
        <Pressable onPress={goBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#333" />
        </Pressable>
        <Text style={styles.title}>新しいジャンル</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Text style={styles.label}>ジャンル名</Text>
      <TextInput
        placeholder="例) リスニング"
        placeholderTextColor="#bbb"
        value={newGenreName}
        onChangeText={setNewGenreName}
        style={styles.input}
        autoFocus
      />

      <Text style={styles.label}>カラー</Text>
      <View style={styles.colorRow}>
        {COLORS.map((c) => {
          const selected = newGenreColor === c;
          return (
            <Pressable
              key={c}
              onPress={() => setNewGenreColor(c)}
              style={[styles.colorSwatch, { backgroundColor: c }]}
            >
              {selected && (
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={14} color={c} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.preview}>
        <View style={[styles.previewDot, { backgroundColor: newGenreColor }]} />
        <Text style={styles.previewText}>
          {newGenreName || 'ジャンル名'}
        </Text>
      </View>

      <Pressable
        style={[styles.saveButton, !newGenreName.trim() && styles.saveButtonDisabled]}
        onPress={onSave}
        disabled={!newGenreName.trim()}
      >
        <Text style={styles.saveText}>追加する</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },

  headerSpacer: {
    width: 36,
  },

  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#aaa',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1a1a1a',
    marginBottom: 20,
  },

  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  colorSwatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 24,
    gap: 8,
  },

  previewDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  previewText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },

  saveButton: {
    backgroundColor: '#ff6347',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },

  saveButtonDisabled: {
    opacity: 0.4,
  },

  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
