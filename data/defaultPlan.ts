
// data/defaultPlan.ts

import { warmUpAsync } from "expo-web-browser";

export type Exercise = {
  name: string;
  sets: number;
  reps: number;
  icon?: string;
  notes?: string; // <-- NEW
};


export const workoutCategories = ['Strength', 'Cardio', 'Yoga', 'Rest'] as const;
export type WorkoutCategory = typeof workoutCategories[number];

export const defaultExercises: Record<WorkoutCategory, Exercise[]> = {
  Strength: [
    { name: 'Push Ups', sets: 3, reps: 15 },
    { name: 'Squats', sets: 4, reps: 12 },
    { name: 'Deadlifts', sets: 3, reps: 10 },
  ],
Cardio: [
  { name: 'Running', sets: 1, reps: 30, icon: 'bicycle-outline', notes: 'Duration in minutes' },
  { name: 'Jump Rope', sets: 3, reps: 100, icon: 'flame-outline', notes: 'Warm-up pace' },
],

  Yoga: [
    { name: 'Sun Salutation', sets: 2, reps: 6 },
    { name: 'Tree Pose', sets: 2, reps: 30 }, // seconds
  ],
  Rest: [],
};

