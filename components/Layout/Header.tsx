import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <View style={styles.inner}>
        <Ionicons name="timer-outline" size={20} color="white" />
        <Text style={styles.title}>TomaReco</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#ff6347',
    paddingTop: 56,
    paddingBottom: 14,
  },

  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 1,
  },
});

export default Header;
