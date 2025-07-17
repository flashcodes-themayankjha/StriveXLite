import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Vibration,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultExercises } from '../../data/defaultPlan';

export default function Quest() {
  const [exerciseList, setExerciseList] = useState<any[]>([]);
  const [todayCategory, setTodayCategory] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const scaleAnimRefs = useRef<Animated.Value[]>([]);

  const todayKey = new Date().toISOString().split('T')[0];

  useEffect(() => {
    (async () => {
      const today = new Date().getDay();
      const planRaw = await AsyncStorage.getItem('userWorkoutPlan');
      const setsRaw = await AsyncStorage.getItem('userExerciseSets');
      const completedRaw = await AsyncStorage.getItem('completedQuests');

      const workoutPlan = planRaw ? JSON.parse(planRaw) : {};
      const allSets = setsRaw ? JSON.parse(setsRaw) : {};
      const completedData = completedRaw ? JSON.parse(completedRaw) : {};

      const selectedCategory = workoutPlan[today];
      setTodayCategory(selectedCategory || null);

      const exercises =
        allSets[selectedCategory]?.length > 0
          ? allSets[selectedCategory]
          : defaultExercises[selectedCategory] || [];

      setExerciseList(exercises);
      setCompletedIds(new Set(completedData[todayKey] || []));

      // 🟦 Initialize animation refs
      scaleAnimRefs.current = exercises.map(() => new Animated.Value(1));
    })();
  }, []);

  const calculateXP = (sets: number, reps: number, multiplier = 1) =>
    Math.floor((10 + sets * reps * 0.4) * multiplier);

  const xpNeeded = (level: number) =>
    Math.floor(100 + level ** 1.5 * 20);

  const completeExercise = async (exercise: any, index: number) => {
    Vibration.vibrate(70);

    const exerciseId = `${todayCategory}_${index}`;
    const alreadyCompleted = completedIds.has(exerciseId);

    const raw = await AsyncStorage.getItem('hunterProfile');
    const profile = raw
      ? JSON.parse(raw)
      : { xp: 0, level: 1, totalXp: 0, nextLevelXp: xpNeeded(1) };

    let { xp, level, totalXp } = profile;
    const xpGained = alreadyCompleted
      ? calculateXP(exercise.sets, exercise.reps, 0.25)
      : calculateXP(exercise.sets, exercise.reps);

    xp += xpGained;
    totalXp += xpGained;

    let leveledUp = false;
    while (xp >= xpNeeded(level)) {
      xp -= xpNeeded(level);
      level++;
      leveledUp = true;
    }

    const updated = {
      ...profile,
      xp,
      level,
      totalXp,
      nextLevelXp: xpNeeded(level),
    };

    await AsyncStorage.setItem('hunterProfile', JSON.stringify(updated));

    if (!alreadyCompleted) {
      const completedRaw = await AsyncStorage.getItem('completedQuests');
      const completedData = completedRaw ? JSON.parse(completedRaw) : {};
      const todayList = new Set(completedData[todayKey] || []);
      todayList.add(exerciseId);
      completedData[todayKey] = Array.from(todayList);
      await AsyncStorage.setItem('completedQuests', JSON.stringify(completedData));
      setCompletedIds(todayList);
    }

    Alert.alert(
      leveledUp ? '🎉 Level Up!' : '✅ Exercise Complete',
      `${alreadyCompleted ? '(Repeat Bonus) ' : ''}+${xpGained} XP`
    );
  };

  const renderAnimatedPressable = (exercise: any, i: number) => {
    const scaleAnim = scaleAnimRefs.current[i];
    const exerciseId = `${todayCategory}_${i}`;
    const completed = completedIds.has(exerciseId);

    const onPressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View key={i} style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          style={styles.questRow}
          onPress={() => completeExercise(exercise, i)}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <MaterialCommunityIcons
            name="dumbbell"
            size={20}
            color="#ccc"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.questText}>{exercise.name}</Text>
          <Text style={styles.questMeta}>
            {exercise.reps} Reps • {exercise.sets} Sets
          </Text>
          <Ionicons
            name="checkmark-done"
            size={18}
            color={completed ? '#1E90FF' : '#555'}
          />
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>🏆 Daily Quest</Text>

      {todayCategory ? (
        exerciseList.length > 0 ? (
          exerciseList.map((exercise, i) => renderAnimatedPressable(exercise, i))
        ) : (
          <Text style={styles.emptyText}>
            No exercises found for "{todayCategory}".
          </Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
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

