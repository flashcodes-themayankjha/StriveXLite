
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultExercises } from '../../data/defaultPlan';

export default function Quest() {
  const [exerciseList, setExerciseList] = useState<any[]>([]);
  const [todayCategory, setTodayCategory] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const today = new Date().getDay(); // 0 - Sunday, 3 - Wednesday, etc.
      const planRaw = await AsyncStorage.getItem('userWorkoutPlan');
      const setsRaw = await AsyncStorage.getItem('userExerciseSets');

      const workoutPlan = planRaw ? JSON.parse(planRaw) : {};
      const allSets = setsRaw ? JSON.parse(setsRaw) : {};

      const selectedCategory = workoutPlan[today];
      setTodayCategory(selectedCategory || null);

      const exercises =
        allSets[selectedCategory]?.length > 0
          ? allSets[selectedCategory]
          : defaultExercises[selectedCategory] || [];

      setExerciseList(exercises);
    })();
  }, []);

  const calculateXP = (sets: number, reps: number) => Math.floor(5 + sets * reps * 0.5);

  const completeExercise = async (exercise: any) => {
    const xpGained = calculateXP(exercise.sets, exercise.reps);
    const raw = await AsyncStorage.getItem('hunterProfile');
    const profile = raw ? JSON.parse(raw) : { xp: 0, level: 1 };

    profile.xp += xpGained;
    let leveledUp = false;

    const xpNeeded = (level: number) => Math.floor(50 + 10 * level * 1.3);
    while (profile.xp >= xpNeeded(profile.level)) {
      profile.xp -= xpNeeded(profile.level);
      profile.level++;
      leveledUp = true;
    }

    await AsyncStorage.setItem('hunterProfile', JSON.stringify(profile));

    Alert.alert(
      leveledUp ? '🎉 Level Up!' : '✅ Exercise Complete',
      leveledUp ? `New Level: ${profile.level}` : `+${xpGained} XP`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Daily Quest</Text>

      {todayCategory ? (
        exerciseList.length > 0 ? (
          exerciseList.map((exercise, i) => (
            <Pressable key={i} style={styles.questRow} onPress={() => completeExercise(exercise)}>
              <MaterialCommunityIcons name="dumbbell" size={20} color="#ccc" style={{ marginRight: 8 }} />
              <Text style={styles.questText}>{exercise.name}</Text>
              <Text style={styles.questMeta}>{exercise.reps} Reps • {exercise.sets} Sets</Text>
              <Ionicons name="checkmark-done" size={18} color="#6cff6c" />
            </Pressable>
          ))
        ) : (
          <Text style={styles.emptyText}>No exercises found for "{todayCategory}".</Text>
        )
      ) : (
        <Text style={styles.emptyText}>No category set for today.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: 20, marginBottom: 20 },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    marginBottom: 10,
    borderRadius: 12,
    padding: 14,
  },
  questText: { flex: 1, color: '#fff', fontSize: 16 },
  questMeta: { color: '#aaa', fontSize: 12, marginRight: 8 },
  emptyText: { color: '#aaa', textAlign: 'center', marginTop: 10 },
});
