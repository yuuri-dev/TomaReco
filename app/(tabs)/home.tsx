import Calendar from '@/components/Calendar/Calendar';
import MonthHeader from '@/components/Calendar/MonthHeader';
import AddRecordModal from '@/components/Modal/AddRecordModal';
import RecordList from '@/components/Record/RecordList';
import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const { changeMonth, isLoading, levelInfo } = useAppContext();
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MonthHeader />

        <GestureDetector gesture={pan}>
          <Calendar onDoubleTap={() => setShowInput(true)} />
        </GestureDetector>

        <RecordList />

        <View style={styles.fabSpacer} />
      </ScrollView>

      <Pressable style={styles.addButton} onPress={() => setShowInput(true)}>
        <Ionicons name="add" size={32} color="white" />
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv.{levelInfo.level}</Text>
        </View>
      </Pressable>

      <AddRecordModal visible={showInput} close={() => setShowInput(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  scrollContent: {
    paddingTop: 16,
    alignItems: 'center',
  },

  fabSpacer: {
    height: 100,
  },

  addButton: {
    position: 'absolute',
    bottom: 20,
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

  levelBadge: {
    position: 'absolute',
    top: -6,
    left: -6,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderWidth: 1.5,
    borderColor: '#ff6347',
  },

  levelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ff6347',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
