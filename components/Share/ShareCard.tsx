import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  streak: number;
  longestStreak: number;
  totalRecords: number;
};

export default function ShareCard({ streak, longestStreak, totalRecords }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.icon}
        />
        <Text style={styles.appName}>TomaReco</Text>
      </View>

      <View style={styles.streakSection}>
        <Ionicons name="flame" size={40} color="#ff6347" />
        <Text style={styles.streakNumber}>{streak}</Text>
        <Text style={styles.streakLabel}>日連続学習中</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{longestStreak}</Text>
          <Text style={styles.statLabel}>最長連続</Text>
        </View>
        <View style={styles.statSep} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalRecords}</Text>
          <Text style={styles.statLabel}>総記録数</Text>
        </View>
      </View>

      <Text style={styles.tagline}>継続は力なり 🍅</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },

  icon: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },

  appName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff6347',
    letterSpacing: 0.5,
  },

  streakSection: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 24,
  },

  streakNumber: {
    fontSize: 72,
    fontWeight: '900',
    color: '#1a1a1a',
    lineHeight: 80,
  },

  streakLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    letterSpacing: 0.3,
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
  },

  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    marginBottom: 20,
    width: '100%',
    justifyContent: 'center',
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },

  statSep: {
    width: 1,
    height: 32,
    backgroundColor: '#f0f0f0',
  },

  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
  },

  statLabel: {
    fontSize: 11,
    color: '#aaa',
    fontWeight: '500',
  },

  tagline: {
    fontSize: 13,
    color: '#bbb',
    fontWeight: '500',
  },
});
