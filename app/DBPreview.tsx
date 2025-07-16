
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function DebugScreen() {
  const [debugData, setDebugData] = useState<any>({});

  const keysToFetch = [
    'userWorkoutPlan',
    'userExerciseSets',
    'customWorkoutCategories',
    'hunterProfile',
  ];

  const loadDebugData = async () => {
    const allData: any = {};

    for (const key of keysToFetch) {
      const value = await AsyncStorage.getItem(key);
      allData[key] = value ? JSON.parse(value) : '❌ Not Set';
    }

    setDebugData(allData);
  };

  useFocusEffect(() => {
    loadDebugData();
  });

  const clearAll = async () => {
    await AsyncStorage.clear();
    setDebugData({});
    Alert.alert('🧹 Cleared', 'All data removed from AsyncStorage');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧪 StriveX Debug Screen</Text>

      {keysToFetch.map((key) => (
        <View key={key} style={styles.card}>
          <Text style={styles.cardTitle}>{key}</Text>
          <Text style={styles.cardContent}>
            {JSON.stringify(debugData[key], null, 2)}
          </Text>
        </View>
      ))}

      <Pressable onPress={loadDebugData} style={styles.reloadBtn}>
        <Ionicons name="refresh" size={20} color="#fff" />
        <Text style={styles.reloadText}>Reload</Text>
      </Pressable>

      <Pressable onPress={clearAll} style={styles.clearBtn}>
        <Ionicons name="trash-outline" size={20} color="#fff" />
        <Text style={styles.clearText}>Clear All</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  cardTitle: {
    color: '#1E90FF',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardContent: {
    color: '#ccc',
    fontFamily: 'monospace',
    fontSize: 13,
  },
  reloadBtn: {
    flexDirection: 'row',
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  reloadText: { color: '#fff', marginLeft: 8 },
  clearBtn: {
    flexDirection: 'row',
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  clearText: { color: '#fff', marginLeft: 8 },
});
