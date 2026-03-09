import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type Props = {
  year: number;
  month: number;
  changeMonth: (diff: number) => void;
};

export default function MonthHeader({ year, month, changeMonth }: Props) {
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
      <Pressable onPress={() => changeMonth(-1)}>
        <Text style={styles.arrow}>◀</Text>
      </Pressable>

      <Pressable
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

      <Pressable onPress={() => changeMonth(1)}>
        <Text style={styles.arrow}>▶</Text>
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
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },

  arrow: {
    fontSize: 20,
  },

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
});
