import Calendar from '@/components/Calendar/Calendar';
import MonthHeader from '@/components/Calendar/MonthHeader';
import AddRecordModal from '@/components/Modal/AddRecordModal';
import RecordList from '@/components/Record/RecordList';
import { useAppContext } from '@/context/AppContext';
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
      <View style={styles.streakBox}>
        <Text style={styles.streakText}>{streak} 日連続🔥</Text>
      </View>

      <MonthHeader />

      <GestureDetector gesture={pan}>
        <Calendar />
      </GestureDetector>

      <RecordList />

      <Pressable style={styles.addButton} onPress={() => setShowInput(true)}>
        <Text style={styles.addText}>＋</Text>
      </Pressable>

      <AddRecordModal visible={showInput} close={() => setShowInput(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
  },

  addButton: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    width: 65,
    height: 65,
    borderRadius: 32,
    backgroundColor: '#ff6347',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addText: {
    fontSize: 30,
    color: 'white',
  },

  streakBox: {
    marginBottom: 10,
  },

  streakText: {
    fontSize: 16,
    fontWeight: '600',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
