
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Vibration,
} from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  steps: number;
  distance: number;
  calories: number;
  onHydrationTapSeries?: () => void;
  onAddXP?: (amount: number) => void; // 🔁 from HunterProfile
}

export default function Stats({
  steps,
  distance,
  calories,
  onHydrationTapSeries,
  onAddXP,
}: Props) {
  const [localHydration, setLocalHydration] = useState(0);

  useEffect(() => {
    const loadHydration = async () => {
      const stored = await AsyncStorage.getItem('hydration');
      if (stored) setLocalHydration(Number(stored));
    };
    loadHydration();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('hydration', String(localHydration));
    const timeout = setTimeout(async () => {
      setLocalHydration(0);
      await AsyncStorage.setItem('hydration', '0');
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearTimeout(timeout);
  }, [localHydration]);

  const handleHydrationTap = async () => {
    const newHydration = Math.min(localHydration + 10, 100);
    setLocalHydration(newHydration);
    Vibration.vibrate(40);

    if (newHydration === 100) {
      await trackHydrationStreak();
    }
  };

  const handleHydrationLongPress = () => {
    Vibration.vibrate(100);
    onHydrationTapSeries?.();
  };

  const trackHydrationStreak = async () => {
    const today = new Date().toDateString();
    const lastDate = await AsyncStorage.getItem('lastHydratedDate');
    const currentStreak = parseInt((await AsyncStorage.getItem('hydrationStreak')) || '0', 10);

    if (lastDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = lastDate === yesterday.toDateString() ? currentStreak + 1 : 1;

    if (newStreak >= 4) {
      onAddXP?.(100); // ✅ use HunterProfile XP logic
      newStreak = 0;
    }

    await AsyncStorage.setItem('hydrationStreak', String(newStreak));
    await AsyncStorage.setItem('lastHydratedDate', today);
  };

  const getHydrationIcon = () => {
    if (localHydration === 0)
      return <MaterialCommunityIcons name="water-remove-outline" size={30} color="#808080" />;
    if (localHydration === 100)
      return <MaterialCommunityIcons name="water-check" size={30} color="#00BFFF" />;
    return <MaterialCommunityIcons name="water-opacity" size={30} color="#00BFFF" />;
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Daily Stats</Text>

      <View style={styles.statsRow}>
        <Pressable style={styles.statBox} android_ripple={{ color: '#333' }} onPress={() => Vibration.vibrate(20)}>
          <FontAwesome5 name="walking" size={24} color="#1E90FF" style={styles.icon} />
          <Text style={styles.statNumber}>{steps.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Steps</Text>
        </Pressable>

        <Pressable style={styles.statBox} android_ripple={{ color: '#333' }} onPress={() => Vibration.vibrate(20)}>
          <MaterialCommunityIcons name="map-marker-distance" size={24} color="#32CD32" style={styles.icon} />
          <Text style={styles.statNumber}>{distance.toFixed(1)} km</Text>
          <Text style={styles.statLabel}>Distance</Text>
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <Pressable style={styles.statBox} android_ripple={{ color: '#333' }} onPress={() => Vibration.vibrate(20)}>
          <MaterialCommunityIcons name="fire" size={30} color="#FF6347" style={styles.icon} />
          <Text style={styles.statNumber}>{calories.toFixed(1)} kcal</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </Pressable>

        <Pressable
          style={styles.statBox}
          onPress={handleHydrationTap}
          onLongPress={handleHydrationLongPress}
          android_ripple={{ color: '#333' }}
        >
          <View style={styles.icon}>{getHydrationIcon()}</View>
          <Text style={styles.statNumber}>{localHydration}%</Text>
          <Text style={styles.statLabel}>Hydration</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 20 },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 12,
  },
  statBox: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 12,
    width: '44%',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  statLabel: {
    color: '#aaa',
    fontSize: 13,
  },
  icon: {
    marginBottom: 6,
  },
});
