
// components/ExerciseListModal.tsx

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Exercise } from '../data/defaultPlan';

type Props = {
  visible: boolean;
  onClose: () => void;
  exercises: Exercise[];
  onSave: (updated: Exercise[]) => void;
};

export default function ExerciseListModal({
  visible,
  onClose,
  exercises,
  onSave,
}: Props) {
  const [localList, setLocalList] = useState<Exercise[]>(exercises);

  const updateExercise = (index: number, field: keyof Exercise, value: string) => {
    const updated = [...localList];
    if (field === 'name') updated[index][field] = value;
    else updated[index][field] = parseInt(value) || 0;
    setLocalList(updated);
  };

  const addExercise = () => {
    setLocalList([...localList, { name: '', sets: 3, reps: 10 }]);
  };

  const removeExercise = (index: number) => {
    const updated = [...localList];
    updated.splice(index, 1);
    setLocalList(updated);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.header}>Edit Exercises</Text>

          <FlatList
            data={localList}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.exerciseRow}>
                <TextInput
                  style={styles.input}
                  value={item.name}
                  placeholder="Exercise Name"
                  placeholderTextColor="#777"
                  onChangeText={(text) => updateExercise(index, 'name', text)}
                />
                <TextInput
                  style={styles.smallInput}
                  value={item.sets.toString()}
                  keyboardType="number-pad"
                  onChangeText={(text) => updateExercise(index, 'sets', text)}
                />
                <TextInput
                  style={styles.smallInput}
                  value={item.reps.toString()}
                  keyboardType="number-pad"
                  onChangeText={(text) => updateExercise(index, 'reps', text)}
                />
                <Pressable onPress={() => removeExercise(index)}>
                  <Ionicons name="trash" size={20} color="#f66" />
                </Pressable>
              </View>
            )}
          />

          <View style={styles.footer}>
            <Pressable onPress={addExercise} style={styles.addButton}>
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={{ color: '#fff', marginLeft: 6 }}>Add</Text>
            </Pressable>

            <Pressable onPress={() => { onSave(localList); onClose(); }} style={styles.saveBtn}>
              <Text style={{ color: '#fff' }}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', alignItems: 'center',
  },
  modal: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 16,
    width: '90%',
    maxHeight: '85%',
  },
  header: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    padding: 8,
    borderRadius: 6,
  },
  smallInput: {
    width: 50,
    backgroundColor: '#333',
    color: '#fff',
    padding: 8,
    borderRadius: 6,
    textAlign: 'center',
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 8,
  },
  saveBtn: {
    backgroundColor: '#1E90FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
