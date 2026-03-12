import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  year: number;
  month: number;
  changeMonth: (diff: number) => void;
  goToday: () => void;
};

export default function MonthHeader({ year, month, changeMonth,goToday }: Props) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [tempMonth, setTempMonth] = useState(month);
  const [tempYear, setTempYear] = useState(year);

  return (
    <View style={styles.monthHeader}>
      <Pressable
        style={({ pressed }) => [
          styles.arrowButton,
          pressed && { opacity: 0.6 },
        ]}
        onPress={() => changeMonth(-1)}
      >
        <Ionicons name="chevron-back" size={22} color="#333" />
      </Pressable>

      <Pressable
        style={styles.monthContainer}
        onPress={() => {
          setTempMonth(month);
          setTempYear(year);
          setShowMonthPicker(true);
        }}
      >
        <Text style={styles.monthText}>
          {monthNames[month]} {year}
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.arrowButton,
          pressed && { opacity: 0.6 },
        ]}
        onPress={() => changeMonth(1)}
      >
        <Ionicons name="chevron-forward" size={22} color="#333" />
      </Pressable>

      {/* 今日ボタン */}
      <Pressable style={styles.todayButton} onPress={goToday}>
        <Text style={styles.todayText}>Today</Text>
      </Pressable>

      <Modal visible={showMonthPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          {/* 背景タップで閉じる */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowMonthPicker(false)}
          />

          <View style={styles.monthModal}>
            <View style={styles.pickerRow}>
              <Picker
                style={styles.picker}
                selectedValue={tempMonth}
                onValueChange={(value) => setTempMonth(value)}
              >
                {monthNames.map((m, i) => (
                  <Picker.Item key={i} label={m} value={i} />
                ))}
              </Picker>

              <Picker
                style={styles.picker}
                selectedValue={tempYear}
                onValueChange={(value) => setTempYear(value)}
              >
                {Array.from({ length: 20 }, (_, i) => {
                  const y = year - 10 + i;
                  return <Picker.Item key={y} label={`${y}`} value={y} />;
                })}
              </Picker>
            </View>

            <Pressable
              style={styles.selectButton}
              onPress={() => {
                const diff = (tempYear - year) * 12 + (tempMonth - month);
                changeMonth(diff);
                setShowMonthPicker(false);
              }}
            >
              <Text style={styles.selectText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  monthModal: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 20,
    width: 300,
  },

  pickerRow: {
    flexDirection: 'row',
  },

  picker: {
    flex: 1,
    height: 150,
  },

  selectButton: {
    marginTop: 10,
    backgroundColor: '#ff6347',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  selectText: {
    color: 'white',
    fontWeight: '600',
  },

  monthHeader: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  monthContainer: {
    flex: 1,
    alignItems: 'center',
  },

  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f3f3f3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  arrow: {
    fontSize: 22,
    fontWeight: '600',
  },
  todayButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ff6347',
  },

  todayText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
});
