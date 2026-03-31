import { useAppContext } from '@/context/AppContext';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function GenreSelector() {
  const { genres, selectedGenreId, setSelectedGenreId, deleteGenre } = useAppContext();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {genres.map((g) => {
        const selected = selectedGenreId === g.id;

        return (
          <Pressable
            key={g.id}
            onPress={() => setSelectedGenreId(g.id)}
            onLongPress={() => deleteGenre(g.id)}
            style={[
              styles.chip,
              selected
                ? { backgroundColor: g.color, borderColor: g.color }
                : { borderColor: '#e0e0e0' },
            ]}
          >
            <View
              style={[
                styles.dot,
                { backgroundColor: selected ? 'rgba(255,255,255,0.8)' : g.color },
              ]}
            />
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {g.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 4,
    gap: 8,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    gap: 6,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
  },

  labelSelected: {
    color: 'white',
    fontWeight: '600',
  },
});
