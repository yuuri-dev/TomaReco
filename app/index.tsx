import Calendar from '@/components/Calendar/Calendar';
import MonthHeader from '@/components/Calendar/MonthHeader';
import AddRecordModal from '@/components/Modal/AddRecordModal';
import RecordList from '@/components/Record/RecordList';
import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function Home() {
  const { streak, changeMonth, isLoading } = useAppContext();
  const [showInput, setShowInput] = useState(false);

  const pan = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onEnd((e) => {
      if (e.translationX > 50) changeMonth(-1);
      if (e.translationX < -50) changeMonth(1);
    })
    .runOnJS(true);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6347" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.streakCard}>
        <Ionicons name="flame" size={20} color="#ff6347" />
        <Text style={styles.streakCount}>{streak}</Text>
        <Text style={styles.streakLabel}>日連続</Text>
      </View>

      <MonthHeader />

      <GestureDetector gesture={pan}>
        <Calendar />
      </GestureDetector>

      <RecordList />

      <Pressable style={styles.addButton} onPress={() => setShowInput(true)}>
        <Ionicons name="add" size={32} color="white" />
      </Pressable>

      <AddRecordModal visible={showInput} close={() => setShowInput(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },

  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  streakCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  streakLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },

  addButton: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff6347',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6347',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
