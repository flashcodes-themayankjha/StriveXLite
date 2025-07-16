
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, Pressable,
  Modal, Dimensions, ScrollView, Animated, Easing, InteractionManager
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderBar from '../../components/HeaderBar';
import Stats from '../../components/home/Stats';
import Quest from '../../components/home/Quest';
import HydrationReminderModal from '../../components/home/HydrationReminderModal';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [profileVisible, setProfileVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [exerciseList, setExerciseList] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hydrationModalVisible, setHydrationModalVisible] = useState(false);

  const settingsRotateAnim = useState(new Animated.Value(0))[0];

  const toggleSettingsModal = () => {
    Animated.timing(settingsRotateAnim, {
      toValue: settingsVisible ? 0 : 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      setSettingsVisible(!settingsVisible);
    });
  };

  const settingsRotate = settingsRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace('/onboarding');
  };

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      (async () => {
        const raw = await AsyncStorage.getItem('hunterProfile');
        const data = raw ? JSON.parse(raw) : null;
        setUserData(data);

        const today = new Date().getDay();
        const planRaw = await AsyncStorage.getItem('userWorkoutPlan');
        const workoutPlan = planRaw ? JSON.parse(planRaw) : {};

        const todayCategory = workoutPlan[today];
        if (!todayCategory) return;

        const setsRaw = await AsyncStorage.getItem('userExerciseSets');
        const allSets = setsRaw ? JSON.parse(setsRaw) : {};
        const todayExercises = allSets[todayCategory] || [];

        setExerciseList(todayExercises);
      })();
    });
  }, []);

  const currentSteps = 6000;
  const totalSteps = 10000;
  const progress = (currentSteps / totalSteps) * 100;

  const handleHydrationTapSeries = () => {
    setHydrationModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <HeaderBar showBack showSettings={false} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.questCard}>
          <Image source={require('../../assets/images/bg2.jpg')} style={styles.questImage} />
          <Text style={styles.questTitle}>Conquer the Day</Text>
          <Text style={styles.questDesc}>Embrace the challenge and push your limits.</Text>
          <Text style={styles.questGoal}>10000 steps</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>

 <Stats
  steps={currentSteps}
  distance={4.5}
  calories={350}
  onHydrationTapSeries={handleHydrationTapSeries}
  onAddXP={(amount) => {
    const updated = {
      ...userData,
      xp: (userData?.xp || 0) + amount,
    };
    setUserData(updated);
    AsyncStorage.setItem('hunterProfile', JSON.stringify(updated));
  }}
/>


        <Quest
          exerciseList={exerciseList}
          userData={userData}
          onProfileUpdate={(profile) => setUserData(profile)}
        />
      </ScrollView>

      {/* Hydration Modal */}
      <HydrationReminderModal
        visible={hydrationModalVisible}
        onClose={() => setHydrationModalVisible(false)}
      />

      {/* Settings Modal */}
      <Modal animationType="slide" transparent={true} visible={settingsVisible} onRequestClose={toggleSettingsModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Settings</Text>

            <Pressable
              style={styles.modalBtn}
              onPress={() => {
                toggleSettingsModal();
                setTimeout(() => { router.push('/setquest') }, 50);
              }}
            >
              <Ionicons name="calendar-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.modalBtnText}>Edit Daily Quest</Text>
            </Pressable>

            <Pressable style={styles.modalBtn} onPress={() => setIsDarkMode(!isDarkMode)}>
              <Ionicons name="contrast-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.modalBtnText}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</Text>
            </Pressable>

            <Pressable style={styles.modalBtn} onPress={() => router.push('/DBPreview')}>
              <MaterialCommunityIcons name="code-tags-check" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.modalBtnText}>Component Preview</Text>
            </Pressable>

            <Pressable style={styles.modalBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.modalBtnText}>Logout</Text>
            </Pressable>

            <Pressable style={styles.modalBtn} onPress={toggleSettingsModal}>
              <Ionicons name="close-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.modalBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Tabs.Screen options={{ tabBarStyle: { backgroundColor: '#1c1c1e' }, tabBarLabelStyle: { color: '#ccc' } }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContent: { paddingBottom: 90 },
  questCard: {
    marginHorizontal: 20,
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  questImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 10,
  },
  questTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  questDesc: { color: '#ccc', marginTop: 4, marginBottom: 6 },
  questGoal: { color: '#fffaa0', marginBottom: 10 },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#1E90FF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1c1c1c',
    padding: 20,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  modalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
  },
  modalBtnText: { color: '#fff', fontSize: 14, fontWeight: '500' },
});
