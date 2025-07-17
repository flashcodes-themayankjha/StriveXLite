// pages/ExerciseLib.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { defaultExercises, workoutCategories, WorkoutCategory, Exercise } from '../../data/defaultPlan';
import { getAllExercises, updateExercise } from '../../utils/ExerciseStorage';
import ExerciseCard from '../../components/ExerciseCard'; // Your custom card

const ExerciseLib = () => {
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory | 'All'>('All');

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [searchQuery, selectedCategory, allExercises]);

  const loadExercises = async () => {
    const custom = await getAllExercises();

    // Combine custom + default
    const combined: Exercise[] = Object.values(defaultExercises).flat().concat(custom);
    setAllExercises(combined);
  };

  const filterExercises = () => {
    let filtered = [...allExercises];

    if (selectedCategory !== 'All') {
      const defaultInCategory = defaultExercises[selectedCategory] || [];
      filtered = filtered.filter(ex => defaultInCategory.some(def => def.name === ex.name));
    }

    if (searchQuery) {
      filtered = filtered.filter(ex =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredExercises(filtered);
  };

  const handleSetChange = async (name: string, increment: boolean, isSet = true) => {
    const updated = allExercises.map(ex => {
      if (ex.name === name) {
        const updatedEx = {
          ...ex,
          sets: isSet ? Math.max(1, ex.sets + (increment ? 1 : -1)) : ex.sets,
          reps: !isSet ? Math.max(1, ex.reps + (increment ? 1 : -1)) : ex.reps,
        };
        updateExercise(updatedEx);
        return updatedEx;
      }
      return ex;
    });
    setAllExercises(updated);
  };

  const renderExercise = ({ item }: { item: Exercise }) => (
    <ExerciseCard
      exercise={item}
      onIncreaseSet={() => handleSetChange(item.name, true, true)}
      onDecreaseSet={() => handleSetChange(item.name, false, true)}
      onIncreaseRep={() => handleSetChange(item.name, true, false)}
      onDecreaseRep={() => handleSetChange(item.name, false, false)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Exercise Library</Text>

      {/* Search Bar */}
      <TextInput
        placeholder="Search exercise..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />

      {/* Filter Tabs */}
      <View style={styles.categoryRow}>
        {['All', ...workoutCategories].map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat as WorkoutCategory | 'All')}
            style={[
              styles.categoryBtn,
              selectedCategory === cat && styles.categoryBtnActive,
            ]}
          >
            <Text style={styles.categoryText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Exercise List */}
      <FlatList
        data={filteredExercises}
        renderItem={renderExercise}
        keyExtractor={(item, index) => item.name + index}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

export default ExerciseLib;
// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#1e1e1e',
  },
  categoryBtnActive: {
    backgroundColor: '#3a3a3a',
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
  },
});

