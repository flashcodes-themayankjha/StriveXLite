
// At top
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView, TextInput,
  Alert, Modal, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import DayTabBar from '../../components/DayTabBar';
import { workoutCategories } from '../../data/defaultPlan';

const iconOptions = [
  'barbell-outline', 'bicycle-outline', 'walk-outline',
  'fitness-outline', 'heart-outline', 'flame-outline',
  'medal-outline', 'tennisball-outline', 'golf-outline',
];

export default function SetQuestScreen() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [workoutPlan, setWorkoutPlan] = useState({});
  const [exerciseSets, setExerciseSets] = useState({});
  const [customCategories, setCustomCategories] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('barbell-outline');
  const [iconPickerVisible, setIconPickerVisible] = useState(false);
  const [deletedCategory, setDeletedCategory] = useState(null);
  const [showUndoBanner, setShowUndoBanner] = useState(false);

  useEffect(() => {
    (async () => {
      const planRaw = await AsyncStorage.getItem('userWorkoutPlan');
      const setsRaw = await AsyncStorage.getItem('userExerciseSets');
      const customRaw = await AsyncStorage.getItem('customWorkoutCategories');

      setWorkoutPlan(planRaw ? JSON.parse(planRaw) : {});
      setExerciseSets(setsRaw ? JSON.parse(setsRaw) : {});
      setCustomCategories(customRaw ? JSON.parse(customRaw) : []);
    })();
  }, []);

  const updatePlanForDay = (day, category) => {
    setWorkoutPlan((prev) => ({ ...prev, [day]: category.name || category }));
  };

  const saveAll = async () => {
    await AsyncStorage.setItem('userWorkoutPlan', JSON.stringify(workoutPlan));
    await AsyncStorage.setItem('userExerciseSets', JSON.stringify(exerciseSets));
    await AsyncStorage.setItem('customWorkoutCategories', JSON.stringify(customCategories));
    alert('Workout plan saved!');
  };

  const addCustomCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed || workoutCategories.includes(trimmed) || customCategories.some(c => c.name === trimmed)) {
      Alert.alert("Invalid or duplicate category");
      return;
    }

    const newCat = { name: trimmed, icon: selectedIcon };
    const updated = [...customCategories, newCat];
    setCustomCategories(updated);
    await AsyncStorage.setItem('customWorkoutCategories', JSON.stringify(updated));
    setNewCategory('');
    setShowInput(false);
  };

  const dayCategory = workoutPlan[selectedDay] || 'Rest';

  const getIconForCategory = (category) => {
    const found = customCategories.find(c => c.name === category);
    if (found) return found.icon;
    const defaultIcons = {
      Strength: 'barbell-outline',
      Cardio: 'heart-outline',
      Yoga: 'fitness-outline',
      Rest: 'moon-outline',
    };
    return defaultIcons[category] || 'bicycle-outline';
  };

  const handleDeleteCategory = (name) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const toDelete = customCategories.find(c => c.name === name);
            const updated = customCategories.filter(c => c.name !== name);

            const updatedPlan = { ...workoutPlan };
            const removedDays = [];

            Object.keys(updatedPlan).forEach(day => {
              if (updatedPlan[day] === name) {
                updatedPlan[day] = 'Rest';
                removedDays.push(day);
              }
            });

            setCustomCategories(updated);
            setWorkoutPlan(updatedPlan);
            setDeletedCategory({ category: toDelete, days: removedDays });
            setShowUndoBanner(true);

            await AsyncStorage.setItem('customWorkoutCategories', JSON.stringify(updated));
            await AsyncStorage.setItem('userWorkoutPlan', JSON.stringify(updatedPlan));

            setTimeout(() => setShowUndoBanner(false), 5000);
          },
        },
      ]
    );
  };

  const undoDelete = async () => {
    if (!deletedCategory) return;

    const restored = [...customCategories, deletedCategory.category];
    const updatedPlan = { ...workoutPlan };

    deletedCategory.days.forEach(day => {
      updatedPlan[day] = deletedCategory.category.name;
    });

    setCustomCategories(restored);
    setWorkoutPlan(updatedPlan);
    setDeletedCategory(null);
    setShowUndoBanner(false);

    await AsyncStorage.setItem('customWorkoutCategories', JSON.stringify(restored));
    await AsyncStorage.setItem('userWorkoutPlan', JSON.stringify(updatedPlan));
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={styles.logo}>
          Strive<Text style={styles.logoHighlight}>X</Text>
        </Text>
        <Text style={styles.tagline}>Level Up Your Fitness</Text>
      </View>

      <Text style={styles.screenTitle}>Setting Up Daily Quest</Text>
      <DayTabBar onSelect={setSelectedDay} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          Select Category for {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][selectedDay]}
        </Text>

        <View style={styles.chipContainer}>
          {workoutCategories.map((name) => (
            <Pressable
              key={name}
              style={[styles.chip, dayCategory === name && styles.chipSelected]}
              onPress={() => updatePlanForDay(selectedDay, { name })}
            >
              <Ionicons name={getIconForCategory(name)} size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.chipText}>{name}</Text>
            </Pressable>
          ))}

          {customCategories.map((cat) => (
            <Pressable
              key={cat.name}
              onPress={() => updatePlanForDay(selectedDay, cat)}
              onLongPress={() => handleDeleteCategory(cat.name)}
              style={[styles.chip, dayCategory === cat.name && styles.chipSelected]}
            >
              <Ionicons name={cat.icon} size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.chipText}>{cat.name}</Text>
            </Pressable>
          ))}

          <Pressable style={styles.chipAdd} onPress={() => setShowInput(true)}>
            <Ionicons name="add" size={20} color="#fff" />
          </Pressable>
        </View>

        {showInput && (
          <View style={styles.inputRow}>
            <TextInput
              value={newCategory}
              onChangeText={setNewCategory}
              placeholder="Custom category"
              placeholderTextColor="#888"
              style={styles.input}
            />
            <Pressable onPress={() => setIconPickerVisible(true)} style={styles.iconBtn}>
              <Ionicons name={selectedIcon} size={20} color="#fff" />
            </Pressable>
            <Pressable style={styles.addBtn} onPress={addCustomCategory}>
              <Text style={{ color: '#fff' }}>Add</Text>
            </Pressable>
          </View>
        )}

        {dayCategory !== 'Rest' && (
          <>
            <Text style={styles.subtitle}>Exercises:</Text>
            {(exerciseSets[dayCategory] || []).map((ex, i) => (
              <Text key={i} style={styles.exerciseItem}>
                • {ex.name} – {ex.sets} sets × {ex.reps} reps
              </Text>
            ))}
          </>
        )}

        <Pressable onPress={saveAll} style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </ScrollView>

      {/* Icon Picker */}
      <Modal visible={iconPickerVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select an Icon</Text>
            <FlatList
              data={iconOptions}
              numColumns={4}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.iconOption}
                  onPress={() => {
                    setSelectedIcon(item);
                    setIconPickerVisible(false);
                  }}
                >
                  <Ionicons name={item} size={28} color="#fff" />
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Undo Snackbar */}
      {showUndoBanner && deletedCategory && (
        <View style={styles.undoBanner}>
          <Text style={styles.undoText}>
            Deleted "{deletedCategory.category.name}"
          </Text>
          <Pressable onPress={undoDelete}>
            <Text style={styles.undoLink}>UNDO</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  logo: { fontSize: 36, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginVertical: 10, marginTop: 30 },
  logoHighlight: { color: '#FF3B30' },
  tagline: { color: '#aaa', fontSize: 14, marginTop: 4 },
  screenTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  content: { padding: 20 },
  title: { color: '#fff', fontSize: 18, marginBottom: 10 },
  subtitle: { color: '#ccc', fontSize: 16, marginBottom: 6 },
  exerciseItem: { color: '#aaa', marginBottom: 4 },
  saveBtn: { marginTop: 20, backgroundColor: '#1E90FF', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: 'bold' },

  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20, gap: 10 },
  chip: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipSelected: { backgroundColor: '#1E90FF' },
  chipText: { color: '#fff' },
  chipAdd: {
    backgroundColor: '#444',
    borderRadius: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  iconBtn: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    marginRight: 6,
  },
  addBtn: {
    backgroundColor: '#1E90FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 16,
    width: '80%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
    textAlign: 'center',
  },
  iconOption: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
  },
  undoBanner: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  undoText: { color: '#fff', fontSize: 14 },
  undoLink: { color: '#1E90FF', fontWeight: 'bold', marginLeft: 16 },
});
