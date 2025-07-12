import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [hunter, setHunter] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loadHunter = async () => {
      const data = await AsyncStorage.getItem('hunterProfile');
      if (data) {
        setHunter(JSON.parse(data));
      }
    };
    loadHunter();
  }, []);

  const logout = async () => {
    await AsyncStorage.clear();
    router.replace('/signin');
  };

  if (!hunter) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#1E90FF" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome, {hunter.name} 👋</Text>
      <Text style={styles.detail}>Age: {hunter.age}</Text>
      <Text style={styles.detail}>Weight: {hunter.weight} kg</Text>
      <Text style={styles.detail}>Height: {hunter.height} cm</Text>

      <Pressable style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 24, justifyContent: 'center' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  detail: { fontSize: 16, color: '#ccc', marginBottom: 8 },
  button: {
    marginTop: 40,
    backgroundColor: '#FF3B30',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

