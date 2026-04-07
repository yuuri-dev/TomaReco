import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function MonthHeader() {
  const { year, month, changeMonth, goToday, streak } = useAppContext();
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [tempMonth, setTempMonth] = useState(month);
  const [tempYear, setTempYear] = useState(year);

  return (
    <View style={styles.header}>
      {/* 左：連続日数 */}
      <View style={styles.streakBadge}>
        <Ionicons name="flame" size={15} color="#ff6347" />
        <Text style={styles.streakCount}>{streak}</Text>
        <Text style={styles.streakLabel}>日</Text>
      </View>

      {/* 中央：月ナビ（矢印位置固定） */}
      <View style={styles.navGroup}>
        <Pressable
          style={({ pressed }) => [styles.arrowButton, pressed && styles.arrowPressed]}
          onPress={() => changeMonth(-1)}
        >
          <Ionicons name="chevron-back" size={20} color="#333" />
        </Pressable>

        <Pressable
          style={styles.monthContainer}
          onPress={() => {
            setTempMonth(month);
            setTempYear(year);
            setShowMonthPicker(true);
          }}
        >
          <Text style={styles.monthText} numberOfLines={1}>
            {MONTH_NAMES[month]} {year}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.arrowButton, pressed && styles.arrowPressed]}
          onPress={() => changeMonth(1)}
        >
          <Ionicons name="chevron-forward" size={20} color="#333" />
        </Pressable>
      </View>

      {/* 右：Today */}
      <Pressable style={styles.todayButton} onPress={goToday}>
        <Text style={styles.todayText}>Today</Text>
      </Pressable>

      <Modal visible={showMonthPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowMonthPicker(false)} />
          <View style={styles.monthModal}>
            <View style={styles.pickerRow}>
              <Picker style={styles.picker} selectedValue={tempMonth} onValueChange={setTempMonth}>
                {MONTH_NAMES.map((m, i) => <Picker.Item key={i} label={m} value={i} />)}
              </Picker>
              <Picker style={styles.picker} selectedValue={tempYear} onValueChange={setTempYear}>
                {Array.from({ length: 20 }, (_, i) => {
                  const y = year - 10 + i;
                  return <Picker.Item key={y} label={`${y}`} value={y} />;
                })}
              </Picker>
            </View>
            <Pressable
              style={styles.selectButton}
              onPress={() => {
                changeMonth((tempYear - year) * 12 + (tempMonth - month));
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
  header: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minWidth: 60,
  },
  streakCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  streakLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },

  navGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  arrowButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#f3f3f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowPressed: {
    backgroundColor: '#e8e8e8',
  },
  monthContainer: {
    width: 148,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  todayButton: {
    minWidth: 60,
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#fff0ee',
  },
  todayText: {
    color: '#ff6347',
    fontWeight: '700',
    fontSize: 13,
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
