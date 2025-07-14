
// data/defaultPlan.ts

export type Exercise = {
  name: string;
  sets: number;
  reps: number;
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
    { name: 'Running', sets: 1, reps: 30 }, // minutes
    { name: 'Jump Rope', sets: 3, reps: 100 },
  ],
  Yoga: [
    { name: 'Sun Salutation', sets: 2, reps: 6 },
    { name: 'Tree Pose', sets: 2, reps: 30 }, // seconds
  ],
  Rest: [],
};
