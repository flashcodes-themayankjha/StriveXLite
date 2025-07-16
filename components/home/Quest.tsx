import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface QuestProps {
  exerciseList: any[];
  userData: any;
  onProfileUpdate: (updatedProfile: any) => void;
}

export default function Quest({ exerciseList, userData, onProfileUpdate }: QuestProps) {
  const calculateXP = (sets: number, reps: number) => Math.floor(5 + sets * reps * 0.5);

  const completeExercise = async (exercise: any) => {
    const xpGained = calculateXP(exercise.sets, exercise.reps);
    let profile = { ...(userData || { xp: 0, level: 1 }) };

    profile.xp += xpGained;
    let leveledUp = false;

    const xpNeeded = (level: number) => Math.floor(50 + 10 * level * 1.3);

    while (profile.xp >= xpNeeded(profile.level)) {
      profile.xp -= xpNeeded(profile.level);
      profile.level++;
      leveledUp = true;
    }

    await AsyncStorage.setItem('hunterProfile', JSON.stringify(profile));
    onProfileUpdate(profile);

    Alert.alert(
      leveledUp ? '🎉 Level Up!' : '✅ Exercise Complete',
      leveledUp ? `New Level: ${profile.level}` : `+${xpGained} XP`
    );
  };

  return (
    <>
      <Text style={styles.sectionTitle}>Daily Quest</Text>
      {exerciseList.map((exercise, i) => (
        <Pressable key={i} style={styles.questRow} onPress={() => completeExercise(exercise)}>
          <MaterialCommunityIcons name="dumbbell" size={20} color="#ccc" style={{ marginRight: 8 }} />
          <Text style={styles.questText}>{exercise.name}</Text>
          <Text style={styles.questMeta}>{exercise.reps} Reps • {exercise.sets} Sets</Text>
          <Ionicons name="checkmark-done" size={18} color="#6cff6c" />
        </Pressable>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 8,
  },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    padding: 14,
  },
  questText: { flex: 1, color: '#fff', fontSize: 16 },
  questMeta: { color: '#aaa', fontSize: 12, marginRight: 8 },
});

