// components/AddCustomExercise.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, Picker, KeyboardAvoidingView, Platform } from 'react-native';
import { defaultExercises, workoutCategories, WorkoutCategory, Exercise } from '@/data/defaultPlan';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAddExercise: (category: WorkoutCategory, exercise: Exercise) => void;
};

const AddCustomExercise = ({ visible, onClose, onAddExercise }: Props) => {
  const [category, setCategory] = useState<WorkoutCategory>('Strength');
  const [name, setName] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    if (name.trim()) {
      const newExercise: Exercise = {
        name,
        sets: parseInt(sets),
        reps: parseInt(reps),
        notes,
      };
      onAddExercise(category, newExercise);
      setName('');
      setSets('3');
      setReps('10');
      setNotes('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Add Custom Exercise</Text>

          <TextInput
            placeholder="Exercise Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <View style={styles.row}>
            <TextInput
              placeholder="Sets"
              value={sets}
              onChangeText={setSets}
              keyboardType="numeric"
              style={styles.smallInput}
            />
            <TextInput
              placeholder="Reps"
              value={reps}
              onChangeText={setReps}
              keyboardType="numeric"
              style={styles.smallInput}
            />
          </View>

          <TextInput
            placeholder="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
          />

          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue as WorkoutCategory)}
            style={styles.picker}
          >
            {workoutCategories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAdd} style={styles.add}>
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddCustomExercise;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000aa',
  },
  container: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    paddingVertical: 8,
    marginVertical: 8,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInput: {
    flex: 1,
    borderBottomWidth: 1,
    paddingVertical: 8,
    margin: 8,
    fontSize: 16,
  },
  picker: {
    marginVertical: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancel: {
    padding: 10,
  },
  cancelText: {
    color: '#999',
    fontSize: 16,
  },
  add: {
    padding: 10,
    backgroundColor: '#1e90ff',
    borderRadius: 8,
  },
  addText: {
    color: '#fff',
    fontWeight: '600',
  },
});

