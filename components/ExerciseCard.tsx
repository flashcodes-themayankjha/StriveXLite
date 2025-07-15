
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  icon?: string;
  notes?: string;
}

interface Props {
  exercise: Exercise;
  onSetChange: (delta: number) => void;
  onRepChange: (delta: number) => void;
}

const ExerciseCard: React.FC<Props> = ({ exercise, onSetChange, onRepChange }) => {
  return (
    <View style={styles.card}>
      {/* Top Row: Icon + Content */}
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
          <Ionicons name={exercise.icon || 'barbell-outline'} size={28} color="#1E90FF" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.name}>{exercise.name}</Text>
          {exercise.notes && (
            <Text style={styles.notes}>📝 {exercise.notes}</Text>
          )}
        </View>
      </View>

      {/* Bottom Row: Sets + Reps */}
      <View style={styles.statsRow}>
        {/* Sets */}
        <View style={styles.inlineAdjust}>
          <Text style={styles.label}>Sets:</Text>
          <Pressable onPress={() => onSetChange(-1)} style={({ pressed }) => [styles.circleButtonRed, pressed && styles.buttonPressed]}>
            <Ionicons name="remove" size={16} color="white" />
          </Pressable>
          <Text style={styles.count}>{String(exercise.sets).padStart(2, '0')}</Text>
          <Pressable onPress={() => onSetChange(1)} style={({ pressed }) => [styles.circleButtonBlue, pressed && styles.buttonPressed]}>
            <Ionicons name="add" size={16} color="white" />
          </Pressable>
        </View>

        {/* Reps */}
        <View style={styles.inlineAdjust}>
          <Text style={styles.label}>Reps:</Text>
          <Pressable onPress={() => onRepChange(-1)} style={({ pressed }) => [styles.circleButtonRed, pressed && styles.buttonPressed]}>
            <Ionicons name="remove" size={16} color="white" />
          </Pressable>
          <Text style={styles.count}>{String(exercise.reps).padStart(2, '0')}</Text>
          <Pressable onPress={() => onRepChange(1)} style={({ pressed }) => [styles.circleButtonBlue, pressed && styles.buttonPressed]}>
            <Ionicons name="add" size={16} color="white" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ExerciseCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e1e',
    padding: 14,
    marginVertical: 8,
    borderRadius: 14,
    borderColor: '#333',
    borderWidth: 1,
    overflow: 'hidden',
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  iconContainer: {
    backgroundColor: '#121212',
    padding: 8,
    borderRadius: 12,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flexShrink: 1,
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notes: {
    color: '#aaa',
    fontSize: 12,
    fontStyle: 'italic',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  inlineAdjust: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  label: {
    color: '#ccc',
    fontSize: 14,
  },
  count: {
    color: '#fff',
    width: 28,
    textAlign: 'center',
    fontSize: 16,
  },
  circleButtonRed: {
    backgroundColor: '#c44569',
    borderRadius: 999,
    padding: 6,
  },
  circleButtonBlue: {
    backgroundColor: '#1E90FF',
    borderRadius: 999,
    padding: 6,
  },
  buttonPressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.8,
  },
});
