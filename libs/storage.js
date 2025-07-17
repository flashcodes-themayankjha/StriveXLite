
export const getUserExerciseSets = async () => {
  const raw = await AsyncStorage.getItem('userExerciseSets');
  return raw ? JSON.parse(raw) : {};
};

export const setUserExerciseSets = async (data) => {
  await AsyncStorage.setItem('userExerciseSets', JSON.stringify(data));
};
