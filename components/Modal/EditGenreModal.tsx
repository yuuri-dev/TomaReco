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
    <Modal visible={!!genre} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheet}
      >
        <View style={styles.handle} />

        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.cancelButton}>
            <Ionicons name="close" size={20} color="#888" />
          </Pressable>
          <Text style={styles.title}>ジャンルを編集</Text>
          <View style={styles.headerSpacer} />
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
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },

  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  cancelButton: {
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
