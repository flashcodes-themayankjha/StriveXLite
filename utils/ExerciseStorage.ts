// utils/ExerciseStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise } from '../data/defaultPlan';

const STORAGE_KEY = 'custom_exercises';

export const saveExercise = async (exercise: Exercise) => {
  const existing = await getAllExercises();
  const updated = [...existing, exercise];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getAllExercises = async (): Promise<Exercise[]> => {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
};

export const updateExercise = async (updatedExercise: Exercise) => {
  const existing = await getAllExercises();
  const updated = existing.map(ex => ex.name === updatedExercise.name ? updatedExercise : ex);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const deleteExercise = async (name: string) => {
  const existing = await getAllExercises();
  const filtered = existing.filter(ex => ex.name !== name);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const clearAllExercises = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};

