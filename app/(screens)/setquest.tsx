
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView, TextInput,
  Alert, Modal, FlatList, Animated, Easing
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import DayTabBar from '../../components/DayTabBar';
import { router } from 'expo-router';
import ExerciseListModal from '../../components/ExerciseListModal';
import { workoutCategories, defaultExercises } from '../../data/defaultPlan';
import ExerciseCard from '../../components/ExerciseCard';

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
  const [newCategory, setNewCategory] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('barbell-outline');
  const [iconPickerVisible, setIconPickerVisible] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [deletedCategory, setDeletedCategory] = useState(null);
  const [showUndoBanner, setShowUndoBanner] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  const rotateAnim = useState(new Animated.Value(0))[0];
  const inputAnim = useState(new Animated.Value(0))[0];

    const currentExercises =
  exerciseSets[dayCategory] && exerciseSets[dayCategory].length > 0
    ? exerciseSets[dayCategory]
    : defaultExercises[dayCategory] || [];



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
    const catName = category.name || category;
    setWorkoutPlan(prev => ({ ...prev, [day]: catName }));
    setExerciseSets(prev => prev[catName] ? prev : { ...prev, [catName]: [] });
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

  const toggleInput = () => {
    const toValue = showInput ? 0 : 1;

    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(inputAnim, {
        toValue,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    setShowInput(!showInput);
  };

  const dayCategory = workoutPlan[selectedDay] || 'Rest';
  const exercises = exerciseSets[dayCategory] || defaultExercises[dayCategory] || [];

  const inputTranslateY = inputAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  const inputOpacity = inputAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });
console.log('Category:', dayCategory);
console.log('Exercises:', exerciseSets[dayCategory] || defaultExercises[dayCategory]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/home')}>
          <Text style={styles.logo}>Strive<Text style={styles.logoHighlight}>X</Text></Text>
          <Text style={styles.tagline}>Level Up Your Fitness</Text>
        </Pressable>
        <Pressable onPress={() => setInfoVisible(true)}>
          <Ionicons name="information-circle-outline" size={26} color="#ccc" />
        </Pressable>
      </View>

      <Text style={styles.screenTitle}>Quest System</Text>
      <DayTabBar onSelect={setSelectedDay} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          Select Category for {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][selectedDay]}
        </Text>

        {/* Chips */}
        <View style={styles.chipContainer}>
          {[...workoutCategories, ...customCategories.map(c => c.name)].map((name, i) => (
            <Pressable
              key={i}
              onPress={() => updatePlanForDay(selectedDay, name)}
              style={[styles.chip, dayCategory === name && styles.chipSelected]}
            >
              <Ionicons name="flame-outline" size={16} color="#fff" style={{ marginRight: 5 }} />
              <Text style={styles.chipText}>{name}</Text>
            </Pressable>
          ))}

          <Pressable style={styles.chipAdd} onPress={toggleInput}>
            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
              <Ionicons name="add" size={20} color="#fff" />
            </Animated.View>
          </Pressable>
        </View>

        {/* Input Row */}
        <Animated.View style={[styles.inputRow, { opacity: inputOpacity, transform: [{ translateY: inputTranslateY }] }]}>
          <TextInput
            placeholder="New category"
            placeholderTextColor="#888"
            value={newCategory}
            onChangeText={setNewCategory}
            style={styles.input}
          />
          <Pressable onPress={() => setIconPickerVisible(true)} style={styles.iconBtn}>
            <Ionicons name={selectedIcon} size={20} color="#fff" />
          </Pressable>
          <Pressable onPress={addCustomCategory} style={styles.addBtn}>
            <Text style={{ color: '#fff' }}>Add</Text>
          </Pressable>
        </Animated.View>

        {/* Exercise Cards */}
       
{dayCategory !== 'Rest' && (
  <>
    <Text style={styles.subtitle}>Exercises:</Text>
    {currentExercises.map((exercise, idx) => (
      <ExerciseCard
        key={idx}
        exercise={exercise}
        onSetChange={(delta) => {
          const updated = [...currentExercises];
          updated[idx].sets = Math.max(1, updated[idx].sets + delta);
          const updatedSets = { ...exerciseSets, [dayCategory]: updated };
          setExerciseSets(updatedSets);
          AsyncStorage.setItem('userExerciseSets', JSON.stringify(updatedSets));
        }}
        onRepChange={(delta) => {
          const updated = [...currentExercises];
          updated[idx].reps = Math.max(1, updated[idx].reps + delta);
          const updatedSets = { ...exerciseSets, [dayCategory]: updated };
          setExerciseSets(updatedSets);
          AsyncStorage.setItem('userExerciseSets', JSON.stringify(updatedSets));
        }}
      />
    ))}
  </>
)}

        <Pressable onPress={saveAll} style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </ScrollView>

      {/* Info Modal */}
      <Modal visible={infoVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>About StriveX</Text>
            <Text style={{ color: '#ccc', textAlign: 'center', marginTop: 10 }}>
              StriveX helps you plan and track personalized workouts using a gamified quest system. 🏋️‍♂️✨
            </Text>
            <Pressable onPress={() => setInfoVisible(false)} style={styles.closeBtn}>
              <Text style={{ color: '#fff' }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  logo: { fontSize: 30, fontWeight: 'bold', color: '#fff' },
  logoHighlight: { color: '#FF3B30' },
  tagline: { fontSize: 12, color: '#888' },
  screenTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  content: { paddingHorizontal: 20 },
  title: { color: '#fff', fontSize: 16, marginBottom: 10 },
  subtitle: { color: '#aaa', marginVertical: 8, fontSize: 14 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  chip: {
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipSelected: { backgroundColor: '#1E90FF' },
  chipText: { color: '#fff' },
  chipAdd: { backgroundColor: '#333', borderRadius: 20, padding: 8, alignItems: 'center' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: { flex: 1, backgroundColor: '#1e1e1e', color: '#fff', padding: 8, borderRadius: 8, marginRight: 8 },
  iconBtn: { padding: 8, backgroundColor: '#2e2e2e', borderRadius: 8, marginRight: 6 },
  addBtn: { backgroundColor: '#1E90FF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  saveBtn: { backgroundColor: '#1E90FF', marginTop: 20, padding: 12, borderRadius: 10, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#1e1e1e', padding: 20, borderRadius: 16, width: '80%' },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  closeBtn: { marginTop: 16, backgroundColor: '#333', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
});
