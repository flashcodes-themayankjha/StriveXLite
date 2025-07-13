
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  Dimensions,
  ScrollView,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [profileVisible, setProfileVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [exerciseList, setExerciseList] = useState([]);
  const rotation = useState(new Animated.Value(0))[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  useEffect(() => {
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
  }, []);

  const rotateSettingsIcon = (open) => {
    Animated.timing(rotation, {
      toValue: open ? 1 : 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleSettingsPress = () => {
    const opening = !settingsVisible;
    rotateSettingsIcon(opening);
    setSettingsVisible(opening);
  };

  const rotationInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const calculateXP = (sets, reps) => Math.floor(5 + sets * reps * 0.5);

  const completeExercise = async (exercise) => {
    const xpGained = calculateXP(exercise.sets, exercise.reps);
    let profile = { ...(userData || { xp: 0, level: 1 }) };

    profile.xp += xpGained;
    let leveledUp = false;

    const xpNeeded = (level) => Math.floor(50 + 10 * level * 1.3);

    while (profile.xp >= xpNeeded(profile.level)) {
      profile.xp -= xpNeeded(profile.level);
      profile.level++;
      leveledUp = true;
    }

    await AsyncStorage.setItem('hunterProfile', JSON.stringify(profile));
    setUserData(profile);

    Alert.alert(
      leveledUp ? '🎉 Level Up!' : '✅ Exercise Complete',
      leveledUp ? `New Level: ${profile.level}` : `+${xpGained} XP`
    );
  };

  const currentSteps = 6000;
  const totalSteps = 10000;
  const progress = (currentSteps / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => setProfileVisible(true)}>
            <Image source={require('../../assets/images/bg2.jpg')} style={styles.avatar} />
          </Pressable>
          <Text style={styles.title}>Strive<Text style={{ color: 'red' }}>X</Text></Text>
         

          <Modal
  animationType="slide"
  transparent={true}
  visible={settingsVisible}
  onRequestClose={() => setSettingsVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Settings</Text>

      <Pressable
        style={styles.modalBtn}
        onPress={() => {
          setSettingsVisible(false);
          router.push('/setquest'); // navigates to SetQuestScreen
        }}
      >
        <Ionicons name="calendar-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.modalBtnText}>Edit Daily Quest</Text>
      </Pressable>

      <Pressable style={[styles.modalBtn, { backgroundColor: '#333' }]} onPress={() => setSettingsVisible(false)}>
        <Text style={styles.modalBtnText}>Close</Text>
      </Pressable>
    </View>
  </View>
</Modal>


          <Pressable onPress={handleSettingsPress}>
            <Animated.View style={{ transform: [{ rotate: rotationInterpolate }] }}>
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </Animated.View>
          </Pressable>


        </View>

        <View style={styles.questCard}>
          <Image source={require('../../assets/images/bg2.jpg')} style={styles.questImage} />
          <Text style={styles.questTitle}>Conquer the Day</Text>
          <Text style={styles.questDesc}>Embrace the challenge and push your limits. Every step counts towards your ultimate victory.</Text>
          <Text style={styles.questGoal}>10000 steps</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Daily Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}><Text style={styles.statNumber}>6,000</Text><Text style={styles.statLabel}>Steps</Text></View>
          <View style={styles.statBox}><Text style={styles.statNumber}>4.5 km</Text><Text style={styles.statLabel}>Distance</Text></View>
        </View>
        <View style={[styles.statBox, { alignSelf: 'center', width: '92%' }]}> 
          <Text style={styles.statNumber}>350 kcal</Text><Text style={styles.statLabel}>Calories</Text>
        </View>

        <Text style={styles.sectionTitle}>Daily Quest</Text>
        {exerciseList.map((exercise, i) => (
          <Pressable key={i} style={styles.questRow} onPress={() => completeExercise(exercise)}>
            <MaterialCommunityIcons name="dumbbell" size={20} color="#ccc" style={{ marginRight: 8 }} />
            <Text style={styles.questText}>{exercise.name}</Text>
            <Text style={styles.questMeta}>{exercise.reps} Reps • {exercise.sets} Sets</Text>
            <Ionicons name="checkmark-done" size={18} color="#6cff6c" />
          </Pressable>
        ))}
      </ScrollView>

      {/* All modal and settings code remains unchanged */}

      <Tabs.Screen
        options={{
          tabBarStyle: { backgroundColor: '#1c1c1e' },
          tabBarLabelStyle: { color: '#ccc' },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContent: { paddingBottom: 90 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 15,
    alignItems: 'center',
  },
  avatar: { width: 36, height: 36, borderRadius: 18, marginTop: 5 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
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
  },
  statLabel: { color: '#aaa' },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    padding: 14,
  },
  questText: { flex: 1, color: '#fff', fontSize: 16 },
  questMeta: { color: '#aaa', fontSize: 12, marginRight: 8 },

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
modalBtnText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '500',
},

});
