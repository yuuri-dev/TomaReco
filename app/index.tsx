import { View, Text, StyleSheet } from 'react-native';

export default function Home() {
  const days = Array.from({ length: 35 }, (_, i) => ({
    day: i + 1,
    hasStudy: Math.random() > 0.7,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tomato Study 🍅</Text>

      <View style={styles.calendar}>
        <View style={styles.grid}>
          {days.map((item) => (
            <View key={item.day} style={styles.day}>
              <Text style={styles.date}>{item.day}</Text>
              <Text>{item.hasStudy ? '🍅' : '🌱'}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  calendar: {
    width: '90%',
    height: 400,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  day: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: 10,
  },
});
