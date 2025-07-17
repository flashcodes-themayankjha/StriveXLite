// data/defaultPlan.ts

export type Exercise = {
  name: string;
  sets: number;
  reps: number;
  icon?: string;
  notes?: string;
};

export const workoutCategories = ['Push', 'Pull', 'Legs', 'Core', 'Cardio', 'Yoga', 'Rest'] as const;
export type WorkoutCategory = typeof workoutCategories[number];

export const defaultExercises: Record<WorkoutCategory, Exercise[]> = {
  Push: [
    { name: 'Push Ups', sets: 3, reps: 15, icon: 'barbell-outline', notes: 'Control the tempo' },
    { name: 'Incline Dumbbell Press', sets: 4, reps: 10, icon: 'fitness-outline', notes: 'Keep elbows at 45°' },
    { name: 'Shoulder Press', sets: 3, reps: 12, icon: 'resize-outline', notes: 'Full range of motion' },
    { name: 'Lateral Raises', sets: 3, reps: 15, icon: 'walk-outline', notes: 'Pause at the top' },
  ],
  Pull: [
    { name: 'Pull Ups', sets: 3, reps: 8, icon: 'arrow-up-outline', notes: 'Controlled negatives' },
    { name: 'Barbell Rows', sets: 4, reps: 10, icon: 'analytics-outline', notes: 'Flat back' },
    { name: 'Face Pulls', sets: 3, reps: 15, icon: 'options-outline', notes: 'Great for posture' },
    { name: 'Bicep Curls', sets: 3, reps: 12, icon: 'body-outline', notes: 'Squeeze at the top' },
  ],
  Legs: [
    { name: 'Squats', sets: 4, reps: 12, icon: 'walk-outline', notes: 'Go below parallel' },
    { name: 'Deadlifts', sets: 3, reps: 10, icon: 'barbell-outline', notes: 'Hinge from hips' },
    { name: 'Lunges', sets: 3, reps: 12, icon: 'shuffle-outline', notes: 'Each leg' },
    { name: 'Calf Raises', sets: 4, reps: 20, icon: 'trending-up-outline', notes: 'Full stretch and squeeze' },
  ],
  Core: [
    { name: 'Planks', sets: 3, reps: 60, icon: 'remove-outline', notes: 'Hold in seconds' },
    { name: 'Leg Raises', sets: 3, reps: 15, icon: 'arrow-up-outline', notes: 'No swinging' },
    { name: 'Russian Twists', sets: 3, reps: 20, icon: 'refresh-outline', notes: 'Each side' },
    { name: 'Mountain Climbers', sets: 3, reps: 30, icon: 'pulse-outline', notes: 'Stay fast-paced' },
  ],
  Cardio: [
    { name: 'Running', sets: 1, reps: 30, icon: 'bicycle-outline', notes: 'Duration in minutes' },
    { name: 'Jump Rope', sets: 3, reps: 100, icon: 'flame-outline', notes: 'Warm-up pace' },
    { name: 'Cycling', sets: 1, reps: 45, icon: 'bicycle-outline', notes: 'Steady-state' },
    { name: 'HIIT Sprints', sets: 5, reps: 30, icon: 'flash-outline', notes: '30s sprint, 90s rest' },
  ],
  Yoga: [
    { name: 'Sun Salutation', sets: 2, reps: 6, icon: 'sunny-outline', notes: 'Slow breathing' },
    { name: 'Tree Pose', sets: 2, reps: 30, icon: 'leaf-outline', notes: 'Hold in seconds' },
    { name: 'Child’s Pose', sets: 2, reps: 60, icon: 'pause-circle-outline', notes: 'Hold for relaxation' },
  ],
  Rest: [],
};

