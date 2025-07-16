
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Vibration,
} from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  steps: number;
  distance: number;
  calories: number;
  hydration?: number;
  onHydrationChange?: (level: number) => void;
  onHydrationTapSeries?: () => void;
}

export default function Stats({
  steps,
  distance,
  calories,
  hydration = 0,
  onHydrationChange,
  onHydrationTapSeries,
}: Props) {
  const [localHydration, setLocalHydration] = useState(hydration);
  const hydrationResetTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (hydrationResetTimeout.current) clearTimeout(hydrationResetTimeout.current);
    hydrationResetTimeout.current = setTimeout(() => {
      setLocalHydration(0);
      onHydrationChange?.(0);
    }, 6 *60 * 60 * 1000); // Reset every 6 hours 

    return () => {
      if (hydrationResetTimeout.current) clearTimeout(hydrationResetTimeout.current);
    };
  }, [localHydration]);

  const handleHydrationTap = () => {
    Vibration.vibrate(50);
    const newHydration = Math.min(localHydration + 10, 100);
    setLocalHydration(newHydration);
    onHydrationChange?.(newHydration);
  };

  const handleHydrationLongPress = () => {
    Vibration.vibrate(100);
    onHydrationTapSeries?.();
  };

  const handleGenericCardTap = () => {
    Vibration.vibrate(10); // light haptic feedback for non-hydration cards
  };

  const hydrationColor = `rgba(0,191,255,${localHydration / 100})`;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Daily Stats</Text>

      <View style={styles.statsRow}>
        <Pressable
          onPress={handleGenericCardTap}
          style={({ pressed }) => [styles.statBox, pressed && styles.pressed]}
        >
          <FontAwesome5 name="walking" size={20} color="#1E90FF" style={styles.icon} />
          <Text style={styles.statNumber}>{steps.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Steps</Text>
        </Pressable>

        <Pressable
          onPress={handleGenericCardTap}
          style={({ pressed }) => [styles.statBox, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons name="map-marker-distance" size={20} color="#32CD32" style={styles.icon} />
          <Text style={styles.statNumber}>{distance.toFixed(1)} km</Text>
          <Text style={styles.statLabel}>Distance</Text>
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <Pressable
          onPress={handleGenericCardTap}
          style={({ pressed }) => [styles.statBox, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons name="fire" size={20} color="#FF6347" style={styles.icon} />
          <Text style={styles.statNumber}>{calories.toFixed(1)} kcal</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </Pressable>

        <Pressable
          onPress={handleHydrationTap}
          onLongPress={handleHydrationLongPress}
          style={({ pressed }) => [styles.statBox, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons
            name="water"
            size={40}
            color={hydrationColor}
            style={styles.icon}
          />
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
  pressed: {
    backgroundColor: '#2a2a2a',
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
