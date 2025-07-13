// lib/xpUtils.js
export const calculateExerciseXP = (exercise) => {
  return exercise.baseXP + (exercise.sets * exercise.reps * 0.1);
};

export const xpNeededForLevel = (level) => {
  return Math.floor(50 + 10 * level * 1.3);
};

export const getRank = (level) => {
  if (level >= 100) return 'S';
  if (level >= 80) return 'A';
  if (level >= 60) return 'B';
  if (level >= 40) return 'C';
  if (level >= 20) return 'D';
  if (level >= 6) return 'E';
  return 'F';
};

