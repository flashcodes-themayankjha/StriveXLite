import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  steps: number;
  distance: number;
  calories: number;
}

export default function Stats({ steps, distance, calories }: Props) {
  return (
    <>
      <Text style={styles.sectionTitle}>Daily Stats</Text>
      <View style={styles.statsRow}>
        <View style={styles.statBox}><Text style={styles.statNumber}>{steps.toLocaleString()}</Text><Text style={styles.statLabel}>Steps</Text></View>
        <View style={styles.statBox}><Text style={styles.statNumber}>{distance.toFixed(1)} km</Text><Text style={styles.statLabel}>Distance</Text></View>
      </View>
      <View style={[styles.statBox, { alignSelf: 'center', width: '92%' }]}>
        <Text style={styles.statNumber}>{calories} kcal</Text><Text style={styles.statLabel}>Calories</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  statLabel: { color: '#aaa' },
});
