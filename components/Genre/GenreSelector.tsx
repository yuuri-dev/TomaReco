import { ScrollView, Pressable, Text } from 'react-native';

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
      contentContainerStyle={{ paddingRight: 20 }}
      style={{ marginBottom: 10 }}
    >
      {genres.map((g) => (
        <Pressable
          key={g.id}
          onPress={() => setSelectedGenreId(g.id)}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            marginRight: 8,
            borderRadius: 8,
            backgroundColor: selectedGenreId === g.id ? g.color : '#eee',
          }}
        >
          <Text
            style={{
              color: selectedGenreId === g.id ? 'white' : 'black',
            }}
          >
            {g.name}
          </Text>
        </Pressable>
      ))}

      <Pressable onPress={openAddGenre}>
        <Text>＋</Text>
      </Pressable>
    </ScrollView>
  );
}
