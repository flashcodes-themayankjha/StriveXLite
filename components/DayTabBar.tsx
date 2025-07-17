import React, { useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Dimensions } from 'react-native';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const { width } = Dimensions.get('window');

export default function DayTabBar({ onSelect }) {
  const [selectedIndex, setSelectedIndex] = useState(new Date().getDay());
  const [indicatorX] = useState(new Animated.Value(new Date().getDay() * (width / 7)));

  const handleSelect = (index) => {
    setSelectedIndex(index);
    onSelect(index);
    Animated.timing(indicatorX, {
      toValue: index * (width / 7),
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.tabContainer}>
      <Animated.View style={[styles.indicator, { left: indicatorX }]} />
      {dayNames.map((day, i) => (
        <Pressable key={i} style={styles.tab} onPress={() => handleSelect(i)}>
          <Text style={[styles.tabText, selectedIndex === i && styles.activeText]}>{day}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    height: 48,
    borderBottomWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1e1e1e',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: width / 7,
    backgroundColor: '#1E90FF',
    borderRadius: 2,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabText: { color: '#aaa', fontSize: 14 },
  activeText: { color: '#fff', fontWeight: 'bold' },
});

