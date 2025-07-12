
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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [profileVisible, setProfileVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false); // NEW
  const [userData, setUserData] = useState(null);
  const rotation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('hunterProfile');
      const data = raw ? JSON.parse(raw) : null;
      setUserData(data);
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

  const currentSteps = 6000;
  const totalSteps = 10000;
  const progress = (currentSteps / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => setProfileVisible(true)}>
            <Image
              source={require('../../assets/images/bg2.jpg')}
              style={styles.avatar}
            />
          </Pressable>

          <Text style={styles.title}>
            Strive<Text style={{ color: 'red' }}>X</Text>
          </Text>

          <Pressable onPress={handleSettingsPress}>
            <Animated.View style={{ transform: [{ rotate: rotationInterpolate }] }}>
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </Animated.View>
          </Pressable>
        </View>

        {/* Quest Card */}
        <View style={styles.questCard}>
          <Image source={require('../../assets/images/bg2.jpg')} style={styles.questImage} />
          <Text style={styles.questTitle}>Conquer the Day</Text>
          <Text style={styles.questDesc}>Embrace the challenge and push your limits. Every step counts towards your ultimate victory.</Text>
          <Text style={styles.questGoal}>10000 steps</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Daily Stats */}
        <Text style={styles.sectionTitle}>Daily Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}><Text style={styles.statNumber}>6,000</Text><Text style={styles.statLabel}>Steps</Text></View>
          <View style={styles.statBox}><Text style={styles.statNumber}>4.5 km</Text><Text style={styles.statLabel}>Distance</Text></View>
        </View>
        <View style={[styles.statBox, { alignSelf: 'center', width: '92%' }]}>
          <Text style={styles.statNumber}>350 kcal</Text><Text style={styles.statLabel}>Calories</Text>
        </View>

        {/* Daily Quest */}
        <Text style={styles.sectionTitle}>Daily Quest</Text>
        {['Bench Press', 'Leg Press', 'Deadlift'].map((exercise, i) => (
          <View key={i} style={styles.questRow}>
            <MaterialCommunityIcons name="dumbbell" size={20} color="#ccc" style={{ marginRight: 8 }} />
            <Text style={styles.questText}>{exercise}</Text>
            <Text style={styles.questMeta}>15 Reps  •  3 Sets</Text>
            <Ionicons name="chevron-forward" size={18} color="#aaa" />
          </View>
        ))}
      </ScrollView>

      {/* Profile Modal */}
      <Modal visible={profileVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Pressable style={styles.modalClose} onPress={() => setProfileVisible(false)}>
              <Ionicons name="close-circle" size={24} color="#aaa" />
            </Pressable>
            <View style={{ position: 'relative' }}>
              <Image
                source={require('../../assets/images/bg2.jpg')}
                style={styles.profileImage}
              />
              <Image
                source={require('../../assets/images/Badges/crown.png')}
                style={{ position: 'absolute', top: -10, left: 10, width: 30, height: 30 }}
              />
            </View>
            <Text style={styles.profileLevel}>Level ∞</Text>
            <Text style={styles.profileName}>{userData?.name || 'Player Name'}</Text>
            <Text style={styles.profileInfo}>
              Date of Joining: 7 June 2025{"\n"}
              DOB: {userData?.dob ? new Date(userData.dob).toDateString() : '---'}{"\n"}
              Height: {userData?.height || '---'}{"\n"}
              Weight: {userData?.weight || '---'}
            </Text>
            <Text style={styles.profileTitle}>Title: {userData?.title || '---'}</Text>
            <Text style={styles.profileRank}>Rank: {userData?.rank || '---'}</Text>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal visible={settingsVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Pressable style={styles.modalClose} onPress={handleSettingsPress}>
              <Ionicons name="close-circle" size={24} color="#aaa" />
            </Pressable>

            <Image source={require('../../assets/images/bg2.jpg')} style={styles.profileImage} />
            <Text style={styles.profileName}>{userData?.name || 'Player Name'}</Text>
            <Text style={{ color: '#aaa', marginTop: 6 }}>Hunter Profile</Text>
            <Text style={{ color: '#fff', marginTop: 4 }}>Level: {userData?.level || '∞'}</Text>
            <Text style={{ color: '#fff', marginTop: 2 }}>Rank: {userData?.rank || '---'}</Text>

            {/* App Info Button */}
            <Pressable
              onPress={() => {
                setSettingsVisible(false);
                setTimeout(() => setInfoVisible(true), 300);
              }}
              style={{
                marginTop: 16,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
                backgroundColor: '#333',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>App Info</Text>
            </Pressable>

            {/* Logout Button */}
            <Pressable
              onPress={async () => {
                await AsyncStorage.clear();
                setSettingsVisible(false);
                router.replace('/onboarding'); // Adjust route path
              }}
              style={{
                marginTop: 20,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
                backgroundColor: '#ff4444',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Quit Being a Hunter</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Info Modal */}
      <Modal visible={infoVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Pressable style={styles.modalClose} onPress={() => setInfoVisible(false)}>
              <Ionicons name="close-circle" size={24} color="#aaa" />
            </Pressable>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              About StriveX
            </Text>
            <Text style={{ color: '#ccc', textAlign: 'center' }}>
              StriveX is your daily companion in becoming the fittest version of yourself. Track progress, complete daily quests, unlock titles, and stay motivated through gamified experiences.
            </Text>
          </View>
        </View>
      </Modal>

      {/* Bottom Tabs */}
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
    marginTop: 10,
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    padding: 20,
    width: width * 0.85,
    alignItems: 'center',
  },
  modalClose: {
    alignSelf: 'flex-end',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginVertical: 10,
  },
  profileLevel: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  profileName: { color: '#fff', marginTop: 4 },
  profileInfo: { color: '#ccc', marginTop: 8, textAlign: 'center' },
  profileTitle: {
    color: '#b0aaff',
    borderTopWidth: 1,
    borderColor: '#555',
    marginTop: 12,
    paddingTop: 8,
    textAlign: 'center',
  },
  profileRank: { color: '#ccc', textAlign: 'center', marginTop: 4 },
});
