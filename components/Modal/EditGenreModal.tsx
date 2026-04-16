import { useAppContext } from '@/context/AppContext';
import { Genre } from '@/type/genre';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const COLORS = [
  '#ff6347',
  '#4CAF50',
  '#2196F3',
  '#FF9800',
  '#E91E63',
  '#9C27B0',
];

type Props = {
  genre: Genre | null;
  onClose: () => void;
};

export default function EditGenreModal({ genre, onClose }: Props) {
  const { editGenre } = useAppContext();
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (genre) {
      setName(genre.name);
      setColor(genre.color);
    }
  }, [genre]);

  function handleSave() {
    if (!genre || !name.trim()) return;
    editGenre(genre.id, name.trim(), color);
    onClose();
  }

  return (
    <Modal visible={!!genre} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.dialog}>
          <View style={styles.header}>
            <Text style={styles.title}>ジャンルを編集</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color="#aaa" />
            </Pressable>
          </View>

          <Text style={styles.label}>ジャンル名</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="例) リスニング"
            placeholderTextColor="#bbb"
            autoFocus
          />

          <Text style={styles.label}>カラー</Text>
          <View style={styles.colorRow}>
            {COLORS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setColor(c)}
                style={[styles.colorSwatch, { backgroundColor: c }]}
              >
                {color === c && (
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={14} color={c} />
                  </View>
                )}
              </Pressable>
            ))}
          </View>

          <View style={styles.preview}>
            <View style={[styles.previewDot, { backgroundColor: color }]} />
            <Text style={styles.previewText}>{name || 'ジャンル名'}</Text>
          </View>

          <Pressable
            style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!name.trim()}
          >
            <Text style={styles.saveText}>保存する</Text>
          </Pressable>
        </View>
      </View>
      </KeyboardAvoidingView>
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

  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1a1a1a',
    marginBottom: 20,
  },

  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
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
    borderRadius: 14,
    paddingHorizontal: 16,
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
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
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
