import { ScrollView, Pressable, Text, View, StyleSheet } from 'react-native';

type Genre = {
  id: string;
  name: string;
  color: string;
};

type Props = {
  genres: Genre[];
  selectedGenreId: string;
  setSelectedGenreId: (id: string) => void;
  openAddGenre: () => void;
};

export default function GenreSelector({
  genres,
  selectedGenreId,
  setSelectedGenreId,
  openAddGenre,
}: Props) {
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
            style={[styles.genre, selected && { backgroundColor: g.color }]}
          >
            <View
              style={[
                styles.dot,
                { backgroundColor: selected ? 'white' : g.color },
              ]}
            />

            <Text style={[styles.text, selected && { color: 'white' }]}>
              {g.name}
            </Text>
          </Pressable>
        );
      })}

      <Pressable style={styles.addGenre} onPress={openAddGenre}>
        <Text style={{ fontSize: 18 }}>＋</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 20,
    alignItems: 'center',
  },

  genre: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36, // ←高さ固定
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#eee',
    marginRight: 10,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  text: {
    fontSize: 13,
  },

  addGenre: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 12,
  },
});
