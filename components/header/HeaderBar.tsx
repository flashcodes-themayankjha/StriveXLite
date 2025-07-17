import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated, Easing, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import HunterProfileModal from './HunterProfileModal';
import SettingsModal from './SettingsModal';

const HeaderBar = () => {
  const [profileVisible, setProfileVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const avatarScale = useRef(new Animated.Value(1)).current;
  const settingsRotate = useRef(new Animated.Value(0)).current;

  const zoomAvatar = (show: boolean) => {
    Animated.timing(avatarScale, {
      toValue: show ? 1.3 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setProfileVisible(show);
  };

  const rotateSettingsIcon = (open: boolean) => {
    Animated.timing(settingsRotate, {
      toValue: open ? 1 : 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    setSettingsVisible(open);
  };

  const rotate = settingsRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <>
      <View style={styles.header}>
        <Pressable onPress={() => zoomAvatar(true)}>
          <Animated.Image
            source={require('../../assets/images/bg2.jpg')}
            style={[styles.avatar, { transform: [{ scale: avatarScale }] }]}
          />
        </Pressable>

        <View style={styles.centerText}>
          <Text style={styles.title}>Strive<Text style={styles.highlight}>X</Text></Text>
          <Text style={styles.subtitle}>Level Up Your Fitness</Text>
        </View>

        <Pressable onPress={() => rotateSettingsIcon(!settingsVisible)}>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="settings-outline" size={26} color="#fff" />
          </Animated.View>
        </Pressable>
      </View>

      <HunterProfileModal visible={profileVisible} onClose={() => zoomAvatar(false)} />
      <SettingsModal visible={settingsVisible} onClose={() => rotateSettingsIcon(false)} />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#121212',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 10,
    marginBottom: 8,
    paddingBottom: 12,
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  centerText: { alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 10, color: '#aaa' },
  highlight: { color: '#FF3B30' },
});

export default HeaderBar;

