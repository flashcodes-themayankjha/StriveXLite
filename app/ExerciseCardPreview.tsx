import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import ExerciseCard from '../components/ExerciseCard';

export default function ExerciseCardPreview() {
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(15);

  return ( 
    <SafeAreaView style={styles.container}>
      <ExerciseCard
        exercise={{
          name: 'Push Ups',
          sets,
          reps,
          icon: 'fitness-outline',
          notes: 'Keep back straight and engage your core.',
        }}
        onSetChange={(delta) => setSets(prev => Math.max(1, prev + delta))}
        onRepChange={(delta) => setReps(prev => Math.max(1, prev + delta))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    padding: 20,
  },
});


