// components/ExerciseListModal.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import exercisesData from '../data/defaultExercises.json';

export default function ExerciseListModal({ visible, onClose, onSelect }) {
  const [search, setSearch] = useState('');
  const [exerciseList, setExerciseList] = useState([]);
  const [infoExercise, setInfoExercise] = useState(null);

  useEffect(() => {
    setExerciseList(exercisesData);
  }, []);

  const filtered = exerciseList.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Exercise Library</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </Pressable>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Search exercises..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.details}>{item.category} • {item.sets}×{item.reps}</Text>
              </View>
              <View style={styles.actions}>
                <Pressable onPress={() => setInfoExercise(item)}>
                  <Ionicons name="information-circle-outline" size={22} color="#ccc" />
                </Pressable>
                <Pressable onPress={() => onSelect(item)} style={styles.addBtn}>
                  <Ionicons name="add" size={20} color="#fff" />
                </Pressable>
              </View>
            </View>
          )}
        />

        {/* GIF Modal */}
        <Modal visible={!!infoExercise} transparent animationType="fade">
          <Pressable style={styles.infoOverlay} onPress={() => setInfoExercise(null)}>
            <View style={styles.infoModal}>
              <Text style={styles.infoTitle}>{infoExercise?.name}</Text>
              <Image
                source={{ uri: infoExercise?.gif }}
                style={styles.gifImage}
                resizeMode="contain"
              />
              <Text style={styles.details}>{infoExercise?.sets} sets × {infoExercise?.reps} reps</Text>
            </View>
          </Pressable>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10
  },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  input: {
    backgroundColor: '#1e1e1e', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 12
  },
  card: {
    backgroundColor: '#1e1e1e', padding: 12, borderRadius: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10
  },
  name: { color: '#fff', fontSize: 16 },
  details: { color: '#aaa', fontSize: 13, marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  addBtn: {
    backgroundColor: '#1E90FF', padding: 6, borderRadius: 6
  },
  infoOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center'
  },
  infoModal: {
    backgroundColor: '#1e1e1e', padding: 20, borderRadius: 12, width: '80%', alignItems: 'center'
  },
  infoTitle: { color: '#fff', fontSize: 18, marginBottom: 10 },
  gifImage: { width: 200, height: 200, borderRadius: 10, marginBottom: 10 }
});

